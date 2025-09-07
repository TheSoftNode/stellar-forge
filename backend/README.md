# KALE Farming Intelligence API 🌱

A comprehensive FastAPI-based backend service that combines real-time KALE token price tracking with advanced farming analytics and optimization tools. Built specifically for the KALE proof-of-teamwork ecosystem on Stellar, this API provides everything farmers need to maximize their rewards.

## 🏆 **Hackathon Project - "Compose the Future on Stellar"**

This project directly leverages and enhances the KALE ecosystem by providing:
- **Real-time price tracking** from Stellar DEX
- **Farming optimization tools** with ROI analysis  
- **Network health monitoring** and farmer leaderboards
- **Intelligent farming strategies** and risk assessment
- **WebSocket streaming** for live updates and alerts

## 🚀 Features

### 💰 Price Intelligence
- **Multi-source Price Fetching**: Stellar DEX → CSV fallback → hardcoded prices
- **Real-time Monitoring**: Continuous price updates with configurable intervals
- **Historical Data**: Persistent JSON-based storage (your original tracker)
- **Statistical Analysis**: 24h high/low, price changes, averages, volatility

### 🚜 Farming Analytics
- **Network Statistics**: Active farmers, total staked, emission rates
- **Farmer Profiles**: Individual stats, success rates, reward history
- **ROI Calculator**: Real-time profitability analysis based on current price
- **Risk Assessment**: Farming difficulty and market condition analysis
- **Farming Simulator**: Monte Carlo simulation for outcome prediction

### 🎯 Smart Farming Tools
- **Opportunity Analysis**: Optimal stake amounts and timing recommendations
- **Strategy Generator**: Personalized farming strategies based on risk tolerance
- **Leaderboards**: Top farmers by rewards and performance metrics  
- **Network Health**: Overall ecosystem health and participation metrics
- **Harvest Alerts**: TTL reminders and optimal farming windows

### API Capabilities
- **RESTful Endpoints**: Complete REST API with OpenAPI documentation
- **WebSocket Streaming**: Real-time price updates via WebSocket
- **Health Checks**: Kubernetes-ready liveness/readiness probes
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configurable CORS for frontend integration

### Production Ready
- **Docker Support**: Containerized deployment
- **GCP Integration**: Cloud Run deployment configuration
- **Monitoring**: Health checks and observability endpoints
- **Security**: Non-root user, input validation, rate limiting ready
- **Scalability**: Async architecture with connection pooling

## 📋 Prerequisites

- Python 3.11+
- Docker (for containerized deployment)
- Google Cloud SDK (for GCP deployment)

## 🛠️ Quick Start

### Local Development

1. **Clone and Navigate**
   ```bash
   cd backend
   ```

2. **Run Development Server**
   ```bash
   ./scripts/local-dev.sh
   ```

3. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

### Docker Deployment

1. **Build and Run**
   ```bash
   docker build -t kale-tracker-api .
   docker run -p 8000:8000 kale-tracker-api
   ```

### Google Cloud Platform Deployment

1. **Configure GCP**
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   gcloud auth login
   ```

2. **Deploy to Cloud Run**
   ```bash
   ./scripts/deploy.sh
   ```

## 📚 API Documentation

### Core Endpoints

#### 💰 Price Data
- `GET /api/v1/prices/current` - Current KALE price
- `GET /api/v1/prices/history` - Historical price data with filtering
- `GET /api/v1/prices/statistics` - Price statistics (24h high/low, etc.)
- `GET /api/v1/prices/summary` - Comprehensive price summary
- `POST /api/v1/prices/force-update` - Force immediate price update

#### 🚜 Farming Intelligence  
- `GET /api/v1/farming/stats` - Network farming statistics
- `GET /api/v1/farming/farmer/{address}` - Individual farmer data
- `GET /api/v1/farming/opportunity` - Current farming opportunity analysis
- `GET /api/v1/farming/roi-analysis` - Detailed ROI calculations
- `GET /api/v1/farming/network-health` - Network health metrics
- `GET /api/v1/farming/leaderboard` - Top farmers leaderboard
- `GET /api/v1/farming/comprehensive` - Complete farming dashboard data
- `GET /api/v1/farming/optimal-strategy` - Personalized farming strategy
- `GET /api/v1/farming/farming-simulator` - Monte Carlo outcome simulation
- `POST /api/v1/farming/alerts/create` - Create custom farming alerts

#### 🔄 Real-time Streaming
- `WebSocket /api/v1/ws/price-stream` - Real-time price and farming updates

**WebSocket Events:**
- `price_update` - New price data
- `farming_stats_response` - Farming network statistics  
- `farming_opportunity_response` - Farming opportunity analysis
- `farming_alert` - Farming-specific alerts (harvest reminders, etc.)
- `harvest_reminder` - TTL deadline notifications

#### Health & Monitoring
- `GET /health` - Basic health check
- `GET /api/v1/health/detailed` - Detailed health status
- `GET /api/v1/health/readiness` - Kubernetes readiness probe
- `GET /api/v1/health/liveness` - Kubernetes liveness probe

### Example Responses

**Current Price:**
```json
{
  "id": 123,
  "price": 0.095420,
  "timestamp": "2024-01-15T10:30:00Z",
  "source": "stellar",
  "volume": 1250.50
}
```

**Price Statistics:**
```json
{
  "current_price": 0.095420,
  "price_24h_high": 0.098100,
  "price_24h_low": 0.092300,
  "price_24h_change": 0.002100,
  "price_24h_change_percent": 2.25,
  "average_price": 0.095100,
  "total_data_points": 144,
  "last_updated": "2024-01-15T10:30:00Z"
}
```

**Farming Opportunity Analysis:**
```json
{
  "optimal_stake": 175.50,
  "estimated_reward": 22.45,
  "roi_percentage": 12.83,
  "risk_level": "medium",
  "recommended_action": "plant_now",
  "time_to_plant": "2024-01-15T15:00:00Z",
  "time_to_harvest": "2024-01-16T15:00:00Z",
  "confidence_score": 0.85
}
```

**Network Health:**
```json
{
  "overall_health_score": 78.5,
  "participation_rate": 82.3,
  "staking_ratio": 67.8,
  "emission_efficiency": 85.4,
  "network_status": "healthy",
  "recommendations": [
    "Excellent farming conditions",
    "Consider maximum stake amounts",
    "Optimal time for new farmers to join"
  ]
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Core settings
PROJECT_NAME="KALE Price Tracker API"
API_V1_STR="/api/v1"

# Database
DATABASE_URL="sqlite+aiosqlite:///./kale_tracker.db"

# Stellar Network
STELLAR_HORIZON_URL="https://horizon-testnet.stellar.org"
KALE_ASSET_CODE="KALE"
KALE_ASSET_ISSUER="GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB"

# Monitoring
PRICE_UPDATE_INTERVAL=10
MAX_PRICE_HISTORY=10000
LOG_LEVEL="INFO"

# CORS (for frontend)
ALLOWED_ORIGINS="http://localhost:3000,https://your-frontend.com"
```

## 🏗️ Architecture

```
backend/
├── app/
│   ├── api/v1/           # API routes and endpoints
│   ├── core/             # Configuration and logging
│   ├── db/               # Database models and connection
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic services
│   └── main.py           # FastAPI application
├── scripts/              # Deployment scripts
├── Dockerfile            # Container configuration
├── requirements.txt      # Python dependencies
└── deploy.yaml          # Cloud Run configuration
```

### Key Components

- **Price Fetcher**: Multi-source price retrieval with fallbacks
- **Price Monitor**: Background service for continuous monitoring
- **Price Service**: Database operations and business logic
- **Technical Analyzer**: Calculation of technical indicators
- **WebSocket Manager**: Real-time connection management

## 🔄 Data Flow

1. **Price Fetching**: Stellar DEX → CSV backup → Hardcoded fallback
2. **Storage**: Save to database with timestamp and source
3. **Processing**: Calculate technical indicators and statistics
4. **Distribution**: REST API responses + WebSocket broadcasts
5. **Cleanup**: Automatic old data retention

## 📊 Monitoring & Observability

### Health Checks
- **Basic**: Service availability
- **Detailed**: Database, price service, configuration
- **Readiness**: Recent price data availability
- **Liveness**: Basic functionality

### Logging
- Structured JSON logging
- Multiple log levels (DEBUG, INFO, WARNING, ERROR)
- File and console output
- Request/response logging

## 🚀 Deployment Options

### Google Cloud Run (Recommended)
- Serverless, automatic scaling
- Pay-per-request pricing
- Integrated with Cloud Build
- Support for custom domains

### Google App Engine
- Managed platform
- Integrated monitoring
- Auto-scaling capabilities

### Kubernetes
- Full container orchestration
- Health checks included
- Horizontal pod autoscaling ready

### Docker Compose
- Local development
- Multi-service orchestration
- Volume mounting for data persistence

## 🔒 Security Features

- Non-root Docker container
- Input validation with Pydantic
- CORS configuration
- Environment variable secrets
- Rate limiting ready (middleware can be added)
- SQL injection protection via SQLAlchemy

## 🧪 Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## 📈 Performance

- **Async Architecture**: Non-blocking I/O operations
- **Connection Pooling**: Efficient database connections
- **Background Tasks**: Non-blocking price monitoring
- **Caching Ready**: Redis integration points available
- **Horizontal Scaling**: Stateless design

## 🤝 Integration Points

### Frontend Integration
- CORS configured for web applications
- WebSocket support for real-time updates
- RESTful API following OpenAPI standards

### External Services
- Webhook endpoints for alerts (extensible)
- CSV export capabilities
- Third-party API integration points

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Update documentation
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check database file permissions
ls -la kale_tracker.db

# Recreate database
rm kale_tracker.db
# Restart the service
```

**Stellar Network Connectivity:**
```bash
# Test Stellar connection
curl https://horizon-testnet.stellar.org/
```

**Docker Build Issues:**
```bash
# Clean build
docker build --no-cache -t kale-tracker-api .
```

### Logs
```bash
# View application logs
tail -f logs/kale_tracker.log

# Docker logs
docker logs <container-id>

# Cloud Run logs
gcloud run services logs read kale-tracker-api --region=us-central1
```

## 📄 License

This project is part of the KALE hackathon submission and is provided as-is for educational and development purposes.

---

**Built with ❤️ for the KALE ecosystem on Stellar**