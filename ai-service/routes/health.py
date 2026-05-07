from flask import Blueprint, jsonify
import time
from services.groq_client import get_average_response_time

health_bp = Blueprint("health", __name__)

START_TIME = time.time()

@health_bp.route("/health", methods=["GET"])
def health():
    uptime = time.time() - START_TIME
    
    return jsonify({
        "status": "up",
        "uptime_seconds": round(uptime, 2),
        "model": "llama-3.3-70b-versatile",
        "avg_response_time_seconds": round(get_average_response_time(), 2)
    })
