// دالة لجلب المنتجات من ملف JSON وعرضها في الصفحة
async function loadProducts() {
    const container = document.getElementById('products-container');
    
    // 🔥 استكشاف لغة الصفحة الحالية (عربي أم إنجليزي)
    const currentLang = document.documentElement.lang; 
    
    // تحديد مسار الملف والنصوص بناءً على اللغة
    const jsonPath = currentLang === 'en' ? './data/products-en.json' : './data/products.json';
    const originText = currentLang === 'en' ? 'Origin:' : 'المنشأ:';
    const orderText = currentLang === 'en' ? 'Order Now &rarr;' : 'اطلب الآن &larr;';
    
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error('فشل في تحميل البيانات / Failed to load data');
        
        const products = await response.json();
        container.innerHTML = '';

        products.forEach(product => {
            const productCard = `
                <div class="product-card fade-up">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-footer">
                            <div class="product-origin">${originText} <strong>${product.origin}</strong></div>
                            <a href="#contact" class="product-link">${orderText}</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });

        const productCards = document.querySelectorAll('.product-card');
        const productObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); 
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        productCards.forEach(card => productObserver.observe(card));

    } catch (error) {
        console.error('Error fetching products:', error);
        container.innerHTML = '<p style="color: red;">عذراً، حدث خطأ أثناء تحميل المنتجات.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);