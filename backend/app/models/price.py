from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class PriceSource(str, Enum):
    """Enum for price data sources"""
    STELLAR = "stellar"
    CSV = "csv"
    HARDCODED = "hardcoded"

class PriceData(BaseModel):
    """Pydantic model for price data - compatible with original tracker"""
    price: float = Field(..., description="KALE token price in USD", gt=0)
    timestamp: datetime = Field(..., description="When the price was recorded")
    source: str = Field(..., description="Source of the price data")  # Keep as string for compatibility
    
    class Config:
        from_attributes = True

class PriceStatistics(BaseModel):
    """Price statistics model"""
    current_price: float = Field(..., description="Current KALE price")
    price_24h_high: float = Field(..., description="24-hour high price")
    price_24h_low: float = Field(..., description="24-hour low price")
    price_24h_change: float = Field(..., description="24-hour price change")
    price_24h_change_percent: float = Field(..., description="24-hour price change percentage")
    average_price: float = Field(..., description="Average price over the period")
    total_data_points: int = Field(..., description="Total number of price records")
    last_updated: datetime = Field(..., description="When statistics were last calculated")

class PriceAlert(BaseModel):
    """Price alert configuration"""
    id: Optional[int] = None
    alert_type: str = Field(..., description="Type of alert (above/below/change)")
    threshold: float = Field(..., description="Price threshold for the alert")
    is_active: bool = Field(True, description="Whether the alert is active")
    webhook_url: Optional[str] = Field(None, description="Webhook URL for notifications")
    created_at: Optional[datetime] = None
    triggered_at: Optional[datetime] = None

class TechnicalIndicators(BaseModel):
    """Technical analysis indicators"""
    sma_10: Optional[float] = Field(None, description="10-period Simple Moving Average")
    sma_20: Optional[float] = Field(None, description="20-period Simple Moving Average")
    ema_10: Optional[float] = Field(None, description="10-period Exponential Moving Average")
    rsi: Optional[float] = Field(None, description="Relative Strength Index", ge=0, le=100)
    volatility: Optional[float] = Field(None, description="Price volatility", ge=0)
    timestamp: datetime = Field(..., description="When indicators were calculated")

class PriceHistoryRequest(BaseModel):
    """Request model for price history queries"""
    start_date: Optional[datetime] = Field(None, description="Start date for price history")
    end_date: Optional[datetime] = Field(None, description="End date for price history")
    limit: int = Field(100, description="Maximum number of records to return", le=1000)
    offset: int = Field(0, description="Number of records to skip", ge=0)
    source_filter: Optional[PriceSource] = Field(None, description="Filter by price source")

class PriceHistoryResponse(BaseModel):
    """Response model for price history"""
    data: List[PriceData] = Field(..., description="List of price data points")
    total_count: int = Field(..., description="Total number of records available")
    has_more: bool = Field(..., description="Whether more records are available")
    statistics: Optional[PriceStatistics] = Field(None, description="Statistics for the queried period")

class WebSocketMessage(BaseModel):
    """WebSocket message model"""
    type: str = Field(..., description="Message type (price_update, alert, etc.)")
    data: dict = Field(..., description="Message payload")
    timestamp: datetime = Field(default_factory=datetime.utcnow)