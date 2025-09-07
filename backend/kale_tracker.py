import time
import logging
import matplotlib.pyplot as plt
import pandas as pd
from stellar_sdk import Server, Network, Asset
from stellar_sdk.exceptions import NotFoundError, SdkError
from datetime import datetime, timedelta
from typing import Optional, List, Tuple
import json
import os
from dataclasses import dataclass


@dataclass
class PriceData:
    """Data class to store price information"""
    price: float
    timestamp: datetime
    source: str  # 'stellar', 'csv', 'hardcoded'


class KalePriceTracker:
    """Enhanced KALE Price Tracker with better structure and error handling"""
    
    def __init__(self,
                 log_file: str = 'kale_price_log.txt',
                 csv_file: str = 'test_prices.csv',
                 update_interval: int = 10,
                 plot_threshold: int = 5):
        """
        Initialize the KALE Price Tracker
        
        Args:
            log_file: Path to log file
            csv_file: Path to CSV backup file
            update_interval: Seconds between price updates
            plot_threshold: Number of data points before showing plot
        """
        self.log_file = log_file
        self.csv_file = csv_file
        self.update_interval = update_interval
        self.plot_threshold = plot_threshold
        
        # Price data storage
        self.price_history: List[PriceData] = []
        
        # Stellar SDK setup
        self.server = Server(horizon_url="https://horizon-testnet.stellar.org")
        self.network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE
        self.kale_asset = Asset("KALE", "GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB")
        
        # Hardcoded test data as fallback
        self.test_prices = [0.095, 0.096, 0.094, 0.093, 0.092, 0.097, 0.098, 0.091]
        self.test_index = 0

        # --- START: Added Code ---
        # Check for matplotlib availability
        try:
            import matplotlib.pyplot as plt
            self.has_matplotlib = True
        except ImportError:
            self.has_matplotlib = False
            logging.warning("matplotlib not found. Falling back to text-based charts.")
        # --- END: Added Code ---
        
        # Setup logging
        self._setup_logging()
        
        # Load existing price history if available
        self._load_price_history()
    
    def _setup_logging(self) -> None:
        """Configure logging with proper formatting"""
        logging.basicConfig(
            filename=self.log_file,
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            filemode='a'
        )
        
        # Also log to console
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        
        logger = logging.getLogger()
        if not logger.handlers:
            logger.addHandler(console_handler)
    
    def _load_price_history(self) -> None:
        """Load existing price history from JSON file if available"""
        history_file = 'price_history.json'
        try:
            if os.path.exists(history_file):
                with open(history_file, 'r') as f:
                    data = json.load(f)
                    for item in data:
                        price_data = PriceData(
                            price=item['price'],
                            timestamp=datetime.fromisoformat(item['timestamp']),
                            source=item['source']
                        )
                        self.price_history.append(price_data)
                logging.info(f"Loaded {len(self.price_history)} historical price records")
        except Exception as e:
            logging.warning(f"Could not load price history: {str(e)}")
    
    def _save_price_history(self) -> None:
        """Save price history to JSON file"""
        history_file = 'price_history.json'
        try:
            data = []
            for price_data in self.price_history:
                data.append({
                    'price': price_data.price,
                    'timestamp': price_data.timestamp.isoformat(),
                    'source': price_data.source
                })
            
            with open(history_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logging.error(f"Could not save price history: {str(e)}")
    
    def get_stellar_price(self) -> Optional[float]:
        """
        Fetch KALE price from Stellar network
        
        Returns:
            Price as float or None if not available
        """
        try:
            # Get recent trades for KALE
            trades = self.server.trades().for_asset(self.kale_asset).limit(10).call()
            
            if not trades['_embedded']['records']:
                logging.warning("No trades found for KALE asset")
                return None
            
            # Get the most recent trade
            latest_trade = trades['_embedded']['records'][0]
            
            # Calculate price from the trade
            price_n = float(latest_trade['price']['n'])
            price_d = float(latest_trade['price']['d'])
            price = price_n / price_d
            
            logging.info(f"Successfully fetched KALE price from Stellar: {price} USD")
            return price
            
        except NotFoundError:
            logging.error("KALE asset not found on Stellar Testnet")
            return None
        except SdkError as e:
            logging.error(f"Stellar SDK error: {str(e)}")
            return None
        except Exception as e:
            logging.error(f"Unexpected error fetching Stellar price: {str(e)}")
            return None
    
    def get_csv_price(self) -> Optional[float]:
        """
        Get price from CSV file as backup
        
        Returns:
            Price as float or None if not available
        """
        try:
            if not os.path.exists(self.csv_file):
                return None
                
            df = pd.read_csv(self.csv_file)
            
            if df.empty or 'price' not in df.columns:
                logging.warning("CSV file is empty or missing 'price' column")
                return None
            
            price = float(df['price'].iloc[-1])
            logging.info(f"Successfully fetched KALE price from CSV: {price} USD")
            return price
            
        except (pd.errors.EmptyDataError, pd.errors.ParserError) as e:
            logging.error(f"CSV parsing error: {str(e)}")
            return None
        except Exception as e:
            logging.error(f"Error reading CSV file: {str(e)}")
            return None
    
    def get_hardcoded_price(self) -> float:
        """
        Get hardcoded test price as final fallback
        
        Returns:
            Test price as float
        """
        price = self.test_prices[self.test_index % len(self.test_prices)]
        self.test_index += 1
        
        logging.info(f"Using hardcoded test price: {price} USD")
        return price
    
    def fetch_current_price(self) -> Optional[PriceData]:
        """
        Fetch current KALE price using multiple sources with fallback
        
        Returns:
            PriceData object or None if all sources fail
        """
        timestamp = datetime.now()
        
        # Try Stellar network first
        price = self.get_stellar_price()
        if price is not None:
            return PriceData(price, timestamp, 'stellar')
        
        # Fallback to CSV
        price = self.get_csv_price()
        if price is not None:
            return PriceData(price, timestamp, 'csv')
        
        # Final fallback to hardcoded data
        price = self.get_hardcoded_price()
        return PriceData(price, timestamp, 'hardcoded')
    
    def plot_price_history(self) -> None:
        """Create and display price history plot"""
        if not self.has_matplotlib:
            self.print_text_chart()
            return
            
        if len(self.price_history) < 2:
            logging.warning("Not enough data points to create plot")
            return
        
        try:
            # Extract data for plotting
            times = [data.timestamp for data in self.price_history]
            prices = [data.price for data in self.price_history]
            sources = [data.source for data in self.price_history]
            
            # Create the plot
            plt.figure(figsize=(12, 6))
            
            # Color code by data source
            color_map = {'stellar': 'blue', 'csv': 'orange', 'hardcoded': 'red'}
            
            for source in set(sources):
                source_times = [times[i] for i, s in enumerate(sources) if s == source]
                source_prices = [prices[i] for i, s in enumerate(sources) if s == source]
                plt.scatter(source_times, source_prices, 
                           label=f'{source.title()} Data', 
                           color=color_map.get(source, 'gray'), 
                           alpha=0.7)
            
            # Add trend line
            plt.plot(times, prices, color='gray', alpha=0.5, linestyle='--')
            
            # Formatting
            plt.xlabel("Time")
            plt.ylabel("KALE Price (USD)")
            plt.title("KALE Price Tracker - Real-time Price History")
            plt.legend()
            plt.grid(True, alpha=0.3)
            plt.xticks(rotation=45)
            plt.tight_layout()
            
            # Show statistics
            current_price = prices[-1]
            min_price = min(prices)
            max_price = max(prices)
            avg_price = sum(prices) / len(prices)
            
            stats_text = f"Current: ${current_price:.4f} | Min: ${min_price:.4f} | Max: ${max_price:.4f} | Avg: ${avg_price:.4f}"
            plt.figtext(0.5, 0.02, stats_text, ha='center', fontsize=10)
            
            plt.show()
            
            logging.info("Price history plot displayed successfully")
            
        except Exception as e:
            logging.error(f"Error creating plot: {str(e)}")
            self.print_text_chart()
    
    def print_text_chart(self) -> None:
        """Print a simple text-based chart when matplotlib is not available"""
        if len(self.price_history) < 2:
            return
        
        prices = [data.price for data in self.price_history]
        times = [data.timestamp.strftime('%H:%M:%S') for data in self.price_history]
        
        print("\n" + "="*60)
        print("📈 KALE PRICE HISTORY (Text Chart)")
        print("="*60)
        
        # Normalize prices for display (0-50 characters width)
        min_price = min(prices)
        max_price = max(prices)
        price_range = max_price - min_price if max_price != min_price else 1
        
        for i, (price, time_str) in enumerate(zip(prices, times)):
            # Calculate bar length (0-40 characters)
            normalized = (price - min_price) / price_range
            bar_length = int(normalized * 40)
            bar = "█" * bar_length + "░" * (40 - bar_length)
            
            print(f"{time_str} │{bar}│ ${price:.6f}")
        
        print("="*60)
        print(f"Range: ${min_price:.6f} - ${max_price:.6f}")
        print("="*60 + "\n")
    
    def print_statistics(self) -> None:
        """Print current price statistics"""
        if not self.price_history:
            return
        
        prices = [data.price for data in self.price_history]
        current_price = prices[-1]
        
        print(f"\n{'='*50}")
        print(f"KALE PRICE STATISTICS")
        print(f"{'='*50}")
        print(f"Current Price: ${current_price:.6f} USD")
        
        if len(prices) > 1:
            min_price = min(prices)
            max_price = max(prices)
            avg_price = sum(prices) / len(prices)
            price_change = current_price - prices[-2]
            
            print(f"24h High: ${max_price:.6f} USD")
            print(f"24h Low: ${min_price:.6f} USD")
            print(f"Average: ${avg_price:.6f} USD")
            print(f"Last Change: {price_change:+.6f} USD ({price_change/prices[-2]*100:+.2f}%)")
            print(f"Data Points: {len(prices)}")
            print(f"Data Source: {self.price_history[-1].source}")
        print(f"{'='*50}\n")
    
    def run(self) -> None:
        """Main execution loop"""
        print("🚀 Starting Enhanced KALE Price Tracker...")
        print(f"📊 Update interval: {self.update_interval} seconds")
        print(f"📈 Plot threshold: {self.plot_threshold} data points")
        print(f"💾 Log file: {self.log_file}")
        print("-" * 50)
        
        try:
            while True:
                # Fetch current price
                price_data = self.fetch_current_price()
                
                if price_data:
                    # Add to history
                    self.price_history.append(price_data)
                    
                    # Print current info
                    print(f"⏰ {price_data.timestamp.strftime('%H:%M:%S')} | "
                          f"💰 ${price_data.price:.6f} USD | "
                          f"📡 Source: {price_data.source}")
                    
                    # Show plot if we have enough data
                    if len(self.price_history) >= self.plot_threshold:
                        if len(self.price_history) % self.plot_threshold == 0:
                            self.plot_price_history()
                            self.print_statistics()
                    
                    # Save history periodically
                    if len(self.price_history) % 10 == 0:
                        self._save_price_history()
                
                else:
                    print("❌ Failed to fetch price data from all sources")
                    logging.error("All price sources failed")
                
                # Wait for next update
                time.sleep(self.update_interval)
                
        except KeyboardInterrupt:
            print("\n🛑 Price tracker stopped by user")
            logging.info("Price tracker stopped by user")
            
            # Save final data
            self._save_price_history()
            
            # Show final plot if we have data
            if self.price_history:
                self.plot_price_history()
                self.print_statistics()
                
        except Exception as e:
            logging.error(f"Unexpected error in main loop: {str(e)}")
            print(f"❌ Unexpected error: {str(e)}")


def main():
    """Main function to run the KALE Price Tracker"""
    # Configuration
    tracker = KalePriceTracker(
        log_file='kale_price_log.txt',
        csv_file='test_prices.csv',
        update_interval=10,  # 10 seconds between updates
        plot_threshold=5     # Show plot every 5 data points
    )
    
    # Start tracking
    tracker.run()


if __name__ == "__main__":
    main()
