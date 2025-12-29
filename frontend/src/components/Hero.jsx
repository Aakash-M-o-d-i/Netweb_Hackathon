import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';

function Hero() {
    const { t } = useTranslation();

    return (
        <section style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            borderBottom: '1px solid var(--border)',
            padding: '6rem 0'
        }}>
            <div className="container text-center">
                <div className="fade-in">
                    <h1 style={{ marginBottom: '1.5rem' }}>
                        {t('heroTitle')}
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        maxWidth: '800px',
                        margin: '0 auto 2rem',
                        color: 'var(--text-secondary)'
                    }}>
                        {t('heroSubtitle')}
                    </p>
                    <p style={{
                        fontSize: '1rem',
                        maxWidth: '700px',
                        margin: '0 auto 2rem',
                        color: 'var(--text-muted)'
                    }}>
                        {t('heroDescription')}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Hero;
