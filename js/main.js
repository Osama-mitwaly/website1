/**
 * main.js
 * الملف الرئيسي - يربط كل شيء معاً
 */

let siteSettings = null;
let allProducts = [];
let currentPage = '';

/**
 * حماية من هجمات XSS
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * تحديد الصفحة الحالية
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
 * تحديث حالة الرابط النشط
 */
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.navbar-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        const href = link.getAttribute('href');
        if (href === `${currentPage}.html` || 
            (currentPage === 'home' && href === 'index.html')) {
            link.classList.add('active-link');
        }
    });
}

/**
 * تحميل البيانات العامة
 */
async function loadGlobalData() {
    try {
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

/**
 * تحديث Navbar
 */
function renderNavbar() {
    if (!siteSettings) return;
    
    const brandName = document.querySelector('.navbar-brand-name');
    if (brandName) {
        brandName.textContent = currentLang === 'ar' 
            ? siteSettings.company.name_ar 
            : siteSettings.company.name_en;
    }
    
    if (siteSettings.seo) {
        document.title = currentLang === 'ar' 
            ? siteSettings.seo.title_ar 
            : siteSettings.seo.title_en;
    }
}

/**
 * تحديث Footer
 */
function renderFooter() {
    if (!siteSettings) return;
    
    const company = siteSettings.company;
    const social = siteSettings.social;
    
    const footerCompanyName = document.querySelector('.footer-company-name');
    if (footerCompanyName) {
        footerCompanyName.textContent = currentLang === 'ar' ? company.name_ar : company.name_en;
    }
    
    const footerCompanyDesc = document.querySelector('.footer-company-desc');
    if (footerCompanyDesc) {
        footerCompanyDesc.textContent = currentLang === 'ar' 
            ? translationsData.ar.footer.company_desc 
            : translationsData.en.footer.company_desc;
    }
    
    const footerEmail = document.querySelector('.footer-email');
    if (footerEmail) {
        footerEmail.textContent = company.email;
        footerEmail.href = `mailto:${company.email}`;
    }
    
    const footerPhone = document.querySelector('.footer-phone');
    if (footerPhone) {
        footerPhone.textContent = company.phone;
        footerPhone.href = `tel:${company.phone.replace(/\s/g, '')}`;
    }
    
    const footerAddress = document.querySelector('.footer-address');
    if (footerAddress) {
        footerAddress.textContent = currentLang === 'ar' ? company.address_ar : company.address_en;
    }
    
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
    
    const copyrightName = document.querySelector('.copyright-name');
    if (copyrightName) {
        copyrightName.textContent = currentLang === 'ar' ? company.name_ar : company.name_en;
    }
}

/**
 * تطبيق إعدادات التصميم (مثل Hero Opacity)
 */
function applyDesignSettings() {
    if (!siteSettings?.design) return;
    
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroOverlay && siteSettings.design.hero_overlay_opacity !== undefined) {
        const opacity = siteSettings.design.hero_overlay_opacity;
        heroOverlay.style.background = `linear-gradient(135deg, rgba(26, 77, 46, ${opacity}) 0%, rgba(15, 40, 24, ${Math.min(opacity + 0.05, 1)}) 100%)`;
    }
    
    // تحديث صورة Hero إذا كانت متاحة
    const heroBg = document.querySelector('.hero-background');
    if (heroBg && siteSettings?.images?.hero_background) {
        heroBg.style.backgroundImage = `url('${siteSettings.images.hero_background}')`;
    }
}

/**
 * تهيئة قائمة الموبايل
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
    
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * تأثيرات ظهور العناصر عند التمرير
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

/**
 * Lazy Loading للصور
 */
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.remove('lazy-load');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * إنشاء بطاقة منتج
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card product-card grid-item';
    card.dataset.category = product.category;
    
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image-wrapper';
    
    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = product.image_url;
    img.alt = currentLang === 'ar' ? product.name_ar : product.name_en;
    img.loading = 'lazy';
    
    const badge = document.createElement('span');
    badge.className = 'card-badge';
    badge.textContent = currentLang === 'ar' 
        ? translationsData.ar.nav[product.category] 
        : translationsData.en.nav[product.category];
    
    imageWrapper.appendChild(img);
    imageWrapper.appendChild(badge);
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentLang === 'ar' ? product.name_ar : product.name_en;
    
    const description = document.createElement('p');
    description.className = 'card-description';
    description.textContent = currentLang === 'ar' ? product.description_ar : product.description_en;
    
    const specs = document.createElement('div');
    specs.className = 'card-specs';
    
    if (product.specs) {
        const specItems = [
            { icon: 'bi-shield-check', label: currentLang === 'ar' ? 'نقاوة' : 'Purity', value: product.specs.purity },
            { icon: 'bi-droplet', label: currentLang === 'ar' ? 'رطوبة' : 'Moisture', value: product.specs.moisture },
            { icon: 'bi-geo-alt', label: currentLang === 'ar' ? 'منشأ' : 'Origin', value: product.specs.origin }
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

/**
 * تهيئة الصفحة الرئيسية
 */
function initHomePage() {
    console.log('🏠 تهيئة الصفحة الرئيسية');
    
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
}

/**
 * تهيئة صفحة المنتجات
 */
function initProductsPage() {
    console.log('📦 تهيئة صفحة المنتجات');
    
    const productsGrid = document.querySelector('.products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!productsGrid) return;
    
    const renderProducts = (category = 'all') => {
        productsGrid.innerHTML = '';
        
        const filteredProducts = category === 'all' 
            ? allProducts 
            : allProducts.filter(p => p.category === category);
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">📦</div>
                    <h3 class="empty-state-title">${currentLang === 'ar' ? 'لا توجد منتجات' : 'No Products'}</h3>
                    <p class="empty-state-description">${currentLang === 'ar' ? 'لم تتم إضافة منتجات في هذه الفئة بعد' : 'No products have been added to this category yet'}</p>
                </div>
            `;
            return;
        }
        
        filteredProducts.forEach(product => {
            productsGrid.appendChild(createProductCard(product));
        });
    };
    
    renderProducts('all');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });
    
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
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
        const productField = form.querySelector('[name="product"]');
        if (productField) productField.value = productId;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="bi bi-hourglass-split"></i> ${currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}`;
        
        const formData = {
            name: form.querySelector('[name="name"]').value,
            company: form.querySelector('[name="company"]').value,
            email: form.querySelector('[name="email"]').value,
            product: form.querySelector('[name="product"]').value,
            message: form.querySelector('[name="message"]').value
        };
        
        const success = await AppAPI.submitContactForm(formData);
        
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

/**
 * تهيئة الموقع بالكامل
 */
async function init() {
    console.log('🚀 بدء تهيئة الموقع...');
    
    currentPage = detectCurrentPage();
    console.log(`📍 الصفحة الحالية: ${currentPage}`);
    
    await loadGlobalData();
    
    renderNavbar();
    renderFooter();
    applyDesignSettings();
    updateActiveNavLink();
    
    initMobileMenu();
    
    switch (currentPage) {
        case 'home':
            initHomePage();
            break;
        case 'products':
            initProductsPage();
            break;
        case 'about':
            break;
        case 'contact':
            initContactPage();
            break;
    }
    
    setTimeout(initScrollReveal, 100);
    initLazyLoading();
    
    console.log('✅ اكتملت تهيئة الموقع');
}

document.addEventListener('DOMContentLoaded', init);