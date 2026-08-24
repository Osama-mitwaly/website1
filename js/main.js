/**
 * main.js
 * الملف الرئيسي - يربط كل شيء معاً
 */

// ===================================
// 1. المتغيرات العامة
// ===================================
let siteSettings = null;
let allProducts = [];
let currentPage = '';

// ===================================
// 2. دوال مساعدة (Helpers)
// ===================================

/**
 * حماية من هجمات XSS - تنظيف النصوص قبل عرضها
 * @param {string} str - النص المراد تنظيفه
 * @returns {string} نص آمن
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * تحديد الصفحة الحالية من اسم الملف
 */
function detectCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop() || 'index.html';
    
    if (fileName === 'index.html' || fileName === '') return 'home';
    if (fileName === 'products.html') return 'products';
    if (fileName === 'about.html') return 'about';
    if (fileName === 'contact.html') return 'contact';
    return 'home';
}

/**
 * تحديث حالة الرابط النشط في شريط التنقل
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `${currentPage}.html`) {
            link.classList.add('active-link');
        }
    });
}

// ===================================
// 3. تحميل البيانات العامة
// ===================================

/**
 * تحميل البيانات المشتركة (الإعدادات + المنتجات)
 */
async function loadGlobalData() {
    try {
        // تحميل الإعدادات والمنتجات بالتوازي (أسرع)
        const [settings, products] = await Promise.all([
            AppAPI.getSettings(),
            AppAPI.getProducts()
        ]);
        
        siteSettings = settings;
        allProducts = products;
        
        console.log('✅ تم تحميل البيانات بنجاح');
    } catch (error) {
        console.error('❌ فشل في تحميل البيانات:', error);
    }
}

// ===================================
// 4. المكونات المشتركة (Navbar & Footer)
// ===================================

/**
 * تحديث معلومات الشركة في الـ Footer
 */
function renderFooter() {
    if (!siteSettings) return;
    
    const company = siteSettings.company;
    const social = siteSettings.social;
    
    // تحديث اسم الشركة
    const footerCompanyName = document.querySelector('.footer-company-name');
    if (footerCompanyName) {
        footerCompanyName.textContent = currentLang === 'ar' ? company.name_ar : company.name_en;
    }
    
    // تحديث معلومات الاتصال
    const footerEmail = document.querySelector('.footer-email');
    if (footerEmail) footerEmail.textContent = company.email;
    
    const footerPhone = document.querySelector('.footer-phone');
    if (footerPhone) footerPhone.textContent = company.phone;
    
    const footerAddress = document.querySelector('.footer-address');
    if (footerAddress) {
        footerAddress.textContent = currentLang === 'ar' ? company.address_ar : company.address_en;
    }
    
    // تحديث روابط السوشيال ميديا
    if (social) {
        const socialLinks = {
            facebook: document.querySelector('.social-facebook'),
            instagram: document.querySelector('.social-instagram'),
            linkedin: document.querySelector('.social-linkedin'),
            twitter: document.querySelector('.social-twitter')
        };
        
        Object.keys(socialLinks).forEach(platform => {
            if (socialLinks[platform] && social[platform]) {
                socialLinks[platform].href = social[platform];
            }
        });
    }
}

/**
 * تحديث اسم الشركة في الـ Navbar
 */
function renderNavbar() {
    if (!siteSettings) return;
    
    const brandName = document.querySelector('.navbar-brand-name');
    if (brandName) {
        brandName.textContent = currentLang === 'ar' 
            ? siteSettings.company.name_ar 
            : siteSettings.company.name_en;
    }
}

// ===================================
// 5. التفاعلات (Interactions)
// ===================================

/**
 * تهيئة قائمة الموبايل (Hamburger Menu)
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.mobile-menu-close');
    
    if (!toggle || !menu) return;
    
    const openMenu = () => {
        menu.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    
    const closeMenu = () => {
        menu.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };
    
    toggle.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    
    // إغلاق القائمة عند النقر على رابط
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * تأثيرات ظهور العناصر عند التمرير (Scroll Reveal)
 */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// 6. دوال إنشاء العناصر (Renderers)
// ===================================

/**
 * إنشاء بطاقة منتج واحدة
 * @param {Object} product - بيانات المنتج
 * @returns {HTMLElement} عنصر DOM للبطاقة
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card product-card grid-item';
    card.dataset.category = product.category;
    
    // الصورة
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image-wrapper';
    
    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = product.image_url;
    img.alt = currentLang === 'ar' ? product.name_ar : product.name_en;
    img.loading = 'lazy'; // Lazy loading للأداء
    
    const badge = document.createElement('span');
    badge.className = 'card-badge';
    badge.textContent = currentLang === 'ar' 
        ? translationsData.ar.nav[product.category] 
        : translationsData.en.nav[product.category];
    
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(badge);
    
    // المحتوى
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentLang === 'ar' ? product.name_ar : product.name_en;
    
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = currentLang === 'ar' ? product.description_ar : product.description_en;
    
    // المواصفات
    const specs = document.createElement('div');
    specs.className = 'card-specs';
    
    if (product.specs) {
        const specItems = [
            { icon: 'bi-shield-check', label: 'نقاوة', value: product.specs.purity },
            { icon: 'bi-droplet', label: 'رطوبة', value: product.specs.moisture },
            { icon: 'bi-geo-alt', label: 'منشأ', value: product.specs.origin }
        ];
        
        specItems.forEach(spec => {
            if (spec.value) {
                const item = document.createElement('div');
                item.className = 'spec-item';
                
                const icon = document.createElement('i');
                icon.className = `bi ${spec.icon}`;
                
                const label = document.createElement('strong');
                label.textContent = spec.label + ':';
                
                const value = document.createElement('span');
                value.textContent = spec.value;
                
                item.appendChild(icon);
                item.appendChild(label);
                item.appendChild(value);
                specs.appendChild(item);
            }
        });
    }
    
    // زر الطلب
    const btn = document.createElement('a');
    btn.className = 'btn btn-outline btn-sm';
    btn.href = `contact.html?product=${encodeURIComponent(product.id)}`;
    btn.textContent = currentLang === 'ar' ? 'اطلب عرض سعر' : 'Request Quote';
    
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(specs);
    content.appendChild(btn);
    
    card.appendChild(imageWrapper);
    card.appendChild(content);
    
    return card;
}

/**
 * إنشاء بطاقة فئة
 */
function createCategoryCard(category, imageUrl) {
    const card = document.createElement('a');
    card.className = 'card category-card scroll-reveal';
    card.href = `products.html?category=${category}`;
    
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image-wrapper';
    
    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = imageUrl;
    img.alt = category;
    img.loading = 'lazy';
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentLang === 'ar' 
        ? translationsData.ar.home[`category_${category}`]
        : translationsData.en.home[`category_${category}`];
    
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = currentLang === 'ar'
        ? translationsData.ar.home[`category_desc_${category}`]
        : translationsData.en.home[`category_desc_${category}`];
    
    content.appendChild(title);
    content.appendChild(description);
    imageWrapper.appendChild(img);
    card.appendChild(imageWrapper);
    card.appendChild(content);
    
    return card;
}

// ===================================
// 7. منطق الصفحات (Page Logic)
// ===================================

/**
 * تهيئة الصفحة الرئيسية
 */
function initHomePage() {
    console.log('🏠 تهيئة الصفحة الرئيسية');
    
    // عرض الفئات الثلاث
    const categoriesGrid = document.querySelector('.categories-grid');
    if (categoriesGrid && siteSettings?.images) {
        const categories = ['spices', 'herbs', 'seeds'];
        categories.forEach(cat => {
            const imageUrl = siteSettings.images[`category_${cat}`] || '';
            if (imageUrl) {
                categoriesGrid.appendChild(createCategoryCard(cat, imageUrl));
            }
        });
    }
    
    // تحديث خلفية Hero إذا كانت متاحة
    const heroBg = document.querySelector('.hero-background');
    if (heroBg && siteSettings?.images?.hero_background) {
        heroBg.style.backgroundImage = `url('${siteSettings.images.hero_background}')`;
    }
}

/**
 * تهيئة صفحة المنتجات
 */
function initProductsPage() {
    console.log('📦 تهيئة صفحة المنتجات');
    
    const productsGrid = document.querySelector('.products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productsGrid) return;
    
    // دالة لعرض المنتجات
    const renderProducts = (category = 'all') => {
        productsGrid.innerHTML = '';
        
        const filteredProducts = category === 'all' 
            ? allProducts 
            : allProducts.filter(p => p.category === category);
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">📦</div>
                    <h3 class="empty-state-title">لا توجد منتجات</h3>
                    <p class="empty-state-description">لم تتم إضافة منتجات في هذه الفئة بعد</p>
                </div>
            `;
            return;
        }
        
        filteredProducts.forEach(product => {
            productsGrid.appendChild(createProductCard(product));
        });
    };
    
    // عرض كل المنتجات افتراضياً
    renderProducts('all');
    
    // ربط أزرار الفلتر
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });
    
    // التحقق من وجود فلتر في الرابط (من صفحة الفئات)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    if (categoryFilter) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${categoryFilter}"]`);
        if (targetBtn) targetBtn.click();
    }
}

/**
 * تهيئة صفحة التواصل
 */
function initContactPage() {
    console.log('📞 تهيئة صفحة التواصل');
    
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    // التحقق من وجود منتج محدد في الرابط
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
        const productField = form.querySelector('[name="product"]');
        if (productField) productField.value = productId;
    }
    
    // معالجة إرسال النموذج
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // حالة التحميل
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> جاري الإرسال...';
        
        // جمع البيانات
        const formData = {
            name: form.querySelector('[name="name"]').value,
            company: form.querySelector('[name="company"]').value,
            email: form.querySelector('[name="email"]').value,
            product: form.querySelector('[name="product"]').value,
            message: form.querySelector('[name="message"]').value
        };
        
        // إرسال البيانات
        const success = await AppAPI.submitContactForm(formData);
        
        // استعادة الزر
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (success) {
            alert(currentLang === 'ar' 
                ? '✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً' 
                : '✅ Your request has been sent successfully! We will contact you soon');
            form.reset();
        } else {
            alert(currentLang === 'ar' 
                ? '❌ حدث خطأ أثناء الإرسال. حاول مرة أخرى' 
                : '❌ An error occurred. Please try again');
        }
    });
}

// ===================================
// 8. نقطة الدخول الرئيسية
// ===================================

/**
 * تهيئة الموقع بالكامل
 */
async function init() {
    console.log('🚀 بدء تهيئة الموقع...');
    
    // تحديد الصفحة الحالية
    currentPage = detectCurrentPage();
    console.log(`📍 الصفحة الحالية: ${currentPage}`);
    
    // تحميل البيانات العامة
    await loadGlobalData();
    
    // تحديث المكونات المشتركة
    renderNavbar();
    renderFooter();
    updateActiveNavLink();
    
    // تهيئة التفاعلات
    initMobileMenu();
    
    // تهيئة الصفحة المحددة
    switch (currentPage) {
        case 'home':
            initHomePage();
            break;
        case 'products':
            initProductsPage();
            break;
        case 'about':
            // صفحة بسيطة، لا تحتاج تهيئة خاصة حالياً
            break;
        case 'contact':
            initContactPage();
            break;
    }
    
    // تهيئة تأثيرات التمرير (يجب أن تكون في النهاية)
    setTimeout(initScrollReveal, 100);
    
    console.log('✅ اكتملت تهيئة الموقع');
}

// بدء التشغيل
document.addEventListener('DOMContentLoaded', init);