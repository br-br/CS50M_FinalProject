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

const Quiz = props => {
  if (!props.data) {
    return;
  }
  const title = props.data.title;
  const description = props.data.description;

  //   const evaluateAnswer = correct => {
  //     props.onAnswered(correct, points);
  //   };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={DefaultStyles.title}>{title}</Text>
        <Text style={DefaultStyles.text}>{description}</Text>
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
  }
});

export default Quiz;
