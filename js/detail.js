/* ===== Detail Page JavaScript ===== */

// Image gallery
function changeMain(thumb, src) {
  const mainImg = document.getElementById('mainImg');
  if (mainImg && src) {
    mainImg.src = src;
    mainImg.alt = thumb.alt;
  }
  document.querySelectorAll('.thumbnails img').forEach(img => img.classList.remove('active'));
  thumb.classList.add('active');
}

// Handle image load error - show placeholder
function handleImageError(img) {
  img.style.display = 'none';
  const container = img.closest('.main-image') || img.parentElement;
  if (container && !container.querySelector('.image-placeholder')) {
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
      <p>Product Image</p>
      <small>${img.alt || 'No image available'}</small>
    `;
    container.appendChild(placeholder);
  }
}

// Tab switching
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.spec-tab');
  const panels = document.querySelectorAll('.spec-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + target)?.classList.add('active');
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Lazy load images with error handling
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // Add error handlers to all images
  document.querySelectorAll('img').forEach(img => {
    img.onerror = () => handleImageError(img);
  });
  
  // Keyboard navigation for tabs
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeTab = document.querySelector('.spec-tab.active');
      if (activeTab) {
        const tabs = Array.from(document.querySelectorAll('.spec-tab'));
        const index = tabs.indexOf(activeTab);
        const nextIndex = e.key === 'ArrowLeft' 
          ? (index - 1 + tabs.length) % tabs.length
          : (index + 1) % tabs.length;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    }
  });
  
  // Print-friendly
  if (window.matchMedia('print').matches) {
    document.querySelectorAll('.spec-panel').forEach(p => p.style.display = 'block');
  }
});
