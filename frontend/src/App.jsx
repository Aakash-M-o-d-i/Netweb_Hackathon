import React, { useState, useEffect } from 'react';
import './index.css';
import Hero from './components/Hero';
import AssessmentForm from './components/AssessmentForm';
import ResultsDisplay from './components/ResultsDisplay';
import ExampleProfiles from './components/ExampleProfiles';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import { TranslationProvider, useTranslation } from './contexts/TranslationContext';

function App() {
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState(null);
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

  const handleExampleProfile = (profileData) => {
    // Just populate the form, don't auto-submit
    setSelectedProfileData(profileData);
    setResult(null); // Clear any previous results
    // Scroll to form
    document.getElementById('assessment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="App">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <LanguageSelector />
      <Hero />

      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <section className="fade-in">
          <AssessmentForm
            onSubmit={handlePrediction}
            loading={loading}
            profileData={selectedProfileData}
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
            <h2>{t('aboutTitle')}</h2>
            <div className="grid grid-2" style={{ marginTop: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-light)' }} align="center">
                  {t('purposeTitle')}
                </h3>
                <p align="center">
                  {t('purposeText')}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary-light)' }} align="center">
                  {t('technologyTitle')}
                </h3>
                <p align="center">
                  {t('technologyText')}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--success)' }} align="center">
                  {t('riskFactorsTitle2')}
                </h3>
                <p align="center">
                  {t('riskFactorsText')}
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--warning)' }} align="center">
                  {t('disclaimerTitle')}
                </h3>
                <p align="center">
                  {t('disclaimerText')}
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
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
}

// Wrapper component to provide translation context
function AppWithProvider() {
  return (
    <TranslationProvider>
      <App />
    </TranslationProvider>
  );
}

export default AppWithProvider;
