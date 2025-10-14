import os 

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
