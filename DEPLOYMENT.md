# StellarForge Analytics - Deployment Guide

## 🚀 Backend Deployment to Google Cloud Platform

### Prerequisites

1. Google Cloud CLI installed and authenticated
2. Docker installed and running
3. GCP project with billing enabled

### Step 1: Set up GCP Project

```bash
# Set your project ID
export GCP_PROJECT_ID="your-stellarforge-project"
gcloud config set project $GCP_PROJECT_ID
```

### Step 2: Run Deployment

```bash
cd backend
./scripts/deploy.sh
```

This script will:

- Enable required GCP APIs
- Set up secrets in Secret Manager
- Build and push Docker image
- Deploy to Cloud Run with secret integration
- Test the deployment

### Step 3: Update Frontend Configuration

After deployment, you'll get a Cloud Run URL like:
`https://stellarforge-api-xyz123-uc.a.run.app`

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://stellarforge-api-xyz123-uc.a.run.app
```

### Step 4: Deploy Frontend to Vercel

```bash
cd frontend
npx vercel --prod
```

## 🔐 Security Features

### Secret Manager Integration

All sensitive configuration is stored in Google Secret Manager:

- `log-level`: Application logging level
- `price-update-interval`: Price fetching interval
- `database-url`: Database connection string
- `stellar-network-url`: Stellar Horizon endpoint
- `api-secret-key`: JWT signing key

### CORS Configuration

Frontend origins are whitelisted in the deployment configuration.

## 📊 Monitoring

### Health Checks

- Basic: `GET /health`
- Detailed: `GET /health/detailed`

### Logs

```bash
gcloud run services logs read stellarforge-api --region=us-central1
```

## 🔧 Updating Secrets

```bash
# Update a secret
echo "new-value" | gcloud secrets versions add SECRET_NAME --data-file=-

# List secrets
gcloud secrets list

# View secret value
gcloud secrets versions access latest --secret="SECRET_NAME"
```

## 📝 Environment Variables

### Backend (from Secret Manager)

- `LOG_LEVEL`: INFO
- `PRICE_UPDATE_INTERVAL`: 10
- `DATABASE_URL`: sqlite+aiosqlite:///./data/stellarforge.db
- `STELLAR_NETWORK_URL`: https://horizon.stellar.org
- `API_SECRET_KEY`: (auto-generated secure key)

### Frontend

- `NEXT_PUBLIC_API_URL`: Cloud Run service URL
