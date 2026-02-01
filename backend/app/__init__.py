from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    # MongoDB configuration
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    app.db = client['retail_configurator_db']

    # register routes
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
