import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={24}
      color={Platform.OS === 'android' ? Colors.primaryText : Colors.primary}
    />
  );
};

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'flex-start' // default
//   }
// });

export default CustomHeaderButton;
