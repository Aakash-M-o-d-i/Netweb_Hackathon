import React, { useState } from 'react';

function AssessmentForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        age: 28,
        num_pregnancies: 1,
        trimester: 2,
        hemoglobin: 12.0,
        systolic_bp: 120,
        diastolic_bp: 80,
        blood_sugar: 95,
        bmi: 22.0,
        previous_complications: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseFloat(value) || value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="card" id="assessment-form">
            <h2>Risk Assessment Form</h2>
            <p style={{ marginBottom: '2rem' }}>
                Enter patient health parameters for AI-powered risk prediction
            </p>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                    <div className="input-group">
                        <label htmlFor="age">
                            Age (years) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="15"
                            max="50"
                            required
                        />
                        <div className="input-hint">Normal: 20-35 years</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="num_pregnancies">
                            Number of Pregnancies <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="num_pregnancies"
                            name="num_pregnancies"
                            value={formData.num_pregnancies}
                            onChange={handleChange}
                            min="1"
                            max="15"
                            required
                        />
                        <div className="input-hint">Total number including current</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="trimester">
                            Current Trimester <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <select
                            id="trimester"
                            name="trimester"
                            value={formData.trimester}
                            onChange={handleChange}
                            required
                        >
                            <option value="1">First Trimester (1-12 weeks)</option>
                            <option value="2">Second Trimester (13-26 weeks)</option>
                            <option value="3">Third Trimester (27-40 weeks)</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="hemoglobin">
                            Hemoglobin (g/dL) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="hemoglobin"
                            name="hemoglobin"
                            value={formData.hemoglobin}
                            onChange={handleChange}
                            min="5"
                            max="18"
                            step="0.1"
                            required
                        />
                        <div className="input-hint">Normal: 12-16 g/dL | Anemia: &lt;10 g/dL</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="systolic_bp">
                            Systolic BP (mmHg) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="systolic_bp"
                            name="systolic_bp"
                            value={formData.systolic_bp}
                            onChange={handleChange}
                            min="80"
                            max="200"
                            required
                        />
                        <div className="input-hint">Normal: 90-120 mmHg</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="diastolic_bp">
                            Diastolic BP (mmHg) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="diastolic_bp"
                            name="diastolic_bp"
                            value={formData.diastolic_bp}
                            onChange={handleChange}
                            min="50"
                            max="130"
                            required
                        />
                        <div className="input-hint">Normal: 60-80 mmHg</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="blood_sugar">
                            Blood Sugar (mg/dL) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="blood_sugar"
                            name="blood_sugar"
                            value={formData.blood_sugar}
                            onChange={handleChange}
                            min="60"
                            max="300"
                            step="0.1"
                            required
                        />
                        <div className="input-hint">Normal: 70-125 mg/dL | High: &gt;140 mg/dL</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="bmi">
                            BMI (kg/m²) <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="bmi"
                            name="bmi"
                            value={formData.bmi}
                            onChange={handleChange}
                            min="12"
                            max="50"
                            step="0.1"
                            required
                        />
                        <div className="input-hint">Normal: 18.5-24.9 | Calculate: weight(kg) / height(m)²</div>
                    </div>
                </div>

                <div className="checkbox-group" style={{ marginTop: '1rem' }}>
                    <input
                        type="checkbox"
                        id="previous_complications"
                        name="previous_complications"
                        checked={formData.previous_complications}
                        onChange={handleChange}
                    />
                    <label htmlFor="previous_complications" style={{ cursor: 'pointer', marginBottom: 0 }}>
                        Previous pregnancy complications (pre-eclampsia, gestational diabetes, etc.)
                    </label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: '2rem', width: '100%' }}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="loading"></span>
                            Analyzing...
                        </>
                    ) : (
                        '🔍 Calculate Risk Score'
                    )}
                </button>
            </form>
        </div>
    );
}

export default AssessmentForm;
