import Config from '../../config';
import User from '../../models/user';

export const CREATE_USER_QUESTIONS = 'CREATE_USER_QUESTIONS';
export const UPDATE_USER_POINTS = 'UPDATE_USER_POINTS';
export const SET_USERS = 'SET_USERS';

export const fetchUsers = () => {
  return async (dispatch, getState) => {
    // any async code I want!
    const userKey = getState().auth.userKey;
    const token = getState().auth.token;

    try {
      const response = await fetch(Config.dbUrl + `users.json?auth=${token}`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const resData = await response.json();

      const loadedUsers = [];

      for (const key in resData) {
        loadedUsers.push(new User(key, resData[key].name, resData[key].points));
      }

      dispatch({
        type: SET_USERS,
        users: loadedUsers
      });
    } catch (err) {
      // do something useful
      console.log('error in set_users: ', err);
      throw err;
    }
  };
};

export const updateUserPoints = newPoints => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userKey = getState().auth.userKey;

    const res = await fetch(
      Config.dbUrl + `users/${userKey}.json?auth=${token}`
    );
    const data = await res.json();

    const points = newPoints + data.points;

    const response = await fetch(
      Config.dbUrl + `users/${userKey}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          points
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();

    dispatch({
      type: UPDATE_USER_POINTS,
      pid: id,
      points: points
    });
  };
};
