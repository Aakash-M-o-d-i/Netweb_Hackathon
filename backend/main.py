from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    PatientData, RiskPrediction, ModelInfo, ContributingFactor,
    Language, TranslateRequest, TranslateResponse
)
from model import risk_model
from translation_service import translation_service
from typing import Dict, List
import uvicorn

app = FastAPI(
    title="Maternal Health Risk Predictor API",
    description="AI-powered API for predicting maternal health risks during pregnancy",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Maternal Health Risk Predictor API",
        "status": "active",
        "version": "1.0.0"
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": risk_model.model is not None,
        "features_count": len(risk_model.feature_names)
    }


@app.get("/api/model-info", response_model=ModelInfo)
async def get_model_info():
    """Get information about the ML model"""
    try:
        info = risk_model.get_model_info()
        return ModelInfo(**info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving model info: {str(e)}")


@app.get("/api/languages", response_model=List[Language])
async def get_supported_languages():
    """Get list of supported languages for translation"""
    try:
        languages = translation_service.get_supported_languages()
        return [
            Language(code=code, name=name)
            for code, name in languages.items()
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving languages: {str(e)}")


@app.post("/api/translate", response_model=TranslateResponse)
async def translate_text(request: TranslateRequest):
    """Translate text to specified language using Gemini AI"""
    try:
        if not translation_service.is_available():
            raise HTTPException(
                status_code=503,
                detail="Translation service not available. Please configure GEMINI_API_KEY."
            )
        
        translated = translation_service.translate_text(
            text=request.text,
            target_language=request.target_language,
            source_language=request.source_language
        )
        
        return TranslateResponse(
            original_text=request.text,
            translated_text=translated,
            source_language=request.source_language,
            target_language=request.target_language
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")


@app.post("/api/predict", response_model=RiskPrediction)
async def predict_risk(patient: PatientData):
    """
    Predict maternal health risk based on patient data
    
    Returns risk score (0-100), category (Low/Medium/High), and recommendations.
    If language parameter is provided, translates results to that language.
    """
    try:
        # Convert patient data to dictionary
        patient_dict = patient.model_dump()
        
        # Get requested language
        target_language = patient_dict.pop('language', 'en')
        
        # Get prediction from model
        prediction = risk_model.predict(patient_dict)
        
        # Translate prediction if not English
        if target_language != 'en' and translation_service.is_available():
            prediction = translation_service.translate_risk_prediction(
                prediction,
                target_language
            )
        
        # Convert contributing factors to proper format
        contributing_factors = [
            ContributingFactor(**factor) 
            for factor in prediction['contributing_factors']
        ]
        
        # Build response
        response = RiskPrediction(
            risk_score=prediction['risk_score'],
            risk_category=prediction['risk_category'],
            probability=prediction['probability'],
            contributing_factors=contributing_factors,
            recommendations=prediction['recommendations'],
            patient_profile=patient
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error making prediction: {str(e)}"
        )


@app.get("/api/example-profiles")
async def get_example_profiles():
    """Get example patient profiles for demonstration"""
    examples = [
        {
            "name": "High Risk: Teenage Mother with Anemia",
            "description": "17-year-old with severe anemia and hypertension",
            "data": {
                "age": 17,
                "num_pregnancies": 1,
                "trimester": 2,
                "hemoglobin": 8.5,
                "systolic_bp": 150,
                "diastolic_bp": 95,
                "blood_sugar": 98.0,
                "bmi": 19.2,
                "previous_complications": False
            }
        },
        {
            "name": "Low Risk: Healthy Adult Mother",
            "description": "28-year-old with normal health parameters",
            "data": {
                "age": 28,
                "num_pregnancies": 2,
                "trimester": 2,
                "hemoglobin": 12.5,
                "systolic_bp": 118,
                "diastolic_bp": 75,
                "blood_sugar": 95.0,
                "bmi": 23.5,
                "previous_complications": False
            }
        },
        {
            "name": "Medium Risk: Advanced Maternal Age",
            "description": "36-year-old with elevated blood pressure",
            "data": {
                "age": 36,
                "num_pregnancies": 3,
                "trimester": 3,
                "hemoglobin": 11.2,
                "systolic_bp": 135,
                "diastolic_bp": 87,
                "blood_sugar": 105.0,
                "bmi": 27.8,
                "previous_complications": False
            }
        }
    ]
    
    return {"examples": examples}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
