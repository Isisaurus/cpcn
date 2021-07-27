import axios from 'axios';
import { showAlert } from './alert';

export const updateFees = async function (feeObj, feeId) {
  // send req
  // console.log(feeObj);
  try {
    const res = await axios({
      method: 'post',
      url: `/api/v1/membership/${feeId}`,
      data: {
        ...feeObj,
      },
    });
    if (res.status === 200) {
      window.setTimeout(() => {
        window.location.reload(true);
        window.location.assign('/administration');
      }, 1500);
      showAlert('success', 'Membership fee updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const calculateFees = async function (memberObj) {
  try {
    // fetch membership fee data from database
    const res = await axios({
      method: 'get',
      url: '/api/v1/membership',
    });
    const feeObj = res.data.data.data[0];

    // compare dates (half year fee after 1st of July)
    const regDate = new Date(Date.now());
    const halffeeDate = new Date(`${regDate.getFullYear()}-07-01, 00:00:00`);

    // decide if full or half year fees apply
    let fees;
    if (regDate > halffeeDate) {
      // half year fee applies
      fees = feeObj.halfYearFee;
    } else {
      // full year fee applies
      fees = feeObj.fullYearFee;
    }

    // calculate fees based on memberObj
    let above12 = 0;
    let under12 = 0;

    if (memberObj.familyMembers) {
      memberObj.familyMembers.map((fam) => {
        if (fam) {
          const date = new Date(`${fam.dateOfBirth} 00:00:00`);
          let diff = (date.getTime() - regDate.getTime()) / 1000;
          diff /= 60 * 60 * 24;
          diff = Math.abs(Math.round(diff / 365.25));
          if (diff <= 12) {
            under12++;
          } else if (diff > 12) {
            above12++;
          }
        }
      });
    } else {
      above12 = 0;
      under12 = 0;
    }

    // calculate fee
    const numDogs = memberObj.dogs.length;
    const memberFee = fees.membership * 1;
    const registrationFee = fees.registration * 1;
    const dogFee = numDogs > 3 ? fees.dog * (numDogs - 3) : 0;
    const familyFee = fees.under12 * under12 + fees.family * above12;

    // return full fee
    const finalFee = memberFee + registrationFee + dogFee + familyFee;
    // console.log(finalFee);
    return finalFee;
  } catch (err) {
    showAlert('error', `Error calculating membership fee.`);
  }
};
