# Maternal Health Risk Predictor

AI-powered web application for predicting maternal health risks during pregnancy. Built for healthcare workers to identify high-risk pregnancies early and provide targeted interventions.

## Features

- **AI Risk Prediction**: Machine learning model (Logistic Regression) trained on maternal health indicators
- **Risk Assessment**: Analyzes age, anemia, blood pressure, blood sugar, BMI, and pregnancy history
- **Visual Analytics**: Interactive charts and risk visualizations
- **Example Profiles**: Pre-configured patient profiles for demonstration
- **Real-time Analysis**: Instant risk calculation with detailed recommendations
- **Modern UI**: Beautiful, responsive design with glassmorphism and smooth animations

## Architecture

### Backend (Python FastAPI)
- FastAPI REST API
- Scikit-learn Logistic Regression model
- Synthetic training data based on medical guidelines
- CORS enabled for frontend communication

### Frontend (React + Vite)
- React 18 with Vite build tool
- Recharts for data visualization
- Axios for API communication
- Modern CSS with custom design system

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
# or
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. **Start Both Servers**: Backend on port 8000, Frontend on port 5173
2. **Open Browser**: Navigate to `http://localhost:5173`
3. **Try Example Profiles**: Click on any example profile to see predictions
4. **Manual Assessment**: Fill in the assessment form with patient data
5. **View Results**: Get risk score, contributing factors, and recommendations

## ML Model Details

- **Algorithm**: Logistic Regression (Multinomial)
- **Features**: Age, pregnancies, trimester, hemoglobin, BP, blood sugar, BMI, complications
- **Training**: 1000 synthetic samples based on medical guidelines
- **Risk Categories**: 
  - Low: 0-40 (probability < 0.4)
  - Medium: 40-70 (probability 0.4-0.7)
  - High: 70-100 (probability > 0.7)

## Project Structure

```
NewWeb/
├── backend/
│   ├── main.py           # FastAPI application
│   ├── model.py          # ML model and training
│   ├── schemas.py        # Pydantic data models
│   ├── requirements.txt  # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── AssessmentForm.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   └── ExampleProfiles.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

- `GET /` - Health check
- `GET /api/health` - Detailed health status
- `GET /api/model-info` - ML model information
- `POST /api/predict` - Predict maternal health risk
- `GET /api/example-profiles` - Get example patient profiles

## Design Features

- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations and transitions
- Responsive design for all devices
- Interactive data visualizations
- Premium typography (Inter & Outfit)

## ⚠️ Disclaimer

This tool is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

## Contributing

- Vineet Kumar @VineetKumar2004
- Rajesh Kumar Mishra @rajeshmishra-11

## License

MIT License - Built for Hackathon 2025

## Credits

Built with ❤️ for improving maternal and newborn health outcomes in underserved communities.
