import Question from '../models/question';
import Answer from '../models/answer';

// constructor(
//   id,
//   quizId,
//   title,
//   questionText,
//   answerCorrect,
//   answerWrong1,
//   answerWrong2,
//   answerWrong3,
//   points = 5,
//   answered = false,
//   solved = false
// ) {

const QUESTIONS = [
  new Question(
    '0',
    'quiz-id',
    'Binary',
    'Which RGB representation matches the color purple?',
    '(128, 0, 128)',
    '(255, 128, 0)',
    '(0, 128, 128)',
    '(128, 128, 255)',
    5,
    true,
    false
  ),
  new Question(
    '1',
    'quiz-id',
    'Binary',
    'An 8-bit byte can store values ranging from 0 to 255 -- i.e., 00000000 to 11111111. What do you suppose would happen if you added 1 to 11111111?',
    '0',
    '255',
    '256',
    'No value. The machine would crash.',
    5,
    false,
    true
  ),
  new Question(
    '2',
    'quiz-id',
    'Binary',
    'Which of the following binary sequences would correspond to the RGB color (0,255,0)?',
    '000000001111111100000000',
    '111111110000000011111111',
    '111111110000000000000000',
    '000000000000000011111111',
    5,
    false,
    false
  ),
  new Question(
    '3',
    'quiz-id',
    'Binary',
    'What is the largest decimal number that can be represented in 1 byte?',
    '255',
    '7',
    '63',
    '511',
    5,
    false,
    false
  ),
  new Question(
    '4',
    'quiz-id',
    'Internet',
    'Which of the following statements most accurately describes the Internet?',

    'A vast network of disparate networks connected together by routers and protocols.',
    'A vast collection of documents, images, movies and other resources also known as the World Wide Web.',
    'A global network of computers that all use the same language to communicate and share information.',
    'All answers are correct.',
    5,
    false,
    false
  ),
  new Question(
    '5',
    'quiz-id',
    'Abstraction',
    "In what way is a photograph taken with our mobile device's camera an abstraction?",
    'All answers are correct.',
    'It represents a real phenomenon, in this case a visual scene.',
    'It leaves out irrelevant details of the phenomenon, such as sounds and other signals.',
    'It focuses on only some of aspects of the phenomenon, in this case light waves.',
    5,
    false,
    false
  ),

  new Question(
    '6',
    'quiz-id',
    'Basics',
    'What is computer programming?',

    'Telling the computer what to do through a special set of instructions',
    'Convincing the computer to never freeze',
    'Setting the alarm on a computer',
    'Speeding up your computer',
    5,
    false,
    false
  ),
  new Question(
    '7',
    'quiz-id',
    'Definitions',
    'What is defensive design?',
    'Designing apps to anticipate and avoid possible user errors.',
    'Designing apps to be very secure in storing private user information.',
    'Designing apps to anticipate and avoid bugs in the code.',
    'All answers are correct.',
    5,
    false,
    false
  )
];
export default QUESTIONS;
