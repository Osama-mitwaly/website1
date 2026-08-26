// ui.js: Handles Mobile Menu, Dropdowns, Scroll Animations (Intersection Observer)
// =========================================
// ui.js - User Interface Interactions
// الغرض: جميع التفاعلات في الواجهة
// يشمل: Header, Mobile Menu, Dropdowns, Scroll, Filters, Animations
// =========================================

const UI = (() => {
  // =========================================
  // Private Variables
  // =========================================
  let header, navMenu, menuToggle, menuOpen = false;
  let dropdowns = [];
  let filterButtons = [];
  let productCards = [];
  
  // =========================================
  // 1. Header Scroll Effect
  // تغيير مظهر الهيدر عند التمرير (أصغر وأكثر صلابة)
  // =========================================
  function initHeaderScroll() {
    header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true }); // passive: true لتحسين الأداء
  }
  
  // =========================================
  // 2. Mobile Menu Toggle
  // فتح/إغلاق القائمة على الموبايل
  // =========================================
  function initMobileMenu() {
    menuToggle = document.getElementById('menuToggle');
    navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      navMenu.classList.toggle('active', menuOpen);
      menuToggle.textContent = menuOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', menuOpen);
      
      // منع تمرير الصفحة عند فتح القائمة
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    
    // إغلاق القائمة عند النقر على رابط
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (menuOpen) {
          menuOpen = false;
          navMenu.classList.remove('active');
          menuToggle.textContent = '☰';
          menuToggle.setAttribute('aria-expanded', false);
          document.body.style.overflow = '';
        }
      });
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (menuOpen && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuOpen = false;
        navMenu.classList.remove('active');
        menuToggle.textContent = '☰';
        menuToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    });
  }
  
  // =========================================
  // 3. Dropdown Menus
  // القوائم المنسدلة (مثل Products)
  // =========================================
  function initDropdowns() {
    dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (!trigger) return;
      
      // Click toggle (للماوس واللمس)
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // إغلاق القوائم الأخرى
        dropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        
        dropdown.classList.toggle('active');
      });
      
      // Hover للماوس (Desktop فقط)
      if (window.matchMedia('(min-width: 768px)').matches) {
        dropdown.addEventListener('mouseenter', () => {
          dropdown.classList.add('active');
        });
        
        dropdown.addEventListener('mouseleave', () => {
          dropdown.classList.remove('active');
        });
      }
    });
    
    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  }
  
  // =========================================
  // 4. Smooth Scroll
  // التمرير السلس للروابط الداخلية (#)
  // =========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // تجاهل الروابط الفارغة أو # فقط
        if (href === '#' || href === '') return;
        
        // التحقق من وجود ?filter= في الرابط
        if (href.includes('?filter=')) {
          const [section, filter] = href.split('?');
          const target = document.querySelector(section);
          
          if (target) {
            e.preventDefault();
            
            // التمرير للقسم
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // تفعيل الفلتر بعد التمرير
            setTimeout(() => {
              const filterValue = filter.split('=')[1];
              activateFilter(filterValue);
            }, 500);
          }
          return;
        }
        
        // الروابط العادية
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // =========================================
  // 5. Intersection Observer (Fade-in Animations)
  // تأثيرات الظهور عند التمرير
  // =========================================
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // إلغاء المراقبة بعد الظهور (للأداء)
        }
      });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
  }
  
  // =========================================
  // 6. Products Filter
  // فلترة المنتجات (All, Spices, Herbs, Seeds)
  // =========================================
  function initProductsFilter() {
    filterButtons = document.querySelectorAll('.filter-btn');
    productCards = document.querySelectorAll('.product-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        activateFilter(filter);
      });
    });
    
    // قراءة الفلتر من URL عند تحميل الصفحة
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('filter');
    
    if (urlFilter) {
      activateFilter(urlFilter);
    }
  }
  
  // =========================================
  // 7. Activate Filter (Helper Function)
  // =========================================
  function activateFilter(filter) {
    // تحديث الأزرار
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    
    // فلترة المنتجات
    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.style.display = '';
        // إعادة تشغيل الأنيميشن
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
      }
    });
    
    // التمرير إلى قسم المنتجات
    const productsSection = document.getElementById('products');
    if (productsSection && window.pageYOffset > productsSection.offsetTop) {
      const headerOffset = 80;
      const elementPosition = productsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    
    console.log(`🔍 Filter activated: ${filter}`);
  }
  
  // =========================================
  // 8. Initialize All UI Components
  // =========================================
  function initUI() {
    initHeaderScroll();
    initMobileMenu();
    initDropdowns();
    initSmoothScroll();
    initScrollAnimations();
    initProductsFilter();
    
    console.log('✅ All UI components initialized');
  }
  
  // =========================================
  // Public API
  // =========================================
  return {
    initUI,
    activateFilter
  };
})();

// Expose to global scope for main.js
window.initUI = UI.initUI;
window.activateFilter = UI.activateFilter;