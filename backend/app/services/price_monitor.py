import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.core.config import settings
from app.db.database import AsyncSessionLocal
from app.db.models import PriceRecord, TechnicalIndicator
from app.models.price import PriceData, PriceStatistics, TechnicalIndicators
from app.services.price_fetcher import PriceFetcher, TechnicalAnalyzer

logger = logging.getLogger(__name__)

class PriceMonitorService:
    """Background service for continuous price monitoring"""
    
    def __init__(self):
        self.price_fetcher = PriceFetcher()
        self.technical_analyzer = TechnicalAnalyzer()
        self.is_running = False
        self.task: Optional[asyncio.Task] = None
        
    async def start(self):
        """Start the price monitoring service"""
        if self.is_running:
            logger.warning("Price monitor is already running")
            return
        
        self.is_running = True
        self.task = asyncio.create_task(self._monitor_loop())
        logger.info("Price monitoring service started")
    
    async def stop(self):
        """Stop the price monitoring service"""
        if not self.is_running:
            return
        
        self.is_running = False
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass
        
        logger.info("Price monitoring service stopped")
    
    async def _monitor_loop(self):
        """Main monitoring loop"""
        logger.info(f"Starting price monitoring loop with {settings.PRICE_UPDATE_INTERVAL}s interval")
        
        while self.is_running:
            try:
                # Fetch current price
                price_data = await self.price_fetcher.fetch_current_price()
                
                # Save to database
                await self._save_price_data(price_data)
                
                # Calculate and save technical indicators
                await self._calculate_and_save_indicators()
                
                # Clean old data if necessary
                await self._cleanup_old_data()
                
                logger.info(f"Price updated: ${price_data.price:.6f} from {price_data.source}")
                
            except Exception as e:
                logger.error(f"Error in price monitoring loop: {e}")
            
            # Wait for next update
            await asyncio.sleep(settings.PRICE_UPDATE_INTERVAL)
    
    async def _save_price_data(self, price_data: PriceData):
        """Save price data to database"""
        async with AsyncSessionLocal() as session:
            try:
                db_price = PriceRecord(
                    price=price_data.price,
                    timestamp=price_data.timestamp,
                    source=price_data.source.value,
                    volume=price_data.volume
                )
                
                session.add(db_price)
                await session.commit()
                
            except Exception as e:
                logger.error(f"Error saving price data: {e}")
                await session.rollback()
    
    async def _calculate_and_save_indicators(self):
        """Calculate and save technical indicators"""
        async with AsyncSessionLocal() as session:
            try:
                # Get recent prices for calculations
                stmt = select(PriceRecord.price).order_by(desc(PriceRecord.timestamp)).limit(50)
                result = await session.execute(stmt)
                prices = [row[0] for row in result.fetchall()]
                
                if len(prices) < 10:
                    logger.debug("Not enough price data for technical indicators")
                    return
                
                # Reverse to get chronological order
                prices.reverse()
                
                # Calculate indicators
                indicators = TechnicalIndicator(
                    timestamp=datetime.utcnow(),
                    sma_10=self.technical_analyzer.calculate_sma(prices, 10),
                    sma_20=self.technical_analyzer.calculate_sma(prices, 20),
                    ema_10=self.technical_analyzer.calculate_ema(prices, 10),
                    rsi=self.technical_analyzer.calculate_rsi(prices, 14),
                    volatility=self.technical_analyzer.calculate_volatility(prices)
                )
                
                session.add(indicators)
                await session.commit()
                
            except Exception as e:
                logger.error(f"Error calculating technical indicators: {e}")
                await session.rollback()
    
    async def _cleanup_old_data(self):
        """Clean up old price data to maintain performance"""
        async with AsyncSessionLocal() as session:
            try:
                # Count current records
                count_stmt = select(func.count(PriceRecord.id))
                result = await session.execute(count_stmt)
                total_records = result.scalar()
                
                if total_records > settings.MAX_PRICE_HISTORY:
                    # Delete oldest records
                    records_to_delete = total_records - settings.MAX_PRICE_HISTORY
                    
                    oldest_records_stmt = (
                        select(PriceRecord.id)
                        .order_by(PriceRecord.timestamp)
                        .limit(records_to_delete)
                    )
                    result = await session.execute(oldest_records_stmt)
                    ids_to_delete = [row[0] for row in result.fetchall()]
                    
                    if ids_to_delete:
                        delete_stmt = PriceRecord.__table__.delete().where(
                            PriceRecord.id.in_(ids_to_delete)
                        )
                        await session.execute(delete_stmt)
                        await session.commit()
                        
                        logger.info(f"Cleaned up {len(ids_to_delete)} old price records")
                
            except Exception as e:
                logger.error(f"Error cleaning up old data: {e}")
                await session.rollback()

class PriceService:
    """Service class for price-related operations"""
    
    def __init__(self):
        self.technical_analyzer = TechnicalAnalyzer()
    
    async def get_current_price(self) -> Optional[PriceData]:
        """Get the most recent price from database"""
        async with AsyncSessionLocal() as session:
            try:
                stmt = select(PriceRecord).order_by(desc(PriceRecord.timestamp)).limit(1)
                result = await session.execute(stmt)
                db_price = result.scalar_one_or_none()
                
                if not db_price:
                    return None
                
                return PriceData(
                    id=db_price.id,
                    price=db_price.price,
                    timestamp=db_price.timestamp,
                    source=db_price.source,
                    volume=db_price.volume
                )
                
            except Exception as e:
                logger.error(f"Error getting current price: {e}")
                return None
    
    async def get_price_history(self, 
                              start_date: Optional[datetime] = None,
                              end_date: Optional[datetime] = None,
                              limit: int = 100,
                              offset: int = 0) -> List[PriceData]:
        """Get price history with optional filtering"""
        async with AsyncSessionLocal() as session:
            try:
                stmt = select(PriceRecord).order_by(desc(PriceRecord.timestamp))
                
                # Apply date filters
                if start_date:
                    stmt = stmt.where(PriceRecord.timestamp >= start_date)
                if end_date:
                    stmt = stmt.where(PriceRecord.timestamp <= end_date)
                
                # Apply pagination
                stmt = stmt.offset(offset).limit(limit)
                
                result = await session.execute(stmt)
                db_prices = result.scalars().all()
                
                return [
                    PriceData(
                        id=db_price.id,
                        price=db_price.price,
                        timestamp=db_price.timestamp,
                        source=db_price.source,
                        volume=db_price.volume
                    )
                    for db_price in db_prices
                ]
                
            except Exception as e:
                logger.error(f"Error getting price history: {e}")
                return []
    
    async def get_price_statistics(self, hours: int = 24) -> Optional[PriceStatistics]:
        """Get price statistics for the specified time period"""
        async with AsyncSessionLocal() as session:
            try:
                cutoff_time = datetime.utcnow() - timedelta(hours=hours)
                
                stmt = select(PriceRecord).where(
                    PriceRecord.timestamp >= cutoff_time
                ).order_by(PriceRecord.timestamp)
                
                result = await session.execute(stmt)
                prices = result.scalars().all()
                
                if not prices:
                    return None
                
                price_values = [p.price for p in prices]
                current_price = price_values[-1]
                
                return PriceStatistics(
                    current_price=current_price,
                    price_24h_high=max(price_values),
                    price_24h_low=min(price_values),
                    price_24h_change=current_price - price_values[0] if len(price_values) > 1 else 0,
                    price_24h_change_percent=((current_price - price_values[0]) / price_values[0] * 100) if len(price_values) > 1 and price_values[0] > 0 else 0,
                    average_price=sum(price_values) / len(price_values),
                    total_data_points=len(price_values),
                    last_updated=datetime.utcnow()
                )
                
            except Exception as e:
                logger.error(f"Error calculating price statistics: {e}")
                return None
    
    async def get_technical_indicators(self) -> Optional[TechnicalIndicators]:
        """Get the latest technical indicators"""
        async with AsyncSessionLocal() as session:
            try:
                stmt = select(TechnicalIndicator).order_by(desc(TechnicalIndicator.timestamp)).limit(1)
                result = await session.execute(stmt)
                db_indicator = result.scalar_one_or_none()
                
                if not db_indicator:
                    return None
                
                return TechnicalIndicators(
                    sma_10=db_indicator.sma_10,
                    sma_20=db_indicator.sma_20,
                    ema_10=db_indicator.ema_10,
                    rsi=db_indicator.rsi,
                    volatility=db_indicator.volatility,
                    timestamp=db_indicator.timestamp
                )
                
            except Exception as e:
                logger.error(f"Error getting technical indicators: {e}")
                return None