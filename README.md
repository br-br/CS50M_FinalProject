# CS50M Final Project: Self-Designed App

## Objectives

Implement a project with JavaScript and React Native from scratch.  
Develop a workflow for developing mobile apps.  
Design your own interfaces.  

### Requirements

- Must use redux
- Must make at least one network call
- Must have at least one stack navigator
- Must have at least one tab navigator
- Must be at least as large in scope as the previous projects  
  
    

## My Solution : Quiz-App

### Description

  To use the Quiz-App, the user must be authenticated (signup/login).  
  The **admin section** offers the possibility to create a new quiz and add questions to it.   
  The current user can also edit or delete his/her own quizzes and questions.      
  The **quiz section** gives access to all quizzes. The user can do the quizzes and then compare his/her results on the leaderboard.

### redux

  The Quiz-App is build around a redux store using redux, react-redux and redux-thunk.    
  In addition, it uses redux-persist to allow to reload the app into the current state.

### Network calls

  The Quiz-App is connected to a *firebase* backend database.    
  Network calls to the backend are made to load/refresh the quizzes and questions, to create or update them, and to load/refresh the user information for the leaderboard.

### Navigation

  The navigation of my App uses 1 SwitchNavigator, 1 DrawerNavigator, 2 TabNavigators and 4 StackNavigators.    
  The navigation structure is as follows:

- MainNavigator (SwitchNavigator)
  - StartupScreen (try to login with persisted state and switch to the AuthNavigator if needed)
  - AuthNavigator(StackNavigator)
    - AuthScreen
  - QuizNavigator (DrawerNavigator)
    - QuizzesNavigator (StackNavigator)
      - QuizzesOverviewScreen
      - QuizStartScreen
      - QuestionScreen
      - ResultsNavigator
    - ResultsNavigator (TabNavigator)
      - LeaderboardScreen
      - ProfileScreen
    - AdminNavigator (TabNavigator)
      - AdminQuizzesNavigator (StackNavigator)
        - AdminQuizzesScreen
        - EditQuizScreen
      - AdminQuestionsNavigator (StackNavigator)
        - AdminQuestionsScreen
        - EditQuestionScreen

### Demo

A demo video of my implementation run on an Android emulator can be watched here: https://youtu.be/v4rcIIqkGvU

#### Note

Before running my code, please edit the file `config.js` with your own firebase credentials.
