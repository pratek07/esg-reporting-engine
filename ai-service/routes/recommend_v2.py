from flask import Blueprint, request, jsonify
from datetime import datetime
from services.groq_client import call_groq
import os
import json
import threading
import uuid
import re

recommend_bp = Blueprint("recommend", __name__)

#GLOBAL STORE
task_store = {}

#ASYNC PROCESS FUNCTION
def process_ai(task_id, user_input):
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    prompt_path = os.path.join(BASE_DIR, "prompts", "recommend.txt")

    with open(prompt_path, "r") as f:
        prompt_template = f.read()

    final_prompt = prompt_template + "\n" + user_input

    ai_response = call_groq(final_prompt)

    print("AI RAW:", ai_response)

    try:
        if isinstance(ai_response, dict):
            recommendations = ai_response.get("recommendations", [])
        else:
            raise ValueError("No JSON returned from AI")

        if not isinstance(recommendations, list):
            recommendations = []

        task_store[task_id]["recommendations"] = recommendations
        task_store[task_id]["status"] = "completed"
    except Exception as e:
        print("ERROR PARSING AI:", str(e))
        task_store[task_id]["status"] = "failed"
        task_store[task_id]["recommendations"] = []

#POST /recommend
@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    user_input = data["text"]

    #create task_id
    task_id = str(uuid.uuid4())

    #store initial state
    task_store[task_id] = {
        "status": "processing",
        "recommendations": []
    }

    #run async
    thread = threading.Thread(target=process_ai, args=(task_id, user_input))
    thread.start()

    return jsonify({
        "task_id": task_id,
        "status": "processing"
    })



@recommend_bp.route("/recommend/result/<task_id>", methods=["GET"])
def get_result(task_id):
    if task_id not in task_store:
        return jsonify({"error": "Invalid task_id"}), 404

    return jsonify({
        "task_id": task_id,
        "status": task_store[task_id]["status"],
        "recommendations": task_store[task_id]["recommendations"]
    })