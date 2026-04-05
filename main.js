document.addEventListener('DOMContentLoaded', () => {

  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const body = document.body;

  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    body.classList.replace('light', 'dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light')) {
      // Switch to Dark
      body.classList.replace('light', 'dark');
      localStorage.setItem('theme', 'dark');
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      // Switch to Light
      body.classList.replace('dark', 'light');
      localStorage.setItem('theme', 'light');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  });

  // --- Intersection Observer for Scroll Animations ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Element triggers when 15% is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Add 'visible' class when element comes into view
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animating if you only want it to animate once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => {
    observer.observe(el);
  });

});
