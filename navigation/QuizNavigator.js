import React from 'react';
import { Platform, SafeAreaView, Button, View, StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {
  createDrawerNavigator,
  DrawerNavigatorItems
} from 'react-navigation-drawer';

import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import QuizzesOverviewScreen from '../screens/quiz/QuizzesOverviewScreen';
import QuizStartScreen from '../screens/quiz/QuizStartScreen';
import LeaderboardScreen from '../screens/quiz/LeaderboardScreen';
import QuestionScreen from '../screens/quiz/QuestionScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import AdminQuestionsScreen from '../screens/user/AdminQuestionsScreen';
import EditQuestionScreen from '../screens/user/EditQuestionScreen';
import AdminQuizzesScreen from '../screens/user/AdminQuizzesScreen';
import EditQuizScreen from '../screens/user/EditQuizScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';

import Colors from '../constants/colors';
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor:
      Platform.OS === 'android' ? Colors.primary : Colors.primary.Text
  },
  headerTitleStyle: {
    fontSize: 28,
    fontWeight: '400',
    fontFamily: 'oregano'
  },
  headerBackTitleStyle: {
    fontSize: 24,
    fontWeight: '200',
    fontFamily: 'oregano'
  },
  headerTintColor:
    Platform.OS === 'android' ? Colors.primaryText : Colors.primary,
  headerLayoutPreset: 'center'
};

const ResultsNavigator = createBottomTabNavigator(
  {
    Leaderboard: {
      screen: LeaderboardScreen,
      navigationOptions: {
        tabBarLabel: 'Leaderboard',
        tabBarIcon: () => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-trophy' : 'ios-trophy'}
            color={
              Platform.OS === 'android' ? Colors.primaryText : Colors.primary
            }
            size={24}
          />
        )
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Your Results',
        tabBarIcon: () => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
            color={
              Platform.OS === 'android' ? Colors.primaryText : Colors.primary
            }
            size={24}
          />
        )
      }
    }
  },
  {
    navigationOptions: {
      headerTitle: 'Achievements',
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-trophy' : 'ios-trophy'}
          size={24}
          color={drawerConfig.tintColor}
        />
      )
    },

    tabBarOptions: {
      activeTintColor:
        Platform.OS === 'android' ? Colors.primaryText : Colors.primary,
      activeBackgroundColor:
        Platform.OS === 'android' ? Colors.primary : Colors.primary.Text,
      inactiveTintColor:
        Platform.OS === 'android' ? Colors.accentText : Colors.accent,
      inactiveBackgroundColor:
        Platform.OS === 'android' ? Colors.accent : Colors.accent.Text,
      showLabel: false,
      showIcon: true
    },
    defaultNavigationOptions: defaultNavOptions
  }
);
const QuestionsNavigator = createStackNavigator(
  {
    StartQuiz: QuizStartScreen,
    Question: QuestionScreen,
    Results: ResultsNavigator
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const QuizzesNavigator = createStackNavigator(
  {
    Quizzes: QuizzesOverviewScreen,
    // Quiz: QuestionsNavigator
    StartQuiz: QuizStartScreen,
    Question: QuestionScreen,
    Results: ResultsNavigator
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={
            Platform.OS === 'android'
              ? 'md-help-circle-outline'
              : 'ios-help-circle-outline'
          }
          size={24}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const AdminQuestionsNavigator = createStackNavigator(
  {
    UserQuestions: AdminQuestionsScreen,
    EditQuestion: EditQuestionScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);
const AdminQuizzesNavigator = createStackNavigator(
  {
    UserQuizzes: AdminQuizzesScreen,
    EditQuiz: EditQuizScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);
const AdminNavigator = createBottomTabNavigator(
  {
    AdminQuizzes: {
      screen: AdminQuizzesNavigator,
      navigationOptions: {
        tabBarLabel: 'Admin quizzes',
        tabBarIcon: () => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-build' : 'ios-build'}
            color={
              Platform.OS === 'android' ? Colors.primaryText : Colors.primary
            }
            size={24}
          />
        )
      }
    },
    AdminQuestions: {
      screen: AdminQuestionsNavigator,
      navigationOptions: {
        tabBarLabel: 'Admin Questions',
        tabBarIcon: () => (
          <Ionicons
            name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
            color={
              Platform.OS === 'android' ? Colors.primaryText : Colors.primary
            }
            size={24}
          />
        )
      }
    }
  },
  {
    navigationOptions: {
      headerTitle: 'Admin',
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-construct' : 'ios-construct'}
          size={24}
          color={drawerConfig.tintColor}
        />
      )
    },

    tabBarOptions: {
      activeTintColor:
        Platform.OS === 'android' ? Colors.primaryText : Colors.primary,
      activeBackgroundColor:
        Platform.OS === 'android' ? Colors.primary : Colors.primary.Text,
      inactiveTintColor:
        Platform.OS === 'android' ? Colors.accentText : Colors.accent,
      inactiveBackgroundColor:
        Platform.OS === 'android' ? Colors.accent : Colors.accent.Text,
      showLabel: false,
      showIcon: true
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const QuizNavigator = createDrawerNavigator(
  {
    Quizzes: QuizzesNavigator,
    Results: ResultsNavigator,
    Admin: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerNavigatorItems {...props} />
            <View style={styles.logoutContainer}>
              <Ionicons
                name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
                color={
                  Platform.OS === 'android'
                    ? Colors.primaryText
                    : Colors.primary
                }
                size={24}
              />
              <View style={styles.buttonContainer}>
                <Button
                  title='Logout'
                  color={Colors.primary}
                  onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate('Auth'); // now done in NavigationContainer
                  }}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    }
  }
);
const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Quiz: QuizNavigator
});

const styles = StyleSheet.create({
  logoutContainer: {
    flexDirection: 'row',

    backgroundColor:
      Platform.OS === 'android' ? Colors.primary : Colors.primaryText,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10
  },
  buttonContainer: {
    marginLeft: 25
  }
});

export default createAppContainer(MainNavigator);
