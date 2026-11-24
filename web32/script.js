// Toggle Menu Mobile (Hamburger)
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Tutup menu otomatis saat link diklik (di layar HP)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
