import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Subheading} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import Drink from '../components/Drink';

const Details = ({route, navigation, theme}) => {
  const {colors} = useTheme();
  const name = route.params.name;
  const image = route.params.image;
  const mix = route.params.mix;
  const recipe = route.params.recipe;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <Drink
        name={name}
        image={image}
        mix={mix}
        recipe={recipe}
        navigation={navigation}
      />
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    flex: 1,
  },
  title: {
    fontSize: 36,
    paddingLeft: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: 25,
  },
  content: {
    height: '80%',
  },
  card: {
    borderRadius: 20,
    padding: 0,
    flex: 1,
    marginBottom: 25,
  },
  paragraph: {
    fontSize: 20,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 10,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  cardCover: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
