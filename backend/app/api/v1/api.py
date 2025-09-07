from fastapi import APIRouter

from app.api.v1.endpoints import prices, health, websocket, farming

api_router = APIRouter()
api_router.include_router(prices.router, prefix="/prices", tags=["prices"])
api_router.include_router(farming.router, prefix="/farming", tags=["farming"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"])