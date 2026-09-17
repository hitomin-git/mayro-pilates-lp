const booking = document.querySelector('.mobile-booking');
const heroBooking = document.querySelector('.hero .cta');
const closing = document.querySelector('.closing-booking .cta');
const versionNavigation = document.querySelector('.design-navigation');
const mobile = matchMedia('(max-width: 640px)');
let scheduled = false;
function updateBooking() {
  scheduled = false;
  const bottom = versionNavigation.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--version-bar-height', `${bottom}px`);
  const rect = closing.getBoundingClientRect();
  const closingVisible = rect.bottom > 66 && rect.top < innerHeight - bottom - 64;
  booking.hidden = !(mobile.matches && heroBooking.getBoundingClientRect().bottom <= 66 && !closingVisible);
}
function scheduleBooking() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateBooking); }
}
addEventListener('scroll', scheduleBooking, { passive: true });
addEventListener('resize', scheduleBooking);
addEventListener('pageshow', scheduleBooking);
mobile.addEventListener('change', scheduleBooking);
new ResizeObserver(scheduleBooking).observe(versionNavigation);
updateBooking();
