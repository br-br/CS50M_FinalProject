import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
import Config from '../../config';
export const AUTHENTICATE = 'AUTHENTICATE';
export const CREATE_USER = 'CREATE_USER';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userKey, userId, token, expiryTime) => {
  return dispatch => {
    // dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      userKey: userKey,
      userId: userId,
      token: token
    });
  };
};

export const signup = (name, email, password) => {
  return async dispatch => {
    const response = await fetch(Config.signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        returnSecureToken: true
      })
    });

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;

      // let message = 'Something went wrong!';
      let message = errorId;
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(createUser(name, email, resData.localId, resData.idToken));

    const userKey = await getUserKey(resData.localId);

    dispatch(
      authenticate(
        userKey,
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(
      userKey,
      resData.idToken,
      resData.localId,
      expirationDate
    );
  };
};

export const createUser = (name, email, uid, token) => {
  return async dispatch => {
    // any async code you want!

    points = 0;

    const response = await fetch(Config.dbUrl + `users.json?auth=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid,
        name,
        email,
        points
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_USER,
      userData: {
        id: resData[name],
        uid,
        name,
        email,
        points
      }
    });
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(Config.loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    });

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    const userKey = await getUserKey(resData.localId);

    dispatch(
      authenticate(
        userKey,
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(
      userKey,
      resData.idToken,
      resData.localId,
      expirationDate
    );
  };
};
const getUserKey = async id => {
  try {
    const response = await fetch(Config.dbUrl + 'users.json');
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const resData = await response.json();

    let currentUserKey;

    for (const key in resData) {
      if (resData[key].uid === id) {
        currentUserKey = key;
      }
    }

    if (currentUserKey) {
      return currentUserKey;
    }
    return;
  } catch (err) {
    console.log(err);
  }
};
export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (userKey, token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      userKey: userKey,
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
