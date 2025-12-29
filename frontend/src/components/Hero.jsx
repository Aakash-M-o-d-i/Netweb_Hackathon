import React from 'react';

function Hero() {
    return (
        <section style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            borderBottom: '1px solid var(--border)',
            padding: '6rem 0'
        }}>
            <div className="container text-center">
                <div className="fade-in">
                    <h1 style={{ marginBottom: '1.5rem' }}>
                        Maternal Health Risk Predictor
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        maxWidth: '800px',
                        margin: '0 auto 2rem',
                        color: 'var(--text-secondary)'
                    }}>
                        AI-powered risk assessment to protect mothers and newborns.
                        Early detection saves lives.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => document.getElementById('assessment-form')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Start Assessment
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                <div className="grid grid-3" style={{
                    marginTop: '4rem',
                    textAlign: 'left'
                }}>
                    <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }} align="center">🏥</div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-light)' }} align="center">
                            AI-Powered
                        </h3>
                        <p style={{ fontSize: '0.95rem', marginBottom: 0 }} align="center">
                            Machine learning model trained on medical guidelines to predict pregnancy risks
                        </p>
                    </div>

                    <div className="card" style={{ background: 'rgba(236, 72, 153, 0.05)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }} align="center">🎯</div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-light)' }} align="center">
                            Early Detection
                        </h3>
                        <p style={{ fontSize: '0.95rem', marginBottom: 0 }} align="center">
                            Identify high-risk pregnancies early for timely medical intervention
                        </p>
                    </div>

                    <div className="card" style={{ background: 'rgba(16, 185, 129, 0.05)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }} align="center">💡</div>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--success)' }} align="center">
                            Actionable Insights
                        </h3>
                        <p style={{ fontSize: '0.95rem', marginBottom: 0 }} align="center">
                            Get specific recommendations based on identified risk factors
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
