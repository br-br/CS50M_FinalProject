import Question from "../../models/question";
import Config from "../../config";

export const ANSWER_QUESTION = "ANSWER_QUESTION";
export const DELETE_QUESTION = "DELETE_QUESTION";
export const CREATE_QUESTION = "CREATE_QUESTION";
export const UPDATE_QUESTION = "UPDATE_QUESTION";
export const SET_QUESTIONS = "SET_QUESTIONS";
export const RESET_QUIZ = "RESET_QUIZ";
export const INCREASE_CURRENT_INDEX = "INCREASE_CURRENT_INDEX";
export const RESET_CURRENT_INDEX = "RESET_CURRENT_INDEX";

export const setCurrentQuestions = questions => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: SET_QUESTIONS,
        questions: questions,
        currentIndex: 0
      });
    } catch (err) {
      // do something useful
      console.log("error in setCurrentQuestions: ", err.message);
      throw err;
    }
  };
};

export const deleteQuestion = (quizId, questionId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      Config.dbUrl +
        `quizzes/${quizId}/questions/${questionId}.json?auth=${token}`,
      {
        method: "DELETE"
      }
    );
    const resData = await response.json();

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({ type: DELETE_QUESTION, pid: questionId });
  };
};

export const createQuestion = (
  quizId,
  title,
  questionText,
  answerCorrect,
  answerWrong1,
  answerWrong2,
  answerWrong3,
  points,
  answered = false,
  solved = false
) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      Config.dbUrl + `quizzes/${quizId}/questions.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quizId,
          title,
          questionText,
          answerCorrect,
          answerWrong1,
          answerWrong2,
          answerWrong3,
          points,
          answered,
          solved
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_QUESTION,
      questionData: {
        id: resData.name,
        quizId,
        title,
        questionText,
        answerCorrect,
        answerWrong1,
        answerWrong2,
        answerWrong3,
        points,
        answered,
        solved
      }
    });
  };
};

export const updateQuestion = (
  id,
  quizId,
  title,
  questionText,
  answerCorrect,
  answerWrong1,
  answerWrong2,
  answerWrong3,
  points,
  answered,
  solved
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      Config.dbUrl + `quizzes/${quizId}/questions/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quizId,
          title,
          questionText,
          answerCorrect,
          answerWrong1,
          answerWrong2,
          answerWrong3,
          points,
          answered,
          solved
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_QUESTION,
      pid: id,
      questionData: {
        quizId,
        title,
        questionText,
        answerCorrect,
        answerWrong1,
        answerWrong2,
        answerWrong3,
        points,
        answered,
        solved
      }
    });
  };
};

export const answerQuestion = (index, answered, solved) => {
  return async (dispatch, getState) => {
    dispatch({
      type: ANSWER_QUESTION,
      questionIndex: index,
      questionData: {
        answered,
        solved
      }
    });
  };
};
export const setNextQuestionIndex = () => {
  return async dispatch => {
    dispatch({
      type: INCREASE_CURRENT_INDEX
    });
  };
};
export const resetNextQuestionIndex = () => {
  return async dispatch => {
    dispatch({
      type: RESET_CURRENT_INDEX
    });
  };
};
export const resetQuiz = () => {
  return async dispatch => {
    dispatch({
      type: RESET_QUIZ
    });
  };
};
