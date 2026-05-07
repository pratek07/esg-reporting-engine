import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")

print("Starting program...")

url = "https://api.groq.com/openai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [
        {"role": "user", "content": "Explain ESG in simple terms"}
    ]
}

try:
    response = requests.post(url, headers=headers, json=data)

    # Check status
    if response.status_code == 200:
        result = response.json()

        #Only AI output
        ai_output = result["choices"][0]["message"]["content"]

        print("\nAI Response:\n")
        print(ai_output)

    else:
        print("Error Status Code:", response.status_code)
        print("Error Message:", response.text)

except Exception as e:
    print("Exception occurred:", e)