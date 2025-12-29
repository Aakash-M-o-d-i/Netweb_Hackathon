import React, { useState, useEffect } from 'react';
import './index.css';
import Hero from './components/Hero';
import AssessmentForm from './components/AssessmentForm';
import ResultsDisplay from './components/ResultsDisplay';
import ExampleProfiles from './components/ExampleProfiles';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    return localStorage.getItem('theme') || 'dark';
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handlePrediction = async (patientData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get prediction. Make sure the backend server is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleProfile = async (profileData) => {
    await handlePrediction(profileData);
  };

  return (
    <div className="App">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <Hero />

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <section className="fade-in">
          <AssessmentForm
            onSubmit={handlePrediction}
            loading={loading}
          />
        </section>

        {result && (
          <section id="results" className="fade-in" style={{ marginTop: '4rem' }}>
            <ResultsDisplay result={result} />
          </section>
        )}

        <section className="fade-in" style={{ marginTop: '4rem' }}>
          <ExampleProfiles onSelectProfile={handleExampleProfile} />
        </section>

        <section id="about" className="fade-in" style={{ marginTop: '4rem' }}>
          <div className="card">
            <h2>About Maternal Health Risk Prediction</h2>
            <div className="grid grid-2" style={{ marginTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-light)' }} align="center">
                  Purpose
                </h3>
                <p align="center">
                  This AI-powered tool helps healthcare workers identify high-risk pregnancies
                  early, enabling targeted interventions and potentially saving lives in rural
                  and underserved areas.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-light)' }} align="center">
                  Technology
                </h3>
                <p align="center">
                  Uses machine learning (Logistic Regression) trained on maternal health indicators
                  aligned with WHO guidelines to predict complications risk.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--success)' }} align="center">
                  Risk Factors
                </h3>
                <p align="center">
                  Analyzes age, anemia (hemoglobin), blood pressure, blood sugar, BMI,
                  and pregnancy history to calculate comprehensive risk scores.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--warning)' }} align="center">
                  Disclaimer
                </h3>
                <p align="center">
                  This tool is for educational and demonstration purposes. Always consult
                  qualified healthcare professionals for medical decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '2rem 0',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border)'
      }}>
        <p>Maternal Health Risk Predictor | AI for Social Good | Hackathon 2025</p>
      </footer>
    </div>
  );
}

export default App;
