import React from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Card from '../UI/Card';

const Answer = props => {
  const evaluateAnswer = () => {
    const correct = props.answer.correct;
    // let message = "You've chosen the right answer!";
    // if (!correct) {
    //   message = 'This answer is not correct!';
    // }
    props.onSelectAnswer(correct);
  };
  return (
    <Card style={styles.container}>
      <TouchableOpacity disabled={props.disabled} onPress={evaluateAnswer}>
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{props.answer.text}</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    backgroundColor: Colors.primary
    // minHeight: 100
  },
  answerContainer: {
    padding: 10
  },
  answerText: {
    color: Colors.primaryText
  }
});

export default Answer;
