/**
 * translations.js
 * إدارة الترجمة وتبديل اللغة (عربي / إنجليزي)
 */

// المتغيرات العامة لحالة اللغة والبيانات
let currentLang = localStorage.getItem('site_lang') || 'ar';
let translationsData = {};

/**
 * دالة مساعدة لاستخراج القيم المتداخلة من كائن JSON
 * مثال: getNestedValue(obj, "nav.home") يرجع قيمة "الرئيسية"
 */
function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * تحميل بيانات الترجمة من ملف JSON
 */
async function loadTranslations() {
    try {
        const response = await fetch('data/translations.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translationsData = await response.json();
        
        // بعد التحميل، طبق الترجمات على الصفحة
        applyTranslations();
    } catch (error) {
        console.error('فشل في تحميل ملف الترجمة:', error);
    }
}

/**
 * تطبيق الترجمات على عناصر DOM
 */
function applyTranslations() {
    // 1. تحديث اتجاه الصفحة ولغة المتصفح للـ SEO و Accessibility
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // 2. البحث عن كل عنصر يحتوي على السمة data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translatedText = getNestedValue(translationsData[currentLang], key);

        if (translatedText) {
            // التعامل مع حقول الإدخال (تحديث الـ placeholder بدلاً من النص)
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translatedText;
            } 
            // التعامل مع الأزرار أو الروابط التي قد تحتوي على أيقونات داخلية
            else if (element.children.length > 0 && element.children[0].tagName === 'I') {
                // الحفاظ على الأيقونة وتحديث النص فقط
                const icon = element.children[0].outerHTML;
                element.innerHTML = `${icon} ${translatedText}`;
            } 
            // الحالة الافتراضية: تحديث النص العادي
            else {
                element.textContent = translatedText;
            }
        }
    });

    // 3. تحديث حالة أزرار تبديل اللغة (Active State)
    updateLanguageButtons();
}

/**
 * تحديث مظهر أزرار اللغة لتعكس اللغة الحالية
 */
function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        // إزالة الكلاس النشط من جميع الأزرار
        btn.classList.remove('active');
        
        // إضافة الكلاس النشط للزر المطابق للغة الحالية
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        }
    });
}

/**
 * تغيير اللغة وحفظ الاختيار في localStorage
 * @param {string} lang - 'ar' أو 'en'
 */
function setLanguage(lang) {
    if (lang === 'ar' || lang === 'en') {
        currentLang = lang;
        localStorage.setItem('site_lang', currentLang);
        applyTranslations();
        
        // إضافة تأثير بصري بسيط عند التبديل (اختياري)
        document.body.classList.add('fade-in');
        setTimeout(() => document.body.classList.remove('fade-in'), 500);
    }
}

/**
 * تهيئة نظام الترجمة عند تحميل الصفحة
 */
function initTranslations() {
    // ربط أحداث النقر بأزرار تبديل اللغة
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // بدء عملية التحميل
    loadTranslations();
}

// تشغيل التهيئة فوراً عند تحميل السكريبت
// نستخدم DOMContentLoaded للتأكد من أن عناصر HTML جاهزة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslations);
} else {
    initTranslations();
}