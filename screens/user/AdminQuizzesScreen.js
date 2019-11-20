import React from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  StyleSheet,
  Alert
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import Card from "../../components/UI/Card";

import Colors from "../../constants/colors";
import DefaultStyles from "../../constants/default-styles";

import * as quizzesActions from "../../store/actions/quizzes";
import * as questionActions from "../../store/actions/questions";

const AdminQuizzesScreen = props => {
  const availableQuizzes = useSelector(state => state.quizzes.userQuizzes);
  // console.log("$$$$$$$$$$ AdminQuizzesScreen $$$$$$$$$$$$$$$");
  const dispatch = useDispatch();

  const editQuizHandler = id => {
    dispatch(quizzesActions.selectQuiz(id));
    props.navigation.navigate("EditQuiz", { quizId: id });
  };
  const addQuestionsHandler = id => {
    {
      dispatch(quizzesActions.selectQuiz(id));
      const editedQuiz = availableQuizzes.find(quiz => quiz.id === id);

      dispatch(questionActions.setCurrentQuestions(editedQuiz.questions));
      props.navigation.navigate("UserQuestions", {
        quizId: id
      });
    }
  };

  const deleteHandler = id => {
    Alert.alert("Are you sure?", "Do you really want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(quizzesActions.deleteQuiz(id));
        }
      }
    ]);
  };

  if (availableQuizzes.length === 0) {
    return (
      <View style={styles.noQuizzes}>
        <Text>No quizzes found, maybe start creating some?</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={availableQuizzes}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Card
            style={styles.card}
            onSelect={() => {
              editQuizHandler(item.id);
            }}
          >
            <View style={styles.quiz}>
              <Text style={DefaultStyles.title}>
                {"Quiz " + (index + 1) + ":   " + item.title}
              </Text>
              <Text style={DefaultStyles.text}>{item.description}</Text>
            </View>

            <View style={styles.line}>
              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.secondary}
                  title="Edit"
                  onPress={() => {
                    editQuizHandler(item.id);
                  }}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.error}
                  title="Delete"
                  onPress={deleteHandler.bind(this, item.id)}
                />
              </View>
            </View>
            <View style={styles.line}>
              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.accent}
                  title="Add/Edit Questions"
                  onPress={() => addQuestionsHandler(item.id)}
                />
              </View>
            </View>
          </Card>
          // </QuizItem>
        )}
      />
    </View>
  );
};
AdminQuizzesScreen.navigationOptions = navData => {
  return {
    headerTitle: "Admin Quizzes",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditQuiz");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {},
  noQuizzes: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    margin: 6,
    padding: 10,
    backgroundColor: Colors.background2
  },
  quiz: {
    marginBottom: 5
  },
  line: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10
  },
  buttonContainer: { flex: 1, marginHorizontal: 10 }
});

export default AdminQuizzesScreen;
