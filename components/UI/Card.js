import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

const Card = props => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: Colors.background
  }
});

export default Card;
