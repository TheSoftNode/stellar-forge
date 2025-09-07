#!/bin/bash

# KALE Farming Analytics Contract Build Script
set -e

echo "🏗️  Building KALE Farming Analytics Soroban Contract..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Rust and Soroban CLI are installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first."
    exit 1
fi

if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI is not installed. Installing..."
    cargo install --locked soroban-cli
fi

# Navigate to contract directory
cd kale-farming-analytics

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
cargo check

echo -e "${YELLOW}🧪 Running tests...${NC}"
cargo test

echo -e "${YELLOW}⚙️  Building contract...${NC}"
soroban contract build

echo -e "${YELLOW}📝 Optimizing contract...${NC}"
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/kale_farming_analytics.wasm

if [ -f "target/wasm32-unknown-unknown/release/kale_farming_analytics.optimized.wasm" ]; then
    echo -e "${GREEN}✅ Contract built successfully!${NC}"
    echo "📁 Contract WASM: target/wasm32-unknown-unknown/release/kale_farming_analytics.optimized.wasm"
    
    # Display contract size
    SIZE=$(wc -c < target/wasm32-unknown-unknown/release/kale_farming_analytics.optimized.wasm)
    echo "📊 Contract size: ${SIZE} bytes"
    
    echo ""
    echo -e "${GREEN}🚀 Ready for deployment!${NC}"
    echo "Next steps:"
    echo "1. Deploy to Stellar testnet: ./deploy.sh"
    echo "2. Verify deployment: soroban contract invoke --id <CONTRACT_ID> --source <ACCOUNT> -- get_network_stats"
    
else
    echo "❌ Contract build failed"
    exit 1
fi