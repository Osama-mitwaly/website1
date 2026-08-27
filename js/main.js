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
});