#!/bin/bash

# KALE Farming Analytics Contract Deployment Script
set -e

echo "🚀 Deploying KALE Farming Analytics Contract to Stellar Testnet..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
NETWORK="testnet"
WASM_FILE="kale-farming-analytics/target/wasm32-unknown-unknown/release/kale_farming_analytics.optimized.wasm"

# Check if contract is built
if [ ! -f "$WASM_FILE" ]; then
    echo -e "${RED}❌ Contract not found. Run ./build.sh first.${NC}"
    exit 1
fi

# Check if Soroban CLI is configured
if ! soroban config identity ls | grep -q "default"; then
    echo -e "${YELLOW}⚙️  Setting up Soroban identity...${NC}"
    soroban config identity generate default
fi

echo -e "${YELLOW}🔑 Using identity:${NC}"
soroban config identity address default

echo -e "${YELLOW}💰 Funding account on testnet...${NC}"
soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

soroban config identity fund default --network testnet

echo -e "${YELLOW}📦 Deploying contract...${NC}"

# Deploy the contract
CONTRACT_ID=$(soroban contract deploy \
  --wasm "$WASM_FILE" \
  --source default \
  --network testnet 2>/dev/null)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
    echo "📍 Contract ID: $CONTRACT_ID"
    
    # Initialize the contract
    echo -e "${YELLOW}🔧 Initializing contract...${NC}"
    ADMIN_ADDRESS=$(soroban config identity address default)
    
    soroban contract invoke \
      --id "$CONTRACT_ID" \
      --source default \
      --network testnet \
      -- \
      initialize \
      --admin "$ADMIN_ADDRESS"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Contract initialized successfully!${NC}"
        
        # Test the deployment
        echo -e "${YELLOW}🧪 Testing deployment...${NC}"
        soroban contract invoke \
          --id "$CONTRACT_ID" \
          --source default \
          --network testnet \
          -- \
          get_network_stats
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Contract is working correctly!${NC}"
            
            # Save deployment info
            echo "Contract deployment successful!" > deployment.log
            echo "Contract ID: $CONTRACT_ID" >> deployment.log
            echo "Network: $NETWORK" >> deployment.log
            echo "Admin: $ADMIN_ADDRESS" >> deployment.log
            echo "Deployed at: $(date)" >> deployment.log
            
            echo ""
            echo -e "${GREEN}🎉 Deployment Complete!${NC}"
            echo "📋 Deployment details saved to deployment.log"
            echo ""
            echo "🔗 Integration info for API:"
            echo "CONTRACT_ADDRESS=$CONTRACT_ID"
            echo "NETWORK=testnet"
            echo "RPC_URL=https://soroban-testnet.stellar.org"
            echo ""
            echo "📚 Example API calls:"
            echo "curl http://localhost:8000/api/v1/farming/stats"
            echo "curl http://localhost:8000/api/v1/farming/opportunity?stake_amount=200"
            
        else
            echo -e "${RED}❌ Contract deployment verification failed${NC}"
            exit 1
        fi
        
    else
        echo -e "${RED}❌ Contract initialization failed${NC}"
        exit 1
    fi
    
else
    echo -e "${RED}❌ Contract deployment failed${NC}"
    exit 1
fi