import axios from 'axios';
import { showAlert } from './alert';

export const createNews = async (header, date, description) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/pups/',
      data: {
        header,
        date,
        description,
      },
    });
    if (res.status === 201) {
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/administration');
      }, 1500);
      showAlert('success', 'News added successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteNews = async (id) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/pups/${id}`,
    });
    if (res.status === 204) {
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/administration');
      }, 1500);
      showAlert('success', 'News deleted successfully!');
    }
  } catch (err) {
    showAlert('error', 'Error deleting News! Try again!');
  }
};
