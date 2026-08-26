const translations = {
    ar: {
        brand: "نباتات الحياة",
        nav_home: "الرئيسية",
        nav_about: "من نحن",
        nav_products: "المنتجات ▾",
        cat_spices: "توابل",
        cat_herbs: "أعشاب",
        cat_seeds: "بذور",
        nav_contact: "اتصل بنا",
        hero_title: "نباتات عطرية وثمار عالية الجودة للتصدير العالمي",
        hero_desc: "نمد العالم بأجود الأعشاب والتوابل والبذور المصرية وفق أعلى المعايير الدولية.",
        btn_explore: "استكشف منتجاتنا"
    },
    en: {
        brand: "Nabatat Elhaya",
        nav_home: "Home",
        nav_about: "About Us",
        nav_products: "Products ▾",
        cat_spices: "Spices",
        cat_herbs: "Herbs",
        cat_seeds: "Seeds",
        nav_contact: "Contact Us",
        hero_title: "High-Quality Aromatic Herbs & Seeds for Global Export",
        hero_desc: "Supplying the world with premium Egyptian herbs, spices, and seeds meeting top international standards.",
        btn_explore: "Explore Products"
    }
};

let currentLang = 'ar';
const langToggler = document.getElementById('lang-toggler');

langToggler.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    langToggler.textContent = currentLang === 'ar' ? 'English' : 'عربي';

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
});