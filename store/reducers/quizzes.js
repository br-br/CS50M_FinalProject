import {
  DELETE_QUIZ,
  CREATE_QUIZ,
  UPDATE_QUIZ,
  SET_QUIZZES,
  SELECT_QUIZ
} from "../actions/quizzes";
import Quiz from "../../models/quiz";

const initialState = {
  availableQuizzes: [],
  userQuizzes: [],
  currentQuizId: ""
};

export default (state = initialState, action) => {
  // console.log('action: ', action); //###########################################""
  switch (action.type) {
    case SELECT_QUIZ:
      return {
        ...state,
        currentQuizId: action.selectedQuiz
      };
    case SET_QUIZZES:
      return {
        ...state,
        availableQuizzes: action.quizzes,
        userQuizzes: action.userQuizzes
      };
    case CREATE_QUIZ:
      const newQuiz = new Quiz(
        action.quizData.id,
        action.quizData.owner,
        action.quizData.title,
        action.quizData.description
        // action.quizData.questions
      );
      return {
        ...state,
        availableQuizzes: state.availableQuizzes.concat(newQuiz),
        userQuizzes: state.userQuizzes.concat(newQuiz)
      };

    case UPDATE_QUIZ:
      const quizIndex = state.availableQuizzes.findIndex(
        quiz => quiz.id === action.pid
      );
      const userIndex = state.userQuizzes.findIndex(
        quiz => quiz.id === action.pid
      );
      const updatedAvailableQuiz = new Quiz(
        action.pid,
        action.quizData.owner,
        action.quizData.title,
        action.quizData.description,
        action.quizData.questions
      );

      const updatedUserQuizzes = [...state.userQuizzes];
      updatedUserQuizzes[userIndex] = updatedAvailableQuiz;
      const updatedAvailableQuizzes = [...state.availableQuizzes];
      updatedAvailableQuizzes[quizIndex] = updatedAvailableQuiz;
      return {
        ...state,
        availableQuizzes: updatedAvailableQuizzes,
        userQuizzes: updatedUserQuizzes
      };
    case DELETE_QUIZ:
      return {
        ...state,
        currentIndex: 0,
        availableQuizzes: state.availableQuizzes.filter(
          quiz => quiz.id !== action.pid
        ),
        userQuizzes: state.userQuizzes.filter(quiz => quiz.id !== action.pid)
      };
  }
  return state;
};
