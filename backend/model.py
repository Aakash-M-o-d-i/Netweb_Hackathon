"""
Maternal Health Risk Prediction Model
======================================
This module implements a machine learning model for predicting maternal health risks
during pregnancy. It uses Logistic Regression trained on synthetic data based on
medical guidelines from WHO and ACOG.

Key Features:
- Synthetic data generation based on real medical risk factors
- Logistic Regression classifier for multi-class risk prediction
- Risk scoring system (0-100 scale)
- Contributing factors analysis
- Personalized medical recommendations
"""

# Import required libraries
import numpy as np  # For numerical operations and array handling
from sklearn.linear_model import LogisticRegression  # ML algorithm for classification
from sklearn.model_selection import train_test_split  # For splitting data into train/test sets
from sklearn.preprocessing import StandardScaler  # For feature normalization
from typing import Dict, List, Tuple  # Type hints for better code documentation
import pickle  # For model serialization (saving/loading trained models)
import os  # For file system operations


class MaternalHealthRiskModel:
    """
    Machine Learning model for predicting maternal health risks.
    
    This class encapsulates all functionality for:
    1. Generating synthetic training data based on medical knowledge
    2. Training a Logistic Regression classifier
    3. Making predictions on new patient data
    4. Analyzing risk factors and generating recommendations
    
    Attributes:
        model: Trained LogisticRegression model
        scaler: StandardScaler for feature normalization
        feature_names: List of feature names for interpretation
        train_accuracy: Model accuracy on test set
    """
    
    def __init__(self):
        """
        Initialize the maternal health risk prediction model.
        Sets up the model architecture and feature specifications.
        """
        # Initialize the ML model (will be trained later)
        self.model = None
        
        # StandardScaler normalizes features to have mean=0 and std=1
        # This helps the model converge faster and perform better
        self.scaler = StandardScaler()
        
        # Define the features used for prediction
        # These are ordered and must match the order when making predictions
        self.feature_names = [
            'age',                      # Mother's age in years
            'num_pregnancies',          # Total number of pregnancies (gravida)
            'trimester',                # Current trimester (1, 2, or 3)
            'hemoglobin',              # Hemoglobin level in g/dL (anemia indicator)
            'systolic_bp',             # Systolic blood pressure in mmHg
            'diastolic_bp',            # Diastolic blood pressure in mmHg
            'blood_sugar',             # Blood glucose level in mg/dL
            'bmi',                     # Body Mass Index (kg/m²)
            'previous_complications'   # Binary: had previous pregnancy complications
        ]
        
        # Store model performance metric
        self.train_accuracy = 0.0
        
    def generate_synthetic_data(self, n_samples: int = 1000) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generate synthetic maternal health data based on medical knowledge.
        
        This function creates realistic training data by simulating patient profiles
        with varying risk levels. The data distribution and risk calculations are
        based on WHO guidelines and medical literature.
        
        Args:
            n_samples: Number of synthetic patient records to generate
            
        Returns:
            Tuple of (features_array, labels_array)
            - features_array: (n_samples, 9) array of patient features
            - labels_array: (n_samples,) array of risk labels (0=Low, 1=Medium, 2=High)
        """
        # Set random seed for reproducibility
        # This ensures we get the same synthetic data every time
        np.random.seed(42)
        
        # Initialize lists to store generated data
        data = []      # Will store feature vectors
        labels = []    # Will store risk labels
        
        # Generate data for each patient sample
        for _ in range(n_samples):
            # === FEATURE GENERATION ===
            
            # Age generation with realistic distribution
            # 15% teenage (15-18), 70% optimal age (20-34), 15% advanced (35-44)
            age = np.random.choice([
                np.random.randint(15, 19),  # Teen pregnancy (higher risk)
                np.random.randint(20, 35),  # Optimal reproductive age (lower risk)
                np.random.randint(35, 45)   # Advanced maternal age (higher risk)
            ], p=[0.15, 0.70, 0.15])  # Probability distribution
            
            # Number of pregnancies (gravida): 1 to 7
            # Most women have 1-3 pregnancies
            num_pregnancies = np.random.randint(1, 8)
            
            # Current trimester: 1, 2, or 3
            trimester = np.random.randint(1, 4)
            
            # Hemoglobin level generation
            # Normal range: 12-16 g/dL
            # Anemia: < 10 g/dL (severe), < 11 g/dL (moderate)
            if np.random.random() < 0.25:  # 25% of women have anemia
                hemoglobin = np.random.uniform(7.0, 10.0)  # Anemic range
            else:
                hemoglobin = np.random.uniform(11.0, 15.5)  # Normal range
            
            # Blood pressure generation
            # Normal: < 120/80 mmHg
            # Hypertension: > 140/90 mmHg (pre-eclampsia risk)
            if np.random.random() < 0.20:  # 20% have hypertension
                systolic_bp = np.random.randint(140, 180)   # High systolic
                diastolic_bp = np.random.randint(90, 110)   # High diastolic
            else:
                systolic_bp = np.random.randint(100, 130)   # Normal systolic
                diastolic_bp = np.random.randint(60, 85)    # Normal diastolic
            
            # Blood sugar generation
            # Normal: < 140 mg/dL
            # Gestational diabetes: > 140 mg/dL
            if np.random.random() < 0.15:  # 15% have gestational diabetes
                blood_sugar = np.random.uniform(140, 200)  # Diabetic range
            else:
                blood_sugar = np.random.uniform(70, 120)   # Normal range
            
            # BMI (Body Mass Index) generation
            # Underweight: < 18.5, Normal: 18.5-24.9
            # Overweight: 25-29.9, Obese: > 30
            bmi_category = np.random.choice([0, 1, 2, 3], p=[0.15, 0.50, 0.25, 0.10])
            if bmi_category == 0:  # Underweight
                bmi = np.random.uniform(15.0, 18.4)
            elif bmi_category == 1:  # Normal
                bmi = np.random.uniform(18.5, 24.9)
            elif bmi_category == 2:  # Overweight
                bmi = np.random.uniform(25.0, 29.9)
            else:  # Obese
                bmi = np.random.uniform(30.0, 40.0)
            
            # Previous pregnancy complications (binary)
            # 10% of women had previous complications
            previous_complications = int(np.random.random() < 0.10)
            
            # === RISK CALCULATION ===
            # Calculate overall risk score based on medical factors
            # This is a rule-based system aligned with medical guidelines
            risk_score = 0
            
            # Age-based risk
            # Teenage pregnancy and advanced maternal age both increase risk
            if age < 18 or age > 35:
                risk_score += 25  # Significant risk contribution
            
            # Anemia risk
            # Low hemoglobin reduces oxygen delivery to fetus
            if hemoglobin < 10:  # Severe anemia
                risk_score += 30  # High risk
            elif hemoglobin < 11:  # Moderate anemia
                risk_score += 15  # Medium risk
            
            # Hypertension risk
            # High BP can lead to pre-eclampsia, placental abruption
            if systolic_bp > 140 or diastolic_bp > 90:  # Hypertension
                risk_score += 35  # Very high risk
            elif systolic_bp > 130 or diastolic_bp > 85:  # Pre-hypertension
                risk_score += 20  # Moderate risk
            
            # Gestational diabetes risk
            # High blood sugar affects fetal development
            if blood_sugar > 140:  # Gestational diabetes
                risk_score += 25  # High risk
            elif blood_sugar > 125:  # Pre-diabetic
                risk_score += 10  # Low-moderate risk
            
            # BMI-based risk
            # Both underweight and obesity increase complications
            if bmi < 18.5 or bmi > 30:
                risk_score += 15  # Moderate risk
            
            # Previous complications risk
            # History is a strong predictor of future complications
            if previous_complications:
                risk_score += 20  # High risk
            
            # Grand multiparity risk
            # More than 5 pregnancies increases risk
            if num_pregnancies > 5:
                risk_score += 15  # Moderate risk
            
            # === RISK CATEGORIZATION ===
            # Convert numerical risk score to categorical label
            # Low: 0-40, Medium: 41-70, High: 71+
            if risk_score < 40:
                risk_label = 0  # Low risk
            elif risk_score < 70:
                risk_label = 1  # Medium risk
            else:
                risk_label = 2  # High risk
            
            # Append this patient's data to our dataset
            data.append([
                age, num_pregnancies, trimester, hemoglobin,
                systolic_bp, diastolic_bp, blood_sugar, bmi,
                previous_complications
            ])
            labels.append(risk_label)
        
        # Convert lists to numpy arrays for sklearn compatibility
        return np.array(data), np.array(labels)
    
    def train(self):
        """
        Train the logistic regression model on synthetic data.
        
        This method:
        1. Generates synthetic training data
        2. Splits data into train/test sets
        3. Normalizes features using StandardScaler
        4. Trains a Logistic Regression classifier
        5. Evaluates model accuracy
        
        Returns:
            self: Returns the trained model instance for method chaining
        """
        # Generate 1000 synthetic patient records
        X, y = self.generate_synthetic_data(n_samples=1000)
        
        # Split data into training (80%) and testing (20%) sets
        # stratify=y ensures each set has proportional representation of each class
        # random_state=42 ensures reproducibility
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=0.2,      # 20% for testing
            random_state=42,    # Reproducibility
            stratify=y          # Maintain class distribution
        )
        
        # Normalize features to have mean=0 and std=1
        # This is crucial for logistic regression performance
        X_train_scaled = self.scaler.fit_transform(X_train)  # Fit and transform training data
        X_test_scaled = self.scaler.transform(X_test)        # Only transform test data (no fitting)
        
        # Initialize and train Logistic Regression model
        # solver='lbfgs': Optimization algorithm (good for small datasets)
        # max_iter=1000: Maximum iterations to converge
        # random_state=42: Reproducibility
        self.model = LogisticRegression(
            solver='lbfgs',      # L-BFGS optimization algorithm
            max_iter=1000,       # Maximum iterations
            random_state=42      # For reproducibility
        )
        
        # Train the model on scaled training data
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate model accuracy on test set
        # This gives us the percentage of correct predictions
        self.train_accuracy = self.model.score(X_test_scaled, y_test)
        
        # Print training results to console
        print(f"Model trained successfully!")
        print(f"Test accuracy: {self.train_accuracy:.3f}")
        print(f"Training samples: {len(X_train)}")
        
        # Return self for method chaining
        return self
    
    def predict(self, patient_data: Dict) -> Dict:
        """
        Make risk prediction for a specific patient.
        
        This method:
        1. Extracts features from patient data
        2. Normalizes features using the fitted scaler
        3. Predicts risk using the trained model
        4. Calculates risk score (0-100)
        5. Identifies contributing factors
        6. Generates personalized recommendations
        
        Args:
            patient_data: Dictionary containing patient health parameters
            
        Returns:
            Dictionary with:
            - risk_score: Float 0-100
            - risk_category: String "Low", "Medium", or "High"
            - probability: Float 0-1 (model confidence)
            - contributing_factors: List of risk factors
            - recommendations: List of medical recommendations
        """
        # Extract features in the exact order the model was trained on
        # This order MUST match self.feature_names
        features = [
            patient_data['age'],                          # Age in years
            patient_data['num_pregnancies'],             # Number of pregnancies
            patient_data['trimester'],                   # Current trimester
            patient_data['hemoglobin'],                  # Hemoglobin g/dL
            patient_data['systolic_bp'],                 # Systolic BP mmHg
            patient_data['diastolic_bp'],                # Diastolic BP mmHg
            patient_data['blood_sugar'],                 # Blood sugar mg/dL
            patient_data['bmi'],                         # BMI kg/m²
            int(patient_data['previous_complications']) # Boolean to int
        ]
        
        # Normalize features using the scaler fitted during training
        # This ensures features are on the same scale as training data
        features_scaled = self.scaler.transform([features])
        
        # Get prediction probabilities for each class
        # Returns array of [prob_low, prob_medium, prob_high]
        probabilities = self.model.predict_proba(features_scaled)[0]
        
        # Get the predicted class (0, 1, or 2)
        predicted_class = self.model.predict(features_scaled)[0]
        
        # Calculate risk score on 0-100 scale
        # Weight each class: Low=0, Medium=50, High=100
        # This gives a continuous score rather than just a category
        risk_score = probabilities[0] * 0 + probabilities[1] * 50 + probabilities[2] * 100
        
        # Convert numerical prediction to categorical label
        if predicted_class == 0:
            risk_category = "Low"       # Low risk
        elif predicted_class == 1:
            risk_category = "Medium"    # Medium risk
        else:
            risk_category = "High"      # High risk
        
        # Analyze which specific factors contribute to this patient's risk
        contributing_factors = self._analyze_factors(patient_data)
        
        # Generate personalized medical recommendations
        recommendations = self._generate_recommendations(patient_data, risk_category)
        
        # Return comprehensive prediction result
        return {
            'risk_score': round(risk_score, 1),              # Rounded to 1 decimal
            'risk_category': risk_category,                   # Low/Medium/High
            'probability': round(probabilities[predicted_class], 3),  # Model confidence
            'contributing_factors': contributing_factors,     # List of risk factors
            'recommendations': recommendations                # List of recommendations
        }
    
    def _analyze_factors(self, data: Dict) -> List[Dict]:
        """
        Analyze which factors contribute to a patient's risk.
        
        This method examines each health parameter and identifies
        which ones are outside normal ranges, determining their
        impact level (High, Medium, or Low).
        
        Args:
            data: Dictionary of patient health parameters
            
        Returns:
            List of dictionaries, each containing:
            - factor: Name of the risk factor
            - value: The patient's value for this parameter
            - impact: "High", "Medium", or "Low"
            - description: Medical explanation
        """
        factors = []  # List to store identified risk factors
        
        # === AGE ANALYSIS ===
        # Check if age is outside optimal range (20-35 years)
        if data['age'] < 18:
            # Teenage pregnancy has multiple risks
            factors.append({
                'factor': 'Teenage Pregnancy',
                'value': f"{data['age']} years",
                'impact': 'High',
                'description': 'Age below 18 increases risk of complications'
            })
        elif data['age'] > 35:
            # Advanced maternal age increases chromosomal abnormalities
            factors.append({
                'factor': 'Advanced Maternal Age',
                'value': f"{data['age']} years",
                'impact': 'High',
                'description': 'Age above 35 associated with increased risks'
            })
        
        # === HEMOGLOBIN ANALYSIS ===
        # Check for anemia (low hemoglobin)
        if data['hemoglobin'] < 10:
            # Severe anemia: very low oxygen carrying capacity
            factors.append({
                'factor': 'Severe Anemia',
                'value': f"{data['hemoglobin']} g/dL",
                'impact': 'High',
                'description': 'Hemoglobin below 10 g/dL indicates severe anemia'
            })
        elif data['hemoglobin'] < 11:
            # Moderate anemia: reduced oxygen supply
            factors.append({
                'factor': 'Moderate Anemia',
                'value': f"{data['hemoglobin']} g/dL",
                'impact': 'Medium',
                'description': 'Hemoglobin below 11 g/dL indicates anemia'
            })
        
        # === BLOOD PRESSURE ANALYSIS ===
        # Check for hypertension (high blood pressure)
        if data['systolic_bp'] > 140 or data['diastolic_bp'] > 90:
            # Hypertension: major pre-eclampsia risk
            factors.append({
                'factor': 'Hypertension',
                'value': f"{data['systolic_bp']}/{data['diastolic_bp']} mmHg",
                'impact': 'High',
                'description': 'High blood pressure increases pre-eclampsia risk'
            })
        elif data['systolic_bp'] > 130 or data['diastolic_bp'] > 85:
            # Elevated BP: needs monitoring
            factors.append({
                'factor': 'Elevated Blood Pressure',
                'value': f"{data['systolic_bp']}/{data['diastolic_bp']} mmHg",
                'impact': 'Medium',
                'description': 'Blood pressure slightly elevated, needs monitoring'
            })
        
        # === BLOOD SUGAR ANALYSIS ===
        # Check for gestational diabetes
        if data['blood_sugar'] > 140:
            # Gestational diabetes: affects fetal development
            factors.append({
                'factor': 'Gestational Diabetes',
                'value': f"{data['blood_sugar']} mg/dL",
                'impact': 'High',
                'description': 'Blood sugar above 140 indicates gestational diabetes'
            })
        elif data['blood_sugar'] > 125:
            # Pre-diabetic range: needs testing
            factors.append({
                'factor': 'Elevated Blood Sugar',
                'value': f"{data['blood_sugar']} mg/dL",
                'impact': 'Medium',
                'description': 'Blood sugar slightly high, further testing recommended'
            })
        
        # === BMI ANALYSIS ===
        # Check for underweight or obesity
        if data['bmi'] < 18.5:
            # Underweight: may affect fetal growth
            factors.append({
                'factor': 'Underweight',
                'value': f"BMI {data['bmi']}",
                'impact': 'Medium',
                'description': 'Low BMI may affect fetal growth'
            })
        elif data['bmi'] > 30:
            # Obesity: increases multiple complications
            factors.append({
                'factor': 'Obesity',
                'value': f"BMI {data['bmi']}",
                'impact': 'Medium',
                'description': 'High BMI increases pregnancy complications risk'
            })
        
        # === PREVIOUS COMPLICATIONS ANALYSIS ===
        # Check pregnancy history
        if data['previous_complications']:
            # Previous complications are strong predictors
            factors.append({
                'factor': 'Previous Complications',
                'value': 'Yes',
                'impact': 'High',
                'description': 'History of complications increases current pregnancy risk'
            })
        
        # === MULTIPARITY ANALYSIS ===
        # Check for grand multiparity (many pregnancies)
        if data['num_pregnancies'] > 5:
            # Grand multiparity increases risks
            factors.append({
                'factor': 'Grand Multiparity',
                'value': f"{data['num_pregnancies']} pregnancies",
                'impact': 'Medium',
                'description': 'Many previous pregnancies increase risk'
            })
        
        # Sort factors by impact level (High first, then Medium, then Low)
        # This ensures most critical factors are shown first
        impact_order = {'High': 0, 'Medium': 1, 'Low': 2}
        factors.sort(key=lambda x: impact_order[x['impact']])
        
        return factors
    
    def _generate_recommendations(self, data: Dict, risk_category: str) -> List[str]:
        """
        Generate personalized medical recommendations.
        
        Based on the patient's risk factors and overall risk category,
        this method creates a tailored list of medical interventions
        and monitoring protocols.
        
        Args:
            data: Patient health parameters
            risk_category: "Low", "Medium", or "High"
            
        Returns:
            List of recommendation strings with emoji icons
        """
        recommendations = []  # List to store recommendations
        
        # === HIGH RISK RECOMMENDATIONS ===
        # If patient is high risk, add urgent recommendations
        if risk_category == "High":
            recommendations.append("🚨 Immediate medical consultation required")
            recommendations.append("📋 Comprehensive prenatal testing recommended")
            recommendations.append("🏥 Consider referral to specialist facility")
        
        # === ANEMIA RECOMMENDATIONS ===
        # If hemoglobin is low, recommend iron supplementation
        if data['hemoglobin'] < 11:
            recommendations.append("💊 Iron supplementation and nutrition counseling")
            recommendations.append("🥗 Diet rich in iron: green vegetables, meat, fortified cereals")
        
        # === HYPERTENSION RECOMMENDATIONS ===
        # If blood pressure is elevated, recommend monitoring
        if data['systolic_bp'] > 130 or data['diastolic_bp'] > 85:
            recommendations.append("🩺 Regular blood pressure monitoring (weekly)")
            recommendations.append("🧂 Reduce salt intake, monitor for pre-eclampsia symptoms")
        
        # === DIABETES RECOMMENDATIONS ===
        # If blood sugar is high, recommend screening
        if data['blood_sugar'] > 125:
            recommendations.append("🍎 Diabetes screening and blood sugar monitoring")
            recommendations.append("🚶‍♀️ Dietary modifications and light exercise")
        
        # === BMI RECOMMENDATIONS ===
        # Nutritional advice based on BMI
        if data['bmi'] < 18.5:
            # Underweight: need to gain weight
            recommendations.append("🍽️ Nutritional support to achieve healthy weight gain")
        elif data['bmi'] > 30:
            # Obese: weight management needed
            recommendations.append("⚖️ Weight management and nutritionist consultation")
        
        # === AGE-SPECIFIC RECOMMENDATIONS ===
        if data['age'] < 18:
            # Teenagers need extra support
            recommendations.append("👥 Additional psychosocial support and education")
        elif data['age'] > 35:
            # Advanced age needs advanced screening
            recommendations.append("🔬 Advanced screening tests (genetic counseling if needed)")
        
        # === HISTORY-BASED RECOMMENDATIONS ===
        if data['previous_complications']:
            # Review past complications for better care
            recommendations.append("📝 Review previous medical records and complications")
            recommendations.append("👨‍⚕️ Enhanced monitoring throughout pregnancy")
        
        # === GENERAL RECOMMENDATIONS ===
        # These apply to all patients
        recommendations.append("✅ Regular antenatal check-ups as scheduled")
        recommendations.append("📞 Emergency contact: Seek help if severe headache, vision changes, or bleeding")
        
        return recommendations
    
    def get_model_info(self) -> Dict:
        """
        Get metadata about the trained model.
        
        Returns:
            Dictionary containing model information:
            - model_type: Type of ML algorithm
            - features: List of feature names
            - accuracy: Test set accuracy
            - training_samples: Number of training samples
            - description: Brief description
        """
        return {
            'model_type': 'Logistic Regression (Multinomial)',
            'features': self.feature_names,
            'accuracy': round(self.train_accuracy, 3),
            'training_samples': 1000,
            'description': 'AI model trained on synthetic maternal health data based on WHO guidelines'
        }


# === MODULE-LEVEL INITIALIZATION ===
# When this module is imported, automatically create and train the model
# This happens once when the FastAPI server starts
print("Initializing Maternal Health Risk Model...")
risk_model = MaternalHealthRiskModel()  # Create model instance
risk_model.train()                      # Train the model
print("Model ready for predictions!")
