from flask import Blueprint, request, jsonify
from services.groq_client import call_groq
from datetime import datetime
import os

generate_report_bp = Blueprint("generate_report", __name__)

def load_prompt(user_input):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    prompt_path = os.path.join(BASE_DIR, "prompts", "generate_report.txt")
    with open(prompt_path, "r") as f:
        base_prompt = f.read()
    return base_prompt + "\n" + user_input

@generate_report_bp.route("/generate-report", methods=["POST"])
def generate_report():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    user_input = data["text"]

    if len(user_input.strip()) == 0:
        return jsonify({"error": "Empty input"}), 400

    prompt = load_prompt(user_input)

    ai_response = call_groq(prompt)

    if isinstance(ai_response, dict):
        # We enforce the keys based on the Day 6 requirement
        # Even if the AI misses some, we provide fallbacks
        report_data = {
            "title": ai_response.get("title", "ESG Report"),
            "summary": ai_response.get("summary", ""),
            "overview": ai_response.get("overview", ""),
            "key_items": ai_response.get("key_items", []),
            "recommendations": ai_response.get("recommendations", [])
        }
        return jsonify({
            **report_data,
            "generated_at": datetime.utcnow().isoformat()
        })
    else:
        return jsonify({
            "error": "Failed to generate report JSON",
            "raw": ai_response,
            "generated_at": datetime.utcnow().isoformat()
        }), 500
