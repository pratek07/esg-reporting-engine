from flask import Flask
from routes.describe import describe_bp
from routes.recommend_v2 import recommend_bp
from routes.generate_report import generate_report_bp
from routes.health import health_bp
from services.embedding_service import init_embedding_model

app = Flask(__name__)

@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['Content-Security-Policy'] = "default-src 'self';"
    return response

app.register_blueprint(describe_bp)
app.register_blueprint(recommend_bp)
app.register_blueprint(generate_report_bp)
app.register_blueprint(health_bp)

# Pre-load models at startup (Day 11 requirement)
init_embedding_model()

if __name__ == "__main__":
    app.run(debug=True)

    