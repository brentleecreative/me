document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Theme Toggle Logic (Light / Dark)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const body = document.body;

  // Restore saved theme from localStorage
  const savedTheme = localStorage.getItem('brent_site_theme');
  if (savedTheme === 'dark') {
    body.classList.replace('light', 'dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('light')) {
      body.classList.replace('light', 'dark');
      localStorage.setItem('brent_site_theme', 'dark');
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      body.classList.replace('dark', 'light');
      localStorage.setItem('brent_site_theme', 'light');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  });

  // ==========================================================================
  // 2. Intro Animation (Meme 3D Shrink -> "Who are you?" -> Slide transitions)
  // ==========================================================================
  const introOverlay = document.getElementById('intro-overlay');
  const introStage = document.querySelector('.intro-stage');
  const skipIntroBtn = document.getElementById('skip-intro');

  let animationTimer1, animationTimer2, animationTimer3, animationTimer4;

  const runIntroAnimation = () => {
    // Step 1: Reduce meme card size in 3D perspective
    animationTimer1 = setTimeout(() => {
      introStage.classList.add('shrink-3d');
    }, 300);

    // Step 2: "Who are you?" appears bold and red over the image
    animationTimer2 = setTimeout(() => {
      introStage.classList.add('show-question');
    }, 900);

    // Step 3: Text slides upward, meme card slides downward and fades off
    animationTimer3 = setTimeout(() => {
      introStage.classList.add('slide-up');
      introStage.classList.add('slide-down');
    }, 1800);

    // Step 4: Overlay fades out cleanly to reveal main page interface
    animationTimer4 = setTimeout(() => {
      introOverlay.classList.add('fade-out');
    }, 2600);
  };

  const finishIntroImmediately = () => {
    clearTimeout(animationTimer1);
    clearTimeout(animationTimer2);
    clearTimeout(animationTimer3);
    clearTimeout(animationTimer4);
    introOverlay.classList.add('fade-out');
  };

  // Skip button or click on overlay to skip
  skipIntroBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    finishIntroImmediately();
  });

  // Start animation immediately on page refresh
  runIntroAnimation();

  // ==========================================================================
  // 3. Carousel Component (Slide Track with Active Center Focus & Touch)
  // ==========================================================================
  const trackWrapper = document.querySelector('.carousel-track-wrapper');
  const track = document.getElementById('carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const indicatorsContainer = document.getElementById('carousel-indicators');

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Build indicator dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('indicator-dot');
    if (idx === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    indicatorsContainer.appendChild(dot);
  });

  const indicatorDots = Array.from(document.querySelectorAll('.indicator-dot'));

  const updateCarousel = () => {
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    indicatorDots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Compute centering offset so the active slide is exactly in the center
    const activeSlide = slides[currentIndex];
    const wrapperWidth = trackWrapper.clientWidth;
    const slideWidth = activeSlide.offsetWidth;
    const slideOffsetLeft = activeSlide.offsetLeft;

    const targetOffset = (wrapperWidth / 2) - (slideOffsetLeft + slideWidth / 2);
    track.style.transform = `translateX(${targetOffset}px)`;
  };

  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    updateCarousel();
  };

  // Nav buttons
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Click on slide to select it
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', () => goToSlide(idx));
  });

  // Touch & Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;

  trackWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  trackWrapper.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchEndX = e.touches[0].clientX;
  }, { passive: true });

  trackWrapper.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance > 0) {
        goToSlide(currentIndex - 1); // Swipe right -> previous
      } else {
        goToSlide(currentIndex + 1); // Swipe left -> next
      }
    }
    touchStartX = 0;
    touchEndX = 0;
  });

  // Re-center on window resize
  window.addEventListener('resize', updateCarousel);
  // Initial update once images and fonts are loaded
  setTimeout(updateCarousel, 100);
  window.addEventListener('load', updateCarousel);

  // ==========================================================================
  // 4. "Click to see more ->" 2-Column Gallery Popup Modal
  // ==========================================================================
  const openGalleryBtn = document.getElementById('open-gallery-btn');
  const closeGalleryBtn = document.getElementById('close-gallery-btn');
  const galleryModal = document.getElementById('gallery-modal');

  const openGalleryModal = () => {
    galleryModal.classList.add('active');
    galleryModal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  };

  const closeGalleryModal = () => {
    galleryModal.classList.remove('active');
    galleryModal.setAttribute('aria-hidden', 'true');
    // Only restore body overflow if lightbox is not active
    if (!lightbox.classList.contains('active')) {
      body.style.overflow = '';
    }
  };

  openGalleryBtn.addEventListener('click', openGalleryModal);
  closeGalleryBtn.addEventListener('click', closeGalleryModal);

  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      closeGalleryModal();
    }
  });

  // ==========================================================================
  // 5. Lightbox for Full-Screen Width Viewing (Modal + Project Images)
  // ==========================================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = (imgElement) => {
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt || 'Expanded Image';
    lightboxCaption.textContent = imgElement.alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    // If the gallery modal is still open, keep overflow hidden
    if (!galleryModal.classList.contains('active')) {
      body.style.overflow = '';
    }
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
      }
    }, 250);
  };

  // Clicking an image in the 2-column modal expands it to fill screen width
  const modalImages = document.querySelectorAll('.gallery-item img');
  modalImages.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img));
  });

  // Clicking any project gallery image also opens the full lightbox
  const projectImages = document.querySelectorAll('.project-gallery img');
  projectImages.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxClose) {
      closeLightbox();
    }
  });

  // Keyboard accessibility (Escape key closes modals & lightbox)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox.classList.contains('active')) {
        closeLightbox();
      } else if (galleryModal.classList.contains('active')) {
        closeGalleryModal();
      } else if (!introOverlay.classList.contains('fade-out')) {
        finishIntroImmediately();
      }
    }
  });

});
