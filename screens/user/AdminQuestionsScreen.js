import React from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  StyleSheet,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';

import Colors from '../../constants/colors';
import DefaultStyles from '../../constants/default-styles';

import * as questionsActions from '../../store/actions/questions';

const AdminQuestionsScreen = props => {
  const dispatch = useDispatch();

  const quizId = props.navigation.getParam('quizId');

  const availableQuestions = useSelector(
    state => state.questions.availableQuestions
  );

  const editQuestionHandler = id => {
    props.navigation.navigate('EditQuestion', {
      questionId: id,
      quizId: quizId
    });
  };

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(questionsActions.deleteQuestion(quizId, id));
        }
      }
    ]);
  };

  if (availableQuestions.length === 0) {
    if (quizId) {
      return (
        <View style={styles.noQuestions}>
          <Text>No questions found, maybe start creating some?</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.noQuestions}>
          <Text>Select a quiz first, then start adding/editing questions.</Text>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={availableQuestions}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Card
            style={styles.card}
            onSelect={() => {
              editQuestionHandler(item.id);
            }}>
            <View style={styles.question}>
              <Text style={DefaultStyles.title}>
                {'Question ' + (index + 1) + ':'}
              </Text>
              <Text style={DefaultStyles.text}>{item.title}</Text>
            </View>
            <View style={styles.line}>
              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.secondary}
                  title='Edit'
                  onPress={editQuestionHandler.bind(this, item.id)}
                />
              </View>

              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.error}
                  title='Delete'
                  onPress={deleteHandler.bind(this, item.id)}
                />
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
};
AdminQuestionsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Admin Questions',
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
          title='Add'
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditQuestion');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {},
  noQuestions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    margin: 6,
    padding: 10,
    backgroundColor: Colors.background2
  },
  question: {
    marginBottom: 5
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  buttonContainer: { flex: 1, marginHorizontal: 10 }
});

export default AdminQuestionsScreen;
