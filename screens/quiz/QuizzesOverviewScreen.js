import React, { useEffect, useState, useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  View,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';
import Colors from '../../constants/colors';
import DefaultStyles from '../../constants/default-styles';

import * as quizzesActions from '../../store/actions/quizzes';
import * as questionActions from '../../store/actions/questions';

const QuizzesOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const quizzes = useSelector(state => state.quizzes.availableQuizzes);

  const dispatch = useDispatch();

  const loadQuizzes = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(questionActions.resetQuiz());
      await dispatch(quizzesActions.fetchQuizzes());
    } catch (err) {
      setError(err.message);
      console.log('error in loadQuizzes', err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // add a navigation listener to ensure to get always the latest version of the quizzes
  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadQuizzes);
    return () => {
      // cleanup: remove listener when component is unmounted or will rerun
      willFocusSub.remove();
    };
  }, [loadQuizzes]);

  useEffect(() => {
    setIsLoading(true);
    loadQuizzes().then(() => setIsLoading(false));
  }, [dispatch, loadQuizzes]);

  const selectItemHandler = id => {
    props.navigation.navigate('StartQuiz', {
      quizId: id
    });
  };
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ ...styles.infoText, ...styles.error }}>
          An error occurred while trying to load the Quizzes Data!
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

  if (!isLoading && quizzes.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>
          No quizzes found. Maybe start adding some!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.infoText}>
          There {quizzes.length === 1 ? 'is ' : 'are '} {quizzes.length}{' '}
          {quizzes.length === 1 ? 'quiz' : 'quizzes'} available:
        </Text>
      </View>
      <FlatList
        onRefresh={loadQuizzes}
        refreshing={isRefreshing}
        data={quizzes}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <Card style={styles.card}>
            <View style={styles.line}>
              <Text style={DefaultStyles.title}>{itemData.index + 1} : </Text>
              <Text style={DefaultStyles.title}>{itemData.item.title}</Text>
            </View>
            <View style={styles.line}>
              <Text style={DefaultStyles.text}>
                {itemData.item.description.slice(0, 75) + '...'}
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <Button
                color={Colors.accent}
                title='Go to this quiz'
                onPress={() => selectItemHandler(itemData.item.id)}
              />
            </View>
          </Card>
        )}
      />
    </View>
  );
};

QuizzesOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'CS50M Quiz-App',
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
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  card: {
    margin: 6,
    padding: 6,
    backgroundColor: Colors.background2
  },

  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30
  },
  infoText: {
    fontFamily: 'oregano',
    fontSize: 24,
    color: Colors.accent,
    textAlign: 'center'
  },
  error: {
    color: Colors.error
  },
  btnContainer: {
    marginVertical: 6,
    alignItems: 'center'
  }
});

export default QuizzesOverviewScreen;
