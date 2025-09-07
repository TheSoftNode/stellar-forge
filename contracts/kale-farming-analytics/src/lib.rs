#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol, Vec,
};

mod test;

// Data structures for farming analytics
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FarmerData {
    pub address: Address,
    pub total_staked: i128,
    pub total_rewards: i128,
    pub farms_completed: u32,
    pub last_plant_time: u64,
    pub last_harvest_time: u64,
    pub success_rate: u32, // Percentage * 100 (e.g., 8500 = 85.00%)
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct NetworkStats {
    pub total_farmers: u32,
    pub total_staked: i128,
    pub total_rewards_distributed: i128,
    pub current_emission_rate: u32, // KALE per minute * 100
    pub farming_difficulty: u32,    // 0-10000 scale
    pub last_updated: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct FarmingSession {
    pub farmer: Address,
    pub stake_amount: i128,
    pub plant_time: u64,
    pub target_hash: Symbol,
    pub is_active: bool,
    pub reward_claimed: bool,
}

const FARMERS: Symbol = symbol_short!("FARMERS");
const NETWORK: Symbol = symbol_short!("NETWORK");
const SESSIONS: Symbol = symbol_short!("SESSIONS");
const LEADERBOARD: Symbol = symbol_short!("LEADERS");

// Reference to main KALE contract (would be the actual deployed contract)
const KALE_CONTRACT: Symbol = symbol_short!("KALE_MAIN");

#[contract]
pub struct KaleFarmingAnalytics;

#[contractimpl]
impl KaleFarmingAnalytics {
    /// Initialize the farming analytics contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        
        let network_stats = NetworkStats {
            total_farmers: 0,
            total_staked: 0,
            total_rewards_distributed: 0,
            current_emission_rate: 50000, // 500.00 KALE per minute
            farming_difficulty: 5000,      // 50% difficulty
            last_updated: env.ledger().timestamp(),
        };
        
        env.storage().instance().set(&NETWORK, &network_stats);
    }

    /// Record a new farming session (called by KALE main contract or farmers)
    pub fn record_farming_session(
        env: Env,
        farmer: Address,
        stake_amount: i128,
        success: bool,
        reward: i128,
    ) {
        farmer.require_auth();
        
        let session_id = env.ledger().sequence();
        let current_time = env.ledger().timestamp();
        
        // Update or create farmer data
        let mut farmer_data = env
            .storage()
            .persistent()
            .get(&FARMERS, &farmer)
            .unwrap_or(FarmerData {
                address: farmer.clone(),
                total_staked: 0,
                total_rewards: 0,
                farms_completed: 0,
                last_plant_time: 0,
                last_harvest_time: 0,
                success_rate: 0,
            });

        // Update farmer statistics
        farmer_data.total_staked += stake_amount;
        if success {
            farmer_data.total_rewards += reward;
            farmer_data.last_harvest_time = current_time;
        }
        farmer_data.farms_completed += 1;
        farmer_data.last_plant_time = current_time;
        
        // Recalculate success rate
        if farmer_data.farms_completed > 0 {
            let successful_farms = if success {
                (farmer_data.success_rate * (farmer_data.farms_completed - 1) / 10000) + 1
            } else {
                farmer_data.success_rate * (farmer_data.farms_completed - 1) / 10000
            };
            farmer_data.success_rate = (successful_farms * 10000) / farmer_data.farms_completed;
        }

        // Store updated farmer data
        env.storage()
            .persistent()
            .set(&FARMERS, &farmer, &farmer_data);

        // Update network statistics
        let mut network_stats: NetworkStats = env
            .storage()
            .instance()
            .get(&NETWORK)
            .unwrap();

        if farmer_data.farms_completed == 1 {
            network_stats.total_farmers += 1; // New farmer
        }
        
        network_stats.total_staked += stake_amount;
        if success {
            network_stats.total_rewards_distributed += reward;
        }
        network_stats.last_updated = current_time;
        
        // Update farming difficulty based on network activity
        let activity_factor = network_stats.total_farmers as u32;
        network_stats.farming_difficulty = core::cmp::min(
            9000, // Max 90% difficulty
            3000 + (activity_factor * 10) // Base 30% + 0.1% per farmer
        );

        env.storage().instance().set(&NETWORK, &network_stats);

        // Emit event for the API to track
        env.events().publish(
            (symbol_short!("farming"), symbol_short!("session")),
            (farmer.clone(), success, reward),
        );
    }

    /// Get farmer data by address
    pub fn get_farmer_data(env: Env, farmer: Address) -> Option<FarmerData> {
        env.storage().persistent().get(&FARMERS, &farmer)
    }

    /// Get current network statistics
    pub fn get_network_stats(env: Env) -> NetworkStats {
        env.storage()
            .instance()
            .get(&NETWORK)
            .unwrap_or(NetworkStats {
                total_farmers: 0,
                total_staked: 0,
                total_rewards_distributed: 0,
                current_emission_rate: 50000,
                farming_difficulty: 5000,
                last_updated: env.ledger().timestamp(),
            })
    }

    /// Get top farmers (leaderboard)
    pub fn get_leaderboard(env: Env, limit: u32) -> Vec<FarmerData> {
        let mut farmers: Vec<FarmerData> = Vec::new(&env);
        
        // In a real implementation, we'd need to iterate through stored farmers
        // For now, return empty vector as this would require complex storage iteration
        // The API layer handles leaderboard sorting from individual farmer queries
        
        farmers
    }

    /// Calculate farming opportunity score based on current conditions
    pub fn calculate_opportunity_score(env: Env, stake_amount: i128) -> u32 {
        let network_stats = Self::get_network_stats(env.clone());
        
        // Base score calculation
        let mut score = 5000; // 50% base score
        
        // Adjust based on farming difficulty (inverse relationship)
        let difficulty_adjustment = (10000 - network_stats.farming_difficulty) / 4;
        score = score + difficulty_adjustment - 2500;
        
        // Adjust based on stake amount (higher stake = better opportunity up to a point)
        let stake_factor = if stake_amount > 100_0000000 { // 100 KALE
            2000 // Max bonus
        } else {
            ((stake_amount / 50_0000000) * 1000) as u32 // Scale up to 20% bonus
        };
        score += stake_factor;
        
        // Ensure score stays within 0-10000 range
        core::cmp::min(10000, core::cmp::max(0, score))
    }

    /// Get optimal stake amount based on current network conditions
    pub fn get_optimal_stake(env: Env) -> i128 {
        let network_stats = Self::get_network_stats(env);
        
        // Base optimal stake
        let mut optimal = 200_0000000; // 200 KALE base
        
        // Adjust based on network difficulty
        if network_stats.farming_difficulty > 7000 {
            optimal = optimal * 150 / 100; // Increase 50% for high difficulty
        } else if network_stats.farming_difficulty < 3000 {
            optimal = optimal * 75 / 100; // Decrease 25% for low difficulty
        }
        
        // Adjust based on total staked (avoid oversaturation)
        let avg_stake_per_farmer = if network_stats.total_farmers > 0 {
            network_stats.total_staked / network_stats.total_farmers as i128
        } else {
            optimal
        };
        
        // Return the minimum of calculated optimal and 120% of average
        core::cmp::min(optimal, avg_stake_per_farmer * 120 / 100)
    }

    /// Check if conditions are optimal for farming
    pub fn is_optimal_farming_time(env: Env) -> bool {
        let network_stats = Self::get_network_stats(env.clone());
        
        // Optimal conditions:
        // 1. Difficulty not too high (< 80%)
        // 2. Not too many farmers competing (< 500)
        // 3. Good emission rate (> 400 KALE/min)
        
        network_stats.farming_difficulty < 8000 &&
        network_stats.total_farmers < 500 &&
        network_stats.current_emission_rate > 40000
    }

    /// Get farming health score (0-100)
    pub fn get_network_health_score(env: Env) -> u32 {
        let network_stats = Self::get_network_stats(env);
        
        let mut health_score = 0u32;
        
        // Participation score (30% weight)
        let participation_score = core::cmp::min(30, network_stats.total_farmers * 30 / 1000);
        health_score += participation_score;
        
        // Staking ratio score (25% weight)  
        let target_staked = 1000000_0000000; // 1M KALE target
        let staking_score = core::cmp::min(25, (network_stats.total_staked * 25 / target_staked) as u32);
        health_score += staking_score;
        
        // Emission efficiency score (25% weight)
        let emission_score = network_stats.current_emission_rate * 25 / 50000; // Based on max 500/min
        health_score += core::cmp::min(25, emission_score);
        
        // Balance score - not too difficult, not too easy (20% weight)
        let balance_score = if network_stats.farming_difficulty >= 4000 && network_stats.farming_difficulty <= 6000 {
            20 // Perfect balance
        } else if network_stats.farming_difficulty >= 3000 && network_stats.farming_difficulty <= 7000 {
            15 // Good balance
        } else {
            5  // Poor balance
        };
        health_score += balance_score;
        
        core::cmp::min(100, health_score)
    }

    /// Predict reward for given stake amount
    pub fn predict_reward(env: Env, stake_amount: i128) -> i128 {
        let network_stats = Self::get_network_stats(env);
        
        // Base reward calculation (simplified version of main KALE contract logic)
        let base_reward = stake_amount / 100; // 1% base
        
        // Adjust for difficulty
        let difficulty_multiplier = 10000 - network_stats.farming_difficulty;
        let difficulty_adjusted = (base_reward * difficulty_multiplier as i128) / 10000;
        
        // Adjust for competition
        let competition_factor = if network_stats.total_farmers > 100 {
            core::cmp::max(5000, 10000 - (network_stats.total_farmers - 100) * 10)
        } else {
            10000
        };
        
        (difficulty_adjusted * competition_factor as i128) / 10000
    }

    /// Admin function to update emission rate
    pub fn update_emission_rate(env: Env, admin: Address, new_rate: u32) {
        admin.require_auth();
        
        let mut network_stats: NetworkStats = env.storage().instance().get(&NETWORK).unwrap();
        network_stats.current_emission_rate = new_rate;
        network_stats.last_updated = env.ledger().timestamp();
        
        env.storage().instance().set(&NETWORK, &network_stats);
    }

    /// Get recent farming activity (last 24 hours)
    pub fn get_recent_activity_count(env: Env) -> u32 {
        let current_time = env.ledger().timestamp();
        let day_ago = current_time - 86400; // 24 hours
        
        // In a real implementation, we'd filter sessions by timestamp
        // For now, return a calculated estimate based on network stats
        let network_stats = Self::get_network_stats(env);
        
        // Estimate: assume each active farmer does 1-3 farming sessions per day
        let avg_sessions_per_farmer = 2;
        let active_farmer_ratio = 70; // 70% of farmers are active daily
        
        (network_stats.total_farmers * avg_sessions_per_farmer * active_farmer_ratio) / 100
    }
}