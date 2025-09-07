from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List
from datetime import datetime

from app.models.farming import (
    FarmingStats, FarmerData, FarmingOpportunity, NetworkHealth,
    FarmingAlert, FarmingROIAnalysis, FarmingLeaderboard, 
    ComprehensiveFarmingData, FarmingTrends
)
from app.services.kale_farming import KaleFarmingService
from app.services.tracker_service import TrackerService
from app.core.config import settings

router = APIRouter()
farming_service = KaleFarmingService()
tracker_service = TrackerService()

@router.get("/stats", response_model=FarmingStats)
async def get_farming_stats():
    """Get current KALE farming network statistics"""
    try:
        stats = await farming_service.get_farming_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching farming stats: {str(e)}")

@router.get("/farmer/{address}", response_model=FarmerData)
async def get_farmer_data(address: str):
    """Get detailed data for a specific farmer"""
    if len(address) < 10:  # Basic validation for Stellar address
        raise HTTPException(status_code=400, detail="Invalid Stellar address format")
    
    try:
        farmer_data = await farming_service.get_farmer_data(address)
        if not farmer_data:
            raise HTTPException(status_code=404, detail="Farmer not found or no farming activity")
        
        return farmer_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching farmer data: {str(e)}")

@router.get("/opportunity", response_model=FarmingOpportunity)
async def analyze_farming_opportunity(
    stake_amount: float = Query(100, description="Amount of KALE to stake", ge=1)
):
    """Analyze current farming opportunity based on market conditions"""
    try:
        # Get current KALE price from the price tracker
        current_price_data = await tracker_service.get_current_price()
        if not current_price_data:
            raise HTTPException(status_code=503, detail="Price data not available")
        
        opportunity = await farming_service.analyze_farming_opportunity(
            current_price=current_price_data.price,
            stake_amount=stake_amount
        )
        
        return opportunity
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing opportunity: {str(e)}")

@router.get("/roi-analysis", response_model=FarmingROIAnalysis)
async def get_roi_analysis(
    stake_amount: float = Query(100, description="Amount of KALE to stake", ge=1),
    gas_cost_xlm: float = Query(0.01, description="Estimated gas costs in XLM", ge=0)
):
    """Get detailed ROI analysis for farming operations"""
    try:
        # Get current KALE price
        current_price_data = await tracker_service.get_current_price()
        if not current_price_data:
            raise HTTPException(status_code=503, detail="Price data not available")
        
        current_price = current_price_data.price
        
        # Get farming opportunity analysis
        opportunity = await farming_service.analyze_farming_opportunity(
            current_price=current_price,
            stake_amount=stake_amount
        )
        
        # Calculate detailed ROI
        expected_reward = opportunity.estimated_reward
        reward_value_usd = expected_reward * current_price
        
        # Estimate costs (gas + opportunity cost)
        xlm_to_usd = 0.12  # Mock XLM price, in real app would fetch from price feed
        gas_cost_usd = gas_cost_xlm * xlm_to_usd
        opportunity_cost = stake_amount * current_price * 0.001  # 0.1% opportunity cost
        total_costs = gas_cost_usd + opportunity_cost
        
        net_profit = reward_value_usd - total_costs
        roi_percentage = (net_profit / (stake_amount * current_price)) * 100
        
        # Calculate breakeven price
        breakeven_price = total_costs / expected_reward if expected_reward > 0 else current_price * 2
        
        # Risk adjustment (based on farming difficulty and market volatility)
        farming_stats = await farming_service.get_farming_stats()
        risk_factor = 1 - (farming_stats.farming_difficulty * 0.3)
        risk_adjusted_roi = roi_percentage * risk_factor
        
        return FarmingROIAnalysis(
            current_price=current_price,
            stake_amount=stake_amount,
            expected_reward=expected_reward,
            reward_value_usd=reward_value_usd,
            cost_estimate=total_costs,
            net_profit_usd=net_profit,
            roi_percentage=roi_percentage,
            breakeven_price=breakeven_price,
            risk_adjusted_roi=risk_adjusted_roi
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating ROI: {str(e)}")

@router.get("/network-health", response_model=NetworkHealth)
async def get_network_health():
    """Get overall KALE farming network health metrics"""
    try:
        health = await farming_service.calculate_network_health()
        return NetworkHealth(**health)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating network health: {str(e)}")

@router.get("/leaderboard", response_model=FarmingLeaderboard)
async def get_farming_leaderboard(
    limit: int = Query(50, description="Number of top farmers to return", ge=1, le=200),
    sort_by: str = Query("total_rewards", description="Sort criteria")
):
    """Get farming leaderboard showing top farmers"""
    try:
        farmers = await farming_service.get_farming_leaderboard(limit=limit)
        
        return FarmingLeaderboard(
            farmers=farmers,
            total_count=len(farmers),
            leaderboard_type=sort_by
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching leaderboard: {str(e)}")

@router.get("/comprehensive", response_model=ComprehensiveFarmingData)
async def get_comprehensive_farming_data():
    """Get comprehensive farming data combining all metrics"""
    try:
        # Gather all farming data in parallel
        import asyncio
        
        stats_task = farming_service.get_farming_stats()
        health_task = farming_service.calculate_network_health()
        leaderboard_task = farming_service.get_farming_leaderboard(limit=10)
        
        # Get current price for opportunity analysis
        current_price_data = await tracker_service.get_current_price()
        current_price = current_price_data.price if current_price_data else 0.095
        
        opportunity_task = farming_service.analyze_farming_opportunity(
            current_price=current_price, 
            stake_amount=200
        )
        
        # Wait for all tasks
        stats, health_dict, top_farmers, opportunity = await asyncio.gather(
            stats_task, health_task, leaderboard_task, opportunity_task
        )
        
        # Mock trends data (in real implementation, would calculate from historical data)
        trends = FarmingTrends(
            time_period="24h",
            farmer_growth_rate=5.2,
            staking_growth_rate=12.8,
            emission_trend="stable",
            reward_trend="increasing",
            optimal_farming_hours=[8, 9, 10, 14, 15, 16, 20, 21],
            historical_data=[]
        )
        
        # Mock alerts
        alerts = [
            FarmingAlert(
                alert_type="optimal_conditions",
                message="Network conditions are optimal for farming - consider increasing stake",
                severity="info",
                action_required=False
            )
        ]
        
        # Price integration metrics
        price_stats = await tracker_service.get_price_statistics(hours=24)
        price_integration = {
            "current_price": current_price,
            "price_trend": "stable" if price_stats and abs(price_stats.price_24h_change_percent) < 5 else "volatile",
            "farming_profitability": "high" if opportunity.roi_percentage > 10 else "medium",
            "optimal_farming_price_range": {
                "min": current_price * 0.9,
                "max": current_price * 1.1
            }
        } if price_stats else {"error": "Price data unavailable"}
        
        return ComprehensiveFarmingData(
            stats=stats,
            network_health=NetworkHealth(**health_dict),
            top_opportunities=[opportunity],
            active_alerts=alerts,
            leaderboard_preview=top_farmers[:5],
            trends=trends,
            price_integration=price_integration
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comprehensive data: {str(e)}")

@router.post("/alerts/create")
async def create_farming_alert(
    alert_type: str,
    farmer_address: Optional[str] = None,
    threshold_value: Optional[float] = None
):
    """Create a new farming alert for specific conditions"""
    try:
        # In a real implementation, this would save the alert to a database
        # and trigger notifications when conditions are met
        
        alert_config = {
            "alert_type": alert_type,
            "farmer_address": farmer_address,
            "threshold_value": threshold_value,
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        return {
            "message": "Alert created successfully",
            "alert_id": f"alert_{int(datetime.utcnow().timestamp())}",
            "config": alert_config
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating alert: {str(e)}")

@router.get("/optimal-strategy")
async def get_optimal_farming_strategy(
    available_kale: float = Query(..., description="Available KALE tokens to stake", gt=0),
    risk_tolerance: str = Query("medium", description="Risk tolerance level (low/medium/high)")
):
    """Get optimal farming strategy recommendations"""
    try:
        # Get current market conditions
        current_price_data = await tracker_service.get_current_price()
        current_price = current_price_data.price if current_price_data else 0.095
        
        stats = await farming_service.get_farming_stats()
        
        # Calculate strategy based on risk tolerance
        if risk_tolerance == "low":
            recommended_stake = min(available_kale * 0.3, 100)  # Conservative
            diversification = 3  # Split across multiple sessions
        elif risk_tolerance == "high":
            recommended_stake = min(available_kale * 0.8, 500)  # Aggressive
            diversification = 1  # All in one session
        else:
            recommended_stake = min(available_kale * 0.5, 250)  # Balanced
            diversification = 2  # Split across two sessions
        
        opportunity = await farming_service.analyze_farming_opportunity(
            current_price=current_price,
            stake_amount=recommended_stake
        )
        
        strategy = {
            "recommended_stake": recommended_stake,
            "diversification_level": diversification,
            "expected_roi": opportunity.roi_percentage,
            "risk_assessment": {
                "market_risk": "medium" if stats.farming_difficulty < 0.7 else "high",
                "liquidity_risk": "low",
                "technical_risk": "low"
            },
            "timing_recommendation": {
                "plant_immediately": opportunity.recommended_action == "plant_now",
                "optimal_plant_time": opportunity.time_to_plant,
                "expected_harvest_time": opportunity.time_to_harvest
            },
            "fallback_strategy": {
                "if_price_drops": "reduce_stake_by_20_percent",
                "if_difficulty_increases": "wait_for_better_conditions",
                "if_emission_decreases": "increase_stake_if_profitable"
            }
        }
        
        return strategy
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating strategy: {str(e)}")

@router.get("/farming-simulator")
async def simulate_farming_session(
    stake_amount: float = Query(..., description="Amount of KALE to stake", gt=0),
    duration_hours: int = Query(24, description="Simulation duration in hours", ge=1, le=168),
    scenarios: int = Query(1000, description="Number of scenarios to simulate", ge=100, le=10000)
):
    """Simulate farming outcomes based on current conditions"""
    try:
        import random
        
        current_price_data = await tracker_service.get_current_price()
        current_price = current_price_data.price if current_price_data else 0.095
        
        stats = await farming_service.get_farming_stats()
        
        # Run Monte Carlo simulation
        outcomes = []
        total_profit = 0
        successful_farms = 0
        
        for _ in range(scenarios):
            # Simulate random factors
            difficulty_variation = random.uniform(0.8, 1.2)  # ±20% difficulty variation
            price_variation = random.uniform(0.9, 1.1)      # ±10% price variation
            
            simulated_difficulty = min(stats.farming_difficulty * difficulty_variation, 1.0)
            simulated_price = current_price * price_variation
            
            # Calculate simulated reward
            base_reward = stake_amount * 0.01
            difficulty_modifier = 1 / max(simulated_difficulty, 0.1)
            
            # Success probability based on difficulty
            success_prob = max(0.3, 1 - simulated_difficulty)
            
            if random.random() < success_prob:
                reward = base_reward * difficulty_modifier
                profit = reward * simulated_price - (stake_amount * current_price * 0.001)  # Subtract opportunity cost
                outcomes.append(profit)
                total_profit += profit
                successful_farms += 1
            else:
                outcomes.append(-stake_amount * current_price * 0.001)  # Just opportunity cost
        
        # Calculate statistics
        outcomes.sort()
        success_rate = successful_farms / scenarios
        avg_profit = total_profit / scenarios
        
        percentile_95 = outcomes[int(scenarios * 0.95)] if outcomes else 0
        percentile_5 = outcomes[int(scenarios * 0.05)] if outcomes else 0
        
        simulation_results = {
            "simulation_parameters": {
                "stake_amount": stake_amount,
                "duration_hours": duration_hours,
                "scenarios_run": scenarios,
                "base_price": current_price,
                "base_difficulty": stats.farming_difficulty
            },
            "results": {
                "success_rate": success_rate,
                "average_profit_usd": avg_profit,
                "best_case_profit": max(outcomes) if outcomes else 0,
                "worst_case_profit": min(outcomes) if outcomes else 0,
                "percentile_95": percentile_95,
                "percentile_5": percentile_5,
                "expected_roi_percent": (avg_profit / (stake_amount * current_price)) * 100,
                "risk_metrics": {
                    "volatility": (percentile_95 - percentile_5) / 2,
                    "downside_risk": abs(percentile_5) if percentile_5 < 0 else 0,
                    "probability_of_loss": len([o for o in outcomes if o < 0]) / scenarios
                }
            },
            "recommendations": {
                "proceed": success_rate > 0.6 and avg_profit > 0,
                "confidence_level": "high" if success_rate > 0.8 else "medium" if success_rate > 0.6 else "low",
                "suggested_adjustments": []
            }
        }
        
        # Add suggestions based on results
        if success_rate < 0.5:
            simulation_results["recommendations"]["suggested_adjustments"].append("Consider reducing stake amount")
        if avg_profit < 0:
            simulation_results["recommendations"]["suggested_adjustments"].append("Wait for better market conditions")
        if percentile_5 < -stake_amount * current_price * 0.1:
            simulation_results["recommendations"]["suggested_adjustments"].append("High downside risk - consider risk management")
        
        return simulation_results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running simulation: {str(e)}")