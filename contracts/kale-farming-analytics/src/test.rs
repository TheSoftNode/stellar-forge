#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmingAnalytics);
    let client = KaleFarmingAnalyticsClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    
    client.initialize(&admin);
    
    let stats = client.get_network_stats();
    assert_eq!(stats.total_farmers, 0);
    assert_eq!(stats.current_emission_rate, 50000);
}

#[test]
fn test_record_farming_session() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmingAnalytics);
    let client = KaleFarmingAnalyticsClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    let farmer = Address::generate(&env);
    
    client.initialize(&admin);
    
    // Record a successful farming session
    client.record_farming_session(&farmer, &100_0000000, &true, &10_0000000);
    
    // Check farmer data
    let farmer_data = client.get_farmer_data(&farmer).unwrap();
    assert_eq!(farmer_data.total_staked, 100_0000000);
    assert_eq!(farmer_data.total_rewards, 10_0000000);
    assert_eq!(farmer_data.farms_completed, 1);
    
    // Check network stats
    let network_stats = client.get_network_stats();
    assert_eq!(network_stats.total_farmers, 1);
    assert_eq!(network_stats.total_staked, 100_0000000);
}

#[test]
fn test_opportunity_scoring() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmingAnalytics);
    let client = KaleFarmingAnalyticsClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.initialize(&admin);
    
    let score = client.calculate_opportunity_score(&200_0000000);
    assert!(score > 0);
    assert!(score <= 10000);
}

#[test]
fn test_network_health() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmingAnalytics);
    let client = KaleFarmingAnalyticsClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.initialize(&admin);
    
    let health_score = client.get_network_health_score();
    assert!(health_score <= 100);
}

#[test]
fn test_optimal_stake_calculation() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmingAnalytics);
    let client = KaleFarmingAnalyticsClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.initialize(&admin);
    
    let optimal_stake = client.get_optimal_stake();
    assert!(optimal_stake > 0);
}

#[test]
fn test_reward_prediction() {
    let env = Env::default();
    let contract_id = env.register_contract(None, KaleFarmingAnalytics);
    let client = KaleFarmingAnalyticsClient::new(&env, &contract_id);
    
    let admin = Address::generate(&env);
    client.initialize(&admin);
    
    let predicted_reward = client.predict_reward(&100_0000000);
    assert!(predicted_reward > 0);
    assert!(predicted_reward <= 100_0000000); // Reward should be less than stake
}