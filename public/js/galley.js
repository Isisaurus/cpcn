import { showAlert } from './alert';

const splitArr = (arr) => {
  const parts = [];
  let i = 0;
  while (i < arr.length) {
    parts.push(arr.slice(i, (i += 4)));
  }
  return parts;
};

export const insertGalleryImages = async (parentEl) => {
  let markup = ``;
  try {
    const data = await fetch('./../img/gallery/image_titles.json').then((res) =>
      res.json()
    );

    if (Object.keys(data).length < 4) {
      Object.values(data).map((src) => {
        const singleMarkup = `
        <div class="col-1">
            <div class="gallery__img" background-image="/img/gallery/${
              Object.values(src)[0]
            }"></div>
        </div>
            `;
        // markup.concat(' ', singleMarkup);
        markup = markup.concat('', singleMarkup);
      });
    } else if (Object.keys(data).length % 4 === 0) {
      const dataArr = Object.values(data);
      const markupGroups = splitArr(dataArr);

      markupGroups.forEach((group, i) => {
        if (+i % 2 === 0) {
          const rowLeftMarkup = `
            <div class="col-1">
                <div class="gallery__img" style="background-image: url(./../img/gallery/${group[0].src})"></div>
            </div>
            <div class="col-2">
                <div class="gallery__img" style="background-image: url(./../img/gallery/${group[1].src})"></div>
                <div class="gallery__img" style="background-image: url(./../img/gallery/${group[2].src})"></div>
                <div class="gallery__img" style="background-image: url(./../img/gallery/${group[3].src})"></div>
            </div>
          `;
          markup = markup.concat('', rowLeftMarkup);
        } else {
          const rowRightMarkup = `
          <div class="col-2">
            <div class="gallery__img" style="background-image: url(./../img/gallery/${group[1].src})"></div>
            <div class="gallery__img" style="background-image: url(./../img/gallery/${group[2].src})"></div>
            <div class="gallery__img" style="background-image: url(./../img/gallery/${group[3].src})"></div>
          </div>
          <div class="col-1">
              <div class="gallery__img" style="background-image: url(./../img/gallery/${group[0].src})"></div>
          </div>
            `;
          markup = markup.concat('', rowRightMarkup);
        }
      });
    } else if (Object.keys(data).length % 4 !== 0) {
      const dataArr = Object.values(data);
      const markupGroups = splitArr(dataArr);

      markupGroups.forEach((group, i) => {
        if (group.length === 4) {
          if (+i % 2 === 0) {
            const rowLeftMarkup = `
                  <div class="col-1">
                      <div class="gallery__img" style="background-image: url(./../img/gallery/${group[0].src})"></div>
                  </div>
                  <div class="col-2">
                      <div class="gallery__img" style="background-image: url(./../img/gallery/${group[1].src})"></div>
                      <div class="gallery__img" style="background-image: url(./../img/gallery/${group[2].src})"></div>
                      <div class="gallery__img" style="background-image: url(./../img/gallery/${group[3].src})"></div>
                  </div>
                `;
            markup = markup.concat('', rowLeftMarkup);
          } else {
            const rowRightMarkup = `
                <div class="col-2">
                  <div class="gallery__img" style="background-image: url(./../img/gallery/${group[1].src})"></div>
                  <div class="gallery__img" style="background-image: url(./../img/gallery/${group[2].src})"></div>
                  <div class="gallery__img" style="background-image: url(./../img/gallery/${group[3].src})"></div>
                </div>
                <div class="col-1">
                    <div class="gallery__img" style="background-image: url(./../img/gallery/${group[0].src})"></div>
                </div>
                `;
            markup = markup.concat('', rowRightMarkup);
          }
        } else {
          group.forEach((obj, i) => {
            const singleRowMarkup = `
                <div class="col-1">
                    <div class="gallery__img" style="background-image: url(./../img/gallery/${group[i].src})"></div>
                </div>
            `;
            markup = markup.concat('', singleRowMarkup);
          });
        }
      });
    }
    parentEl.insertAdjacentHTML('beforeend', markup);
  } catch (err) {
    showAlert('error', err);
  }
};

/// gallery pagination and modal
export const showImg = (imgDiv, galleryContainer, imgDivArr) => {
  //////////////////////////////////////////////////////////// show modal
  // "url("./../img/gallery/image-1623085573518.jpeg")"
  const src = imgDiv.style.backgroundImage.slice(9, 46);
  const dataset = imgDiv.dataset.img;
  // hide scrollbar on body
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';

  //////////////////////////////////////////////////////////// add markup
  // modal markup
  let modal = `
  <div class="modal modal__close">
    <div class="modal__screen">
      <div class="modal__btn modal__btn--prev ">
        <svg>
          <use xlink:href="/img/sprite.svg#icon-chevron-left"></use>
        </svg>
      </div>
      <div class="modal__img">
        <img id="cur_img" class="modal__pic" src="${src}" data-pic="${dataset}"/>
      </div>
      <div class="modal__btn modal__btn--next ">
        <svg>
          <use xlink:href="/img/sprite.svg#icon-chevron-right"></use>
        </svg>
      </div>
      <div class="modal__btn modal__btn--close class="modal__close">
        <svg class="modal__close">
          <use xlink:href="/img/sprite.svg#icon-x" class="modal__close"></use>
        </svg>
      </div>
    </div>
  </div>
  `;
  // add modal
  galleryContainer.insertAdjacentHTML('afterbegin', modal);

  const modalWindow = document.querySelector('.modal');
  const hideModal = function () {
    body.style.overflow = 'auto';
    modalWindow.remove();
  };

  //////////////////////////////////////////////////////////// add next markup
  // need current dataset
  const nextBtn = document.querySelector('.modal__btn--next');
  const prevBtn = document.querySelector('.modal__btn--prev');
  let next = 0;
  const following = function () {
    next++;
    const nextDataset = `${+dataset + next}`;

    let nextImgMarkup = '';

    if (nextDataset <= imgDivArr.length) {
      const nextImgSrc = document
        .querySelector(`[data-img="${nextDataset}"]`)
        .style.backgroundImage.slice(9, 46);

      nextImgMarkup = `
        <img id="cur_img" class="modal__pic" src="${nextImgSrc}" data-pic="${nextDataset}"/>
      `;
      document.querySelector('.modal__img').innerHTML = '';
      document.querySelector('.modal__img').innerHTML = nextImgMarkup;
    } else {
      hideModal();
    }
  };
  const previous = function () {
    let prevImgMarkup = '';
    const curDataset = document.getElementById('cur_img').dataset.pic;

    const prevDataset = +curDataset - 1;

    if (prevDataset > 0) {
      const prevImgSrc = document
        .querySelector(`[data-img="${prevDataset}"]`)
        .style.backgroundImage.slice(9, 46);
      prevImgMarkup = `
        <img id="cur_img" class="modal__pic" src="${prevImgSrc}" data-pic="${prevDataset}"/>
      `;
      document.querySelector('.modal__img').innerHTML = '';
      document.querySelector('.modal__img').innerHTML = prevImgMarkup;
    } else {
      hideModal();
    }
  };
  nextBtn.addEventListener('click', following);
  prevBtn.addEventListener('click', previous);

  if (modalWindow) {
    // listening for closing
    modalWindow.addEventListener('click', (e) => {
      const isModalClose = e.target.classList.contains('modal__close');
      if (isModalClose) {
        hideModal();
      }
    });
    body.addEventListener('keydown', function (e) {
      if (e.keyCode == 37 || e.keyCode == 38) previous();
      if (e.keyCode == 39 || e.keyCode == 40) following();
      if (e.keyCode == 27) hideModal();
    });
  }
};
