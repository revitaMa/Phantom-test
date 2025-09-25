import os
from flask import request, jsonify, Blueprint
import requests  # for upstream API

API_BASE = os.getenv("API_BASE")
TIMEOUT = int(os.getenv("TIMEOUT"))

auth_bp = Blueprint("authBP", __name__)


# Login: forward to upstream, set HttpOnly cookie with the token
@auth_bp.post("/dev_test/token")
def login():
    body = request.get_json(silent=True) or {}
    username = (body.get("username") or "").strip()
    password = (body.get("password") or "").strip()

    if not username or not password:
        return jsonify({"error": "username and password are required"}), 400

    try:
        url = f"{API_BASE}/dev_test/token"
        upstream = requests.post(
            url, json={"username": username, "password": password}, timeout=TIMEOUT
        )
    except requests.Timeout:
        return jsonify({"error": "upstream timeout"}), 504
    except Exception:
        return jsonify({"error": "internal server error"}), 500

    ctype = upstream.headers.get("content-type", "")
    if not upstream.ok:
        if "application/json" in ctype:
            return jsonify(upstream.json()), upstream.status_code
        return upstream.text, upstream.status_code, {"Content-Type": ctype}

    # On success, set the token cookie (HttpOnly) and return ok
    data = upstream.json() if "application/json" in ctype else {}
    token = data.get("token")
    if not token:
        return jsonify({"error": "missing token in upstream response"}), 502

    resp = jsonify({"ok": True})
    resp.set_cookie(
        "auth",
        token,
        httponly=True,
        secure=False,  # dev over HTTP. set True in prod (HTTPS)
        samesite="Lax",  # set "Strict" in prod?
        path="/",  # cookie sent for all requests
        max_age=60 * 60,  # 1 hour demo lifetime?
    )
    return resp, 200


# Clear the cookie
@auth_bp.post("/logout")
def logout():
    resp = jsonify({"ok": True})
    resp.delete_cookie("auth", path="/")
    return resp, 200


# Check login status
@auth_bp.get("/me")
def me():
    token = request.cookies.get("auth")
    return jsonify({"authenticated": bool(token)})
