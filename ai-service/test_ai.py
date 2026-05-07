from services.groq_client import call_groq

# loading prompt
def load_prompt(text):
    with open("prompts/describe.txt") as f:
        template = f.read()
    return template + "\n" + text

# 5 test inputs for testing the AI service
inputs = [
    "Company emits high carbon and no waste management",
    "Good governance but poor employee satisfaction",
    "High energy usage with no renewable energy",
    "Strong CSR but weak environmental policies",
    "No ESG policies implemented"
]

# running tests 
for i, text in enumerate(inputs):
    print(f"\n--- Test {i+1} ---")
    prompt = load_prompt(text)
    response = call_groq(prompt)
    print(response)