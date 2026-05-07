from app import app
import json

with app.app_context():
    # Hit the health endpoint using the test client
    client = app.test_client()
    response = client.get('/health')
    print("Health Endpoint Output:")
    print(json.dumps(response.get_json(), indent=2))
