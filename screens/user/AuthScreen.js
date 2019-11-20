import React, { useState, useReducer, useCallback, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";

import Colors from "../../constants/colors";
import * as authActions from "../../store/actions/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

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

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.name,
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Quiz");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

  if (isSignup) {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        style={styles.screen}
      >
        <LinearGradient
          colors={[Colors.gradient1, Colors.gradient2]}
          style={styles.gradient}
        >
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id="name"
                label="Username"
                keyboardType="default"
                required
                name
                autoCapitalize="words"
                errorText="Please enter a valid username!"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="email"
                label="E-Mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address!"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={12}
                autoCapitalize="none"
                errorText="Please enter a valid password!"
                onInputChange={inputChangeHandler}
                initialValue=""
              />

              <View style={styles.btnContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Button
                    title={"Sign Up"}
                    color={Colors.primary}
                    onPress={authHandler}
                  />
                )}
              </View>
              <View style={styles.btnContainer}>
                <Button
                  title={`Switch to Login`}
                  color={Colors.accent}
                  onPress={() => {
                    setIsSignup(prevState => !prevState);
                  }}
                />
              </View>
            </ScrollView>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  } else {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        style={styles.screen}
      >
        <LinearGradient
          colors={[Colors.gradient1, Colors.gradient2]}
          style={styles.gradient}
        >
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id="email"
                label="E-Mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address!"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={12}
                autoCapitalize="none"
                errorText="Please enter a valid password!"
                onInputChange={inputChangeHandler}
                initialValue=""
              />

              <View style={styles.btnContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Button
                    title={"Login"}
                    color={Colors.primary}
                    onPress={authHandler}
                  />
                )}
              </View>
              <View style={styles.btnContainer}>
                <Button
                  title={`Switch to Sign Up`}
                  color={Colors.accent}
                  onPress={() => {
                    setIsSignup(prevState => !prevState);
                  }}
                />
              </View>
            </ScrollView>
          </Card>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate"
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  btnContainer: {
    marginTop: 10
  },
  hidden: {
    display: "none"
  }
});

export default AuthScreen;
