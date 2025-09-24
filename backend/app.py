import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from backend.routes.auth import auth_bp
from backend.routes.orders import orders_bp
from backend.routes.order_detail import order_detail_bp


# Load environment (ensure backend/.env is UTF-8)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

app = Flask(__name__)

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(orders_bp, url_prefix="/api")
app.register_blueprint(order_detail_bp, url_prefix="/api")


@app.get("/api/health")
def health():
    return jsonify({"ok": True})


# check: types of error codes
