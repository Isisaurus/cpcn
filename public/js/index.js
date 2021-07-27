'use strict';
import '@babel/polyfill';
import { createEvent, deleteEvent } from './events';
import { createNews, deleteNews } from './news';
import { showAlert } from './alert';
import { login, logout } from './login';
import {
  addFormMarkup,
  returnFamilyArr,
  returnDogArr,
  join,
  addOverview,
} from './join';

import { updateFees, calculateFees } from './membership';
import { updatePw } from './updatePw';
import { sendFooterMessage } from './footerMessage';
import { uploadGalleryImage } from './uploadGalleryImage';

import { insertGalleryImages, showImg } from './galley';

const body = document.querySelector('body');
const loginForm = document.getElementById('form_login');
const logoutBtn = document.querySelector('#logout');
const logoutBtn2 = document.querySelector('#logout2');
const nav = document.querySelector('.nav');
const sideNav = document.querySelector('.side_nav');
const sideNavList = document.querySelector('.side_nav__list');
const burger = document.getElementById('burger');

const questions = document.querySelectorAll('.section__qa__question');

const tabContainer = document.querySelector('.section_content__tabs');
const tabs = document.querySelectorAll('.section_content__button');
const tabsContent = document.querySelectorAll('.section_content__content');

const newsForm = document.getElementById('newsForm');
const newsFormDelete = document.getElementById('newsFormDelete');
const eventsForm = document.getElementById('eventsForm');
const eventsFormDelete = document.getElementById('eventsFormDelete');

const tabsContainerAdmin = document.getElementById('admin_menu');
const tabsAdmin = document.querySelectorAll('.admin_nav__el');
const tabsContentAdmin = document.querySelectorAll('.admin_view');

const removeFameMemBtn = document.getElementById('removeFamMem');
const addFamMemBtn = document.getElementById('addFamMem');
const addFamMemContainer = document.getElementById('addFamMemContainer');

const removeDogBtn = document.getElementById('removeDog');
const addDogBtn = document.getElementById('addDog');
const addDogContainer = document.getElementById('addDogContainer');

const showOverviewModalBtn = document.getElementById('showOverviewModalBtn');
const overviewModal = document.getElementById('showOverviewModal');
const submitJoinFormBtn = document.getElementById('submitJoinFormBtn');
const showOverViewContainer = document.getElementById('showOverViewContainer');
const overviewCotnainer = document.getElementById('showOverview');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const cancelJoinFormBtn = document.getElementById('cancelJoinForm');

const updateFeeBtn = document.getElementById('updatefee');

const updatePwForm = document.getElementById('profile_password');

const footerSendForm = document.getElementById('contact_form');

const galleryForm = document.getElementById('upload_image');

const galleryContainer = document.getElementById('gallery');
const col1ImgContainers = document.querySelectorAll('.col-1');

let memberState;

///////////////////////// showmodal
const showModal = function () {
  overviewModal.classList.remove('hid');
  body.classList.add('modal');
  showOverViewContainer.classList.add('opacityAnim');
};

const hideModal = function () {
  overviewModal.classList.add('hid');
  body.classList.remove('modal');
  showOverViewContainer.classList.remove('opacityAnim');
};

//////////////////////// Navigation
const hideSideNav = function () {
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
const showSideNav = function () {
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
const sideNavToggle = () => {
  burger.classList.toggle('open');
  if (burger.classList.contains('open')) {
    showSideNav();
  } else {
    hideSideNav();
  }
};
////////////////////////// QandA
const toggleQuestion = function (e) {
  const paragraph = e.currentTarget.parentElement.querySelector(
    '.section__qa__answer'
  );
  const svgUse = e.currentTarget.querySelector('svg').querySelector('use');
  if (paragraph) {
    paragraph.classList.toggle('open');
  } else {
    return;
  }
  if (paragraph.classList.contains('open')) {
    svgUse.setAttribute('xlink:href', '/img/sprite.svg#icon-chevron-up');
  } else {
    svgUse.setAttribute('xlink:href', '/img/sprite.svg#icon-chevron-down');
  }
};

/// EVENT LISTENERS
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (logoutBtn2) {
  logoutBtn2.addEventListener('click', logout);
}

// burger menu
if (!(burger.style.display === 'none')) {
  burger.addEventListener('click', sideNavToggle);
  sideNav.classList.remove('hidden');
} else {
  sideNav.classList.add('hidden');
}

if (questions) {
  questions.forEach((el) => {
    el.addEventListener('click', toggleQuestion);
  });
}

// Chodsky Pes - TABS
if (tabContainer) {
  tabContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.section_content__button');
    if (!clicked) return;
    tabs.forEach((btn) => {
      btn.classList.remove('section_content__button--active');
    });
    clicked.classList.add('section_content__button--active');

    tabsContent.forEach((cont) => {
      cont.classList.remove('section_content__content--active');
    });
    const content = document.querySelector(
      `.section_content__content--${clicked.dataset.tab}`
    );
    content.classList.add('section_content__content--active');
  });
}

/////////// JOIN FORM
// add family member
if (addFamMemBtn) {
  addFamMemBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const maxFamMem = 4;
    if (addFamMemContainer.children.length <= maxFamMem) {
      addFormMarkup(
        addFamMemContainer.children.length,
        'family',
        addFamMemContainer
      );
      removeFameMemBtn.classList.remove('hid');
    } else {
      showAlert(
        'error',
        `You can only add max. ${maxFamMem + 1} family members!`
      );
    }
  });
}
// remove family member
if (removeFameMemBtn) {
  removeFameMemBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addFamMemContainer.removeChild(addFamMemContainer.lastElementChild);
    if (addFamMemContainer.children.length === 1) {
      removeFameMemBtn.classList.add('hid');
    }
  });
}
// add dog
if (addDogContainer) {
  addDogBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const maxDogs = 4;
    if (addDogContainer.children.length <= maxDogs) {
      addFormMarkup(addDogContainer.children.length, 'dog', addDogContainer);
      removeDogBtn.classList.remove('hid');
    } else {
      showAlert('error', `You can only add max. ${maxDogs + 1} dogs!`);
    }
  });
}
// remove dog
if (removeDogBtn) {
  removeDogBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addDogContainer.removeChild(addDogContainer.lastElementChild);
    if (addDogContainer.children.length === 1) {
      removeDogBtn.classList.add('hid');
    }
  });
}

// build member state
if (addFamMemContainer) {
  memberState = {};
  showOverviewModalBtn.addEventListener('click', () => {
    const famMems = document.querySelectorAll('.join_form__section--fam');
    const dogs = document.querySelectorAll('.join_form__section--dogs');

    const firstName = document.getElementById('memberFirstName').value;
    const lastName = document.getElementById('memberLastName').value;
    const initials = document.getElementById('initials').value;

    const dob = document.getElementById('memberDob').value;

    const country = document.getElementById('memberCountry').value;
    const city = document.getElementById('memberCity').value;
    const street = document.getElementById('memberAddress').value;
    const postcode = document.getElementById('memberPostcode').value;

    const email = document.getElementById('memberEmail').value;
    const phone = document.getElementById('memberPhone').value;

    const address = {
      country,
      city,
      street,
      postcode,
    };

    const famArray = returnFamilyArr(famMems);
    const dogArray = returnDogArr(dogs);

    memberState = {
      firstName,
      lastName,
      initials,
      dateOfBirth: dob,
      address,
      email,
      phone,
      familyMembers: famArray,
      dogs: dogArray,
    };
  });
}
// render table markup in overview window
if (showOverviewModalBtn) {
  showOverviewModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const formValid = document.forms['joinForm'].reportValidity();
    // TEST
    // const formValid = true;
    if (formValid) {
      calculateFees(memberState)
        .then((fee) => {
          memberState.fee = fee;
          return memberState;
        })
        .then((memberState) => {
          showModal();
          addOverview(showOverview, memberState);
        });
    }
  });
}

if (submitJoinFormBtn) {
  submitJoinFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    join(memberState);
  });
}

if (submitJoinFormBtn) {
  submitJoinFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal();
  });
}

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal();
  });
}

if (cancelJoinFormBtn) {
  cancelJoinFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal();
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', hideModal);
}

// CMS
if (newsForm) {
  newsForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const header = document.getElementById('news_header').value;
    const date = document.getElementById('news_date').value;
    const description = document.getElementById('news_description').value;

    createNews(header, date, description);
  });
}
if (newsFormDelete) {
  newsFormDelete.addEventListener('submit', function (e) {
    e.preventDefault();
    const deleteNewsInputs = document.querySelectorAll('.deleteNews__input');
    let id = null;
    deleteNewsInputs.forEach((el) => {
      if (el.checked) {
        id = el.value;
      }
    });
    deleteNews(id);
  });
}
if (eventsForm) {
  eventsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const sdate = document.getElementById('endsAtDate').value;
    const stime = document.getElementById('endsAtTime').value;
    const edate = document.getElementById('endsAtDate').value;
    const etime = document.getElementById('endsAtTime').value;
    const title = document.getElementById('event_title').value;
    const location = document.getElementById('event_location').value;
    const locationUrl = document.getElementById('event_locationUrl').value;
    const description = document.getElementById('event_description').value;

    const startsAt = `${sdate} ${stime}`;
    const endsAt = `${edate} ${etime}`;
    createEvent(title, startsAt, endsAt, location, locationUrl, description);
  });
}
if (eventsFormDelete) {
  eventsFormDelete.addEventListener('submit', function (e) {
    e.preventDefault();
    const deleteEventInput = document.querySelectorAll('.deleteEvents__input');
    let id = null;
    deleteEventInput.forEach((el) => {
      if (el.checked) {
        id = el.value;
      }
    });
    deleteEvent(id);
  });
}

// CMS - TABS
if (tabsContainerAdmin) {
  tabsContainerAdmin.addEventListener('click', (e) => {
    const clicked = e.target.closest('.admin_nav__el');
    if (!clicked) return;
    tabsAdmin.forEach((btn) => {
      btn.classList.remove('admin_nav__el--active');
    });
    clicked.classList.add('admin_nav__el--active');

    tabsContentAdmin.forEach((cont) => {
      cont.classList.remove('admin_view--active');
    });
    const content = document.querySelector(
      `.admin_view--${clicked.dataset.tab}`
    );
    if (!content) return;
    content.classList.add('admin_view--active');
  });
}

// administration: update membership fees
if (updateFeeBtn) {
  updateFeeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // inputs
    const feeMember = document.getElementById('fee_member').value;
    const feeFamily = document.getElementById('fee_family').value;
    const feeDog = document.getElementById('fee_dog').value;
    const feeReg = document.getElementById('fee_reg').value;
    const feeUnder12 = document.getElementById('fee_under12').value;
    const halffeeMember = document.getElementById('halffee_member').value;
    const halffeeFamily = document.getElementById('halffee_family').value;
    const halffeeDog = document.getElementById('halffee_dog').value;
    const halffeeReg = document.getElementById('halffee_reg').value;
    const halffeeUnder12 = document.getElementById('halffee_under12').value;

    // data obj
    const feeObj = {
      fullYearFee: {
        under12: +feeUnder12,
        registration: +feeReg,
        membership: +feeMember,
        family: +feeFamily,
        dog: +feeDog,
      },
      halfYearFee: {
        under12: +halffeeUnder12,
        registration: +halffeeReg,
        membership: +halffeeMember,
        family: +halffeeFamily,
        dog: +halffeeDog,
      },
    };
    const feeId = document.getElementById('membershipform').dataset.set;
    updateFees(feeObj, feeId);
  });
}

// update pw using API
if (updatePwForm) {
  updatePwForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log(`SUBMIT`);
    const passwordCurrent = document.getElementById(
      'user_password_current'
    ).value;
    const password = document.getElementById('user_password').value;
    const passwordConfirm = document.getElementById(
      'user_password_confirm'
    ).value;
    updatePw(passwordCurrent, password, passwordConfirm);
  });
}

/// footer message
const senderState = {};
if (footerSendForm) {
  footerSendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // console.log('Sending contact event listener!');
    senderState.email = document.getElementById('contact_email').value;
    senderState.message = document.getElementById('contact_message').value;
    sendFooterMessage(senderState);
  });
}

// gallery form
if (galleryForm) {
  galleryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append(
      'image',
      document.getElementById('upload_image_input').files[0]
    );

    uploadGalleryImage(form);
  });
}

// gallery
if (galleryContainer) {
  insertGalleryImages(galleryContainer);
}
if (galleryContainer) {
  galleryContainer.addEventListener('click', (e) => {
    const images = document.querySelectorAll('.gallery__img');

    images.forEach((img, i) => {
      img.dataset.img = i + 1;
    });

    if (e.target.closest('.gallery__img')) {
      showImg(e.target.closest('.gallery__img'), galleryContainer, images);
    }
  });
}
