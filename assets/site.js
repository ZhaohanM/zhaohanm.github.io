const menu = document.querySelector('.menu-toggle');
const links = document.querySelector('.navigation-links');
const languageToggle = document.querySelector('.language-toggle');
const chinese = JSON.parse(document.getElementById('translations').textContent);
const localizedElements = [];
for (const attribute of ['text', 'aria-label', 'alt', 'content']) {
  const marker = attribute === 'text' ? 'data-i18n' : `data-i18n-${attribute}`;
  for (const element of document.querySelectorAll(`[${marker}]`)) {
    localizedElements.push({ element, attribute, key: element.getAttribute(marker),
      english: attribute === 'text' ? element.innerHTML : element.getAttribute(attribute) });
  }
}
let language = 'en';
function menuLabel(open) {
  return language === 'zh-CN' ? (open ? '关闭导航' : '打开导航') : (open ? 'Close navigation' : 'Open navigation');
}
function closeMenu() {
  links.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', menuLabel(false));
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', menuLabel(open));
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
window.matchMedia('(min-width: 1200px)').addEventListener('change', closeMenu);
const navLinks = [...links.querySelectorAll('a')];
let scheduled = false;
function updateActiveSection() {
  let active = navLinks[0]?.hash;
  for (const link of navLinks) {
    const section = document.getElementById(link.hash.slice(1));
    if (section && section.getBoundingClientRect().top <= 130) active = link.hash;
  }
  for (const link of navLinks) {
    if (link.hash === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateActiveSection); }
}, { passive: true });

const tagline = document.querySelector('.research-tagline');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let typingFrame;
function finishTyping() {
  cancelAnimationFrame(typingFrame);
  tagline.classList.remove('is-typing');
  tagline.querySelector('.tagline-animated').textContent = '';
}
function startTyping() {
  finishTyping();
  if (motionPreference.matches) return;
  const phrase = [...tagline.querySelector('.tagline-full').textContent];
  const animated = tagline.querySelector('.tagline-animated');
  let started;
  function typePhrase(now) {
    started ??= now;
    const progress = Math.min((now - started) / 3800, 1);
    animated.textContent = phrase.slice(0, Math.floor(progress * phrase.length)).join('');
    if (progress < 1) typingFrame = requestAnimationFrame(typePhrase);
    else finishTyping();
  }
  tagline.classList.add('is-typing');
  typingFrame = requestAnimationFrame(typePhrase);
}
motionPreference.addEventListener('change', event => {
  if (event.matches) finishTyping();
});

function applyLanguage(nextLanguage, remember = false) {
  // Keep the current section in view when its translated text changes height.
  const visibleSections = [...document.querySelectorAll('#localized-content section')];
  const readingSection = remember ? visibleSections.find(section => section.getBoundingClientRect().bottom > 130) : null;
  const previousTop = readingSection?.getBoundingClientRect().top;
  language = nextLanguage;
  finishTyping();
  document.documentElement.lang = language;
  for (const { element, attribute, key, english } of localizedElements) {
    const value = language === 'zh-CN' ? chinese[key] : english;
    if (attribute === 'text') element.innerHTML = value;
    else element.setAttribute(attribute, value);
  }
  languageToggle.textContent = language === 'en' ? '中文' : 'EN';
  languageToggle.lang = language === 'en' ? 'zh-CN' : 'en';
  languageToggle.setAttribute('aria-label', language === 'en' ? '切换为中文' : 'Switch to English');
  languageToggle.hidden = false;
  closeMenu();
  if (readingSection) {
    requestAnimationFrame(() => {
      const translatedSection = document.getElementById(readingSection.id);
      window.scrollBy({ top: translatedSection.getBoundingClientRect().top - previousTop, behavior: 'instant' });
      updateActiveSection();
    });
  }
  if (remember) {
    try { localStorage.setItem('homepage-language', language); } catch { /* Storage may be disabled. */ }
  }
  updateActiveSection();
  startTyping();
}
languageToggle.addEventListener('click', () => applyLanguage(language === 'en' ? 'zh-CN' : 'en', true));
let savedLanguage;
try { savedLanguage = localStorage.getItem('homepage-language'); } catch { /* Use English when storage is unavailable. */ }
applyLanguage(savedLanguage === 'zh-CN' ? 'zh-CN' : 'en');
