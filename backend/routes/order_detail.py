import os
from utils.api_client import curr_session
from flask import Blueprint, request, jsonify

API_BASE = os.getenv("API_BASE")
TIMEOUT = float(os.getenv("TIMEOUT"))

order_detail_bp = Blueprint("order_detail", __name__)


@order_detail_bp.get("/orders/<order_id>")
def order_detail(order_id):
    print("orderId: ", order_id)
    token = request.cookies.get("auth")
    if not token:
        return jsonify({"error": "unauthorized"}), 401

    try:
        r = curr_session.get(
            f"{API_BASE}/dev_test/item/{order_id}",
            params={"token": token},
            timeout=TIMEOUT,
        )
    except Exception as e:
        return jsonify({"error": "unexpected error"}), 502

    ctype = r.headers.get("content-type", "")
    if "application/json" in ctype:
        return jsonify(r.json()), r.status_code
    return r.text, r.status_code, {"Content-Type": ctype}
