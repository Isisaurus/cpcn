import axios from 'axios';
import { showAlert } from './alert';

export const uploadGalleryImage = async (data) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/users/uploadImage',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Image uploaded successfully!');
      window.setTimeout(() => {
        location.assign('/administration');
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err);
  }
};
