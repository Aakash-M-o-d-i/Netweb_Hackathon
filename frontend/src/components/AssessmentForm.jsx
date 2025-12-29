import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

function AssessmentForm({ onSubmit, loading, profileData }) {
    const { currentLanguage, t } = useTranslation();
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

    // Update form data when profileData changes
    useEffect(() => {
        if (profileData) {
            setFormData({
                age: profileData.age || 28,
                num_pregnancies: profileData.num_pregnancies || 1,
                trimester: profileData.trimester || 2,
                hemoglobin: profileData.hemoglobin || 12.0,
                systolic_bp: profileData.systolic_bp || 120,
                diastolic_bp: profileData.diastolic_bp || 80,
                blood_sugar: profileData.blood_sugar || 95,
                bmi: profileData.bmi || 22.0,
                previous_complications: profileData.previous_complications || false
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : parseFloat(value) || value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Include language in submission
        onSubmit({ ...formData, language: currentLanguage });
    };

    return (
        <div className="card" id="assessment-form">
            <h2>{t('formTitle')}</h2>
            <p style={{ marginBottom: '2rem' }}>
                {t('formSubtitle')}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                    <div className="input-group">
                        <label htmlFor="age">
                            {t('age')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('ageHint')}</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="num_pregnancies">
                            {t('numPregnancies')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('numPregnanciesHint')}</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="trimester">
                            {t('trimester')} <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <select
                            id="trimester"
                            name="trimester"
                            value={formData.trimester}
                            onChange={handleChange}
                            required
                        >
                            <option value="1">{t('trimesterFirst')}</option>
                            <option value="2">{t('trimesterSecond')}</option>
                            <option value="3">{t('trimesterThird')}</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="hemoglobin">
                            {t('hemoglobin')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('hemoglobinHint')}</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="systolic_bp">
                            {t('systolicBp')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('systolicHint')}</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="diastolic_bp">
                            {t('diastolicBp')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('diastolicHint')}</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="blood_sugar">
                            {t('bloodSugar')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('bloodSugarHint')}</div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="bmi">
                            {t('bmi')} <span style={{ color: 'var(--danger)' }}>*</span>
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
                        <div className="input-hint">{t('bmiHint')}</div>
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
                        {t('prevComplications')}
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
                            {t('calculating')}
                        </>
                    ) : (
                        t('calculateButton')
                    )}
                </button>
            </form>
        </div>
    );
}

export default AssessmentForm;
