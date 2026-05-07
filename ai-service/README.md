# AI Microservice - ESG Reporting Engine

This is the Python/Flask AI microservice for the ESG Reporting Engine (Tool-62). It leverages the Groq API (LLaMA-3.3-70b) to provide intelligent ESG insights, describe reports, generate recommendations, and format full structured ESG reports.

## Prerequisites
- Python 3.11+
- Redis 7 (for caching responses)

## Setup & Installation

1. **Navigate to the AI service directory:**
   ```bash
   cd ai-service
   ```

2. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the `ai-service` directory with the following variables:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Start the Redis Server:**
   Ensure your local Redis server is running, or start it via Docker.
   ```bash
   redis-server
   ```

5. **Run the Application:**
   Start the Flask application. It will run on port `5000` by default.
   ```bash
   python app.py
   ```

## API Reference

### 1. Describe Endpoint
Describes the key issues, summary, and business impact of a given company text.

- **URL:** `/describe`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "text": "Company has no waste management policy and high carbon emissions."
  }
  ```
- **Response Example:**
  ```json
  {
    "summary": "The company suffers from significant environmental shortfalls.",
    "key_issues": ["No waste management", "High carbon emissions"],
    "business_impact": "High regulatory risk and negative public perception.",
    "generated_at": "2026-05-05T12:00:00.000000"
  }
  ```

### 2. Recommend Endpoint
Provides three specific recommendations based on the ESG issues found.

- **URL:** `/recommend`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "text": "High energy usage but great employee satisfaction."
  }
  ```
- **Response Example:**
  ```json
  {
    "task_id": "uuid-string-here",
    "status": "completed",
    "recommendations": [
      {
        "action_type": "Mitigation",
        "description": "Transition to renewable energy sources.",
        "priority": "high"
      }
    ]
  }
  ```

### 3. Generate Report Endpoint
Generates a fully structured ESG report.

- **URL:** `/generate-report`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "text": "Company has poor renewable energy adoption but great employee satisfaction."
  }
  ```
- **Response Example:**
  ```json
  {
    "title": "ESG Report for Renewable Energy and Employee Satisfaction",
    "summary": "The company has made significant strides in employee satisfaction, but lags behind in renewable energy adoption.",
    "overview": "Our assessment reveals a notable discrepancy between social and environmental policies.",
    "key_items": ["Low renewable energy adoption poses risks", "High employee satisfaction is a plus"],
    "recommendations": ["Develop a comprehensive renewable energy strategy"],
    "generated_at": "2026-05-05T12:00:00.000000"
  }
  ```

### 4. Health Check
Checks the uptime, API metrics, and model status.

- **URL:** `/health`
- **Method:** `GET`
- **Response Example:**
  ```json
  {
    "status": "up",
    "model": "llama-3.3-70b-versatile",
    "uptime_seconds": 120.5,
    "avg_response_time_seconds": 1.2
  }
  ```
