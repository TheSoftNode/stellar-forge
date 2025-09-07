from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json
import logging
from datetime import datetime

from app.models.price import WebSocketMessage
from app.services.tracker_service import TrackerService
from app.services.kale_farming import KaleFarmingService

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    """Manages WebSocket connections for real-time price updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.tracker_service = TrackerService()
        self.farming_service = KaleFarmingService()
        
    async def connect(self, websocket: WebSocket):
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
        
        # Send current price immediately
        try:
            current_price = await self.tracker_service.get_current_price()
            if current_price:
                message = WebSocketMessage(
                    type="price_update",
                    data=current_price.dict()
                )
                await websocket.send_text(message.json())
        except Exception as e:
            logger.error(f"Error sending initial price: {e}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def broadcast_price_update(self, price_data: dict):
        """Broadcast price update to all connected clients"""
        if not self.active_connections:
            return
        
        message = WebSocketMessage(
            type="price_update",
            data=price_data
        )
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message.json())
            except Exception as e:
                logger.warning(f"Error broadcasting to connection: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)
    
    async def broadcast_alert(self, alert_data: dict):
        """Broadcast price alert to all connected clients"""
        if not self.active_connections:
            return
        
        message = WebSocketMessage(
            type="price_alert",
            data=alert_data
        )
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message.json())
            except Exception as e:
                logger.warning(f"Error broadcasting alert to connection: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)

# Global connection manager instance
manager = ConnectionManager()

@router.websocket("/price-stream")
async def websocket_price_stream(websocket: WebSocket):
    """WebSocket endpoint for real-time KALE price updates"""
    await manager.connect(websocket)
    
    try:
        # Keep connection alive and handle client messages
        while True:
            try:
                # Wait for client messages (ping, subscription preferences, etc.)
                data = await websocket.receive_text()
                
                try:
                    message = json.loads(data)
                    await handle_client_message(websocket, message)
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON received from client: {data}")
                    
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"Error in WebSocket loop: {e}")
                break
                
    finally:
        manager.disconnect(websocket)

async def handle_client_message(websocket: WebSocket, message: dict):
    """Handle messages received from WebSocket clients"""
    message_type = message.get("type")
    
    if message_type == "ping":
        # Respond to ping with pong
        pong_message = WebSocketMessage(
            type="pong",
            data={"timestamp": datetime.utcnow().isoformat()}
        )
        await websocket.send_text(pong_message.json())
        
    elif message_type == "get_current_price":
        # Send current price on request
        current_price = await manager.tracker_service.get_current_price()
        if current_price:
            response_message = WebSocketMessage(
                type="current_price_response",
                data=current_price.dict()
            )
            await websocket.send_text(response_message.json())
        
    elif message_type == "get_statistics":
        # Send price statistics on request
        hours = message.get("data", {}).get("hours", 24)
        statistics = await manager.tracker_service.get_price_statistics(hours=hours)
        if statistics:
            response_message = WebSocketMessage(
                type="statistics_response",
                data=statistics.dict()
            )
            await websocket.send_text(response_message.json())
    
    elif message_type == "get_farming_stats":
        # Send farming statistics on request
        farming_stats = await manager.farming_service.get_farming_stats()
        response_message = WebSocketMessage(
            type="farming_stats_response",
            data=farming_stats.__dict__
        )
        await websocket.send_text(response_message.json())
    
    elif message_type == "get_farming_opportunity":
        # Send farming opportunity analysis
        stake_amount = message.get("data", {}).get("stake_amount", 100)
        current_price = await manager.tracker_service.get_current_price()
        if current_price:
            opportunity = await manager.farming_service.analyze_farming_opportunity(
                current_price.price, stake_amount
            )
            response_message = WebSocketMessage(
                type="farming_opportunity_response",
                data=opportunity.__dict__
            )
            await websocket.send_text(response_message.json())
    
    elif message_type == "subscribe_farming_alerts":
        # Subscribe to farming-specific alerts
        farmer_address = message.get("data", {}).get("farmer_address")
        response_message = WebSocketMessage(
            type="subscription_confirmed",
            data={
                "subscription_type": "farming_alerts",
                "farmer_address": farmer_address,
                "alerts": ["harvest_reminder", "optimal_conditions", "network_congestion"]
            }
        )
        await websocket.send_text(response_message.json())
    
    else:
        logger.warning(f"Unknown message type received: {message_type}")

# Function to be called by the price monitoring service
async def notify_price_update(price_data: dict):
    """Function to be called when price is updated"""
    await manager.broadcast_price_update(price_data)

async def notify_price_alert(alert_data: dict):
    """Function to be called when price alert is triggered"""
    await manager.broadcast_alert(alert_data)

# Functions to be called by the farming service
async def notify_farming_opportunity(opportunity_data: dict):
    """Broadcast farming opportunity changes"""
    if not manager.active_connections:
        return
    
    message = WebSocketMessage(
        type="farming_opportunity_update",
        data=opportunity_data
    )
    
    disconnected = []
    for connection in manager.active_connections:
        try:
            await connection.send_text(message.json())
        except Exception as e:
            logger.warning(f"Error broadcasting farming opportunity: {e}")
            disconnected.append(connection)
    
    # Clean up disconnected connections
    for connection in disconnected:
        manager.disconnect(connection)

async def notify_farming_alert(alert_data: dict):
    """Broadcast farming-specific alerts"""
    if not manager.active_connections:
        return
    
    message = WebSocketMessage(
        type="farming_alert",
        data=alert_data
    )
    
    disconnected = []
    for connection in manager.active_connections:
        try:
            await connection.send_text(message.json())
        except Exception as e:
            logger.warning(f"Error broadcasting farming alert: {e}")
            disconnected.append(connection)
    
    # Clean up disconnected connections
    for connection in disconnected:
        manager.disconnect(connection)

async def notify_harvest_reminder(farmer_address: str, time_remaining: int):
    """Notify specific farmer about harvest deadline"""
    alert_data = {
        "farmer_address": farmer_address,
        "alert_type": "harvest_reminder",
        "message": f"Harvest deadline in {time_remaining} hours! Don't lose your rewards.",
        "time_remaining_hours": time_remaining,
        "severity": "high" if time_remaining < 2 else "medium"
    }
    
    await notify_farming_alert(alert_data)