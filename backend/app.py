import os
from flask import Flask, jsonify
from dotenv import load_dotenv

# Load environment (ensure backend/.env is UTF-8)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from routes.auth import auth_bp
from routes.orders import orders_bp
from routes.order_detail import order_detail_bp


app = Flask(__name__)

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(orders_bp, url_prefix="/api")
app.register_blueprint(order_detail_bp, url_prefix="/api")


@app.get("/api/health")
def health():
    return jsonify({"ok": True})
