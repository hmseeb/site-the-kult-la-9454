/* ==========================================================================
   The Kult LA — site scripts
   Vanilla JS, no dependencies, no external services.
   ========================================================================== */
(function () {
  'use strict';

  var BUSINESS_EMAIL = 'vikvdesign@gmail.com';
  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/20b4ddfcb5b19681843dfc18c63f4ee0';

  /* ----------------------------------------------------------------------
     Shared form status helper
     ---------------------------------------------------------------------- */
  function showStatus(message, kind) {
    var status = document.getElementById('form-status');
    if (!status) return;
    status.textContent = message;
    status.className = 'form-status is-visible ' + (kind === 'error' ? 'is-error' : 'is-success');
    status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  }

  function thankYou(firstName) {
    showStatus(
      'Thanks' + (firstName ? ', ' + firstName : '') + '! Your details are with us — ' +
      'we\'ll reply within one business day. In a hurry? Call (424) 355-4446.',
      'success'
    );
  }

  /* ----------------------------------------------------------------------
     Hidden _page field — so visitors come back to the right page
     ---------------------------------------------------------------------- */
  function initPageFields() {
    var fields = document.querySelectorAll('input[name="_page"]');
    for (var i = 0; i < fields.length; i++) fields[i].value = window.location.href;
  }

  /* ----------------------------------------------------------------------
     Plain (no-JavaScript) submissions return with ?submitted=1
     ---------------------------------------------------------------------- */
  function initSubmittedNotice() {
    if (!window.location.search) return;
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') !== '1') return;
    thankYou('');
  }

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) close();
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (item) { observer.observe(item); });
  }

  /* ----------------------------------------------------------------------
     FAQ — keep one answer open at a time within a group
     ---------------------------------------------------------------------- */
  function initFaq() {
    var groups = document.querySelectorAll('[data-faq-group]');
    groups.forEach(function (group) {
      var items = group.querySelectorAll('details.faq__item');
      items.forEach(function (item) {
        item.addEventListener('toggle', function () {
          if (!item.open) return;
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     Quote / contact form
     A validated submission is posted with fetch() to the LeadrVision forms
     endpoint (the same URL as the form's action attribute), which answers
     with {"ok": true}. Without JavaScript the plain HTML POST still works and
     the visitor returns to this page with ?submitted=1.
     ---------------------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var honeypot = form.querySelector('.honeypot input');
    var gotcha = form.querySelector('input[name="_gotcha"]');

    function field(id) {
      return form.querySelector('#' + id);
    }

    function setError(field, message) {
      var wrap = field.closest('.field');
      var slot = wrap ? wrap.querySelector('.field__error') : null;
      if (slot) slot.textContent = message || '';
      if (message) {
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.removeAttribute('aria-invalid');
      }
    }

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function validPhone(value) {
      var digits = value.replace(/[^0-9]/g, '');
      return digits.length >= 10 && digits.length <= 15;
    }

    function validate() {
      var ok = true;

      var required = [
        { id: 'name', message: 'Please tell us your name.' },
        { id: 'email', message: 'Please enter your email address.' },
        { id: 'service', message: 'Please choose a service.' },
        { id: 'message', message: 'Please share a few details about your project.' }
      ];

      required.forEach(function (rule) {
        var input = field(rule.id);
        if (!input) return;
        if (!input.value.trim()) {
          setError(input, rule.message);
          ok = false;
        } else {
          setError(input, '');
        }
      });

      var email = field('email');
      if (email && email.value.trim() && !validEmail(email.value.trim())) {
        setError(email, 'That email address does not look right.');
        ok = false;
      }

      var phone = field('phone');
      if (phone && phone.value.trim() && !validPhone(phone.value.trim())) {
        setError(phone, 'Please enter a valid phone number, or leave it blank.');
        ok = false;
      }

      var message = field('message');
      if (message && message.value.trim() && message.value.trim().length < 12) {
        setError(message, 'A little more detail helps us quote accurately.');
        ok = false;
      }

      var consent = field('consent');
      if (consent && !consent.checked) {
        showStatus('Please confirm you agree to be contacted about your enquiry.', 'error');
        ok = false;
      }

      return ok;
    }

    // Clear an error as soon as the visitor starts fixing it.
    Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (field) {
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') setError(field, '');
      });
    });

    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    function get(id) {
      var input = field(id);
      return input ? input.value.trim() : '';
    }

    function setBusy(busy) {
      if (!submitBtn) return;
      submitBtn.disabled = busy;
      submitBtn.textContent = busy ? 'Sending…' : submitLabel;
    }

    form.addEventListener('submit', function (event) {
      // Silently ignore bot submissions.
      if ((honeypot && honeypot.value) || (gotcha && gotcha.value)) {
        event.preventDefault();
        return;
      }

      if (!validate()) {
        event.preventDefault();
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      // No fetch (very old browser) — let the plain HTML POST go through.
      if (typeof window.fetch !== 'function') return;

      event.preventDefault();

      var firstName = get('name').split(' ')[0];
      var consent = field('consent');

      var payload = {
        _form: 'Quote request',
        _page: window.location.href,
        _gotcha: gotcha ? gotcha.value : '',
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        'Business / brand': get('company'),
        'Service needed': get('service'),
        'Budget range': get('budget'),
        'Ideal timeline': get('timeline'),
        'Project details': get('message'),
        'Consent to be contacted': consent && consent.checked ? 'Yes' : 'No'
      };

      setBusy(true);

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          return { ok: response.ok && (data.ok !== false), data: data || {} };
        });
      }).then(function (result) {
        setBusy(false);

        if (result.ok) {
          thankYou(firstName);
          form.reset();
          initPageFields();
          return;
        }

        showStatus(
          'Sorry — something went wrong sending your details. Please email ' +
          BUSINESS_EMAIL + ' or call (424) 355-4446 and we\'ll pick it up right away.',
          'error'
        );
      }).catch(function () {
        setBusy(false);
        showStatus(
          'Sorry — something went wrong sending your details. Please email ' +
          BUSINESS_EMAIL + ' or call (424) 355-4446 and we\'ll pick it up right away.',
          'error'
        );
      });
    });
  }

  /* ----------------------------------------------------------------------
     Pre-select a service when arriving from a service card link
     e.g. contact.html?service=Brand%20Identity
     ---------------------------------------------------------------------- */
  function initServicePreselect() {
    var select = document.getElementById('service');
    if (!select || !window.location.search) return;

    var params = new URLSearchParams(window.location.search);
    var wanted = params.get('service');
    if (!wanted) return;

    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value.toLowerCase() === wanted.toLowerCase()) select.value = option.value;
    });
  }

  /* ----------------------------------------------------------------------
     Boot
     ---------------------------------------------------------------------- */
  function boot() {
    initNav();
    initYear();
    initReveal();
    initFaq();
    initPageFields();
    initForm();
    initServicePreselect();
    initSubmittedNotice();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
