from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.db.database import Base

class PriceRecord(Base):
    """SQLAlchemy model for price records"""
    __tablename__ = "price_records"
    
    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    source = Column(String(20), nullable=False, index=True)
    volume = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<PriceRecord(price={self.price}, timestamp={self.timestamp}, source={self.source})>"

class PriceAlert(Base):
    """SQLAlchemy model for price alerts"""
    __tablename__ = "price_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(20), nullable=False)  # 'above', 'below', 'change'
    threshold = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    webhook_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    triggered_at = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<PriceAlert(type={self.alert_type}, threshold={self.threshold}, active={self.is_active})>"

class TechnicalIndicator(Base):
    """SQLAlchemy model for technical indicators"""
    __tablename__ = "technical_indicators"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    sma_10 = Column(Float, nullable=True)
    sma_20 = Column(Float, nullable=True)
    ema_10 = Column(Float, nullable=True)
    rsi = Column(Float, nullable=True)
    volatility = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<TechnicalIndicator(timestamp={self.timestamp}, rsi={self.rsi})>"