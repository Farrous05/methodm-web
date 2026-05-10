
document.addEventListener('DOMContentLoaded', function() {
  // Mobile nav
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function() {
      var open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  // Services tabs
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function(p){ p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(function(b){ b.classList.remove('open'); });
      document.querySelectorAll('.faq-a').forEach(function(a){ a.classList.remove('open'); });
      if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
    });
  });

  // Phone reveal
  var phoneBtn = document.getElementById('phone-reveal-btn');
  var phonePanel = document.getElementById('phone-reveal');
  if (phoneBtn && phonePanel) {
    phoneBtn.addEventListener('click', function() {
      var visible = phonePanel.classList.toggle('visible');
      phoneBtn.setAttribute('aria-expanded', visible);
    });
  }

  // Message scroll
  var msgBtn = document.getElementById('message-btn');
  var formSection = document.getElementById('contact-form-section');
  if (msgBtn && formSection) {
    msgBtn.addEventListener('click', function() {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Meeting checkbox
  var meetingCb = document.getElementById('meeting-checkbox');
  var meetingNote = document.getElementById('meeting-note');
  if (meetingCb && meetingNote) {
    meetingCb.addEventListener('change', function() {
      meetingNote.classList.toggle('visible', meetingCb.checked);
    });
  }

  // Contact form
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var success = document.getElementById('form-success');
      if (success) { form.style.display = 'none'; success.classList.add('visible'); }
    });
  }

  // Counter animation
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var val = el.getAttribute('data-count');
        var suf = el.getAttribute('data-suffix') || '';
        animCount(el, val, suf);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function(c){ io.observe(c); });
  }
  function animCount(el, val, suf) {
    var num = parseFloat(val);
    var dur = 1400;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = (Number.isInteger(num) ? Math.floor(num * ease) : (num * ease).toFixed(0)) + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
});
