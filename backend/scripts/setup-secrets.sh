#!/bin/bash

# StellarForge Analytics API - Secret Manager Setup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-$(gcloud config get-value project)}
REGION=${GCP_REGION:-"us-central1"}

echo -e "${GREEN}🔐 Setting up secrets in Google Secret Manager${NC}"
echo "Project ID: $PROJECT_ID"
echo ""

if [[ -z "$PROJECT_ID" ]]; then
    echo -e "${RED}❌ No GCP project set. Please run 'gcloud config set project YOUR_PROJECT_ID' first.${NC}"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
    echo -e "${YELLOW}⚠️  Please authenticate with gcloud first${NC}"
    gcloud auth login
fi

# Enable Secret Manager API
echo -e "${YELLOW}🔧 Enabling Secret Manager API...${NC}"
gcloud services enable secretmanager.googleapis.com

# Function to create or update a secret
create_or_update_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    echo -e "${BLUE}📝 Processing secret: $secret_name${NC}"
    
    # Check if secret exists
    if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" >/dev/null 2>&1; then
        echo "  ↳ Secret exists, adding new version..."
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-
    else
        echo "  ↳ Creating new secret..."
        echo -n "$secret_value" | gcloud secrets create "$secret_name" \
            --replication-policy="automatic" \
            --data-file=- \
            --labels="app=stellarforge,env=production"
    fi
}

# Create secrets with default values
echo -e "${YELLOW}🔑 Creating/updating secrets...${NC}"

create_or_update_secret "log-level" "INFO" "Application log level"
create_or_update_secret "price-update-interval" "10" "Price update interval in seconds"
create_or_update_secret "database-url" "sqlite+aiosqlite:///./data/stellarforge.db" "Database connection URL"
create_or_update_secret "stellar-network-url" "https://horizon.stellar.org" "Stellar network Horizon URL"
create_or_update_secret "api-secret-key" "$(openssl rand -hex 32)" "API secret key for JWT tokens"

echo ""
echo -e "${GREEN}✅ All secrets created successfully!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Update secret values if needed:"
echo "   gcloud secrets versions add SECRET_NAME --data-file=-"
echo ""
echo "2. Grant Cloud Run service account access to secrets:"
echo "   gcloud projects add-iam-policy-binding $PROJECT_ID \\"
echo "     --member=\"serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com\" \\"
echo "     --role=\"roles/secretmanager.secretAccessor\""
echo ""
echo "3. Deploy your application:"
echo "   ./scripts/deploy.sh"
echo ""

# Grant access to the default compute service account
echo -e "${YELLOW}🔒 Granting secret access to Cloud Run service account...${NC}"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$PROJECT_ID-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

echo -e "${GREEN}🎉 Secret Manager setup complete!${NC}"
