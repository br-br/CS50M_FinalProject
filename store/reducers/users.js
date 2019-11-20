import {
  CREATE_USER_QUESTIONS,
  UPDATE_USER_POINTS,
  SET_USERS
} from '../actions/users';

const initialState = {
  users: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        ...state,
        users: action.users
      };

    case UPDATE_USER_POINTS:
      const userIndex = state.users.findIndex(
        user => user.userKey === action.pid
      );
      const currentUser = users[userIndex];
      currentUser.points += action.points;

      const updatedUsers = [...state.users];
      updatedUsers[userIndex] = currentUser;
  }
  return state;
};
