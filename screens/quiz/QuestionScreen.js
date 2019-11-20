import React from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { StackActions } from 'react-navigation';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/colors';
import Question from '../../components/quiz/Question';
import * as userActions from '../../store/actions/users';
import * as questionActions from '../../store/actions/questions';

const QuestionScreen = props => {
  const index = useSelector(state => state.questions.currentIndex);
  const numQuestions = useSelector(
    state => state.questions.availableQuestions.length
  );

  if (numQuestions === 0) {
    return null;
  }
  const isLastQuestion = index === numQuestions - 1;

  const question = useSelector(
    state => state.questions.availableQuestions[index]
  );

  const dispatch = useDispatch();

  // const endQuiz = () => {
  //   // console.log('quiz over!');
  //   try {
  //     dispatch(questionActions.resetNextQuestionIndex());
  //   } catch (error) {
  //     console.log('error in endQuiz:', error);
  //   }
  // };

  const evaluateAnswer = (correct, points) => {
    let message =
      'This answer is not correct! \nYou missed ' + points + ' points.';

    if (correct) {
      message =
        "Great! You've chosen the right answer!\nYou get " +
        points +
        ' points.';

      try {
        dispatch(userActions.updateUserPoints(points));
      } catch (err) {
        console.log(err);
      }
    }
    const continueQuiz = isLastQuestion => {
      if (isLastQuestion) {
        dispatch(questionActions.resetNextQuestionIndex());
        // props.navigation.dispatch(StackActions.popToTop());
        props.navigation.navigate('Leaderboard');
      } else {
        dispatch(questionActions.setNextQuestionIndex());
      }
    };

    if (isLastQuestion) {
      message +=
        '\n\nThis has been the last question of the Quiz - Congratulation for finishing!';
    }
    try {
      dispatch(questionActions.answerQuestion(index, true, correct));
    } catch (err) {
      console.log(err);
    }

    Alert.alert('Evaluation:', message, [
      {
        text: isLastQuestion ? 'Okay' : 'Next Question',
        onPress: continueQuiz(isLastQuestion)
      }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Question data={question} index={index} onAnswered={evaluateAnswer} />
    </ScrollView>
  );
};

QuestionScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Quiz',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Profile'
          iconName={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
          onPress={() => {
            navData.navigation.navigate('Profile');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  answersArray: {
    fontFamily: 'quicksand',
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: 20
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10
  }
});

export default QuestionScreen;
