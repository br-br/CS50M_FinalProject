import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';
import Question from '../../components/quiz/Question';

import * as quizActions from '../../store/actions/quizzes';
import * as questionActions from '../../store/actions/questions';
import Colors from '../../constants/colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const EditQuizScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const quizId = props.navigation.getParam('quizId');
  const editedQuiz = useSelector(state =>
    state.quizzes.userQuizzes.find(quiz => quiz.id === quizId)
  );

  const currentUser = useSelector(state => state.auth.userKey);

  const dispatch = useDispatch();
  if (editedQuiz) {
    dispatch(questionActions.setCurrentQuestions(editedQuiz.questions));
  }

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedQuiz ? editedQuiz.title : '',
      //   owner: editedQuiz ? editedQuiz.owner : currentUser,
      description: editedQuiz ? editedQuiz.description : ''
    },
    inputValidities: {
      title: editedQuiz ? true : false,
      description: editedQuiz ? true : false
    },
    formIsValid: editedQuiz ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (editedQuiz) {
        await dispatch(
          quizActions.updateQuiz(
            quizId,
            currentUser,
            formState.inputValues.title,
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          quizActions.createQuiz(
            currentUser,
            formState.inputValues.title,
            formState.inputValues.description
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, quizId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ ...styles.noQuizzesText, ...styles.error }}>
          An error occurred while trying to load the Data!
        </Text>
        <View style={styles.btnContainer}>
          <Button
            title='Try again'
            onPress={loadQuizzes}
            color={Colors.accent}
          />
        </View>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color='Colors.primary' />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={100}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='title'
            label='Title'
            errorText='Please enter a valid quiz title!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedQuiz ? editedQuiz.title : ''}
            initiallyValid={!!editedQuiz}
            required
          />
          <Input
            id='description'
            label='Description'
            errorText='Please enter a valid description!'
            keyboardType='default'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedQuiz ? editedQuiz.description : ''}
            initiallyValid={!!editedQuiz}
            required
            multiline
            numberOfLines={3}
            returnKeyType='done'
            blurOnSubmit={true}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditQuizScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('quizId')
      ? 'Edit Quiz'
      : 'Add Quiz',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Save'
          iconName={Platform.OS === 'android' ? 'md-done-all' : 'ios-done-all'}
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
    backgroundColor: Colors.background
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50
  },
  noQuizzesText: {
    fontFamily: 'oregano',
    fontSize: 24,
    color: Colors.accent,
    textAlign: 'center'
  },
  error: {
    color: Colors.error
  },
  btnContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 20
  }
});

export default EditQuizScreen;
