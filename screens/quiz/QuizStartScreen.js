import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Button,
  View,
  Text,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import Card from "../../components/UI/Card";
import Colors from "../../constants/colors";
import DefaultStyles from "../../constants/default-styles";

import * as questionsActions from "../../store/actions/questions";

const QuizStartScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const quizId = props.navigation.getParam("quizId");
  const quizArray = useSelector(state => state.quizzes.availableQuizzes).filter(
    quiz => quiz.id === quizId
  );
  const currentQuiz = quizArray.length > 0 ? quizArray[0] : null;
  const quizTitle = currentQuiz.title;
  const ownerArray = useSelector(state => state.users.users).filter(
    user => user.key === currentQuiz.owner
  );
  const owner = ownerArray.length > 0 ? ownerArray[0] : null;

  const questions = currentQuiz.questions;

  dispatch(questionsActions.setCurrentQuestions(questions));

  const noQuestions = questions.length === 0;
  const answeredQuestions = useSelector(
    state => state.questions.answeredQuestions
  );
  const index = useSelector(state => state.questions.currentIndex);

  const startQuizHandler = () => {
    let startIndex = index;
    if (answeredQuestions.length === numQuestions) {
      resetHandler();
      startIndex = 0;
    }
    props.navigation.navigate("Question", { questionIndex: startIndex });
  };
  const resetHandler = () => {
    dispatch(questionsActions.resetQuiz());
    loadQuestions(quizId);
  };
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ ...styles.noQuestionsText, ...styles.error }}>
          An error occurred while trying to load the Data!
        </Text>
        <View style={styles.btnContainer}>
          <Button
            title="Try again"
            onPress={loadQuestions}
            color={Colors.accent}
          />
        </View>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="Colors.primary" />
      </View>
    );
  }
  const numQuestions = questions.length;

  if (!isLoading && numQuestions === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.noQuestionsText}>
            No questions found. Maybe start adding some!
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <Button
            color={Colors.primary}
            title="Choose another Quiz"
            onPress={() => props.navigation.navigate("Quizzes")}
          />
        </View>
      </View>
    );
  }

  const started = index > 0;
  const allDone = answeredQuestions.length === numQuestions;
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={DefaultStyles.title}>{quizTitle}</Text>
        {owner ? (
          <Text style={DefaultStyles.text}>Created by {owner.name}</Text>
        ) : null}

        <Text style={DefaultStyles.text}>{"\n" + currentQuiz.description}</Text>

        <Text style={DefaultStyles.title}>
          You have to answer {numQuestions} questions.
        </Text>

        <View style={styles.btnContainer}>
          <Button
            color={Colors.accent}
            title={
              allDone ? "Restart Quiz" : started ? "Resume Quiz" : "Start Quiz"
            }
            onPress={() => startQuizHandler()}
          />
        </View>

        {started && !allDone ? (
          <View style={styles.btnContainer}>
            <Button
              color={Colors.primary}
              title="Reset Quiz"
              onPress={() => resetHandler()}
            />
          </View>
        ) : null}
      </Card>
    </View>
  );
};

QuizStartScreen.navigationOptions = navData => {
  return {
    headerTitle: "Quiz Details",

    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Profile"
          iconName={Platform.OS === "android" ? "md-person" : "ios-person"}
          onPress={() => {
            navData.navigation.navigate("Profile");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch"
  },

  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // width: '100%',
    padding: 10,
    margin: 10,
    backgroundColor: Colors.background2
  },
  infoCard: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
    width: "100%",
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
  line: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 50
  },
  noQuestionsText: {
    fontFamily: "oregano",
    fontSize: 24,
    color: Colors.accent,
    textAlign: "center"
  },
  error: {
    color: Colors.error
  },
  btnContainer: {
    margin: 20
  }
});

export default QuizStartScreen;
