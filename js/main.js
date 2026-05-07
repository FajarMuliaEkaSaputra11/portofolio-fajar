// assets/js/main.js

// Navbar toggle functions for mobile hamburger
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  console.log('toggleMenu called, isOpen=', isOpen);
  const icon = document.querySelector('.hamburger i');
  const hamb = document.querySelector('.hamburger');
  if (icon) {
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  }
  if (hamb) hamb.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeMenu() {
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  if (nav.classList.contains('open')) nav.classList.remove('open');
  const icon = document.querySelector('.hamburger i');
  const hamb = document.querySelector('.hamburger');
  if (icon) {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
  if (hamb) hamb.setAttribute('aria-expanded', 'false');
}

// smooth scroll untuk link navbar
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: 'smooth'
    });
  });
});

// Ensure hamburger and nav links work even if inline handlers fail
document.addEventListener('DOMContentLoaded', () => {
  const hamb = document.querySelector('.hamburger');
  if (hamb) {
    hamb.addEventListener('click', toggleMenu);
    hamb.setAttribute('aria-expanded', 'false');
    hamb.setAttribute('role', 'button');
    hamb.setAttribute('aria-label', 'Toggle navigation');
    console.log('hamburger initialized', hamb);
  } else {
    console.log('hamburger element NOT found');
  }

  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      // close mobile menu after clicking a nav link
      closeMenu();
    });
  });
});

// Show clock in header on small screens (replace hamburger visually)
function ensureMobileClock() {
  const container = document.querySelector('.nav-content');
  if (!container) return;
  const existing = container.querySelector('.mobile-clock');
  if (window.innerWidth <= 900) {
    // hide hamburger visually (we may still keep it in DOM)
    const hamb = container.querySelector('.hamburger');
    if (hamb) hamb.style.display = 'none';

    if (!existing) {
      const clockSrc = document.getElementById('clock');
      const clone = document.createElement('div');
      clone.className = 'clock-badge mobile-clock';
      clone.style.marginLeft = '0';
      clone.textContent = clockSrc ? clockSrc.textContent : '--:-- WIB';
      container.appendChild(clone);
    }
  } else {
    // restore hamburger
    const hamb = container.querySelector('.hamburger');
    if (hamb) hamb.style.display = '';
    if (existing) existing.remove();
  }
}

// Keep mobile clock in sync with main clock
function updateMobileClockText(text) {
  const mobile = document.querySelector('.mobile-clock');
  if (mobile) mobile.textContent = text;
}

// run on load and resize
window.addEventListener('resize', ensureMobileClock);
document.addEventListener('DOMContentLoaded', ensureMobileClock);


// Marquee certificates: ensure seamless, non-stuttering loop
document.addEventListener('DOMContentLoaded', () => {
  const marquee = document.querySelector('.cert-marquee');
  if (!marquee) return;
  const track = marquee.querySelector('.cert-track');
  if (!track) return;

  // wait for images to load so measurements are accurate
  const imgs = track.querySelectorAll('img');
  const imgPromises = Array.from(imgs).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => img.addEventListener('load', resolve));
  });

  Promise.all(imgPromises).then(initMarquee).catch(initMarquee);

  function initMarquee() {
    // duplicate content at least once (so we have two identical halves)
    const original = track.innerHTML;
    if (!original) return;
    // ensure enough content to cover continuous scroll
    track.innerHTML = original + original;

    // if still not wide enough, append more copies until large enough
    while (track.scrollWidth < marquee.clientWidth * 2) {
      track.innerHTML += original;
    }

    // compute exact scroll distance (half of the track's full scrollWidth)
    const distance = track.scrollWidth / 2;

    // set CSS variables used by the animation
    track.style.setProperty('--scroll-distance', `${distance}px`);

    // set duration dynamically for smoothness (pixels per second)
    const speed = 120; // px per second — tweak to desired speed
    const duration = Math.max(6, distance / speed); // minimum duration for stability
    track.style.setProperty('--marquee-duration', `${duration}s`);

    // make sure animation restarts cleanly
    track.style.animation = 'none';
    // force reflow then restore animation
    void track.offsetWidth;
    track.style.animation = '';
  }
});

// Wrap all images with a wrapper to show lightning OUTSIDE the image
function wrapAllImages() {
  const imgs = document.querySelectorAll('img');
  imgs.forEach(img => {
    // skip images already inside a wrapper we control
    if (img.closest('.img-light') || img.closest('.cert-card')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'img-light';
    // preserve image layout by copying display/width styles if inline
    const parent = img.parentNode;
    parent.replaceChild(wrapper, img);
    wrapper.appendChild(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  wrapAllImages();
});

