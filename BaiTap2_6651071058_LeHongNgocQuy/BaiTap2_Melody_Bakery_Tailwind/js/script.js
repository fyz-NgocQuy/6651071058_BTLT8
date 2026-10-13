const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', String(!isHidden));
  menuToggle.setAttribute('aria-label', isHidden ? 'Mở menu' : 'Đóng menu');
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Mở menu');
  });
});

const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('show', window.scrollY > 450);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.getElementById('order-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  document.getElementById('form-message').textContent =
    `Cảm ơn ${name}! Yêu cầu đã được ghi nhận trên bản demo. Melody sẽ liên hệ bạn sớm nhé.`;
  event.target.reset();
});