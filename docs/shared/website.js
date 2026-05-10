/**
 * MCP and the Road Not Taken — Website JavaScript
 * 
 * Handles:
 * 1. Reading progress bar
 * 2. Active TOC section highlighting (IntersectionObserver)
 * 3. Mobile TOC drawer toggle
 * 4. Smooth scroll for TOC links
 */

(function () {
  'use strict';

  // ── Progress Bar ──
  const progressBar = document.getElementById('progress');

  function updateProgress() {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();


  // ── Active TOC Section ──
  const tocLinks = document.querySelectorAll('.toc__link[data-section]');
  const sections = [];

  tocLinks.forEach(function (link) {
    const secNum = link.getAttribute('data-section');
    // Map section numbers to their DOM ids
    // §1-9 → section-1 through section-9
    // §1.1 → section-1-1
    // §10-12 → section-10 through section-12
    // addendum → addendum, appendix → appendix
    const idMap = {
      '1': 'section-1',
      '1.1': 'section-1-1',
      '2': 'section-2',
      '3': 'section-3',
      '4': 'section-4',
      '5': 'section-5',
      '6': 'section-6',
      '7': 'section-7',
      '8': 'section-8',
      '9': 'section-9',
      '10': 'section-10',
      '11': 'section-11',
      '12': 'section-12',
      'add': 'addendum',
      'app': 'appendix'
    };
    const targetId = idMap[secNum];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        sections.push({ el: el, link: link });
      }
    }
  });

  // Use IntersectionObserver to track which section is visible
  let currentActive = null;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Find the link for this section
        const match = sections.find(function (s) { return s.el === entry.target; });
        if (match) {
          if (currentActive) {
            currentActive.classList.remove('toc__link--active');
          }
          match.link.classList.add('toc__link--active');
          currentActive = match.link;
        }
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',  // Trigger when section enters top 30% of viewport
    threshold: 0
  });

  sections.forEach(function (s) {
    observer.observe(s.el);
  });


  // ── Mobile TOC Drawer ──
  const tocToggle = document.querySelector('.toc-toggle');
  const tocNav = document.getElementById('toc');
  const tocOverlay = document.querySelector('.toc-overlay');

  function openToc() {
    if (tocNav) tocNav.classList.add('toc--open');
    if (tocOverlay) tocOverlay.classList.add('toc-overlay--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeToc() {
    if (tocNav) tocNav.classList.remove('toc--open');
    if (tocOverlay) tocOverlay.classList.remove('toc-overlay--visible');
    document.body.style.overflow = '';
  }

  if (tocToggle) {
    tocToggle.addEventListener('click', openToc);
  }
  if (tocOverlay) {
    tocOverlay.addEventListener('click', closeToc);
  }

  // Close TOC drawer when a TOC link is clicked (mobile)
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 900) {
        closeToc();
      }
    });
  });


  // ── External Links ──
  // Open external links in new tab
  document.querySelectorAll('.essay a[href^="http"]').forEach(function (link) {
    if (!link.hostname || link.hostname !== window.location.hostname) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

})();