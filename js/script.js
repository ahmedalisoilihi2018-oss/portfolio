/* ============================================================================
   SORA-DEV CONSULTING — Portfolio one-page
   Script principal — JavaScript vanilla (aucune dépendance)
   Sommaire :
     1. Repli du logo (image manquante -> logo texte stylé)
     2. En-tête : ombre au scroll + surlignage de la section active
     3. Menu mobile (hamburger) accessible au clavier
     4. Défilement fluide avec compensation du header sticky
     5. Révélation des blocs au scroll (IntersectionObserver)
     6. Compteurs animés (chiffres clés)
     7. Modales projets (<dialog>) : ouverture / fermeture / focus
     8. Bouton "retour en haut"
     9. Année courante dans le pied de page
   ========================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* 1. Repli du logo si l'image n'est pas (encore) disponible           */
  /* ------------------------------------------------------------------ */
  (function initLogoFallback() {
    var logoImg = document.getElementById('brand-logo');
    var fallback = document.getElementById('brand-fallback');
    if (!logoImg || !fallback) return;

    logoImg.addEventListener('error', function () {
      logoImg.hidden = true;
      fallback.hidden = false;
    });
  })();

  /* ------------------------------------------------------------------ */
  /* 2. En-tête : ombre au scroll + surlignage de la section active      */
  /* ------------------------------------------------------------------ */
  var header = document.getElementById('site-header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav__link'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));

  (function initHeaderScrollState() {
    if (!header) return;
    var toggleShadow = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    toggleShadow();
    window.addEventListener('scroll', toggleShadow, { passive: true });
  })();

  (function initActiveSectionHighlight() {
    if (!sections.length || !navLinks.length) return;

    var linkForId = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href');
      if (id && id.charAt(0) === '#') linkForId[id.slice(1)] = link;
    });

    var setActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });
      var active = linkForId[id];
      if (active) {
        active.classList.add('is-active');
        active.setAttribute('aria-current', 'true');
      }
    };

    var observer = new IntersectionObserver(function (entries) {
      // Choisit la section la plus visible parmi celles qui intersectent.
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (visible.length === 0) return;
      visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      setActive(visible[0].target.id);
    }, {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // zone d'activation centrée sous le header sticky
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (section) { observer.observe(section); });
  })();

  /* ------------------------------------------------------------------ */
  /* 3. Menu mobile (hamburger) accessible au clavier                    */
  /* ------------------------------------------------------------------ */
  (function initMobileMenu() {
    var toggle = document.getElementById('hamburger-btn');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    var closeMenu = function () {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    var openMenu = function () {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    // Ferme le menu quand un lien est activé (navigation vers une ancre).
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.primary-nav__link')) closeMenu();
    });

    // Ferme au clavier avec Échap, et rend le focus au bouton.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    // Repasse automatiquement en navigation desktop au-delà du breakpoint.
    var mq = window.matchMedia('(min-width: 960px)');
    var handleBreakpoint = function () { if (mq.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', handleBreakpoint);
    else mq.addListener(handleBreakpoint); // repli navigateurs plus anciens
  })();

  /* ------------------------------------------------------------------ */
  /* 4. Défilement fluide avec compensation du header sticky             */
  /* ------------------------------------------------------------------ */
  (function initSmoothAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        var headerH = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
        window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

        // Replace le focus sur la cible pour les utilisateurs clavier/lecteur d'écran.
        target.setAttribute('tabindex', '-1');
        target.addEventListener('blur', function handler() {
          target.removeAttribute('tabindex');
          target.removeEventListener('blur', handler);
        });
        window.setTimeout(function () { target.focus({ preventScroll: true }); }, prefersReducedMotion ? 0 : 350);
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* 5. Révélation des blocs au scroll (fade-in / slide-in)              */
  /* ------------------------------------------------------------------ */
  (function initScrollReveal() {
    var items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ------------------------------------------------------------------ */
  /* 6. Compteurs animés (chiffres clés du hero)                         */
  /* ------------------------------------------------------------------ */
  (function initCounters() {
    var counters = document.querySelectorAll('.stats__number[data-count-to]');
    if (!counters.length) return;

    var formatNumber = function (value, decimals) {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    };

    var animateCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600; // ms
      var startTime = null;

      if (prefersReducedMotion) {
        el.textContent = formatNumber(target, decimals) + suffix;
        return;
      }

      var step = function (timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Easing "ease-out" pour un ralentissement naturel en fin de course.
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = target * eased;
        el.textContent = formatNumber(current, decimals) + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  })();

  /* ------------------------------------------------------------------ */
  /* 7. Modales projets (<dialog>) : ouverture / fermeture / focus       */
  /* ------------------------------------------------------------------ */
  (function initProjectModals() {
    var openButtons = document.querySelectorAll('[data-open-modal]');
    if (!openButtons.length) return;

    var lastTrigger = null;

    var openModal = function (dialog, trigger) {
      if (!dialog || typeof dialog.showModal !== 'function') return;
      lastTrigger = trigger || null;
      dialog.showModal();
      document.body.style.overflow = 'hidden';

      // Déclenche le tracé animé du mini-graphique de tendance, s'il y en a un.
      var trend = dialog.querySelector('.trend-chart');
      if (trend) {
        trend.classList.remove('is-animated');
        // Forcer un reflow avant de réactiver la classe pour rejouer l'animation
        // à chaque ouverture (utile si l'utilisateur rouvre la même modale).
        void trend.offsetWidth;
        window.requestAnimationFrame(function () { trend.classList.add('is-animated'); });
      }

      // Place le focus sur le bouton de fermeture pour un parcours clavier clair.
      var closeBtn = dialog.querySelector('[data-close-modal]');
      if (closeBtn) closeBtn.focus();
    };

    var closeModal = function (dialog) {
      if (!dialog || !dialog.open) return;
      dialog.close();
    };

    openButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dialogId = btn.getAttribute('data-open-modal');
        var dialog = document.getElementById(dialogId);
        openModal(dialog, btn);
      });
    });

    // Permet également d'ouvrir la modale en cliquant n'importe où sur la carte.
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('button, a')) return; // évite le double-déclenchement
        var trigger = card.querySelector('[data-open-modal]');
        if (trigger) trigger.click();
      });
    });

    document.querySelectorAll('.project-modal').forEach(function (dialog) {
      // Bouton de fermeture explicite.
      dialog.querySelectorAll('[data-close-modal]').forEach(function (btn) {
        btn.addEventListener('click', function () { closeModal(dialog); });
      });

      // Clic sur le fond (::backdrop) => fermeture. On détecte un clic hors du
      // panneau ".project-modal__inner" alors que la cible est le <dialog> lui-même.
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog) closeModal(dialog);
      });

      // Restaure le focus sur l'élément déclencheur à la fermeture (accessibilité).
      dialog.addEventListener('close', function () {
        document.body.style.overflow = '';
        if (lastTrigger) lastTrigger.focus();
      });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* 8. Bouton "retour en haut"                                          */
  /* ------------------------------------------------------------------ */
  (function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var toggleVisibility = function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ------------------------------------------------------------------ */
  /* 9. Année courante dans le pied de page                              */
  /* ------------------------------------------------------------------ */
  (function initFooterYear() {
    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  })();

})();
