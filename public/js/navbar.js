const sideNav = document.querySelector('.side_nav');
const sideNavList = document.querySelector('.side_nav__list');
const burger = document.getElementById('burger');

const body = document.querySelector('body');

//////////////////////// Mobile Navigation
export const hideSideNav = function () {
  sideNav.style.opacity = '0';
  sideNav.style.height = '0%';

  sideNavList.style.height = '0%';
  sideNavList.style.width = '0%';

  sideNavList.style.opacity = '0';

  burger.classList.remove('open');
  sideNav.classList.add('hidden');
  sideNav.classList.remove('animated_sidenav');

  body.style.overflow = 'auto';
};
export const showSideNav = function () {
  sideNav.style.height = '100%';
  sideNav.style.opacity = '1';
  sideNav.style.visibility = 'visible';

  sideNavList.style.visibility = 'visible';
  sideNavList.style.height = '100%';
  sideNavList.style.width = '100%';
  sideNavList.style.opacity = '1';

  sideNav.classList.remove('hidden');
  body.style.overflow = 'hidden';
  sideNav.classList.add('animated_sidenav');
};
export const sideNavToggle = () => {
  burger.classList.toggle('open');
  if (burger.classList.contains('open')) {
    showSideNav();
  } else {
    hideSideNav();
  }
};
