from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from datetime import datetime, timedelta

from app.models.price import (
    PriceData, PriceStatistics, TechnicalIndicators,
    PriceHistoryRequest, PriceHistoryResponse
)
from app.services.tracker_service import TrackerService
from app.core.config import settings

router = APIRouter()
tracker_service = TrackerService()

@router.get("/current", response_model=PriceData)
async def get_current_price():
    """Get the current KALE token price"""
    price_data = await tracker_service.get_current_price()
    
    if not price_data:
        raise HTTPException(status_code=404, detail="No price data available")
    
    return price_data

@router.get("/history", response_model=PriceHistoryResponse)
async def get_price_history(
    start_date: Optional[datetime] = Query(None, description="Start date for price history"),
    end_date: Optional[datetime] = Query(None, description="End date for price history"),
    limit: int = Query(100, description="Maximum number of records to return", le=1000, ge=1),
    offset: int = Query(0, description="Number of records to skip", ge=0)
):
    """Get KALE token price history with optional filtering"""
    
    # Get price history
    price_history = await tracker_service.get_price_history(
        start_date=start_date,
        end_date=end_date,
        limit=limit + 1  # Get one extra to check if there are more
    )
    
    # Check if there are more records
    has_more = len(price_history) > limit
    if has_more:
        price_history = price_history[:-1]  # Remove the extra record
    
    # Get total count (approximate for performance)
    total_count = len(price_history) + offset
    if has_more:
        total_count += 1  # At least one more
    
    # Get statistics for the queried period
    statistics = None
    if price_history:
        # Calculate basic statistics from the returned data
        prices = [p.price for p in price_history]
        statistics = PriceStatistics(
            current_price=prices[0] if prices else 0,  # Most recent (first in desc order)
            price_24h_high=max(prices),
            price_24h_low=min(prices),
            price_24h_change=prices[0] - prices[-1] if len(prices) > 1 else 0,
            price_24h_change_percent=((prices[0] - prices[-1]) / prices[-1] * 100) if len(prices) > 1 and prices[-1] > 0 else 0,
            average_price=sum(prices) / len(prices),
            total_data_points=len(prices),
            last_updated=datetime.utcnow()
        )
    
    return PriceHistoryResponse(
        data=price_history,
        total_count=total_count,
        has_more=has_more,
        statistics=statistics
    )

@router.get("/statistics", response_model=PriceStatistics)
async def get_price_statistics(
    hours: int = Query(24, description="Number of hours to calculate statistics for", ge=1, le=168)
):
    """Get KALE token price statistics for a specified time period"""
    
    statistics = await tracker_service.get_price_statistics(hours=hours)
    
    if not statistics:
        raise HTTPException(status_code=404, detail="No price data available for the specified period")
    
    return statistics

@router.get("/technical-indicators")
async def get_technical_indicators():
    """Get basic technical analysis indicators for KALE token"""
    
    # For now, return tracker statistics since the original tracker doesn't have technical indicators
    statistics = await tracker_service.get_price_statistics(hours=24)
    tracker_stats = tracker_service.get_tracker_stats()
    
    if not statistics:
        raise HTTPException(status_code=404, detail="No technical indicators available")
    
    return {
        "basic_stats": statistics,
        "tracker_info": tracker_stats
    }

@router.get("/summary")
async def get_price_summary():
    """Get a comprehensive price summary including current price, statistics, and indicators"""
    
    # Get current price
    current_price = await tracker_service.get_current_price()
    
    # Get 24h statistics
    statistics_24h = await tracker_service.get_price_statistics(hours=24)
    
    # Get recent price history for trend analysis
    recent_prices = await tracker_service.get_price_history(limit=10)
    
    # Get tracker stats
    tracker_stats = tracker_service.get_tracker_stats()
    
    # Calculate trend
    trend = None
    if len(recent_prices) >= 2:
        if recent_prices[0].price > recent_prices[1].price:
            trend = "up"
        elif recent_prices[0].price < recent_prices[1].price:
            trend = "down"
        else:
            trend = "stable"
    
    return {
        "current_price": current_price,
        "statistics_24h": statistics_24h,
        "tracker_info": tracker_stats,
        "trend": trend,
        "recent_prices": recent_prices[:5],  # Last 5 prices
        "last_updated": datetime.utcnow(),
        "data_sources_priority": ["stellar", "csv", "hardcoded"]
    }

@router.post("/force-update", response_model=PriceData)
async def force_price_update():
    """Force an immediate price update"""
    price_data = await tracker_service.force_price_update()
    
    if not price_data:
        raise HTTPException(status_code=503, detail="Failed to fetch price data")
    
    return price_data