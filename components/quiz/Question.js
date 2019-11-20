import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Button,
  Platform,
  StyleSheet
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import DefaultStyles from '../../constants/default-styles';
import Card from '../UI/Card';
import Answer from './Answer';
import { shuffleInPlace } from '../../helpers/functions';

const Question = props => {
  if (!props.data) {
    return;
  }
  const points = props.data.points;
  const question = props.data.questionText;
  const solved = props.data.solved;
  const answered = props.data.answered;
  const answersArray = [
    { correct: true, text: props.data.answerCorrect },
    { correct: false, text: props.data.answerWrong1 },
    { correct: false, text: props.data.answerWrong2 },
    { correct: false, text: props.data.answerWrong3 }
  ];
  const answers = shuffleInPlace(answersArray);

  const evaluateAnswer = correct => {
    props.onAnswered(correct, points);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card
          style={{
            ...styles.question,
            backgroundColor: solved
              ? Colors.correct
              : answered
              ? Colors.wrong
              : Colors.background3
          }}>
          <Text style={DefaultStyles.title}>
            Question {props.index + 1}
            <Text style={DefaultStyles.text}> ({points} points) </Text> :
          </Text>
          <Text style={DefaultStyles.title}>{question}</Text>
        </Card>
        <View style={styles.answers}>
          {answers.map((answer, index) => (
            <Answer
              disabled={false}
              style={styles.answer}
              key={index}
              answer={answer}
              onSelectAnswer={evaluateAnswer}
            />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    padding: 10
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 10
  },
  question: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    width: '100%',
    backgroundColor: Colors.background3,
    marginBottom: 10,
    padding: 10
  },
  answered: {
    margin: 6,
    backgroundColor: Colors.wrong
  },
  solved: {
    margin: 6,
    backgroundColor: Colors.correct
  },
  answers: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 10
  },
  answer: {
    flex: 1,
    minHeight: 50
    // width: '100%'
  }
});

export default Question;
