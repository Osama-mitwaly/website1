/**
 * api.js
 * طبقة الوصول إلى البيانات (Data Access Layer)
 * مسؤول عن جلب البيانات من المصادر (حالياً JSON محلي، مستقبلاً Cloudflare KV)
 */

// كائن عام يحتوي على جميع دوال الـ API لتسهيل الاستدعاء من أي مكان
const AppAPI = {
    
    /**
     * جلب إعدادات الموقع العامة (معلومات الشركة، روابط الصور الثابتة، السوشيال ميديا)
     * @returns {Promise<Object>} بيانات الإعدادات
     */
    async getSettings() {
        try {
            // ملاحظة للمستقبل: هنا سنستبدل الرابط برابط Cloudflare Worker أو KV
            // مثال: const response = await fetch('https://api.yoursite.com/settings');
            const response = await fetch('data/settings.json');
            
            if (!response.ok) {
                throw new Error(`فشل في جلب الإعدادات: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('خطأ في AppAPI.getSettings:', error);
            // إرجاع بيانات افتراضية في حال فشل الجلب لمنع انهيار الموقع
            return {
                company: { name_ar: 'شركة الأعشاب', name_en: 'Herbs Co.', email: 'info@example.com' },
                images: {}
            };
        }
    },

    /**
     * جلب قائمة المنتجات
     * @param {string} [category] - (اختياري) تصفية المنتجات حسب الفئة (spices, herbs, seeds)
     * @returns {Promise<Array>} مصفوفة من المنتجات
     */
    async getProducts(category = null) {
        try {
            // ملاحظة للمستقبل: هنا سنستبدل الرابط برابط Cloudflare KV
            // مثال: const response = await fetch('https://api.yoursite.com/products');
            const response = await fetch('data/products.json');
            
            if (!response.ok) {
                throw new Error(`فشل في جلب المنتجات: ${response.status}`);
            }
            
            const data = await response.json();
            let products = data.products || [];

            // إذا تم تمرير فئة معينة، نقوم بتصفية النتائج
            if (category && category !== 'all') {
                products = products.filter(product => product.category === category);
            }

            return products;
        } catch (error) {
            console.error('خطأ في AppAPI.getProducts:', error);
            return []; // إرجاع مصفوفة فارغة في حال الخطأ
        }
    },

    /**
     * جلب منتج واحد بواسطة المعرف (ID)
     * @param {string} productId - معرف المنتج
     * @returns {Promise<Object|null>} بيانات المنتج أو null إذا لم يوجد
     */
    async getProductById(productId) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.id === productId) || null;
        } catch (error) {
            console.error('خطأ في AppAPI.getProductById:', error);
            return null;
        }
    },

    /**
     * إرسال نموذج التواصل (محاكاة حالياً)
     * @param {Object} formData - بيانات النموذج (الاسم، البريد، الرسالة، إلخ)
     * @returns {Promise<boolean>} true إذا تم الإرسال بنجاح
     */
    async submitContactForm(formData) {
        try {
            // محاكاة تأخير الشبكة لإعطاء شعور واقعي (يمكن إزالتها لاحقاً)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // ملاحظة للمستقبل: هنا سنربط بـ Cloudflare Worker لإرسال البريد أو حفظ البيانات
            // مثال: 
            // const response = await fetch('https://api.yoursite.com/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });
            // return response.ok;

            console.log('تم محاكاة إرسال بيانات النموذج بنجاح:', formData);
            return true;
        } catch (error) {
            console.error('خطأ في AppAPI.submitContactForm:', error);
            return false;
        }
    }
};

// تصدير الكائن للاستخدام في الملفات الأخرى (في حال استخدام Modules)
// في Vanilla JS العادي، الكائن AppAPI متاح عالمياً (Global) بمجرد تحميل هذا الملف.