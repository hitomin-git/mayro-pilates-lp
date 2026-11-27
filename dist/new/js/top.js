const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const frames = Array.from(document.querySelectorAll('.frame'));
const frameButtons = Array.from(document.querySelectorAll('[data-frame]'));
const toggle = document.querySelector('#film-toggle');
let frame = 0;
let playing = !reduceMotion.matches;
let timer;
function showFrame(index){
  frame = index;
  frames.forEach((item, i) => item.classList.toggle('active', i === frame));
  frameButtons.forEach((button, i) => {
    if (i === frame) button.setAttribute('aria-current','true');
    else button.removeAttribute('aria-current');
  });
}
function schedule(){
  clearInterval(timer);
  toggle.setAttribute('aria-label', playing ? '一時停止' : '再生');
  toggle.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
  if (playing && !document.hidden) {
    timer = setInterval(() => showFrame((frame + 1) % frames.length), 4500);
  }
}
toggle.addEventListener('click', () => { playing = !playing; schedule(); });
frameButtons.forEach((button,i) => button.addEventListener('click', () => { showFrame(i); schedule(); }));
document.addEventListener('visibilitychange', schedule);
reduceMotion.addEventListener('change', () => {playing = !reduceMotion.matches; schedule();});
schedule();
if ('IntersectionObserver' in window && !reduceMotion.matches){
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('pending');
    observer.observe(element);
  });
}



const conceptStage = document.getElementById('about');
const concept = conceptStage.querySelector('.about');
const conceptStrokes = concept.querySelector('.concept-strokes');
const conceptMarks = concept.querySelectorAll('.concept-mark');
const conceptHeader = document.querySelector('header');
let markerFrame = 0;
let pinTop = 72;
let lineCount = 0;
let unlockTimer;
const root = document.documentElement;

function releaseConceptScroll() {
  clearTimeout(unlockTimer);
  if (root.classList.contains('concept-scroll-lock')) {
    root.classList.remove('concept-scroll-lock');
    measureConceptStrokes();
  }
}

function updateConceptStrokes() {
  markerFrame = 0;
  const bounds = conceptStage.getBoundingClientRect();
  if (!bounds.height) return;
  // 文章ブロック（最初の行〜「ピラティスを選ぶ」リンクまで）が、すべて画面内に入った瞬間に止める。
  // 画面より高いブロックの場合だけ、最初の行が画面上部に来た時点で止める。
  const firstTop = conceptMarks[0].getBoundingClientRect().top;
  const blockBottom = concept.querySelector('.concept-services').getBoundingClientRect().bottom;
  const fits = blockBottom - firstTop <= innerHeight - pinTop - 32;
  const reached = fits ? blockBottom <= innerHeight - 16 : firstTop <= pinTop + 8;
  const farBefore = fits ? blockBottom > innerHeight + 80 : firstTop > pinTop + 80;
  if (farBefore) conceptStage.classList.remove('is-marked');
  if (conceptStage.classList.contains('is-marked') || !lineCount || !reached) return;

  const homeEntry = ['', '#home', '#about'].includes(location.hash);
  if (homeEntry && bounds.bottom > pinTop && !reduceMotion.matches) {
    root.classList.add('concept-scroll-lock');
    unlockTimer = setTimeout(releaseConceptScroll, (lineCount - 1) * 265 + 300);
  }
  conceptStage.classList.add('is-marked');

}

function queueConceptStrokes() {
  if (!markerFrame) markerFrame = requestAnimationFrame(updateConceptStrokes);
}

function measureConceptStrokes() {
  if (root.classList.contains('concept-scroll-lock')) return;
  pinTop = conceptHeader.getBoundingClientRect().height;
  conceptStage.style.setProperty('--concept-pin-top', pinTop + 'px');

  const fragments = document.createDocumentFragment();
  let index = 0;
  const origin = concept.getBoundingClientRect();
  conceptMarks.forEach(mark => {
    Array.from(mark.getClientRects()).forEach(rect => {
      if (!rect.width || !rect.height) return;
      const height = Math.max(4, Math.min(11, rect.height * .22));
      const element = document.createElement('span');
      element.className = 'concept-stroke';
      if (mark.classList.contains('concept-mark--medical')) element.classList.add('concept-stroke--medical');
      if (mark.classList.contains('concept-mark--lifestyle')) element.classList.add('concept-stroke--lifestyle');
      Object.assign(element.style, {
        left: (rect.left - origin.left - 1) + 'px',
        top: (rect.bottom - origin.top - height - 1) + 'px',
        width: (rect.width + 2) + 'px',
        height: height + 'px'
      });
      element.style.setProperty('--line-delay', index * 265 + 'ms');
      index += 1;
      fragments.append(element);
    });
  });
  lineCount = index;
  conceptStrokes.replaceChildren(fragments);
  queueConceptStrokes();
}

function preventLockedScroll(event) {
  if (root.classList.contains('concept-scroll-lock')) event.preventDefault();
}

addEventListener('wheel', preventLockedScroll, {passive:false});
addEventListener('touchmove', preventLockedScroll, {passive:false});
addEventListener('scroll', queueConceptStrokes, {passive:true});
addEventListener('resize', measureConceptStrokes);
addEventListener('hashchange', () => {
  releaseConceptScroll();
  measureConceptStrokes();
});
addEventListener('keydown', event => {
  if (event.key === 'Escape') releaseConceptScroll();
});
addEventListener('pagehide', releaseConceptScroll);
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) releaseConceptScroll();
  measureConceptStrokes();
});
if (document.fonts) document.fonts.ready.then(measureConceptStrokes);
measureConceptStrokes();

const serviceCards = document.querySelectorAll('#service-cards .card');
function measureServicePhotos() {
  if (!cardsGrid.clientHeight) return;
  const gridStyle = getComputedStyle(cardsGrid);
  const stagger = parseFloat(getComputedStyle(serviceCards[1]).marginTop);
  const textHeight = Math.max(...Array.from(serviceCards, card =>
    card.querySelector('.service-card-body').getBoundingClientRect().height
  ));
  const photoHeight = Math.max(0, cardsGrid.clientHeight - parseFloat(gridStyle.paddingBottom) - stagger - textHeight);
  cardsGrid.style.setProperty('--service-photo-height', photoHeight + 'px');
  serviceCards.forEach(card => {
    const source = card.querySelector('.service-card-photo').getBoundingClientRect();
    const destination = card.querySelector('.service-expanded-photo');
    const panel = destination.parentElement.getBoundingClientRect();
    if (!source.width || !source.height || !panel.width || !panel.height) return;
    destination.style.setProperty('--photo-start-x', (source.left - panel.left) + 'px');
    destination.style.setProperty('--photo-start-y', (source.top - panel.top) + 'px');
    destination.style.setProperty('--photo-start-w', source.width + 'px');
    destination.style.setProperty('--photo-start-h', source.height + 'px');
    const image = destination.querySelector('img');
    if (image.complete && image.naturalWidth) card.setAttribute('data-photo-ready', '');

  });
}
serviceCards.forEach(card => {
  const image = card.querySelector('.service-expanded-photo img');
  image.loading = 'eager';
  image.addEventListener('load', measureServicePhotos, {once:true});
});
const cardsGrid = document.getElementById('service-cards');
if ('ResizeObserver' in window) {
  const photoObserver = new ResizeObserver(measureServicePhotos);
  photoObserver.observe(cardsGrid);
  serviceCards.forEach(card => photoObserver.observe(card.querySelector('.service-card-body')));
}
addEventListener('resize', measureServicePhotos);
addEventListener('hashchange', measureServicePhotos);
measureServicePhotos();

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');
if (navToggle && siteNav) {
  const setNav = open => {
    siteNav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };
  navToggle.addEventListener('click', () => setNav(!siteNav.classList.contains('is-open')));
  siteNav.addEventListener('click', event => { if (event.target.closest('a')) setNav(false); });
}
