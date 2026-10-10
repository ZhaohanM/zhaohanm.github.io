const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.navigation-links');
function closeMenu() {
  links.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  links.classList.toggle('is-open', open);
});
links.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenu();
  const section = document.getElementById(link.hash.slice(1));
  if (section) {
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 981px)').addEventListener('change', closeMenu);
const navLinks = [...links.querySelectorAll('a')];
const sections = navLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
let scheduled = false;
function updateActiveSection() {
  let active = sections[0];
  for (const section of sections) if (section.getBoundingClientRect().top <= 130) active = section;
  for (const link of navLinks) {
    if (link.hash === `#${active?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveSection); }
}, { passive: true });
updateActiveSection();
