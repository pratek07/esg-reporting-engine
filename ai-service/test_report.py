from services.groq_client import call_groq
import json

def load_prompt(text):
    with open("prompts/generate_report.txt") as f:
        template = f.read()
    return template + "\n" + text

text = "Company has poor renewable energy adoption but great employee satisfaction."
prompt = load_prompt(text)

print("Calling AI for generate-report...")
response = call_groq(prompt)

print("AI Response:")
print(json.dumps(response, indent=2))
