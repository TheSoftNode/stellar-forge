import asyncio
import logging
from typing import Optional, List
from datetime import datetime, timedelta

from app.services.kale_tracker import KalePriceTracker, PriceData as TrackerPriceData
from app.models.price import PriceData, PriceStatistics

logger = logging.getLogger(__name__)

class TrackerService:
    """Service that wraps the original KalePriceTracker for FastAPI use"""
    
    def __init__(self):
        self.tracker = KalePriceTracker(
            log_file='logs/kale_price_log.txt',
            csv_file='test_prices.csv',
            update_interval=10,
            plot_threshold=5
        )
        self.background_task: Optional[asyncio.Task] = None
        self.is_running = False
    
    async def start_background_monitoring(self):
        """Start the background price monitoring"""
        if self.is_running:
            logger.warning("Background monitoring is already running")
            return
        
        self.is_running = True
        self.background_task = asyncio.create_task(self._monitoring_loop())
        logger.info("Background price monitoring started")
    
    async def stop_background_monitoring(self):
        """Stop the background price monitoring"""
        if not self.is_running:
            return
        
        self.is_running = False
        if self.background_task:
            self.background_task.cancel()
            try:
                await self.background_task
            except asyncio.CancelledError:
                pass
        
        # Save final data
        self.tracker._save_price_history()
        logger.info("Background price monitoring stopped")
    
    async def _monitoring_loop(self):
        """Background monitoring loop"""
        while self.is_running:
            try:
                # Fetch current price using the original tracker
                price_data = await asyncio.to_thread(self.tracker.fetch_current_price)
                
                if price_data:
                    # Add to tracker history
                    self.tracker.price_history.append(price_data)
                    
                    logger.info(f"Price updated: ${price_data.price:.6f} from {price_data.source}")
                    
                    # Save history periodically
                    if len(self.tracker.price_history) % 10 == 0:
                        await asyncio.to_thread(self.tracker._save_price_history)
                else:
                    logger.error("Failed to fetch price data from all sources")
                
                # Wait for next update
                await asyncio.sleep(self.tracker.update_interval)
                
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                await asyncio.sleep(5)  # Wait before retrying
    
    async def get_current_price(self) -> Optional[PriceData]:
        """Get the most recent price"""
        if not self.tracker.price_history:
            # Try to fetch a new price if history is empty
            tracker_price = await asyncio.to_thread(self.tracker.fetch_current_price)
            if tracker_price:
                self.tracker.price_history.append(tracker_price)
        
        if not self.tracker.price_history:
            return None
        
        latest = self.tracker.price_history[-1]
        return PriceData(
            price=latest.price,
            timestamp=latest.timestamp,
            source=latest.source
        )
    
    async def get_price_history(self, 
                              start_date: Optional[datetime] = None,
                              end_date: Optional[datetime] = None,
                              limit: int = 100) -> List[PriceData]:
        """Get price history with optional filtering"""
        history = self.tracker.price_history
        
        # Apply date filters
        if start_date or end_date:
            filtered_history = []
            for price_data in history:
                if start_date and price_data.timestamp < start_date:
                    continue
                if end_date and price_data.timestamp > end_date:
                    continue
                filtered_history.append(price_data)
            history = filtered_history
        
        # Apply limit (get most recent)
        if len(history) > limit:
            history = history[-limit:]
        
        # Convert to Pydantic models
        return [
            PriceData(
                price=price_data.price,
                timestamp=price_data.timestamp,
                source=price_data.source
            )
            for price_data in history
        ]
    
    async def get_price_statistics(self, hours: int = 24) -> Optional[PriceStatistics]:
        """Get price statistics for the specified time period"""
        if not self.tracker.price_history:
            return None
        
        # Filter by time period
        cutoff_time = datetime.now() - timedelta(hours=hours)
        filtered_prices = [
            p for p in self.tracker.price_history 
            if p.timestamp >= cutoff_time
        ]
        
        if not filtered_prices:
            return None
        
        prices = [p.price for p in filtered_prices]
        current_price = prices[-1]
        
        return PriceStatistics(
            current_price=current_price,
            price_24h_high=max(prices),
            price_24h_low=min(prices),
            price_24h_change=current_price - prices[0] if len(prices) > 1 else 0,
            price_24h_change_percent=((current_price - prices[0]) / prices[0] * 100) if len(prices) > 1 and prices[0] > 0 else 0,
            average_price=sum(prices) / len(prices),
            total_data_points=len(prices),
            last_updated=datetime.utcnow()
        )
    
    async def force_price_update(self) -> Optional[PriceData]:
        """Force a price update and return the new price"""
        tracker_price = await asyncio.to_thread(self.tracker.fetch_current_price)
        
        if tracker_price:
            self.tracker.price_history.append(tracker_price)
            return PriceData(
                price=tracker_price.price,
                timestamp=tracker_price.timestamp,
                source=tracker_price.source
            )
        
        return None
    
    def get_tracker_stats(self) -> dict:
        """Get tracker internal statistics"""
        return {
            "total_history_points": len(self.tracker.price_history),
            "update_interval": self.tracker.update_interval,
            "plot_threshold": self.tracker.plot_threshold,
            "last_hardcoded_index": self.tracker.test_index,
            "is_monitoring": self.is_running,
            "log_file": self.tracker.log_file,
            "csv_file": self.tracker.csv_file
        }