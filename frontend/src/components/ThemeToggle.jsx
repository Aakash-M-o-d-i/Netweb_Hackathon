import React from 'react';

function ThemeToggle({ theme, onToggle }) {
    return (
        <button
            onClick={onToggle}
            style={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '2px solid var(--border)',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                transition: 'all var(--transition-base)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(15deg)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}

export default ThemeToggle;
