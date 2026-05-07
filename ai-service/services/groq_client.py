import os
import requests
import json
import re
import time
import hashlib
import redis
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Initialize Redis client
try:
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True)
except Exception as e:
    print(f"Failed to connect to Redis: {e}")
    redis_client = None

# Global metrics for /health
total_response_time = 0
request_count = 0

def get_average_response_time():
    if request_count == 0:
        return 0
    return total_response_time / request_count

def call_groq(prompt):
    global total_response_time, request_count
    
    # Check cache first
    prompt_hash = hashlib.sha256(prompt.encode('utf-8')).hexdigest()
    cache_key = f"ai_cache:{prompt_hash}"
    
    if redis_client:
        try:
            cached_response = redis_client.get(cache_key)
            if cached_response:
                print("Returning cached AI response from Redis.")
                return json.loads(cached_response)
        except Exception as e:
            print(f"Redis get error: {e}")

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }

    start_time = time.time()
    try:
        # Added 5s timeout for optimisation, prevents hanging
        response = requests.post(url, json=data, headers=headers, timeout=5)
        response.raise_for_status()
    except Exception as e:
        end_time = time.time()
        response_time = end_time - start_time
        total_response_time += response_time
        request_count += 1
        
        print(f"Groq API Error: {e}")
        return {
            "is_fallback": True,
            "summary": "AI Service is temporarily unavailable. This is a fallback response.",
            "key_issues": ["AI Service Error"],
            "business_impact": "Could not be determined due to AI unavailability.",
            "recommendations": [
                {
                    "action_type": "Retry",
                    "description": "Please try the request again later.",
                    "priority": "low"
                }
            ],
            "title": "Fallback Report",
            "overview": "The AI model is currently unreachable.",
            "key_items": ["Service Error"]
        }
        
    end_time = time.time()
    
    # Track response time
    response_time = end_time - start_time
    total_response_time += response_time
    request_count += 1

    # Debug print
    print("RAW RESPONSE:", response.text)

    result = response.json()

    if "choices" in result:
        content = result["choices"][0]["message"]["content"]

        try:
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                json_str = match.group()
            else:
                json_str = content
            
            parsed = json.loads(json_str)
            final_result = parsed
        except:
            final_result = content
            
        # Save to cache with 15 mins TTL (900 seconds)
        if redis_client:
            try:
                redis_client.setex(cache_key, 900, json.dumps(final_result))
            except Exception as e:
                print(f"Redis set error: {e}")
                
        return final_result
    else:
        return {
            "error": result
        }
    