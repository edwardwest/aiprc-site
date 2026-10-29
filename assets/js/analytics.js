/* Google Analytics (Google tag GT-TBVGT3GG, same tag the WordPress site used via Site Kit).
   Only runs on the live domain, so Vercel previews and local testing don't add fake visits. */
(function () {
  var host = window.location.hostname;
  if (host !== 'aiprc.org' && host !== 'www.aiprc.org') return;
  var id = 'GT-TBVGT3GG';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id);
})();
