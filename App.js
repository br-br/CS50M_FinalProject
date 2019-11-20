import React, { useState } from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension'; // remove before questionion

import NavigationContainer from './navigation/NavigationContainer';
import questionsReducer from './store/reducers/questions';
import quizzesReducer from './store/reducers/quizzes';
import authReducer from './store/reducers/auth';
import usersReducer from './store/reducers/users';

const rootReducer = combineReducers({
  questions: questionsReducer,
  quizzes: quizzesReducer,
  auth: authReducer,
  users: usersReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(rootReducer, composeWithDevTools()); // remove ...devTools before questionion
const store = createStore(persistedReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store);
const fetchFonts = () => {
  return Font.loadAsync({
    oregano: require('./assets/fonts/Oregano-Regular.ttf'),
    quicksand: require('./assets/fonts/Quicksand-Regular.ttf'),
    'quicksand-bold': require('./assets/fonts/Quicksand-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <PersistGate loading={<AppLoading />} persistor={persistor}>
        <NavigationContainer />
      </PersistGate>
    </Provider>
  );
}
