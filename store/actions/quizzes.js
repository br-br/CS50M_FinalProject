import Quiz from "../../models/quiz";
import Question from "../../models/question";
import Config from "../../config";

export const DELETE_QUIZ = "DELETE_QUIZ";
export const CREATE_QUIZ = "CREATE_QUIZ";
export const UPDATE_QUIZ = "UPDATE_QUIZ";
export const ADD_QUESTION = "ADD_QUESTION";
export const SET_QUIZZES = "SET_QUIZZES";
export const SELECT_QUIZ = "SELECT_QUIZ";

export const fetchQuizzes = () => {
  return async (dispatch, getState) => {
    // any async code I want!
    const userKey = getState().auth.userKey;
    const token = getState().auth.token;

    try {
      const response = await fetch(Config.dbUrl + `quizzes.json?auth=${token}`);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await response.json();
      // console.log('resData', resData);
      const loadedQuizzes = [];
      const userQuizzes = [];

      for (const key in resData) {
        const quizQuestions = resData[key].questions;
        let questions = [];
        for (const qid in quizQuestions) {
          questions.push(
            new Question(
              qid,
              quizQuestions[qid].quizId,
              quizQuestions[qid].title,
              quizQuestions[qid].questionText,
              quizQuestions[qid].answerCorrect,
              quizQuestions[qid].answerWrong1,
              quizQuestions[qid].answerWrong2,
              quizQuestions[qid].answerWrong3,
              quizQuestions[qid].points,
              quizQuestions[qid].answered,
              quizQuestions[qid].solved
            )
          );
        }

        loadedQuizzes.push(
          new Quiz(
            key,
            resData[key].owner,
            resData[key].title,
            resData[key].description,
            questions
          )
        );
        if (resData[key].owner === userKey) {
          userQuizzes.push(
            new Quiz(
              key,
              resData[key].owner,
              resData[key].title,
              resData[key].description,
              questions
            )
          );
        }
      }

      dispatch({
        type: SET_QUIZZES,
        quizzes: loadedQuizzes,
        userQuizzes: userQuizzes
      });
    } catch (err) {
      // do something useful
      throw err;
    }
  };
};
export const selectQuiz = quizId => {
  return async (dispatch, getState) => {
    dispatch({ type: SELECT_QUIZ, selectedQuiz: quizId });
  };
};
export const deleteQuiz = quizId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      Config.dbUrl + `quizzes/${quizId}.json?auth=${token}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({ type: DELETE_QUIZ, pid: quizId });
  };
};

export const createQuiz = (owner, title, description, questions = []) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(Config.dbUrl + `quizzes.json?auth=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        owner,
        title,
        description
      })
    });

    const resData = await response.json();
    // console.log('resData  in createQuiz', resData);

    dispatch({
      type: CREATE_QUIZ,
      quizData: {
        id: resData.name,
        owner,
        title,
        description,
        questions
      }
    });
  };
};

export const updateQuiz = (id, owner, title, description, questions = []) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      Config.dbUrl + `quizzes/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id,
          owner,
          title,
          description,
          questions
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_QUIZ,
      pid: id,
      quizData: {
        owner,
        title,
        description,
        questions
      }
    });
  };
};
