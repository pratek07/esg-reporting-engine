from flask import Blueprint, request, jsonify
from services.groq_client import generate_response
import json

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400

        user_input = data["text"]

        #  basic sanitization
        user_input = user_input.replace("<", "").replace(">", "")

        blocked = [
            "ignore previous instructions",
            "give api key",
            "reveal secret",
            "bypass",
            "system prompt"
        ]

        for word in blocked:
            if word in user_input.lower():
                return jsonify({"error": "Invalid input detected"}), 400

        #  structured prompt
        prompt = f"""
        Give 3 ESG recommendations for the following input.
        Return ONLY JSON array like:
        [
          {{
            "action_type": "...",
            "description": "...",
            "priority": "High/Medium/Low"
          }}
        ]

        Input: {user_input}
        """

        ai_output = generate_response(prompt)

        #  convert string → JSON
        try:
            recommendations = json.loads(ai_output)
        except:
            recommendations = ai_output

        return jsonify({
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500