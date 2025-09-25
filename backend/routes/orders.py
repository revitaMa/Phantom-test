import os
import requests
from flask import Blueprint, request, jsonify

API_BASE = os.getenv("API_BASE")
TIMEOUT = int(os.getenv("TIMEOUT"))

orders_bp = Blueprint("orders", __name__)


@orders_bp.get("/orders")
def list_orders():
    token = request.cookies.get("auth")
    if not token:
        return jsonify({"error": "unauthorized"}), 401

    try:
        r = requests.get(
            f"{API_BASE}/dev_test/items",
            params={"token": token},
            timeout=TIMEOUT,
        )
    except requests.Timeout:
        return jsonify({"error": "upstream timeout"}), 504
    except Exception:
        return jsonify({"error": "internal server error"}), 500

    ctype = r.headers.get("content-type", "")
    if "application/json" in ctype:
        return jsonify(r.json()), r.status_code
    return r.text, r.status_code, {"Content-Type": ctype}
