from stellar_sdk import Server, Network, Asset
from stellar_sdk.exceptions import NotFoundError, SdkError
import pandas as pd
import os
import logging
from typing import Optional, List
from datetime import datetime
import asyncio
import httpx

from app.core.config import settings
from app.models.price import PriceData, PriceSource

logger = logging.getLogger(__name__)

class PriceFetcher:
    """Service class for fetching KALE prices from multiple sources"""
    
    def __init__(self):
        self.server = Server(horizon_url=settings.STELLAR_HORIZON_URL)
        self.kale_asset = Asset(settings.KALE_ASSET_CODE, settings.KALE_ASSET_ISSUER)
        self.test_prices = [0.095, 0.096, 0.094, 0.093, 0.092, 0.097, 0.098, 0.091]
        self.test_index = 0
        
    async def fetch_stellar_price(self) -> Optional[PriceData]:
        """Fetch KALE price from Stellar network"""
        try:
            # Run the synchronous Stellar SDK call in a thread pool
            trades = await asyncio.to_thread(
                lambda: self.server.trades().for_asset(self.kale_asset).limit(10).call()
            )
            
            if not trades['_embedded']['records']:
                logger.warning("No trades found for KALE asset on Stellar")
                return None
            
            # Get the most recent trade
            latest_trade = trades['_embedded']['records'][0]
            
            # Calculate price from the trade
            price_n = float(latest_trade['price']['n'])
            price_d = float(latest_trade['price']['d'])
            price = price_n / price_d
            
            # Extract volume if available
            volume = float(latest_trade.get('base_amount', 0))
            
            logger.info(f"Successfully fetched KALE price from Stellar: ${price:.6f}")
            
            return PriceData(
                price=price,
                timestamp=datetime.utcnow(),
                source=PriceSource.STELLAR,
                volume=volume
            )
            
        except NotFoundError:
            logger.error("KALE asset not found on Stellar network")
            return None
        except SdkError as e:
            logger.error(f"Stellar SDK error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching Stellar price: {e}")
            return None
    
    async def fetch_csv_price(self, csv_file: str = "test_prices.csv") -> Optional[PriceData]:
        """Fetch price from CSV file as backup"""
        try:
            if not os.path.exists(csv_file):
                logger.warning(f"CSV file {csv_file} not found")
                return None
            
            # Run pandas operations in thread pool
            df = await asyncio.to_thread(pd.read_csv, csv_file)
            
            if df.empty or 'price' not in df.columns:
                logger.warning("CSV file is empty or missing 'price' column")
                return None
            
            price = float(df['price'].iloc[-1])
            logger.info(f"Successfully fetched KALE price from CSV: ${price:.6f}")
            
            return PriceData(
                price=price,
                timestamp=datetime.utcnow(),
                source=PriceSource.CSV
            )
            
        except Exception as e:
            logger.error(f"Error reading CSV file: {e}")
            return None
    
    def fetch_hardcoded_price(self) -> PriceData:
        """Get hardcoded test price as final fallback"""
        price = self.test_prices[self.test_index % len(self.test_prices)]
        self.test_index += 1
        
        logger.info(f"Using hardcoded test price: ${price:.6f}")
        
        return PriceData(
            price=price,
            timestamp=datetime.utcnow(),
            source=PriceSource.HARDCODED
        )
    
    async def fetch_current_price(self) -> PriceData:
        """Fetch current KALE price using multiple sources with fallback"""
        # Try Stellar network first
        price_data = await self.fetch_stellar_price()
        if price_data:
            return price_data
        
        # Fallback to CSV
        price_data = await self.fetch_csv_price()
        if price_data:
            return price_data
        
        # Final fallback to hardcoded data
        return self.fetch_hardcoded_price()

class TechnicalAnalyzer:
    """Service class for technical analysis calculations"""
    
    def __init__(self):
        pass
    
    def calculate_sma(self, prices: List[float], period: int) -> Optional[float]:
        """Calculate Simple Moving Average"""
        if len(prices) < period:
            return None
        return sum(prices[-period:]) / period
    
    def calculate_ema(self, prices: List[float], period: int) -> Optional[float]:
        """Calculate Exponential Moving Average"""
        if len(prices) < period:
            return None
        
        multiplier = 2 / (period + 1)
        ema = prices[0]
        
        for price in prices[1:]:
            ema = (price * multiplier) + (ema * (1 - multiplier))
        
        return ema
    
    def calculate_rsi(self, prices: List[float], period: int = 14) -> Optional[float]:
        """Calculate Relative Strength Index"""
        if len(prices) < period + 1:
            return None
        
        deltas = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        gains = [delta if delta > 0 else 0 for delta in deltas]
        losses = [-delta if delta < 0 else 0 for delta in deltas]
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            return 100
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    def calculate_volatility(self, prices: List[float]) -> Optional[float]:
        """Calculate price volatility (standard deviation)"""
        if len(prices) < 2:
            return None
        
        mean = sum(prices) / len(prices)
        variance = sum((price - mean) ** 2 for price in prices) / len(prices)
        return variance ** 0.5