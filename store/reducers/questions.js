// import QUESTIONS from '../../data/dummy-data';
import {
  ANSWER_QUESTION,
  DELETE_QUESTION,
  CREATE_QUESTION,
  UPDATE_QUESTION,
  SET_QUESTIONS,
  RESET_QUIZ,
  INCREASE_CURRENT_INDEX,
  RESET_CURRENT_INDEX
} from '../actions/questions';
import Question from '../../models/question';

const initialState = {
  availableQuestions: [],
  answeredQuestions: [],
  currentIndex: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREASE_CURRENT_INDEX:
      const newIndex = state.currentIndex + 1;
      if (newIndex < state.availableQuestions.length) {
        return {
          ...state,
          currentIndex: newIndex
        };
      } else {
        return { ...state };
      }
    case RESET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: 0
      };
    case RESET_QUIZ:
      return { ...initialState };

    case ANSWER_QUESTION:
      const answeredQuestion = new Question(
        state.availableQuestions[action.questionIndex].id,
        state.availableQuestions[action.questionIndex].quizId,
        state.availableQuestions[action.questionIndex].title,
        state.availableQuestions[action.questionIndex].questionText,
        state.availableQuestions[action.questionIndex].answerCorrect,
        state.availableQuestions[action.questionIndex].answerWrong1,
        state.availableQuestions[action.questionIndex].answerWrong2,
        state.availableQuestions[action.questionIndex].answerWrong3,
        state.availableQuestions[action.questionIndex].points,
        action.questionData.answered,
        action.questionData.solved
      );
      const updatedQuestions = [...state.availableQuestions];
      updatedQuestions[action.questionIndex] = answeredQuestion;

      const answeredQuestionIndex = state.answeredQuestions.findIndex(
        question => question.id === answeredQuestion.id
      );
      const updatedAnsweredQuestions = [...state.answeredQuestions];
      if (answeredQuestionIndex >= 0) {
        updatedAnsweredQuestions[answeredQuestionIndex] = answeredQuestion;
      } else {
        updatedAnsweredQuestions.push(answeredQuestion);
      }

      return {
        ...state,
        availableQuestions: updatedQuestions,
        answeredQuestions: updatedAnsweredQuestions
      };

    case SET_QUESTIONS:
      return {
        ...state,
        availableQuestions: action.questions
      };
    case CREATE_QUESTION:
      const newQuestion = new Question(
        action.questionData.id,
        action.questionData.quizId,
        action.questionData.title,
        action.questionData.questionText,
        action.questionData.answerCorrect,
        action.questionData.answerWrong1,
        action.questionData.answerWrong2,
        action.questionData.answerWrong3,
        action.questionData.points,
        false,
        false
      );
      return {
        ...state,
        availableQuestions: state.availableQuestions.concat(newQuestion)
      };
    case UPDATE_QUESTION:
      const questionIndex = state.availableQuestions.findIndex(
        question => question.id === action.pid
      );
      const answeredIndex = state.answeredQuestions.findIndex(
        question => question.id === action.pid
      );
      const updatedAvailableQuestion = new Question(
        action.pid,
        state.availableQuestions[questionIndex].quizId,
        action.questionData.title,
        action.questionData.questionText,
        action.questionData.answerCorrect,
        action.questionData.answerWrong1,
        action.questionData.answerWrong2,
        action.questionData.answerWrong3,
        action.questionData.points,
        action.questionData.answered,
        action.questionData.solved
      );

      const updatedAvailableQuestions = [...state.availableQuestions];
      updatedAvailableQuestions[questionIndex] = updatedAvailableQuestion;
      const updatedAnsQuestions = [...state.answeredQuestions];
      updatedAnsQuestions[answeredIndex] = updatedAvailableQuestion;
      return {
        ...state,
        availableQuestions: updatedAvailableQuestions
      };
    case DELETE_QUESTION:
      return {
        ...state,
        currentIndex: 0,
        availableQuestions: state.availableQuestions.filter(
          question => question.id !== action.pid
        ),
        answeredQuestions: state.answeredQuestions.filter(
          question => question.id !== action.pid
        )
      };
  }
  return state;
};
