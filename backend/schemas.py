from pydantic import BaseModel, Field
from typing import List, Optional


class PatientData(BaseModel):
    """Input data for risk prediction"""
    age: int = Field(..., ge=15, le=50, description="Mother's age in years")
    num_pregnancies: int = Field(..., ge=1, le=15, description="Number of pregnancies (gravida)")
    trimester: int = Field(..., ge=1, le=3, description="Current trimester (1, 2, or 3)")
    hemoglobin: float = Field(..., ge=5.0, le=18.0, description="Hemoglobin level in g/dL")
    systolic_bp: int = Field(..., ge=80, le=200, description="Systolic blood pressure in mmHg")
    diastolic_bp: int = Field(..., ge=50, le=130, description="Diastolic blood pressure in mmHg")
    blood_sugar: float = Field(..., ge=60.0, le=300.0, description="Blood sugar in mg/dL")
    bmi: float = Field(..., ge=12.0, le=50.0, description="Body Mass Index")
    previous_complications: bool = Field(..., description="Previous pregnancy complications")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 28,
                "num_pregnancies": 2,
                "trimester": 2,
                "hemoglobin": 12.5,
                "systolic_bp": 120,
                "diastolic_bp": 80,
                "blood_sugar": 95.0,
                "bmi": 23.5,
                "previous_complications": False
            }
        }


class ContributingFactor(BaseModel):
    """A factor contributing to risk"""
    factor: str
    value: str
    impact: str  # "High", "Medium", "Low"
    description: str


class RiskPrediction(BaseModel):
    """Risk prediction response"""
    risk_score: float = Field(..., description="Risk score from 0-100")
    risk_category: str = Field(..., description="Low, Medium, or High")
    probability: float = Field(..., description="Probability of complications (0-1)")
    contributing_factors: List[ContributingFactor]
    recommendations: List[str]
    patient_profile: PatientData


class ModelInfo(BaseModel):
    """Model metadata"""
    model_type: str
    features: List[str]
    accuracy: float
    training_samples: int
    description: str
