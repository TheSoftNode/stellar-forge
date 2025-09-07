from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Basic app settings
    PROJECT_NAME: str = "KALE Price Tracker API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database settings
    DATABASE_URL: str = "sqlite+aiosqlite:///./kale_tracker.db"
    
    # Stellar network settings
    STELLAR_HORIZON_URL: str = "https://horizon-testnet.stellar.org"
    KALE_ASSET_CODE: str = "KALE"
    KALE_ASSET_ISSUER: str = "GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB"
    
    # Price monitoring settings
    PRICE_UPDATE_INTERVAL: int = 10  # seconds
    MAX_PRICE_HISTORY: int = 10000  # maximum records to keep
    
    # Logging settings
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "kale_tracker.log"
    
    # GCP settings
    GCP_PROJECT_ID: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create global settings instance
settings = Settings()