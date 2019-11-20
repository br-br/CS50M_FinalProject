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
import { Ionicons } from '@expo/vector-icons';

import Card from '../../components/UI/Card';
import Colors from '../../constants/colors';

const ProfileScreen = props => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState();
  const questions = useSelector(state => state.questions.answeredQuestions);

  // const dispatch = useDispatch();
  let earned = 0;
  let missed = 0;
  questions.forEach(question => {
    if (question.solved) {
      earned += question.points;
    } else {
      missed += question.points;
    }
  });

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ ...styles.noQuestionsText, ...styles.error }}>
          An error occurred while trying to load the Data!
        </Text>
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

  if (!isLoading && questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noQuestionsText}>
          No answered questions found. Maybe start the quiz!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Your Quiz Results</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.infoText}>You collected {earned} points.</Text>
        <Text style={styles.infoText}>You missed {missed} points.</Text>
      </View>

      <FlatList
        data={questions}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <Card style={itemData.item.solved ? styles.solved : styles.answered}>
            <View style={styles.line}>
              <Text>{itemData.item.title}</Text>
              <View style={styles.inline}>
                <Text
                  style={{
                    color: itemData.item.solved ? Colors.primary : Colors.error
                  }}>
                  {itemData.item.points} points
                </Text>
                <Text> </Text>
                {itemData.item.solved ? (
                  <Ionicons
                    style={styles.icon}
                    name={
                      Platform.OS === 'android'
                        ? 'md-checkmark'
                        : 'ios-checkmark'
                    }
                    size={24}
                    color={Colors.primary}
                  />
                ) : (
                  <Ionicons
                    style={styles.icon}
                    name={Platform.OS === 'android' ? 'md-close' : 'ios-close'}
                    size={24}
                    color={Colors.error}
                  />
                )}
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

ProfileScreen.navigationOptions = {
  headerTitle: 'Your Profile:'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: Colors.text
  },
  headerContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 8,
    padding: 5,
    backgroundColor: Colors.shadow,
    borderColor: Colors.gold,
    borderRadius: 50,
    borderWidth: 3
  },
  headerText: {
    fontFamily: 'oregano',
    fontSize: 36,
    color: Colors.gold,
    textAlign: 'center'
  },
  textContainer: {
    marginBottom: 10
  },
  infoText: {
    fontFamily: 'quicksand',
    fontSize: 20,
    color: Colors.gold,
    textAlign: 'center'
  },
  card: {
    marginVertical: 1,
    marginHorizontal: 10
    // backgroundColor: Colors.background
  },

  answered: {
    marginVertical: 1,
    marginHorizontal: 10,
    backgroundColor: Colors.wrong
  },
  solved: {
    marginVertical: 1,
    marginHorizontal: 10,
    backgroundColor: Colors.correct
  },
  line: {
    flex: 1,
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { paddingHorizontal: 10 },
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
    marginTop: 20
  }
});

export default ProfileScreen;
