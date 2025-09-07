#!/bin/bash

# StellarForge Analytics API Deployment Script for GCP
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project)}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="stellarforge-api"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo -e "${GREEN}🚀 Starting deployment of StellarForge Analytics API${NC}"
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo ""

if [[ -z "$PROJECT_ID" ]]; then
    echo -e "${RED}❌ No GCP project set. Please run 'gcloud config set project YOUR_PROJECT_ID' first.${NC}"
    exit 1
fi

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo -e "${YELLOW}⚠️  Please authenticate with gcloud first${NC}"
    gcloud auth login
fi

# Set the project
echo -e "${YELLOW}🔧 Setting GCP project...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Check if secrets exist
echo -e "${YELLOW}🔐 Checking secrets...${NC}"
REQUIRED_SECRETS=("log-level" "price-update-interval" "database-url" "stellar-network-url" "api-secret-key")
MISSING_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! gcloud secrets describe "$secret" >/dev/null 2>&1; then
        MISSING_SECRETS+=("$secret")
    fi
done

if [ ${#MISSING_SECRETS[@]} -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Missing secrets detected. Running setup script...${NC}"
    echo "Missing: ${MISSING_SECRETS[*]}"
    ./scripts/setup-secrets.sh
fi

# Build and push the image
echo -e "${YELLOW}🏗️  Building Docker image...${NC}"
docker build -t $IMAGE_NAME:latest .

echo -e "${YELLOW}📤 Pushing image to Google Container Registry...${NC}"
docker push $IMAGE_NAME:latest

# Deploy to Cloud Run with secrets
echo -e "${YELLOW}🚀 Deploying to Cloud Run with Secret Manager...${NC}"
gcloud run deploy $SERVICE_NAME \
    --image=$IMAGE_NAME:latest \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --memory=1Gi \
    --cpu=1 \
    --concurrency=100 \
    --max-instances=10 \
    --port=8000 \
    --update-secrets=LOG_LEVEL=log-level:latest \
    --update-secrets=PRICE_UPDATE_INTERVAL=price-update-interval:latest \
    --update-secrets=DATABASE_URL=database-url:latest \
    --update-secrets=STELLAR_NETWORK_URL=stellar-network-url:latest \
    --update-secrets=API_SECRET_KEY=api-secret-key:latest \
    --set-env-vars=ALLOWED_ORIGINS='["https://stellarforge-analytics.vercel.app","http://localhost:3000"]'

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service URL: $SERVICE_URL${NC}"
echo -e "${GREEN}📊 API Documentation: $SERVICE_URL/docs${NC}"
echo -e "${GREEN}❤️  Health Check: $SERVICE_URL/health${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Test the API endpoints"
echo "2. Configure your frontend to use the new API URL: $SERVICE_URL"
echo "3. Set up monitoring and alerts"
echo "4. Update your frontend environment variables"
echo ""

# Test the deployment
echo -e "${YELLOW}🧪 Testing deployment...${NC}"
if curl -s "$SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
    echo ""
    echo -e "${GREEN}🔗 Update your frontend API_URL to:${NC}"
    echo -e "${BLUE}$SERVICE_URL${NC}"
else
    echo -e "${RED}❌ Health check failed. Please check the logs.${NC}"
    echo "View logs with: gcloud run services logs read $SERVICE_NAME --region=$REGION"
fi