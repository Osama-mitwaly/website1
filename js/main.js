document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تأثير تصغير شريط التنقل (Header) عند التمرير
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. مراقب التمرير لإظهار العناصر بنعومة (Scroll Reveal)
    // نحدد العناصر التي نريد تطبيق الحركة عليها
    const animatedElements = document.querySelectorAll('.section-header, .about-content, .about-image, .contact-info, .contact-form');
    
    // نضيف كلاس الإخفاء المبدئي لكل هذه العناصر
    animatedElements.forEach(el => el.classList.add('fade-up'));

    // إعدادات المراقب (متى يظهر العنصر؟ عندما يظهر 15% منه على الشاشة)
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // إظهار العنصر
                observer.unobserve(entry.target);      // إيقاف المراقبة بعد ظهوره (لكي لا يتكرر)
            }
        });
    }, observerOptions);

    // تفعيل المراقبة على العناصر
    animatedElements.forEach(el => observer.observe(el));

    // 3. برمجة نموذج الاتصال لفتح تطبيق الإيميل
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضي

            // جلب البيانات التي كتبها العميل من الحقول
            const name = document.getElementById('clientName').value;
            const email = document.getElementById('clientEmail').value;
            const message = document.getElementById('clientMessage').value;

            // الإيميل الخاص بك لاستقبال الرسائل
            const receiverEmail = 'alsayed0852.as@gmail.com';
            
            // تحديد لغة الصفحة لتخصيص عنوان الرسالة
            const currentLang = document.documentElement.lang;
            const subjectTitle = currentLang === 'en' ? 'New Inquiry from Nabatat Elhaya -' : 'طلب تواصل جديد من موقع نباتات الحياة -';
            
            // تشفير النصوص لكي تقرأها تطبيقات الإيميل بشكل صحيح (لمنع الأخطاء مع المسافات والحروف العربية)
            const subject = encodeURIComponent(`${subjectTitle} ${name}`);
            const body = encodeURIComponent(`الاسم / Name: ${name}\nالبريد / Email: ${email}\n\nالرسالة / Message:\n${message}`);

            // أمر فتح تطبيق الإيميل الافتراضي في جهاز المستخدم مع تعبئة البيانات
            window.location.href = `mailto:${receiverEmail}?subject=${subject}&body=${body}`;
        });
    }

});