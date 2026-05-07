from services.groq_client import generate_response

print("Testing Groq Client...\n")

prompt = "Explain ESG in 3 simple lines"

response = generate_response(prompt)

print("----- AI RESPONSE -----\n")
print(response)
print("\n-----------------------")