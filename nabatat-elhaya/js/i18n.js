// i18n.js: Handles language switching (EN/AR) and localStorage persistence
// =========================================
// i18n.js - Internationalization System
// الغرض: نظام الترجمة الثنائية اللغة (EN/AR)
// يدعم: localStorage, URL parameters, dynamic translation
// =========================================

const I18n = (() => {
  // =========================================
  // Private Variables
  // =========================================
  let translations = {};
  let currentLang = 'en';
  const DEFAULT_LANG = 'en';
  const STORAGE_KEY = 'nabatat_lang';
  
  // =========================================
  // 1. Load Translations from JSON
  // =========================================
  async function loadTranslations() {
    try {
      const response = await fetch('data/translations.json');
      if (!response.ok) throw new Error('Failed to load translations');
      translations = await response.json();
      console.log('✅ Translations loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error loading translations:', error);
      // Fallback: use English texts already in HTML
      return false;
    }
  }
  
  // =========================================
  // 2. Detect Language Priority
  // Priority: URL parameter > localStorage > browser language > default
  // =========================================
  function detectLanguage() {
    // 1. Check URL parameter (?lang=ar)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && translations[urlLang]) {
      return urlLang;
    }
    
    // 2. Check localStorage
    const storedLang = localStorage.getItem(STORAGE_KEY);
    if (storedLang && translations[storedLang]) {
      return storedLang;
    }
    
    // 3. Check browser language (optional)
    const browserLang = navigator.language.split('-')[0];
    if (browserLang && translations[browserLang]) {
      return browserLang;
    }
    
    // 4. Default language
    return DEFAULT_LANG;
  }
  
  // =========================================
  // 3. Apply Translations to DOM
  // =========================================
  function applyTranslations() {
    if (!translations[currentLang]) {
      console.warn('⚠️ No translations found for:', currentLang);
      return;
    }
    
    const langData = translations[currentLang];
    
    // Update HTML lang and dir attributes
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all elements with data-i18n attribute (textContent)
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (langData[key]) {
        // Check if text contains HTML tags (like <br>, <strong>)
        if (langData[key].includes('<')) {
          element.innerHTML = langData[key];
        } else {
          element.textContent = langData[key];
        }
      }
    });
    
    // Update placeholders (data-i18n-placeholder)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (langData[key]) {
        element.placeholder = langData[key];
      }
    });
    
    // Update page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement && langData[titleElement.getAttribute('data-i18n')]) {
      document.title = langData[titleElement.getAttribute('data-i18n')];
    }
    
    // Update meta description (if needed)
    const metaDesc = document.querySelector('meta[name="description"][data-i18n-content]');
    if (metaDesc && langData[metaDesc.getAttribute('data-i18n-content')]) {
      metaDesc.content = langData[metaDesc.getAttribute('data-i18n-content')];
    }
    
    // Update active state of language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, currentLang);
    
    console.log(`🌍 Language switched to: ${currentLang.toUpperCase()}`);
  }
  
  // =========================================
  // 4. Switch Language Manually
  // =========================================
  function switchLanguage(lang) {
    if (translations[lang]) {
      currentLang = lang;
      applyTranslations();
    } else {
      console.warn('⚠️ Language not supported:', lang);
    }
  }
  
  // =========================================
  // 5. Bind Language Buttons
  // =========================================
  function bindLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });
  }
  
  // =========================================
  // 6. Initialize i18n System
  // =========================================
  async function initI18n() {
    // Load translations first
    const loaded = await loadTranslations();
    
    if (loaded) {
      // Detect language
      currentLang = detectLanguage();
      
      // Apply translations
      applyTranslations();
      
      // Bind language buttons
      bindLanguageButtons();
    } else {
      console.warn('⚠️ Running without translations - using HTML defaults');
    }
  }
  
  // =========================================
  // Public API
  // =========================================
  return {
    initI18n,
    switchLanguage,
    getCurrentLang: () => currentLang
  };
})();

// Expose to global scope for main.js
window.initI18n = I18n.initI18n;
window.switchLanguage = I18n.switchLanguage;