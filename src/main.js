import './styles.css';
import { RobotAnimationSystem } from './robot-animation.js';
import projectsData from './projectsData.json';

// Instantiate robot animation system
const robotAnimation = new RobotAnimationSystem();
window.robotAnimationSystem = robotAnimation;

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const revealItems = document.querySelectorAll('.reveal');
const cursorGlow = document.querySelector('.cursor-glow');
const slider = document.querySelector('.project-slider');
const prevButton = document.querySelector('.slider-prev');
const nextButton = document.querySelector('.slider-next');
const dotsContainer = document.querySelector('.slider-dots');
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

const closeMenu = () => {
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
};

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

const pageViews = {
  '#home': document.getElementById('home-view'),
  '#about': document.getElementById('about-view'),
  '#service': document.getElementById('service-view'),
  '#contact': document.getElementById('contact-view')
};

let currentActivePage = '';

function getPageForHash(hash) {
  if (hash.startsWith('#contact')) return '#contact';
  if (hash.startsWith('#service')) return '#service';
  if (hash.startsWith('#about')) return '#about';
  return '#home';
}

function navigateTo(hash, instant = false) {
  const targetPage = getPageForHash(hash);
  const targetView = pageViews[targetPage];
  
  if (!targetView) return;

  closeMenu();

  if (targetPage === currentActivePage) {
    if (hash !== targetPage) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    return;
  }

  const overlay = document.querySelector('.page-transition-overlay');
  
  const updateDOM = () => {
    Object.values(pageViews).forEach(view => {
      if (view) {
        view.classList.remove('active');
        view.style.display = 'none';
      }
    });

    targetView.classList.add('active');
    targetView.style.display = 'block';
    currentActivePage = targetPage;

    // Trigger robot entrance animation
    robotAnimation.playEntrance(targetPage);

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === targetPage);
    });

    if (hash !== targetPage) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Trigger reveal animations for elements currently in viewport
    setTimeout(() => {
      document.querySelectorAll('.page-view.active .reveal').forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.1) {
          item.classList.add('is-visible');
        }
      });
    }, 100);
  };

  if (instant) {
    updateDOM();
  } else {
    overlay.classList.add('active');
    setTimeout(() => {
      updateDOM();
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 300);
    }, 400);
  }
}

// Intercept all anchor clicks for local hash routing
document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    event.preventDefault();
    window.location.hash = href;
  }
});

window.addEventListener('hashchange', () => {
  navigateTo(window.location.hash || '#home');
});

// Run router on first load
window.addEventListener('DOMContentLoaded', () => {
  navigateTo(window.location.hash || '#home', true);
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px' });

revealItems.forEach((item) => revealObserver.observe(item));

if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = event.clientX - window.innerWidth / 2;
    const y = event.clientY - window.innerHeight / 2;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.01);
      item.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
    });
  }, { passive: true });
}

function sliderStep() {
  const card = slider?.querySelector('.project-card');
  if (!card) return 350;
  return card.getBoundingClientRect().width + 18;
}

function buildSliderDots() {
  if (!slider || !dotsContainer) return;
  const cardCount = slider.querySelectorAll('.project-card').length;
  dotsContainer.innerHTML = Array.from({ length: cardCount }, (_, index) => `<span class="${index === 0 ? 'active' : ''}" data-index="${index}"></span>`).join('');
}

function updateSliderDots() {
  if (!slider || !dotsContainer) return;
  const index = Math.round(slider.scrollLeft / sliderStep());
  dotsContainer.querySelectorAll('span').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
}

prevButton?.addEventListener('click', () => slider?.scrollBy({ left: -sliderStep(), behavior: 'smooth' }));
nextButton?.addEventListener('click', () => slider?.scrollBy({ left: sliderStep(), behavior: 'smooth' }));
slider?.addEventListener('scroll', updateSliderDots, { passive: true });
buildSliderDots();

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    formStatus.textContent = 'Complete all required fields first.';
    return;
  }

  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const subject = String(data.get('subject') || '').trim();
  const message = String(data.get('message') || '').trim();

  const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
  const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  formStatus.textContent = 'Opening your email app…';
  window.location.href = `mailto:ezz.ali9939@gmail.com?subject=${mailSubject}&body=${mailBody}`;
});

document.getElementById('current-year').textContent = String(new Date().getFullYear());

// Project Details Data Map loaded from dynamically generated JSON file


// Modal and Lightbox Elements
const projectModal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-project-title');
const modalCategory = document.getElementById('modal-project-category');
const modalDescription = document.getElementById('modal-project-description');
const modalClient = document.getElementById('modal-project-client');
const modalYear = document.getElementById('modal-project-year');
const modalServices = document.getElementById('modal-project-services');
const modalTools = document.getElementById('modal-project-tools');
const modalGallery = document.getElementById('modal-project-gallery');
const modalCloseBtn = document.getElementById('modal-close-btn');

const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCloseBtn = document.getElementById('lightbox-close-btn');

// Open Lightbox
function openLightbox(imgSrc) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = imgSrc;
  lightboxModal.style.display = 'flex';
  setTimeout(() => {
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
  }, 10);
}

// Close Lightbox
function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('active');
  lightboxModal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    lightboxModal.style.display = 'none';
  }, 300);
}

// Open Project Modal
function openProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project || !projectModal) return;

  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalDescription.textContent = project.description;
  modalClient.textContent = project.client;
  modalYear.textContent = project.year;
  modalServices.textContent = project.services;
  modalTools.textContent = project.tools;

  // Clear and populate gallery
  modalGallery.innerHTML = '';
  project.images.forEach(imgSrc => {
    const item = document.createElement('div');
    item.className = 'project-modal-gallery-item';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = `${project.title} detail photo`;
    img.loading = 'lazy';
    img.onerror = (e) => {
      console.error(`Image load error for ${imgSrc}:`, e);
      const errorMsg = document.createElement('div');
      errorMsg.style.color = '#ff6b6b';
      errorMsg.style.fontSize = '12px';
      errorMsg.style.marginTop = '5px';
      errorMsg.textContent = `Error loading: ${imgSrc.split('/').pop()}`;
      item.appendChild(errorMsg);
    };

    item.appendChild(img);
    modalGallery.appendChild(item);

    item.addEventListener('click', () => openLightbox(imgSrc));
  });

  // Show Modal
  projectModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
  }, 10);
}

// Close Project Modal
function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => {
    projectModal.style.display = 'none';
  }, 400);
}

// Attach Event Listeners for Project Cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const projectId = card.dataset.projectId;
    if (projectId) {
      openProjectModal(projectId);
    }
  });
});

// Close buttons and Backdrops event listeners
modalCloseBtn?.addEventListener('click', closeProjectModal);
projectModal?.addEventListener('click', (e) => {
  if (e.target.classList.contains('project-modal-backdrop') || e.target === projectModal) {
    closeProjectModal();
  }
});

lightboxCloseBtn?.addEventListener('click', closeLightbox);
lightboxModal?.addEventListener('click', (e) => {
  if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
    closeLightbox();
  }
});

// ESC key to close modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    } else if (projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  }
});

document.getElementById('current-year').textContent = String(new Date().getFullYear());

// Space Background Canvas Parallax and Twinkling Stars
(function() {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const starsCount = 180;
  const stars = [];
  
  function createStars() {
    stars.length = 0;
    for (let i = 0; i < starsCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.012 + 0.004,
        depth: Math.random() * 0.75 + 0.25
      });
    }
  }
  createStars();

  let nebulae = [];
  function initNebulae() {
    nebulae = [
      {
        x: width * 0.25,
        y: height * 0.3,
        radius: Math.min(width, height) * 0.5,
        color: 'rgba(147, 51, 234, 0.16)', // Purple
        depth: 0.3
      },
      {
        x: width * 0.75,
        y: height * 0.6,
        radius: Math.min(width, height) * 0.55,
        color: 'rgba(79, 70, 229, 0.12)', // Indigo
        depth: 0.5
      },
      {
        x: width * 0.5,
        y: height * 0.4,
        radius: Math.min(width, height) * 0.45,
        color: 'rgba(219, 39, 119, 0.08)', // Pink/Magenta
        depth: 0.4
      }
    ];
  }
  initNebulae();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
    initNebulae();
  }, { passive: true });

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.08;
      targetY = (e.clientY - window.innerHeight / 2) * 0.08;
    }, { passive: true });
  }

  function tick() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    const scrollY = window.scrollY;

    ctx.fillStyle = '#07050d';
    ctx.fillRect(0, 0, width, height);

    // Draw Space Nebulae
    nebulae.forEach(n => {
      const offsetX = n.x - currentX * n.depth;
      const offsetY = n.y - currentY * n.depth - scrollY * n.depth * 0.25;

      const grad = ctx.createRadialGradient(
        offsetX, offsetY, 0,
        offsetX, offsetY, n.radius
      );
      grad.addColorStop(0, n.color);
      grad.addColorStop(0.5, n.color.replace('0.16', '0.06').replace('0.12', '0.04').replace('0.08', '0.02'));
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, n.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Twinkling Stars
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
      const alpha = Math.max(0.1, Math.min(1, s.alpha));

      let finalX = (s.x - currentX * s.depth) % width;
      let finalY = (s.y - currentY * s.depth - scrollY * s.depth * 0.35) % height;
      if (finalX < 0) finalX += width;
      if (finalY < 0) finalY += height;

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(finalX, finalY, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    requestAnimationFrame(tick);
  }
  tick();
})();
