const booking = document.querySelector('.mobile-booking');
const heroBooking = document.querySelector('.hero .cta');
const closing = document.querySelector('.closing-booking .cta');
const versionNavigation = document.querySelector('.design-navigation');
const mobile = matchMedia('(max-width: 640px)');
let scheduled = false;
function updateBooking() {
  scheduled = false;
  const bottom = versionNavigation?.getBoundingClientRect().height || 0;
  document.documentElement.style.setProperty('--version-bar-height', bottom + 'px');
  const reserved = 100 + bottom;
  const viewportHeight = window.visualViewport?.height || innerHeight;
  const heroRect = heroBooking.getBoundingClientRect();
  const endRect = closing.getBoundingClientRect();
  const visible = rect => rect.top >= 66 && rect.bottom <= viewportHeight - reserved;
  booking.hidden = !(mobile.matches && !visible(heroRect) && !visible(endRect));
}
function scheduleBooking() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateBooking); }
}
addEventListener('scroll', scheduleBooking, { passive: true });
addEventListener('resize', scheduleBooking);
addEventListener('pageshow', scheduleBooking);
window.visualViewport?.addEventListener('resize', scheduleBooking);
mobile.addEventListener('change', scheduleBooking);
if (versionNavigation) new ResizeObserver(scheduleBooking).observe(versionNavigation);
updateBooking();
