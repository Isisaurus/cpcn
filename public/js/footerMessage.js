import axios from 'axios';
import { showAlert } from './alert';

const footerSendForm = document.getElementById('contact_form');

export const sendFooterMessage = async (sender) => {
  try {
    // console.log(`In footerMesage.js!`);
    // POST to /contact
    sender.sentAt = new Date(Date.now());
    //////////////////////////////////////////////////////////////////////
    // console.log(sender);
    //////////////////////////////////////////////////////////////////////
    const res = await axios({
      method: 'post',
      url: '/contact',
      data: {
        ...sender,
      },
    });
    if (res.data.status === 'Success') {
      showAlert(
        'success',
        'Thank you for your message! We will get back to you soon!'
      );
      window.setTimeout(() => {
        if (footerSendForm) {
          footerSendForm.reset();
        }
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
  }
};
