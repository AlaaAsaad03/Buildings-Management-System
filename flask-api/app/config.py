import os 
from datetime import timedelta

class Config:

    # Load secret key from environment variable or use a default for development
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:alaa2003@localhost:3306/building_management'
    )

    #JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY','jwt-secret-key')

    #expiration times
    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(days=7)

    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    #JWT token locations
    JWT_TOKEN_LOCATION = ['headers']

    JWT_ERROR_MESSAGE_KEY = 'error'