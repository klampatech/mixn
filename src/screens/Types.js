import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Card, Subheading, Paragraph, Text, Divider} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useTheme} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import Drink from '../components/Drink';
import store from '../assets/store';

const Types = ({route, navigation, theme}) => {
  const [cocktail, setCocktail] = useState(null);
  const {colors} = useTheme();
  const isFocused = useIsFocused();

  const getRandomCocktail = () => {
    fetch(
      `https://www.thecocktaildb.com/api/json/v2/${store.apiKey}/random.php`,
    )
      .then(response => response.json())
      .then(data => {
        console.log('Cocktail: ', data);
        setCocktail(data.drinks[0]);
      });
  };

  const collectIngredients = item => {
    let ingredients = [];
    for (let i = 1; i < 16; i++) {
      let ingredient = null;
      let measure = null;
      let ing = `strIngredient${i.toString()}`;
      let m = `strMeasure${i.toString()}`;
      if (item[ing] !== null) {
        ingredient = item[ing];
      }
      if (item[m] !== null) {
        measure = item[m];
      }
      if (ingredient !== null && measure !== null) {
        ingredients.push({
          ingredient: ingredient,
          measure: measure,
        });
      }

      console.log(ingredients);
    }
    return ingredients;
  };

  useEffect(() => {
    if (isFocused === true) {
      getRandomCocktail();
    } else {
      setCocktail(null);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      {cocktail === null ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Drink
          name={cocktail.strDrink}
          image={cocktail.strDrinkThumb}
          recipe={cocktail.strInstructions}
          mix={collectIngredients(cocktail)}
          navigation={navigation}
          back={false}
        />
      )}
    </View>
  );
};

export default Types;

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
  content: {flex: 0.85},
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
  divider: {
    height: '100%',
    width: 0.5,
    marginHorizontal: 10,
  },
  cardCover: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
