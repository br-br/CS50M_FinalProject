import { StyleSheet } from 'react-native';
import Colors from './colors';

export default StyleSheet.create({
  text: {
    fontFamily: 'quicksand',
    fontSize: 15,
    color: Colors.text
  },
  title: {
    fontFamily: 'quicksand-bold',
    fontSize: 18,
    color: Colors.text,
    marginVertical: 15
  }
});
