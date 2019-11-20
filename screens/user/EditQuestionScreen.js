import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  Text,
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

import * as questionsActions from '../../store/actions/questions';
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

const EditQuestionScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const questionId = props.navigation.getParam('questionId');
  const quizId = useSelector(state => state.quizzes.currentQuizId);

  const editedQuestion = useSelector(state =>
    state.questions.availableQuestions.find(
      question => question.id === questionId
    )
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedQuestion ? editedQuestion.title : '',
      questionText: editedQuestion ? editedQuestion.questionText : '',
      answerCorrect: editedQuestion ? editedQuestion.answerCorrect : '',
      answerWrong1: editedQuestion ? editedQuestion.answerWrong1 : '',
      answerWrong2: editedQuestion ? editedQuestion.answerWrong2 : '',
      answerWrong3: editedQuestion ? editedQuestion.answerWrong3 : '',
      points: editedQuestion ? editedQuestion.points : ''
    },
    inputValidities: {
      title: editedQuestion ? true : false,
      questionText: editedQuestion ? true : false,
      answerCorrect: editedQuestion ? true : false,
      answerWrong1: editedQuestion ? true : false,
      answerWrong2: editedQuestion ? true : false,
      answerWrong3: editedQuestion ? true : false,
      points: editedQuestion ? true : false
    },
    formIsValid: editedQuestion ? true : false
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
      if (editedQuestion) {
        await dispatch(
          questionsActions.updateQuestion(
            questionId,
            quizId,
            formState.inputValues.title,
            formState.inputValues.questionText,
            formState.inputValues.answerCorrect,
            formState.inputValues.answerWrong1,
            formState.inputValues.answerWrong2,
            formState.inputValues.answerWrong3,
            +formState.inputValues.points
          )
        );
      } else {
        await dispatch(
          questionsActions.createQuestion(
            quizId,
            formState.inputValues.title,
            formState.inputValues.questionText,
            formState.inputValues.answerCorrect,
            formState.inputValues.answerWrong1,
            formState.inputValues.answerWrong2,
            formState.inputValues.answerWrong3,
            +formState.inputValues.points
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, questionId, quizId, formState]);

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
        <Text style={{ ...styles.noQuestionsText, ...styles.error }}>
          An error occurred while trying to load the Data!
        </Text>
        <View style={styles.btnContainer}>
          <Button
            title='Try again'
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
        <ActivityIndicator size='large' color='Colors.primary' />
      </View>
    );
  }

  // if (!isLoading && questions.length === 0) {
  //   return (
  //     <View style={styles.centered}>
  //       <Text style={styles.noQuestionsText}>
  //         No questions found. Maybe start adding some!
  //       </Text>
  //     </View>
  //   );
  // }

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
            errorText='Please enter a valid category/title!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedQuestion ? editedQuestion.title : ''}
            initiallyValid={!!editedQuestion}
            required
          />
          <Input
            id='questionText'
            label='Question'
            errorText='Please enter a valid question text!'
            keyboardType='default'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedQuestion ? editedQuestion.questionText : ''}
            initiallyValid={!!editedQuestion}
            required
            multiline
            numberOfLines={3}
          />

          <Input
            id='answerCorrect'
            label='Correct answer'
            errorText='Please enter a valid correct answer!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedQuestion ? editedQuestion.answerCorrect : ''}
            initiallyValid={!!editedQuestion}
            required
            returnKeyType='next'
          />

          <Input
            id='points'
            label='Points'
            errorText='Please enter valid points!'
            keyboardType='decimal-pad'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={
              editedQuestion ? editedQuestion.points.toString() : null
            }
            initiallyValid={!!editedQuestion}
            required
            // min={0.1}
          />

          <Input
            id='answerWrong1'
            label='Wrong Answer 1'
            errorText='Please enter a valid wrong answer!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedQuestion ? editedQuestion.answerWrong1 : ''}
            initiallyValid={!!editedQuestion}
            required
            returnKeyType='next'
          />
          <Input
            id='answerWrong2'
            label='Wrong Answer 2'
            errorText='Please enter a valid wrong answer!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedQuestion ? editedQuestion.answerWrong2 : ''}
            initiallyValid={!!editedQuestion}
            required
            returnKeyType='next'
          />
          <Input
            id='answerWrong3'
            label='Wrong Answer 3'
            errorText='Please enter a valid wrong answer!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedQuestion ? editedQuestion.answerWrong3 : ''}
            initiallyValid={!!editedQuestion}
            required
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

EditQuestionScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('questionId')
      ? 'Edit Question'
      : 'Add Question',
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
  noQuestionsText: {
    fontFamily: 'oregano',
    fontSize: 24,
    color: Colors.accent,
    textAlign: 'center'
  },
  error: {
    color: Colors.error
  },
  btnContainer: {
    marginVertical: 20
  }
});

export default EditQuestionScreen;
