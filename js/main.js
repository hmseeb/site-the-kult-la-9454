/* ==========================================================================
   The Kult LA — site scripts
   Vanilla JS, no dependencies, no external services.
   ========================================================================== */
(function () {
  'use strict';

  var BUSINESS_EMAIL = 'vikvdesign@gmail.com';
  var LEAD_ENDPOINT = '/api/ghl-lead';

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
     A validated submission is posted to /api/ghl-lead, which creates or
     updates the contact in the GoHighLevel sub-account (tagged website-lead).
     If that endpoint is unavailable, the submission falls back to the
     pre-filled email handoff so no enquiry is ever lost.
     ---------------------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var status = document.getElementById('form-status');
    var honeypot = form.querySelector('.honeypot input');

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

    function showStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status is-visible ' + (kind === 'error' ? 'is-error' : 'is-success');
      status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
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
        var field = form.elements[rule.id];
        if (!field) return;
        if (!field.value.trim()) {
          setError(field, rule.message);
          ok = false;
        } else {
          setError(field, '');
        }
      });

      var email = form.elements.email;
      if (email && email.value.trim() && !validEmail(email.value.trim())) {
        setError(email, 'That email address does not look right.');
        ok = false;
      }

      var phone = form.elements.phone;
      if (phone && phone.value.trim() && !validPhone(phone.value.trim())) {
        setError(phone, 'Please enter a valid phone number, or leave it blank.');
        ok = false;
      }

      var message = form.elements.message;
      if (message && message.value.trim() && message.value.trim().length < 12) {
        setError(message, 'A little more detail helps us quote accurately.');
        ok = false;
      }

      var consent = form.elements.consent;
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

    function get(name) {
      var field = form.elements[name];
      return field ? field.value.trim() : '';
    }

    function mailtoHref() {
      var subject = 'Project enquiry — ' + get('service') + ' — ' + get('name');

      var lines = [
        'Name: ' + get('name'),
        'Email: ' + get('email'),
        'Phone: ' + (get('phone') || 'Not provided'),
        'Company / brand: ' + (get('company') || 'Not provided'),
        'Service needed: ' + get('service'),
        'Budget range: ' + (get('budget') || 'Not specified'),
        'Ideal timeline: ' + (get('timeline') || 'Not specified'),
        '',
        'Project details:',
        get('message'),
        '',
        '— Sent from thekultla.com'
      ];

      return 'mailto:' + BUSINESS_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    }

    function thankYou(firstName) {
      showStatus(
        'Thanks' + (firstName ? ', ' + firstName : '') + '! Your details are with us — ' +
        'we\'ll reply within one business day. In a hurry? Call (424) 355-4446.',
        'success'
      );
    }

    function setBusy(busy) {
      if (!submitBtn) return;
      submitBtn.disabled = busy;
      submitBtn.textContent = busy ? 'Sending…' : submitLabel;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Silently ignore bot submissions.
      if (honeypot && honeypot.value) return;

      if (!validate()) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var firstName = get('name').split(' ')[0];

      var payload = {
        formName: form.getAttribute('data-form-name') || form.id || 'Website Form',
        name: get('name'),
        email: get('email'),
        phone: get('phone'),
        company: get('company'),
        service: get('service'),
        budget: get('budget'),
        timeline: get('timeline'),
        message: get('message'),
        website: honeypot ? honeypot.value : '',
        pageUrl: window.location.href
      };

      // No fetch (very old browser) — keep the email handoff.
      if (typeof window.fetch !== 'function') {
        thankYou(firstName);
        window.location.href = mailtoHref();
        form.reset();
        return;
      }

      setBusy(true);

      fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          return { ok: response.ok, status: response.status, data: data || {} };
        });
      }).then(function (result) {
        setBusy(false);

        if (result.ok) {
          thankYou(firstName);
          form.reset();
          return;
        }

        // CRM not wired up on this deployment — fall back to the email handoff.
        if (result.status === 503 || result.status === 404 || result.status === 405) {
          thankYou(firstName);
          window.location.href = mailtoHref();
          form.reset();
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
    initForm();
    initServicePreselect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
