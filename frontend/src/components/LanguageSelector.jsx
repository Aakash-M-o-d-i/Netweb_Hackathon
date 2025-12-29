import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import './LanguageSelector.css';

/**
 * Language Selector Component
 * ============================
 * Dropdown selector for choosing interface language.
 * Supports English and 5 Indian languages for ASHA workers.
 */

function LanguageSelector() {
    const { currentLanguage, setCurrentLanguage, languages } = useTranslation();

    const handleLanguageChange = (e) => {
        setCurrentLanguage(e.target.value);
    };

    return (
        <div className="language-selector">
            <select
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="language-dropdown"
                aria-label="Select language"
            >
                {Object.values(languages).map(lang => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;
