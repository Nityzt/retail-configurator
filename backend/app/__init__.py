from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os

def create_app():
    app = Flask(__name__)

    # CORS: allow your frontend dev server during development
    CORS(app, origins=["http://localhost:5173", ""])

    # MongoDB Atlas configuration
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise ValueError("MONGO_URI environment variable not set!")

    # Connect to Atlas with TLS
    client = MongoClient(
        mongo_uri,
        tls=True,  # enforce TLS
        tlsAllowInvalidCertificates=False,  # set True only for testing
        serverSelectionTimeoutMS=10000  # fail fast if connection fails
    )
    app.db = client.get_database()  # uses DB from URI

    # Register routes
    from app.routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
