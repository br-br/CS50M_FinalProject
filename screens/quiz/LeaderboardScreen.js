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
import { Ionicons } from '@expo/vector-icons';

import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';
import Colors from '../../constants/colors';
import DefaultStyles from '../../constants/default-styles';

import * as userActions from '../../store/actions/users';

const LeaderboardScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const users = useSelector(state => state.users.users);
  const currentUserKey = useSelector(state => state.auth.userKey);

  users.sort((a, b) => (a.points < b.points ? 1 : -1));

  const dispatch = useDispatch();

  const loadUsers = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(userActions.fetchUsers());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // add a navigation listener to ensure to get always the latest version of the users
  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', loadUsers);
    return () => {
      // cleanup: remove listener when component is unmounted or will rerun
      willFocusSub.remove();
    };
  }, [loadUsers]);

  useEffect(() => {
    setIsLoading(true);
    loadUsers().then(() => setIsLoading(false));
  }, [dispatch, loadUsers]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ ...styles.noUsersText, ...styles.error }}>
          An error occurred while trying to load the Leaderboard!
        </Text>
        <Text style={{ ...styles.noUsersText, ...styles.error }}>{error}</Text>
        <View style={styles.btnContainer}>
          <Button title='Try again' onPress={loadUsers} color={Colors.accent} />
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

  if (!isLoading && users.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noUsersText}>
          No entries found. Maybe start answering questions to get your place on
          the leaderboard!
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name={Platform.OS === 'android' ? 'md-trophy' : 'ios-trophy'}
          size={36}
          color={Colors.gold}
        />
        <Text style={styles.headerText}>Leaderboard</Text>
        <Ionicons
          name={Platform.OS === 'android' ? 'md-trophy' : 'ios-trophy'}
          size={36}
          color={Colors.gold}
        />
      </View>
      <FlatList
        onRefresh={() => {}}
        refreshing={isRefreshing}
        data={users}
        keyExtractor={item => item.key}
        renderItem={itemData => (
          <Card
            style={{
              ...styles.card,
              backgroundColor:
                itemData.item.key === currentUserKey
                  ? Colors.gold
                  : Colors.background
            }}>
            <View style={styles.line}>
              <Text style={DefaultStyles.title}>
                {itemData.index + 1} : {itemData.item.name}
              </Text>

              <Text style={DefaultStyles.title}>
                {itemData.item.points} points
              </Text>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

LeaderboardScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Leaderboard',
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
          title='Profile'
          iconName={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
          onPress={() => {
            navData.navigation.navigate('Profile');
          }}
        />
      </HeaderButtons>
    )
  };
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
  card: {
    marginVertical: 2,
    marginHorizontal: 10
    // backgroundColor: Colors.background
  },

  line: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 50
  },
  noUsersText: {
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

export default LeaderboardScreen;
