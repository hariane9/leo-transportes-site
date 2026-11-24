/* =========================================================
   LEO Transportes & Mudanças — script.js
   JavaScript puro (sem dependências externas)
   ========================================================= */

/* =========================================================
   CONFIGURAÇÃO EMAILJS
   ---------------------------------------------------------
   Preencha aqui as 3 chaves da sua conta EmailJS
   (https://www.emailjs.com) para ativar o envio real do
   formulário de orçamento. Sem backend, sem SMTP — funciona
   em Cloudflare Pages, GitHub Pages e também localmente.

   Instruções passo a passo em: README_EMAILJS.md

     1. EMAILJS_PUBLIC_KEY  → Account > General > Public Key
     2. EMAILJS_SERVICE_ID  → Email Services > (o seu serviço Gmail)
     3. EMAILJS_TEMPLATE_ID → Email Templates > (o seu template)

   Enquanto as 3 constantes abaixo estiverem vazias (""), o
   formulário funciona em modo de simulação local: valida os
   campos e mostra a mensagem de sucesso, mas não envia nenhum
   email. Isto permite testar o site localmente antes de ligar
   a conta EmailJS.
   ========================================================= */
const EMAILJS_PUBLIC_KEY = "qNpqEIzJsDxDr0Lxg";   // <-- colar aqui a Public Key da EmailJS
const EMAILJS_SERVICE_ID = "service_jnij4pb";   // <-- colar aqui o Service ID da EmailJS
const EMAILJS_TEMPLATE_ID = "template_jgda2ic";  // <-- colar aqui o Template ID da EmailJS

/* =========================================================
   CONFIGURAÇÃO GOOGLE ANALYTICS (GA4)
   ---------------------------------------------------------
   Preencha aqui o Measurement ID do Google Analytics 4
   (formato "G-XXXXXXXXXX") para ativar o rastreio de visitas.

   Como obter: https://analytics.google.com → Admin → Criar
   propriedade → Fluxos de dados → Web → copiar o "ID de métricas".

   Enquanto esta constante estiver vazia (""), nenhum script do
   Google Analytics é carregado — o site continua sem qualquer
   rastreio. Quando preenchida, o Analytics só é carregado DEPOIS
   de o visitante clicar em "Aceitar" no aviso de cookies (ou já
   ter aceitado numa visita anterior), em conformidade com o RGPD.
   ========================================================= */
const GA4_MEASUREMENT_ID = ""; // <-- colar aqui o ID (ex: G-XXXXXXXXXX)

document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------
     0) Inicialização do EmailJS (só quando a Public Key existe)
  ----------------------------------------------------------- */
  var emailjsReady = false;
  if (EMAILJS_PUBLIC_KEY && typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailjsReady = true;
  }

  /* -----------------------------------------------------------
     0.1) Carrossel automático do Hero (fade a cada 5s)
  ----------------------------------------------------------- */
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));

  if (heroSlides.length > 1) {
    var currentHeroSlide = heroSlides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    if (currentHeroSlide === -1) currentHeroSlide = 0;

    window.setInterval(function () {
      heroSlides[currentHeroSlide].classList.remove('is-active');
      currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
      heroSlides[currentHeroSlide].classList.add('is-active');
    }, 5000);
  }

  /* -----------------------------------------------------------
     0.2) Utilitário: limitar uma função a, no máximo, uma vez por
     frame de animação (evita "forced reflow"/layout thrashing ao
     recalcular o layout em todos os eventos de scroll).
  ----------------------------------------------------------- */
  function rafThrottle(fn) {
    var ticking = false;
    return function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        fn();
        ticking = false;
      });
    };
  }

  /* -----------------------------------------------------------
     1) Cabeçalho: sombra/fundo ao fazer scroll
  ----------------------------------------------------------- */
  var header = document.getElementById('header');

  function updateHeaderOnScroll() {
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeaderOnScroll();
  window.addEventListener('scroll', rafThrottle(updateHeaderOnScroll), { passive: true });

  /* -----------------------------------------------------------
     2) Menu mobile (hamburger)
  ----------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  function closeMobileNav() {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu mobile ao clicar numa hiperligação de navegação
  document.querySelectorAll('.nav-link, .submenu a').forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* -----------------------------------------------------------
     3) Realce do link ativo no menu, conforme o scroll
  ----------------------------------------------------------- */
  var sections = ['servicos', 'trabalhos', 'sobre', 'cobertura', 'orcamento', 'contacto']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link')).filter(function (link) {
    return (link.getAttribute('href') || '').charAt(0) === '#';
  });

  // Guarda o offsetTop de cada secção em cache (só recalcula no resize),
  // para não forçar um reflow de layout em cada evento de scroll.
  var sectionOffsets = [];
  function cacheSectionOffsets() {
    sectionOffsets = sections.map(function (section) {
      return { id: section.id, top: section.offsetTop };
    });
  }
  cacheSectionOffsets();

  function updateActiveNavLink() {
    var currentId = null;
    var scrollPos = window.scrollY + window.innerHeight * 0.35;

    sectionOffsets.forEach(function (section) {
      if (section.top <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var matches = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', matches);
    });
  }
  updateActiveNavLink();
  window.addEventListener('scroll', rafThrottle(updateActiveNavLink), { passive: true });
  window.addEventListener('resize', rafThrottle(cacheSectionOffsets), { passive: true });

  /* -----------------------------------------------------------
     4) Modais (Política de Privacidade / Política de Cookies)
  ----------------------------------------------------------- */
  var modalTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-modal-target]'));
  var modalCloseButtons = Array.prototype.slice.call(document.querySelectorAll('[data-modal-close]'));
  var modalOverlays = Array.prototype.slice.call(document.querySelectorAll('.modal-overlay'));

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var modal = document.getElementById(trigger.getAttribute('data-modal-target'));
      openModal(modal);
    });
  });

  modalCloseButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      closeModal(btn.closest('.modal-overlay'));
    });
  });

  modalOverlays.forEach(function (overlay) {
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeModal(overlay);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      modalOverlays.forEach(function (overlay) {
        if (!overlay.hidden) closeModal(overlay);
      });
    }
  });

  /* -----------------------------------------------------------
     5) Animações discretas ao entrar no ecrã (reveal on scroll)
  ----------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Sem suporte a IntersectionObserver: mostra tudo imediatamente
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* -----------------------------------------------------------
     6) Ano atual no rodapé
  ----------------------------------------------------------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     7) Formulário de pedido de orçamento (envio via EmailJS)
     ---------------------------------------------------------
     O SDK da EmailJS é carregado no <head> do index.html e a
     inicialização é feita no topo deste ficheiro (secção
     "CONFIGURAÇÃO EMAILJS"), a partir das 3 constantes:

       EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID

     Campos enviados para o template EmailJS (template params):
       nome, telefone, email, tipo_servico, mensagem, subject

     Sugestão de "Subject" a definir no template da EmailJS:
       [Novo Pedido de Orçamento] {{nome}}

     Se as 3 constantes não estiverem preenchidas, o formulário
     funciona em modo de simulação local (valida os campos e
     mostra a mensagem de sucesso, mas não envia email nenhum) —
     ideal para testar o site localmente antes de configurar a
     conta EmailJS. Ver README_EMAILJS.md para o passo a passo.
  ----------------------------------------------------------- */
  var quoteForm = document.getElementById('quoteForm');
  var formFeedback = document.getElementById('formFeedback');

  if (quoteForm) { // o formulário existe apenas nas páginas Início e Orçamento

  var validators = {
    name: function (value) { return value.trim().length >= 2; },
    phone: function (value) { return /^[0-9+()\s-]{9,}$/.test(value.trim()); },
    email: function (value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); },
    message: function (value) { return value.trim().length >= 10; }
  };

  var errorMessages = {
    name: 'Indique o seu nome.',
    phone: 'Indique um número de telefone válido.',
    email: 'Indique um email válido.',
    message: 'Descreva brevemente a sua mudança (mín. 10 caracteres).'
  };

  function setFieldError(fieldName, message) {
    var field = quoteForm.querySelector('[name="' + fieldName + '"]');
    var errorSpan = quoteForm.querySelector('[data-error-for="' + fieldName + '"]');
    var wrapper = field ? field.closest('.form-field') : null;

    if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
    if (errorSpan) errorSpan.textContent = message || '';
  }

  function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = 'form-feedback is-visible ' + type;
  }

  function hideFeedback() {
    formFeedback.className = 'form-feedback';
  }

  quoteForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Anti-spam: se o campo-armadilha (invisível para humanos) vier
    // preenchido, foi um bot. Ignora silenciosamente, sem dar pista ao bot.
    var honeypotField = quoteForm.querySelector('[name="website"]');
    if (honeypotField && honeypotField.value.trim() !== '') {
      return;
    }

    hideFeedback();

    var isValid = true;
    Object.keys(validators).forEach(function (fieldName) {
      var field = quoteForm.querySelector('[name="' + fieldName + '"]');
      var value = field ? field.value : '';
      var fieldIsValid = validators[fieldName](value);
      setFieldError(fieldName, fieldIsValid ? '' : errorMessages[fieldName]);
      if (!fieldIsValid) isValid = false;
    });

    if (!isValid) {
      showFeedback('Por favor corrija os campos assinalados.', 'error');
      return;
    }

    var submitBtn = document.getElementById('quoteSubmit');
    var originalBtnText = submitBtn.textContent;

    function setLoading(isLoading) {
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? 'A enviar...' : originalBtnText;
    }

    function handleSuccess() {
      quoteForm.reset();
      setLoading(false);
      // Página de agradecimento (permite medir a conversão no Google Ads)
      window.location.href = '/obrigado';
    }

    function handleError() {
      showFeedback('Não foi possível enviar o seu pedido. Tente novamente ou contacte-nos pelo WhatsApp.', 'error');
      setLoading(false);
    }

    setLoading(true);

    var nameField = quoteForm.querySelector('[name="name"]');
    var phoneField = quoteForm.querySelector('[name="phone"]');
    var emailField = quoteForm.querySelector('[name="email"]');
    var serviceField = quoteForm.querySelector('[name="service"]');
    var messageField = quoteForm.querySelector('[name="message"]');

    var nomeValue = nameField ? nameField.value.trim() : '';
    var tipoServicoValue = (serviceField && serviceField.selectedOptions && serviceField.selectedOptions[0])
      ? serviceField.selectedOptions[0].text
      : '';

    var templateParams = {
      nome: nomeValue,
      telefone: phoneField ? phoneField.value.trim() : '',
      email: emailField ? emailField.value.trim() : '',
      tipo_servico: tipoServicoValue,
      mensagem: messageField ? messageField.value.trim() : '',
      subject: '[Novo Pedido de Orçamento] ' + nomeValue
    };

    if (emailjsReady) {
      /* ---------------- ENVIO REAL VIA EMAILJS ---------------- */
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(handleSuccess)
        .catch(function (error) {
          console.error('Erro ao enviar via EmailJS:', error);
          handleError();
        });
    } else {
      /* ---------------- MODO DE SIMULAÇÃO (sem chaves EmailJS configuradas) ---------------- */
      console.info('EmailJS não configurado — a simular envio localmente. Preencha EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID e EMAILJS_TEMPLATE_ID em js/script.js para ativar o envio real.');
      window.setTimeout(handleSuccess, 900);
    }
  });

  // Remove a mensagem de erro de um campo enquanto o utilizador o corrige
  Object.keys(validators).forEach(function (fieldName) {
    var field = quoteForm.querySelector('[name="' + fieldName + '"]');
    if (field) {
      field.addEventListener('input', function () { setFieldError(fieldName, ''); });
    }
  });

  } // fim: if (quoteForm)

  /* -----------------------------------------------------------
     8) Aviso de Cookies (banner de consentimento)
     ---------------------------------------------------------
     Mostra o banner ao entrar no site enquanto o utilizador não
     clicar em "Aceitar". A escolha fica guardada no localStorage,
     para o banner não voltar a aparecer em visitas seguintes.
  ----------------------------------------------------------- */
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  var COOKIE_CONSENT_KEY = 'leoCookieConsent';

  function setCookieBannerHeightVar() {
    if (cookieBanner) {
      document.documentElement.style.setProperty('--cookie-banner-h', cookieBanner.offsetHeight + 'px');
    }
  }

  /* Carrega o Google Analytics (GA4) — só é chamada depois do
     consentimento de cookies, e só faz algo se o ID estiver preenchido. */
  function loadGoogleAnalytics() {
    if (!GA4_MEASUREMENT_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID);
  }

  if (cookieBanner && cookieAcceptBtn) {
    var consentAlreadyGiven = false;
    try {
      consentAlreadyGiven = window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
    } catch (e) {
      consentAlreadyGiven = false;
    }

    if (consentAlreadyGiven) {
      loadGoogleAnalytics();
    }

    if (!consentAlreadyGiven) {
      document.body.classList.add('has-cookie-banner');
      window.requestAnimationFrame(function () {
        setCookieBannerHeightVar();
        cookieBanner.classList.add('is-visible');
      });

      window.addEventListener('resize', setCookieBannerHeightVar, { passive: true });

      cookieAcceptBtn.addEventListener('click', function () {
        try {
          window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        } catch (e) { /* localStorage indisponível — o banner simplesmente fecha nesta visita */ }

        cookieBanner.classList.remove('is-visible');
        document.body.classList.remove('has-cookie-banner');
        loadGoogleAnalytics();
      });
    }
  }

});
