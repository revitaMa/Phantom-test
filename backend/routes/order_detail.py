import os
import requests
from flask import Blueprint, request, jsonify

API_BASE = os.getenv("API_BASE")
TIMEOUT = os.getenv("TIMEOUT")

order_detail_bp = Blueprint("order_detail", __name__)


@order_detail_bp.get("/orders/<order_id>")
def order_detail(order_id):
    print("orderId: ", order_id)
    token = request.cookies.get("auth")
    if not token:
        return jsonify({"error": "unauthorized"}), 401

    try:
        r = requests.get(
            f"{API_BASE}/dev_test/item/{order_id}",
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
