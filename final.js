const booking = document.querySelector('.mobile-booking');
const about = document.querySelector('#about');
const closing = document.querySelector('.closing-booking .cta');
const versionNavigation = document.querySelector('.design-navigation');
const mobile = matchMedia('(max-width: 640px)');
let scheduled = false;
function updateBooking() {
  scheduled = false;
  const bottom = versionNavigation?.getBoundingClientRect().height || 0;
  document.documentElement.style.setProperty('--version-bar-height', `${bottom}px`);
  const rect = closing.getBoundingClientRect();
  const closingVisible = rect.top >= 66 && rect.bottom <= innerHeight - bottom - 64;
  booking.hidden = !(mobile.matches && about.getBoundingClientRect().top < innerHeight - bottom - 24 && !closingVisible);
}
function scheduleBooking() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateBooking); }
}
addEventListener('scroll', scheduleBooking, { passive: true });
addEventListener('resize', scheduleBooking);
addEventListener('pageshow', scheduleBooking);
mobile.addEventListener('change', scheduleBooking);
if (versionNavigation) new ResizeObserver(scheduleBooking).observe(versionNavigation);
updateBooking();
