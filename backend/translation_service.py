"""
Translation Service using Gemini AI
====================================
This module provides translation capabilities for the Maternal Health Risk Predictor
application using Google's Gemini AI. It supports translation between English and
5 Indian languages: Hindi, Bengali, Marathi, Telugu, and Tamil.

Features:
- Real-time translation via Gemini AI API
- In-memory caching for performance optimization
- Batch translation support
- Graceful error handling with fallback
- Medical terminology preservation
"""

import google.generativeai as genai
from typing import Dict, List, Optional, Union
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()


class TranslationService:
    """
    Service for translating text using Gemini AI.
    
    Supports translation between English and Indian languages for better
    accessibility for ASHA workers and healthcare providers.
    
    Attributes:
        api_key: Gemini API key from environment
        model: Configured Gemini model instance
        cache: In-memory cache for translated content
        supported_languages: Dict of language codes and names
    """
    
    # Language codes and their human-readable names
    SUPPORTED_LANGUAGES = {
        'en': 'English',
        'hi': 'Hindi (हिंदी)',
        'bn': 'Bengali (বাংলা)',
        'mr': 'Marathi (मराठी)',
        'ta': 'Tamil (தமிழ்)'
    }
    
    def __init__(self):
        """
        Initialize the translation service.
        
        Sets up Gemini AI API configuration and cache.
        """
        # Get API key from environment
        self.api_key = os.getenv('GEMINI_API_KEY', '')
        
        # Initialize cache for translations
        # Structure: {(text, source_lang, target_lang): translated_text}
        self.cache: Dict[tuple, str] = {}
        
        # Configure Gemini API
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # Use Gemini 2.5 Flash - latest model for fast, cost-effective translations
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None
            print("Warning: GEMINI_API_KEY not found. Translation will be disabled.")
    
    def is_available(self) -> bool:
        """
        Check if translation service is available.
        
        Returns:
            True if API key is configured, False otherwise
        """
        return self.model is not None
    
    def get_supported_languages(self) -> Dict[str, str]:
        """
        Get list of supported languages.
        
        Returns:
            Dictionary mapping language codes to names
        """
        return self.SUPPORTED_LANGUAGES.copy()
    
    def translate_text(
        self,
        text: str,
        target_language: str,
        source_language: str = 'en',
        preserve_medical_terms: bool = True
    ) -> str:
        """
        Translate text from source to target language.
        
        Args:
            text: Text to translate
            target_language: Target language code (hi, bn, mr, te, ta)
            source_language: Source language code (default: en)
            preserve_medical_terms: Whether to preserve medical terminology
            
        Returns:
            Translated text, or original text if translation fails
        """
        # Return original if same language
        if source_language == target_language:
            return text
        
        # Return original if service not available
        if not self.is_available():
            print(f"Translation service not available. Returning original text.")
            return text
        
        # Validate target language
        if target_language not in self.SUPPORTED_LANGUAGES:
            print(f"Unsupported language: {target_language}. Returning original text.")
            return text
        
        # Check cache first
        cache_key = (text, source_language, target_language)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # Prepare translation prompt
            target_lang_name = self.SUPPORTED_LANGUAGES[target_language]
            
            prompt = f"""Translate the following text from {self.SUPPORTED_LANGUAGES[source_language]} to {target_lang_name}.

Important instructions:
1. Provide ONLY the translated text without any explanations or notes
2. Maintain the same tone and formality
3. For medical terms, use commonly understood terms in the target language
4. Preserve any numbers, measurements, and units exactly as they are
5. Keep any emoji symbols unchanged

Text to translate:
{text}

Translation:"""
            
            # Call Gemini API
            response = self.model.generate_content(prompt)
            translated = response.text.strip()
            
            # Cache the result
            self.cache[cache_key] = translated
            
            return translated
            
        except Exception as e:
            print(f"Translation error: {str(e)}")
            # Return original text on error
            return text
    
    def translate_dict(
        self,
        data: Dict[str, Union[str, List[str]]],
        target_language: str,
        source_language: str = 'en',
        exclude_keys: Optional[List[str]] = None
    ) -> Dict[str, Union[str, List[str]]]:
        """
        Translate all string values in a dictionary.
        
        Useful for translating structured data like API responses.
        
        Args:
            data: Dictionary with string values to translate
            target_language: Target language code
            source_language: Source language code
            exclude_keys: List of keys to not translate
            
        Returns:
            Dictionary with translated values
        """
        if not self.is_available() or source_language == target_language:
            return data
        
        exclude_keys = exclude_keys or []
        result = {}
        
        for key, value in data.items():
            # Skip excluded keys
            if key in exclude_keys:
                result[key] = value
                continue
            
            # Translate string values
            if isinstance(value, str):
                result[key] = self.translate_text(
                    value,
                    target_language,
                    source_language
                )
            # Translate list of strings
            elif isinstance(value, list) and all(isinstance(item, str) for item in value):
                result[key] = [
                    self.translate_text(item, target_language, source_language)
                    for item in value
                ]
            # Keep other types as-is
            else:
                result[key] = value
        
        return result
    
    def translate_risk_prediction(
        self,
        prediction: Dict,
        target_language: str
    ) -> Dict:
        """
        Translate a complete risk prediction response.
        
        Handles the complex nested structure of risk predictions including
        contributing factors and recommendations.
        
        Args:
            prediction: Risk prediction dictionary
            target_language: Target language code
            
        Returns:
            Translated prediction dictionary
        """
        if not self.is_available() or target_language == 'en':
            return prediction
        
        try:
            # Create a copy to avoid modifying original
            result = prediction.copy()
            
            # Translate risk category
            if 'risk_category' in result:
                result['risk_category'] = self.translate_text(
                    result['risk_category'],
                    target_language
                )
            
            # Translate contributing factors
            if 'contributing_factors' in result:
                translated_factors = []
                for factor in result['contributing_factors']:
                    translated_factor = {
                        'factor': self.translate_text(factor['factor'], target_language),
                        'value': factor['value'],  # Keep values as-is
                        'impact': self.translate_text(factor['impact'], target_language),
                        'description': self.translate_text(factor['description'], target_language)
                    }
                    translated_factors.append(translated_factor)
                result['contributing_factors'] = translated_factors
            
            # Translate recommendations
            if 'recommendations' in result:
                result['recommendations'] = [
                    self.translate_text(rec, target_language)
                    for rec in result['recommendations']
                ]
            
            return result
            
        except Exception as e:
            print(f"Error translating risk prediction: {str(e)}")
            return prediction
    
    def clear_cache(self):
        """Clear the translation cache."""
        self.cache.clear()
    
    def get_cache_size(self) -> int:
        """Get number of cached translations."""
        return len(self.cache)


# Create singleton instance
translation_service = TranslationService()
