from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.api import api_router
from app.services.tracker_service import TrackerService

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events"""
    # Startup
    logger.info("Starting KALE Price Tracker API...")
    
    # Create the tracker service instance
    tracker_service = TrackerService()
    
    # Start background price monitoring using the real tracker
    await tracker_service.start_background_monitoring()
    logger.info("KALE Price Tracker service started")
    
    # Store tracker service in app state for access in endpoints
    app.state.tracker_service = tracker_service
    
    yield
    
    # Shutdown
    logger.info("Shutting down KALE Price Tracker API...")
    await tracker_service.stop_background_monitoring()
    logger.info("KALE Price Tracker service stopped")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Professional KALE token price tracking API with real-time monitoring",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "KALE Price Tracker API",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for deployment monitoring"""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }