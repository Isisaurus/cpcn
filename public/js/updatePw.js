import axios from 'axios';
import { showAlert } from './alert';

export const updatePw = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password successfully changed.');
      window.setTimeout(() => {
        location.assign('/administration');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
