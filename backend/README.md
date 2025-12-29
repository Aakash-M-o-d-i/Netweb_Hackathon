# Maternal Health Risk Predictor - Backend

Python FastAPI backend with ML model for maternal health risk prediction.

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `GET /` - Health check
- `GET /api/health` - Detailed health status
- `GET /api/model-info` - ML model information
- `POST /api/predict` - Predict maternal health risk
- `GET /api/example-profiles` - Get example patient profiles

## Example Request

```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "num_pregnancies": 2,
    "trimester": 2,
    "hemoglobin": 12.5,
    "systolic_bp": 120,
    "diastolic_bp": 80,
    "blood_sugar": 95.0,
    "bmi": 23.5,
    "previous_complications": false
  }'
```
