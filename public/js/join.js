import axios from 'axios';
import { showAlert } from './alert';

export const returnDogMemInputs = function (dataset) {
  const dogMember = {
    nickname: '',
    gender: '',
    dateOfBirth: '',
    familyTree: '',
    familyTreeNumber: '',
  };

  dogMember.nickname = document.getElementById(`nickname${dataset}`).value;
  dogMember.dateOfBirth = document.getElementById(`dogdob${dataset}`).value;
  dogMember.familyTree = document.getElementById(`familytree${dataset}`).value;
  dogMember.familyTreeNumber = document.getElementById(
    `number${dataset}`
  ).value;

  const female = document.getElementById(`female${dataset}`);
  const male = document.getElementById(`male${dataset}`);
  if (female.checked) {
    dogMember.gender = female.value;
  } else if (male.checked) {
    dogMember.gender = male.value;
  }
  return dogMember;
};

export const returnFamMemInputs = function (dataset) {
  const famMember = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  };

  if (document.getElementById(`familyFirstName${dataset}`).value) {
    famMember.firstName = document.getElementById(
      `familyFirstName${dataset}`
    ).value;
  } else {
    famMember.firstName = '';
  }

  if (document.getElementById(`familyLastName${dataset}`).value) {
    famMember.lastName = document.getElementById(
      `familyLastName${dataset}`
    ).value;
  } else {
    famMember.lastName = '';
  }

  if (document.getElementById(`familyDob${dataset}`).value) {
    famMember.dateOfBirth = document.getElementById(
      `familyDob${dataset}`
    ).value;
  } else {
    famMember.dateOfBirth = '';
  }

  if (famMember.firstName !== '' && famMember.lastName !== '') {
    return famMember;
  } else return;
};

export const returnFamilyArr = function (family) {
  // define familyMembers array
  const familyMembers = [];
  // forEach family member return a familyMember object using return inputs function
  family.forEach((fam) => {
    const famObj = returnFamMemInputs(fam.dataset.set);
    familyMembers.push(famObj);
  });

  return familyMembers;
};

export const returnDogArr = function (dogs) {
  const dogArr = [];

  dogs.forEach((dog) => {
    const dogObj = returnDogMemInputs(dog.dataset.set);
    dogArr.push(dogObj);
  });

  return dogArr;
};

//HTML markups
export const addFormMarkup = function (dataset, type, parentEl) {
  let markup;
  if (type === 'dog') {
    markup = `
    
    <div
      class="join_form__section join_form__section--2col join_form__section--dogs margin-top-medium" data-set="${dataset}" 
    >
      <div class="join_form__group">
        <label for="nickname${dataset}" class="join_form__label"
          >Roepnaam*</label
        >
        <input
          type="text"
          id="nickname${dataset}"
          class="join_form__input"
          name="nickname${dataset}"
        />
      </div>
      <div class="join_form__gender">
        <div class="join_form__group--radio">
          <input
            id="female${dataset}"
            type="radio"
            name="gender${dataset}"
            value="female"
            checked
          />
          <label for="female${dataset}" class="join_form__label">teef</label>
        </div>
        <div class="join_form__group--radio">
          <input
            id="male${dataset}"
            type="radio"
            name="gender${dataset}"
            value="male"
          />
          <label for="male${dataset}" class="join_form__label">reu</label>
        </div>
      </div>
      <div class="join_form__group">
        <label for="dogdob${dataset}" class="join_form__label"
          >Geboortedatum*</label
        >
        <input
          type="date"
          id="dogdob${dataset}"
          class="join_form__input"
          required
          name="dogdob${dataset}"
        />
      </div>
      <div class="join_form__group"></div>
      <div class="join_form__group">
        <label for="familytree${dataset}" class="join_form__label"
          >Stamboom</label
        >
        <input
          type="text"
          id="familytree${dataset}"
          class="join_form__input"
          name="familytree${dataset}"
        />
      </div>
      <div class="join_form__group">
        <label for="number${dataset}" class="join_form__label"
          >Stamboom Registratie Nummer</label
        >
        <input
          type="text"
          id="number${dataset}"
          class="join_form__input"
          name="number${dataset}"
        />
      </div>
    </div>

  `;
  } else if (type === 'family') {
    markup = `
    <div class="join_form__section join_form__section--2col margin-top-medium join_form__section--fam" data-set="${dataset}">
    <div class="join_form__group">
        <label for="familyFirstName${dataset}" class="join_form__label"
        >Voornaam*</label
        >
        <input
        type="text"
        name="familyFirstName"
        id="familyFirstName${dataset}"
        class="join_form__input"
        required
        />
    </div>
    <div class="join_form__group">
        <label for="familyLastName${dataset}" class="join_form__label"
        >Achternaam*</label
        >
        <input
        type="text"
        name="familyLastName"
        id="familyLastName${dataset}"
        class="join_form__input"
        required
        />
    </div>
    <div class="join_form__group">
        <label for="familyDob${dataset}" class="join_form__label"
        >Geboortedatum*</label
        >
        <input
        type="date"
        name="familyDob"
        id="familyDob${dataset}"
        class="join_form__input"
        required
        />
    </div>

    </div>
          `;
  }
  parentEl.insertAdjacentHTML('beforeend', markup);
};

/////////////////////// send request
const joinForm = document.getElementById('joinForm');
export const join = async (memberObj) => {
  try {
    memberObj.validated = false;
    memberObj.joinedAt = new Date(Date.now());
    //////////////////////////////////////////////////////////////////////
    // console.log(memberObj);
    //////////////////////////////////////////////////////////////////////
    const res = await axios({
      method: 'post',
      url: '/api/v1/members',
      data: {
        ...memberObj,
      },
    });
    if (res.data.status === 'Success') {
      showAlert('success', 'You signed up successfully! Check your email!');
      window.setTimeout(() => {
        if (joinForm) {
          joinForm.reset();
        }
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
  }
};

/////////////////////// create overview markup from input data
const overviewTableMarkup = function (type, data) {
  let markup;
  if (type === 'dogs') {
    markup = data.map((dog) => {
      return `
  <tr>
    <td class="table__dog_info__nickname">${dog.nickname}</td>
    </tr>
  <tr class="table__dog_info__details_row">  
    <td>${dog.gender}</td>
    <td>${dog.dateOfBirth}</td>
    <td>${dog.familyTree}</td>
    <td>${dog.familyTreeNumber}</td>
  </tr>
    `;
    });
  } else if (type === 'family') {
    if (data.length !== 0) {
      markup = data.map((member) => {
        if (member) {
          return `
          <tr>
            <td>${member.firstName} ${member.lastName}</td>
            <td>${member.dateOfBirth}</td>
          </tr>
        `;
        } else {
          return `
          <tr>
            <td>No family members added.</td>
          </tr>
          `;
        }
      });
    } else {
      markup = '';
    }
  }

  const fullMarkup = markup.join('');
  return fullMarkup;
};

////////////////////// add Overview Markup
export const addOverview = function (parentEl, memberState) {
  // calculate member fee from database values
  const memberFee = memberState.fee + ` €`;

  const familyMarkups = overviewTableMarkup(
    'family',
    memberState.familyMembers
  );
  const dogMarkups = overviewTableMarkup('dogs', memberState.dogs);

  const markup = `
  <table class="table__personal_info">
    <tr>
      <td>Full Name</td>
      <td>${memberState.firstName} ${memberState.lastName}</td>
    </tr>
    <tr>
      <td>Initials</td>
      <td>${memberState.initials}</td>
    </tr>
    <tr>
      <td>Date Of Birth</td>
      <td>${memberState.dateOfBirth}</td>
    </tr>
    <tr>
      <td>Phone</td>
      <td>${memberState.phone}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${memberState.email}</td>
    </tr>
    <tr>
      <td>Address</td>
      <td>${memberState.address.country}, ${memberState.address.postcode}, ${memberState.address.city}, ${memberState.address.street}</td>
    </tr>
  </table>
  <table class="table__family_info">
    <tr class="table__header">
      <td class="header__tertiary">Family Members</td>
    </tr>
    ${familyMarkups}
  </table>
  <table class="table__dog_info">
    <tr class="table__header">
      <td class="header__tertiary">dogs</td>
    </tr>
    ${dogMarkups}
  </table>
  <table class="table__membership_fee">
    <td>Membership Fee</td>
    <td>${memberFee}</td>
  </table>
  `;
  parentEl.innerHTML = markup;
};
