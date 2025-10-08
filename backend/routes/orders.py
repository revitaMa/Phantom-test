import os
from utils.api_client import curr_session
from flask import Blueprint, request, jsonify

API_BASE = os.getenv("API_BASE")
TIMEOUT = float(os.getenv("TIMEOUT"))

orders_bp = Blueprint("orders", __name__)


@orders_bp.get("/orders")
def list_orders():
    token = request.cookies.get("auth")
    if not token:
        return jsonify({"error": "unauthorized"}), 401

    try:
        r = curr_session.get(
            f"{API_BASE}/dev_test/items",
            params={"token": token},
            timeout=TIMEOUT,
        )
    except Exception as e:
        return jsonify({"error": "unexpected error"}), 502

    ctype = r.headers.get("content-type", "")
    if "application/json" in ctype:
        return jsonify(r.json()), r.status_code
    return r.text, r.status_code, {"Content-Type": ctype}
