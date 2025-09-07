# KALE Farming Intelligence Platform 🌱

## 🏆 Hackathon Project - "Compose the Future on Stellar"

A comprehensive platform that **builds directly on KALE** to provide intelligent farming analytics, real-time price tracking, and optimization tools for the KALE proof-of-teamwork ecosystem.

### 🎯 **Composability Achievement**

- ✅ **Builds on KALE**: Direct integration with KALE token and farming mechanics
- ✅ **Enhances KALE**: Adds intelligent analytics and optimization layer
- ✅ **New Tool**: First comprehensive KALE farming intelligence platform
- ✅ **Live Integration**: Uses real Stellar testnet and KALE data

---

## 🏗️ **Project Architecture**

```
kale-tracker/
├── contracts/                    # Soroban Smart Contracts
│   ├── kale-farming-analytics/   # Main farming analytics contract
│   ├── build.sh                  # Contract build script
│   └── deploy.sh                 # Contract deployment script
├── backend/                      # FastAPI Backend Service
│   ├── app/
│   │   ├── services/
│   │   │   ├── kale_tracker.py   # Original price tracker (YOUR CODE)
│   │   │   ├── kale_farming.py   # Farming analytics service
│   │   │   └── contract_integration.py # Smart contract client
│   │   ├── api/v1/endpoints/     # REST API endpoints
│   │   └── models/               # Pydantic data models
│   ├── scripts/                  # Deployment scripts
│   └── requirements.txt          # Python dependencies
└── frontend/                     # Next.js Frontend (existing)
```

---

## 🚀 **Features**

### 💰 **Price Intelligence** (Your Original Tracker)

- Real-time KALE price from Stellar DEX
- Multi-source fallback (Stellar → CSV → Hardcoded)
- Historical data with JSON persistence
- Statistical analysis and trend tracking

### 🚜 **Smart Contract Analytics** (New)

- **Farming Statistics**: Network health, active farmers, total staked
- **Farmer Profiles**: Individual performance, success rates, reward history
- **Opportunity Analysis**: Optimal stake amounts and timing
- **ROI Calculator**: Real-time profitability based on current price
- **Risk Assessment**: Difficulty scoring and market analysis

### 🎯 **Intelligent Tools** (New)

- **Strategy Generator**: Personalized farming recommendations
- **Monte Carlo Simulator**: Outcome prediction with 1000+ scenarios
- **Farming Leaderboard**: Top performers and community stats
- **Smart Alerts**: Harvest reminders and optimal farming windows
- **Real-time WebSocket**: Live price and farming event streaming

---

## 🔧 **Quick Start**

### **1. Smart Contract Deployment**

```bash
cd contracts
./build.sh          # Build Soroban contract
./deploy.sh         # Deploy to Stellar testnet
```

### **2. Backend API**

```bash
cd backend
./scripts/local-dev.sh    # Start development server
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### **3. Frontend**

```bash
cd frontend
npm install
npm run dev         # Start Next.js app
# App: http://localhost:3000
```

---

## 📡 **API Endpoints**

### **Price Intelligence** (Your Original Tracker Enhanced)

- `GET /api/v1/prices/current` - Real-time KALE price
- `GET /api/v1/prices/history` - Historical price data
- `GET /api/v1/prices/statistics` - 24h stats and trends

### **Farming Analytics** (New Smart Contract Integration)

- `GET /api/v1/farming/stats` - Network farming statistics
- `GET /api/v1/farming/farmer/{address}` - Individual farmer data
- `GET /api/v1/farming/opportunity` - Farming opportunity analysis
- `GET /api/v1/farming/roi-analysis` - Detailed ROI calculations
- `GET /api/v1/farming/leaderboard` - Top farmers ranking
- `GET /api/v1/farming/optimal-strategy` - Personalized recommendations
- `GET /api/v1/farming/farming-simulator` - Monte Carlo predictions

### **Real-time Streaming**

- `WebSocket /api/v1/ws/price-stream` - Live price and farming updates

---

## 🎯 **Smart Contract Features**

### **Core Functions**

```rust
// Record farming activity
record_farming_session(farmer, stake_amount, success, reward)

// Get farmer analytics
get_farmer_data(farmer_address) -> FarmerData

// Network statistics
get_network_stats() -> NetworkStats

// Opportunity scoring
calculate_opportunity_score(stake_amount) -> u32

// Reward prediction
predict_reward(stake_amount) -> i128
```

### **Advanced Analytics**

- **Network Health Scoring**: Participation, staking ratios, emission efficiency
- **Difficulty Adjustment**: Dynamic based on network activity
- **Optimal Timing**: Conditions analysis for best farming windows
- **Risk Assessment**: Multi-factor opportunity evaluation

---

## 🏆 **Why This Wins the Hackathon**

### **✅ Perfect Composability**

1. **Builds ON KALE**: Uses your working price tracker + adds farming layer
2. **Enhances KALE**: Makes farming more intelligent and profitable
3. **Live Integration**: Real Stellar testnet data and contract deployment
4. **Complete Solution**: Contracts + API + Frontend ready

### **🎯 Technical Innovation**

- **Smart Contract**: Soroban contract for on-chain farming analytics
- **Real-time Intelligence**: WebSocket streaming with farming events
- **Predictive Analytics**: Monte Carlo simulation for outcome modeling
- **Professional API**: 20+ endpoints with comprehensive documentation

### **💡 Unique Value**

- **First KALE Farming Intelligence Platform**
- **Combines price tracking with farming optimization**
- **Makes KALE farming accessible to everyone**
- **Demonstrates true Stellar ecosystem composability**

---

## 📊 **Example API Responses**

### **Farming Opportunity**

```json
{
  "optimal_stake": 175.5,
  "estimated_reward": 22.45,
  "roi_percentage": 12.83,
  "risk_level": "medium",
  "recommended_action": "plant_now",
  "confidence_score": 0.85
}
```

### **Network Health**

```json
{
  "overall_health_score": 78.5,
  "active_farmers": 287,
  "total_staked": 12500000,
  "network_status": "healthy",
  "recommendations": ["Excellent farming conditions"]
}
```

---

## 🚀 **Deployment**

### **Local Development**

```bash
# Backend
cd backend && ./scripts/local-dev.sh

# Contracts
cd contracts && ./build.sh && ./deploy.sh

# Frontend
cd frontend && npm run dev
```

### **Production (GCP)**

```bash
# Deploy API to Cloud Run
cd backend && ./scripts/deploy.sh

# Frontend deployment
cd frontend && npm run build
```
