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
                <div class="product-card fade-in">
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

    } catch (error) {
        console.error('Error fetching products:', error);
        container.innerHTML = '<p style="color: red;">عذراً، حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة لاحقاً.</p>';
    }
}

// تشغيل الدالة بمجرد تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadProducts);