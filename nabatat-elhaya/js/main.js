// =========================================
// main.js - Application Entry Point
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM Loaded Successfully');
  
  // 1. Load Shared Components (Header & Footer)
  if (window.Components) {
    window.Components.loadComponents();
    window.Components.highlightActiveNav();
    console.log('✅ Shared Components Loaded');
  }
  
  // 2. Initialize i18n
  if (typeof initI18n === 'function') {
    initI18n();
    console.log('✅ i18n System Initialized');
  }
  
  // 3. Initialize UI
  if (typeof initUI === 'function') {
    initUI();
    console.log('✅ UI Components Initialized');
  }
  
  console.log('🚀 Nabatat Elhaya Application Ready');
});