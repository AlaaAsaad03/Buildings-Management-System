from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Initialize extensions 
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()


def create_app(config_class='app.config.Config'):
    app = Flask(__name__)

    #loads settings (like database URL, secret keys, etc.) from a Config class
    app.config.from_object(config_class) 

    #CORS for frontend-backend communication
    # CORS(app, resources={r"/api/*": {
    # "origins" :["http://localhost:4200"],
    # "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    # "allow_headers": ["Content-Type", "Authorization"],
    # "expose_headers": ["Authorization", "Content-Type"],
    # "supports_credentials": True
    # }})
    CORS(app, resources={r"/api/*": {"origins" :"http://localhost:4200"}}, supports_credentials=True)


    #Attach extensions to app
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)


    #Register blueprints(routes)
    from app.routes import auth_route, admin_route, complex_routes, building_routes
    app.register_blueprint(auth_route.bp)
    app.register_blueprint(admin_route.bp)
    app.register_blueprint(complex_routes.bp)
    app.register_blueprint(building_routes.bp)



    with app.app_context():
        db.create_all()

    return app