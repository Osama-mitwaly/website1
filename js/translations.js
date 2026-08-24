/**
 * translations.js
 * إدارة الترجمة وتبديل اللغة (عربي / إنجليزي)
 */

let currentLang = localStorage.getItem('site_lang') || 'ar';
let translationsData = {};

/**
 * استخراج القيم المتداخلة من كائن JSON
 */
function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * تحميل بيانات الترجمة
 */
async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translationsData = await response.json();
        applyTranslations();
    } catch (error) {
        console.error('فشل في تحميل ملف الترجمة:', error);
    }
}

/**
 * تطبيق الترجمات على عناصر DOM
 */
function applyTranslations() {
    // 1. تحديث اتجاه الصفحة ولغة المتصفح
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // 2. البحث عن كل عنصر يحتوي على السمة data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = getNestedValue(translationsData[currentLang], key);

        if (translatedText) {
            // التعامل مع حقول الإدخال
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translatedText;
            } 
            // التعامل مع العناصر التي تحتوي على أيقونات
            else if (element.querySelector('i')) {
                const icon = element.querySelector('i').outerHTML;
                element.innerHTML = `${icon} ${translatedText}`;
            } 
            // الحالة الافتراضية
            else {
                element.textContent = translatedText;
            }
        }
    });

    // 3. تحديث حالة أزرار تبديل اللغة
    updateLanguageButtons();
    
    // 4. إعادة تطبيق البيانات الديناميكية
    if (typeof renderNavbar === 'function') renderNavbar();
    if (typeof renderFooter === 'function') renderFooter();
    if (typeof applyDesignSettings === 'function') applyDesignSettings();
}

/**
 * تحديث مظهر أزرار اللغة
 */
function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
}

/**
 * تغيير اللغة
 */
function setLanguage(lang) {
    if (lang === 'ar' || lang === 'en') {
        currentLang = lang;
        localStorage.setItem('site_lang', currentLang);
        applyTranslations();
        
        document.body.classList.add('fade-in');
        setTimeout(() => document.body.classList.remove('fade-in'), 500);
    }
}

/**
 * تهيئة نظام الترجمة
 */
function initTranslations() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    loadTranslations();
}

// بدء التشغيل
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslations);
} else {
    initTranslations();
}