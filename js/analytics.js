

// Google Analytics 4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('js', new Date());
gtag('config', 'G-3S9LEKE8DT');

// Kakao inquiry click tracking
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href*="pf.kakao.com"]').forEach(function(link) {
    link.addEventListener('click', function() {
      gtag('event', 'generate_lead', {
        method: 'kakao'
      });
    });
  });
});