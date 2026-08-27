// =========================================
// ui.js - User Interface Interactions
// =========================================

const UI = (() => {
  let header, navMenu, menuToggle, menuOpen = false;
  let dropdowns = [];
  let filterButtons = [];
  let productCards = [];
  
  // 1. Header Scroll Effect
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
    }, { passive: true });
  }
  
  // 2. Mobile Menu Toggle
  function initMobileMenu() {
    menuToggle = document.getElementById('menuToggle');
    navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
      menuOpen = !menuOpen;
      navMenu.classList.toggle('active', menuOpen);
      menuToggle.textContent = menuOpen ? '✕' : '☰';
      menuToggle.setAttribute('aria-expanded', menuOpen);
      
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    
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
  
  // 3. Dropdown Menus
  function initDropdowns() {
    dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (!trigger) return;
      
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        dropdowns.forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });
        
        dropdown.classList.toggle('active');
      });
      
      if (window.matchMedia('(min-width: 768px)').matches) {
        dropdown.addEventListener('mouseenter', () => {
          dropdown.classList.add('active');
        });
        
        dropdown.addEventListener('mouseleave', () => {
          dropdown.classList.remove('active');
        });
      }
    });
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(d => d.classList.remove('active'));
      }
    });
  }
  
  // 4. Smooth Scroll
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '') return;
        
        if (href.includes('?filter=')) {
          const [section, filter] = href.split('?');
          const target = document.querySelector(section);
          
          if (target) {
            e.preventDefault();
            
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            setTimeout(() => {
              const filterValue = filter.split('=')[1];
              activateFilter(filterValue);
            }, 500);
          }
          return;
        }
        
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
  
  // 5. Intersection Observer (Fade-in Animations)
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
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));
  }
  
  // 6. Products Filter
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
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlFilter = urlParams.get('filter');
    
    if (urlFilter) {
      activateFilter(urlFilter);
    }
  }
  
  // 7. Activate Filter (Helper Function)
  function activateFilter(filter) {
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });
    
    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        card.style.display = '';
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
      }
    });
    
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
  
  // 8. Initialize All UI Components
  function initUI() {
    initHeaderScroll();
    initMobileMenu();
    initDropdowns();
    initSmoothScroll();
    initScrollAnimations();
    initProductsFilter();
    
    console.log('✅ All UI components initialized');
  }
  
  return {
    initUI,
    activateFilter
  };
})();

window.initUI = UI.initUI;
window.activateFilter = UI.activateFilter;
