import axios from 'axios';
import { showAlert } from './alert';

export const createEvent = async (
  title,
  startsAt,
  endsAt,
  location,
  locationUrl,
  description
) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/api/v1/events/',
      data: {
        title,
        startsAt,
        endsAt,
        location,
        locationUrl,
        description,
      },
    });
    if (res.status === 201) {
      window.setTimeout(() => {
        window.location.reload(true);
        window.location.assign('/administration');
      }, 1500);
      showAlert('success', 'Event added successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteEvent = async (id) => {
  try {
    const res = await axios({
      method: 'delete',
      url: `/api/v1/events/${id}`,
    });
    if (res.status === 204) {
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/administration');
      }, 1500);
      showAlert('success', 'Event deleted successfully!');
    }
  } catch (err) {
    showAlert('error', 'Error deleting Event! Try again!');
  }
};
