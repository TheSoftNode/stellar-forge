from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class FarmingAction(str, Enum):
    """Recommended farming actions"""
    PLANT_NOW = "plant_now"
    CONSIDER_PLANTING = "consider_planting"
    WAIT_FOR_BETTER_CONDITIONS = "wait_for_better_conditions"
    HARVEST_READY = "harvest_ready"
    HARVEST_URGENT = "harvest_urgent"

class RiskLevel(str, Enum):
    """Risk levels for farming operations"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EXTREME = "extreme"

class NetworkStatus(str, Enum):
    """Network health status"""
    HEALTHY = "healthy"
    MODERATE = "moderate"
    POOR = "poor"
    CRITICAL = "critical"

class FarmingStats(BaseModel):
    """Current KALE farming network statistics"""
    active_farmers: int = Field(..., description="Number of currently active farmers")
    total_staked: float = Field(..., description="Total KALE tokens staked across all farmers")
    current_emission_rate: float = Field(..., description="Current KALE emission rate per minute")
    next_decay_date: datetime = Field(..., description="Next scheduled emission decay date")
    farming_difficulty: float = Field(..., description="Current farming difficulty (0-1 scale)", ge=0, le=1)
    recent_harvests: int = Field(..., description="Number of harvests in the last hour")
    avg_reward_per_farm: float = Field(..., description="Average reward per farming session")
    total_kale_supply: float = Field(..., description="Total KALE token supply")
    
    class Config:
        schema_extra = {
            "example": {
                "active_farmers": 187,
                "total_staked": 82450.75,
                "current_emission_rate": 425.5,
                "next_decay_date": "2024-02-15T00:00:00Z",
                "farming_difficulty": 0.67,
                "recent_harvests": 23,
                "avg_reward_per_farm": 18.32,
                "total_kale_supply": 2500000
            }
        }

class FarmerData(BaseModel):
    """Individual farmer statistics and data"""
    address: str = Field(..., description="Stellar address of the farmer")
    stake_amount: float = Field(..., description="Amount of KALE tokens staked", ge=0)
    last_plant_time: Optional[datetime] = Field(None, description="Timestamp of last plant operation")
    last_harvest_time: Optional[datetime] = Field(None, description="Timestamp of last harvest")
    total_rewards: float = Field(..., description="Total KALE rewards earned", ge=0)
    farms_completed: int = Field(..., description="Total number of farming cycles completed", ge=0)
    success_rate: float = Field(..., description="Farming success rate (0-1)", ge=0, le=1)
    is_active: bool = Field(..., description="Whether the farmer is currently active")
    
    class Config:
        schema_extra = {
            "example": {
                "address": "GABC123...",
                "stake_amount": 250.0,
                "last_plant_time": "2024-01-15T14:30:00Z",
                "last_harvest_time": "2024-01-14T16:45:00Z",
                "total_rewards": 1250.75,
                "farms_completed": 45,
                "success_rate": 0.87,
                "is_active": True
            }
        }

class FarmingOpportunity(BaseModel):
    """Analysis of current farming opportunity"""
    optimal_stake: float = Field(..., description="Recommended optimal stake amount", ge=0)
    estimated_reward: float = Field(..., description="Estimated reward for the farming session", ge=0)
    roi_percentage: float = Field(..., description="Expected ROI as a percentage")
    risk_level: RiskLevel = Field(..., description="Risk level of the farming operation")
    recommended_action: FarmingAction = Field(..., description="Recommended action to take")
    time_to_plant: Optional[datetime] = Field(None, description="Optimal time to plant")
    time_to_harvest: Optional[datetime] = Field(None, description="Expected harvest time")
    confidence_score: float = Field(0.8, description="Confidence in the analysis (0-1)", ge=0, le=1)
    
    class Config:
        schema_extra = {
            "example": {
                "optimal_stake": 175.50,
                "estimated_reward": 22.45,
                "roi_percentage": 12.83,
                "risk_level": "medium",
                "recommended_action": "plant_now",
                "time_to_plant": "2024-01-15T15:00:00Z",
                "time_to_harvest": "2024-01-16T15:00:00Z",
                "confidence_score": 0.85
            }
        }

class NetworkHealth(BaseModel):
    """Overall KALE farming network health metrics"""
    overall_health_score: float = Field(..., description="Overall health score (0-100)", ge=0, le=100)
    participation_rate: float = Field(..., description="Farmer participation rate (0-100)", ge=0, le=100)
    staking_ratio: float = Field(..., description="Percentage of KALE tokens staked (0-100)", ge=0, le=100)
    emission_efficiency: float = Field(..., description="Emission efficiency rate (0-100)", ge=0, le=100)
    network_status: NetworkStatus = Field(..., description="Overall network status")
    recommendations: List[str] = Field(..., description="List of network recommendations")
    last_updated: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")

class FarmingAlert(BaseModel):
    """Farming-specific alert or notification"""
    alert_type: str = Field(..., description="Type of farming alert")
    message: str = Field(..., description="Alert message")
    severity: str = Field(..., description="Alert severity level")
    farmer_address: Optional[str] = Field(None, description="Specific farmer address if applicable")
    action_required: bool = Field(False, description="Whether immediate action is required")
    expires_at: Optional[datetime] = Field(None, description="When the alert expires")
    
    class Config:
        schema_extra = {
            "example": {
                "alert_type": "harvest_reminder",
                "message": "Your farm is ready to harvest! Claim within 2 hours to avoid expiration.",
                "severity": "high",
                "farmer_address": "GABC123...",
                "action_required": True,
                "expires_at": "2024-01-15T18:00:00Z"
            }
        }

class FarmingROIAnalysis(BaseModel):
    """ROI analysis for farming operations"""
    current_price: float = Field(..., description="Current KALE price in USD", gt=0)
    stake_amount: float = Field(..., description="Stake amount being analyzed", ge=0)
    expected_reward: float = Field(..., description="Expected KALE reward", ge=0)
    reward_value_usd: float = Field(..., description="USD value of expected reward", ge=0)
    cost_estimate: float = Field(..., description="Estimated costs (gas, opportunity, etc.)", ge=0)
    net_profit_usd: float = Field(..., description="Net profit in USD")
    roi_percentage: float = Field(..., description="ROI as percentage")
    breakeven_price: float = Field(..., description="KALE price needed to break even", gt=0)
    risk_adjusted_roi: float = Field(..., description="Risk-adjusted ROI percentage")

class FarmingLeaderboard(BaseModel):
    """Leaderboard data for top farmers"""
    farmers: List[FarmerData] = Field(..., description="List of top farmers")
    total_count: int = Field(..., description="Total number of farmers")
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    leaderboard_type: str = Field("total_rewards", description="Type of leaderboard ranking")

class FarmingHistory(BaseModel):
    """Historical farming data point"""
    timestamp: datetime = Field(..., description="Timestamp of the data point")
    active_farmers: int = Field(..., description="Number of active farmers at this time")
    total_staked: float = Field(..., description="Total staked amount at this time")
    emission_rate: float = Field(..., description="Emission rate at this time")
    avg_reward: float = Field(..., description="Average reward at this time")
    kale_price: Optional[float] = Field(None, description="KALE price at this time")

class FarmingTrends(BaseModel):
    """Farming trends and analytics"""
    time_period: str = Field(..., description="Time period for the trends (24h, 7d, 30d)")
    farmer_growth_rate: float = Field(..., description="Growth rate of farmers")
    staking_growth_rate: float = Field(..., description="Growth rate of staking")
    emission_trend: str = Field(..., description="Emission rate trend (increasing/decreasing/stable)")
    reward_trend: str = Field(..., description="Reward trend (increasing/decreasing/stable)")
    optimal_farming_hours: List[int] = Field(..., description="Best hours of day for farming")
    historical_data: List[FarmingHistory] = Field(..., description="Historical data points")

class FarmingPoolData(BaseModel):
    """Data for farming pools or groups"""
    pool_id: str = Field(..., description="Unique pool identifier")
    pool_name: str = Field(..., description="Human-readable pool name")
    total_members: int = Field(..., description="Number of farmers in the pool")
    total_stake: float = Field(..., description="Combined stake of all pool members")
    pool_success_rate: float = Field(..., description="Pool success rate", ge=0, le=1)
    min_stake_requirement: float = Field(..., description="Minimum stake to join pool")
    pool_fees: float = Field(..., description="Pool fee percentage", ge=0, le=1)
    last_harvest: Optional[datetime] = Field(None, description="Last pool harvest time")

class ComprehensiveFarmingData(BaseModel):
    """Comprehensive farming data combining all metrics"""
    stats: FarmingStats
    network_health: NetworkHealth
    top_opportunities: List[FarmingOpportunity]
    active_alerts: List[FarmingAlert]
    leaderboard_preview: List[FarmerData]
    trends: FarmingTrends
    price_integration: Dict[str, Any] = Field(..., description="Price-related farming metrics")
    last_updated: datetime = Field(default_factory=datetime.utcnow)