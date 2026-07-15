document.addEventListener('DOMContentLoaded', () => {
  const mobileDropdown = document.querySelector('.mobile-dropdown');
  const trigger = mobileDropdown?.querySelector('[data-dropdown-trigger]');
  
  if (window.innerWidth <= 1000 && trigger) {
    trigger.addEventListener('click', () => {
      mobileDropdown.classList.toggle('active');
    });
  }
}); 