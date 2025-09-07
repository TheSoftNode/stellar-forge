from fastapi import APIRouter, HTTPException
from datetime import datetime
from sqlalchemy import text

from app.core.config import settings
from app.db.database import AsyncSessionLocal
from app.services.price_monitor import PriceService

router = APIRouter()
price_service = PriceService()

@router.get("/")
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }

@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check including database and service status"""
    
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "checks": {}
    }
    
    # Database connectivity check
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "Database connection successful"
        }
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}"
        }
    
    # Price service check
    try:
        current_price = await price_service.get_current_price()
        if current_price:
            health_status["checks"]["price_service"] = {
                "status": "healthy",
                "message": "Price data available",
                "last_price_update": current_price.timestamp
            }
        else:
            health_status["checks"]["price_service"] = {
                "status": "warning",
                "message": "No price data available"
            }
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["checks"]["price_service"] = {
            "status": "unhealthy",
            "message": f"Price service error: {str(e)}"
        }
    
    # Configuration check
    health_status["checks"]["configuration"] = {
        "status": "healthy",
        "stellar_horizon_url": settings.STELLAR_HORIZON_URL,
        "kale_asset": f"{settings.KALE_ASSET_CODE}:{settings.KALE_ASSET_ISSUER[:12]}...",
        "update_interval": settings.PRICE_UPDATE_INTERVAL
    }
    
    if health_status["status"] != "healthy":
        raise HTTPException(status_code=503, detail=health_status)
    
    return health_status

@router.get("/readiness")
async def readiness_check():
    """Kubernetes-style readiness probe"""
    try:
        # Check if we have recent price data (within last 5 minutes)
        current_price = await price_service.get_current_price()
        
        if not current_price:
            raise HTTPException(status_code=503, detail="No price data available - service not ready")
        
        # Check if price data is recent
        time_since_update = datetime.utcnow() - current_price.timestamp
        if time_since_update.total_seconds() > 300:  # 5 minutes
            raise HTTPException(status_code=503, detail="Price data is stale - service not ready")
        
        return {
            "status": "ready",
            "last_price_update": current_price.timestamp,
            "seconds_since_update": time_since_update.total_seconds()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Readiness check failed: {str(e)}")

@router.get("/liveness")
async def liveness_check():
    """Kubernetes-style liveness probe"""
    try:
        # Simple database connectivity check
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        
        return {
            "status": "alive",
            "timestamp": datetime.utcnow()
        }
        
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Liveness check failed: {str(e)}")