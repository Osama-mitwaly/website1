// دالة لجلب المنتجات من ملف JSON وعرضها في الصفحة
async function loadProducts() {
    const container = document.getElementById('products-container');
    
    try {
        // جلب البيانات من ملف JSON
        const response = await fetch('./data/products.json');
        
        // التحقق من نجاح العملية
        if (!response.ok) {
            throw new Error('فشل في تحميل البيانات');
        }

        const products = await response.json();
        
        // تفريغ الحاوية من نص "جاري التحميل"
        container.innerHTML = '';

        // توليد كود HTML لكل منتج
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
                            <div class="product-origin">المنشأ: <strong>${product.origin}</strong></div>
                            <a href="#contact" class="product-link">اطلب الآن ←</a>
                        </div>
                    </div>
                </div>
            `;
            // إضافة المنتج إلى الحاوية
            container.innerHTML += productCard;
        });

        // تفعيل الأنيميشن للمنتجات بعد تحميلها
        const productCards = document.querySelectorAll('.product-card');
        const productObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // إضافة تأخير زمني بسيط لكل منتج ليظهروا بالتتابع (شكل فخم جداً)
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
        container.innerHTML = '<p style="color: red;">عذراً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة لاحقاً.</p>';
    }
}

// تشغيل الدالة بمجرد تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);