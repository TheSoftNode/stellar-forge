#!/bin/bash

# KALE Price Tracker API Local Development Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting KALE Price Tracker API in Development Mode${NC}"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "app/main.py" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    echo "Current directory: $(pwd)"
    echo "Contents: $(ls -la)"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}🔧 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}🔧 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${BLUE}📝 Please review and update the .env file if needed${NC}"
fi

# Create necessary directories
mkdir -p logs data

# Start the development server
echo -e "${GREEN}🏃 Starting development server...${NC}"
echo -e "${BLUE}📊 API will be available at: http://localhost:8000${NC}"
echo -e "${BLUE}📚 Documentation will be available at: http://localhost:8000/docs${NC}"
echo -e "${BLUE}🔍 Alternative docs at: http://localhost:8000/redoc${NC}"
echo -e "${BLUE}❤️  Health check at: http://localhost:8000/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Start with hot reloading
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level info