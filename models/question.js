class Question {
  constructor(
    id,
    quizId,
    title,
    questionText,
    answerCorrect,
    answerWrong1,
    answerWrong2,
    answerWrong3,
    points = 5,
    answered = false,
    solved = false
  ) {
    this.id = id;
    this.quizId = quizId;
    this.title = title;
    this.questionText = questionText;
    this.answerCorrect = answerCorrect;
    this.answerWrong1 = answerWrong1;
    this.answerWrong2 = answerWrong2;
    this.answerWrong3 = answerWrong3;
    this.points = points;
    this.answered = answered;
    this.solved = solved;
  }
}
export default Question;
