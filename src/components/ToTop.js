import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

const ToTop = ({scrollToTop}) => {
  return (
    <FAB
      style={styles.fab}
      large
      icon="chevron-up"
      onPress={() => scrollToTop()}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    backgroundColor: 'white',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
  },
});

export default ToTop;
