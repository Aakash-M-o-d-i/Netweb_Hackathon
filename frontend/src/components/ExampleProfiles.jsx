import React, { useState, useEffect } from 'react';

function ExampleProfiles({ onSelectProfile }) {
    const [examples, setExamples] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExamples();
    }, []);

    const fetchExamples = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/example-profiles');
            const data = await response.json();
            setExamples(data.examples);
        } catch (error) {
            console.error('Error fetching examples:', error);
            // Fallback examples if backend is not available
            setExamples([
                {
                    name: "High Risk: Teenage Mother with Anemia",
                    description: "17-year-old with severe anemia and hypertension",
                    data: {
                        age: 17,
                        num_pregnancies: 1,
                        trimester: 2,
                        hemoglobin: 8.5,
                        systolic_bp: 150,
                        diastolic_bp: 95,
                        blood_sugar: 98.0,
                        bmi: 19.2,
                        previous_complications: false
                    }
                },
                {
                    name: "Low Risk: Healthy Adult Mother",
                    description: "28-year-old with normal health parameters",
                    data: {
                        age: 28,
                        num_pregnancies: 2,
                        trimester: 2,
                        hemoglobin: 12.5,
                        systolic_bp: 118,
                        diastolic_bp: 75,
                        blood_sugar: 95.0,
                        bmi: 23.5,
                        previous_complications: false
                    }
                },
                {
                    name: "Medium Risk: Advanced Maternal Age",
                    description: "36-year-old with elevated blood pressure",
                    data: {
                        age: 36,
                        num_pregnancies: 3,
                        trimester: 3,
                        hemoglobin: 11.2,
                        systolic_bp: 135,
                        diastolic_bp: 87,
                        blood_sugar: 105.0,
                        bmi: 27.8,
                        previous_complications: false
                    }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (profile) => {
        onSelectProfile(profile.data);
    };

    if (loading) {
        return (
            <div className="card text-center">
                <div className="loading" style={{ margin: '2rem auto' }}></div>
                <p>Loading example profiles...</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1rem' }}>📊 Example Patient Profiles</h2>
            <p style={{ marginBottom: '2rem' }}>
                Click on any profile to see AI risk prediction demonstration
            </p>

            <div className="grid grid-3">
                {examples.map((profile, index) => {
                    const riskType =
                        profile.name.includes('High') ? 'high' :
                            profile.name.includes('Low') ? 'low' :
                                'medium';

                    const riskColor =
                        riskType === 'high' ? 'var(--high-risk)' :
                            riskType === 'low' ? 'var(--low-risk)' :
                                'var(--medium-risk)';

                    return (
                        <div
                            key={index}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                background: `linear-gradient(135deg, ${riskColor}08, transparent)`,
                                border: `2px solid ${riskColor}30`,
                                transition: 'all var(--transition-base)'
                            }}
                            onClick={() => handleClick(profile)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = riskColor;
                                e.currentTarget.style.boxShadow = `0 10px 30px ${riskColor}40, var(--shadow-xl)`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = `${riskColor}30`;
                                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                            }}
                        >
                            <div className={`risk-badge ${riskType}`} style={{
                                marginBottom: '1rem',
                                fontSize: '0.75rem'
                            }}>
                                {riskType.toUpperCase()} RISK
                            </div>

                            <h3 style={{
                                fontSize: '1.1rem',
                                marginBottom: '0.75rem',
                                color: 'var(--text-primary)'
                            }}>
                                {profile.name.split(':')[1]?.trim() || profile.name}
                            </h3>

                            <p style={{
                                fontSize: '0.9rem',
                                marginBottom: '1rem',
                                color: 'var(--text-secondary)'
                            }}>
                                {profile.description}
                            </p>

                            <div style={{
                                display: 'grid',
                                gap: '0.5rem',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-secondary)',
                                padding: 'var(--spacing-sm)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)'
                            }}>
                                <div>Age: {profile.data.age} years</div>
                                <div>Hemoglobin: {profile.data.hemoglobin} g/dL</div>
                                <div>BP: {profile.data.systolic_bp}/{profile.data.diastolic_bp} mmHg</div>
                                <div>Blood Sugar: {profile.data.blood_sugar} mg/dL</div>
                            </div>

                            <button
                                className="btn btn-outline"
                                style={{
                                    width: '100%',
                                    marginTop: '1rem',
                                    fontSize: '0.9rem',
                                    padding: '0.625rem 1rem'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClick(profile);
                                }}
                            >
                                View Prediction →
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="alert alert-info" style={{ marginTop: '2rem' }}>
                <strong>💡 Note:</strong> These are demonstration profiles showing different risk scenarios.
                In real deployment, patient data would be entered by healthcare workers during antenatal visits.
            </div>
        </div>
    );
}

export default ExampleProfiles;
