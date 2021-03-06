import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Subheading,
  Paragraph,
  Portal,
  IconButton,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/core';
import useDebounce from '../hooks/useDebounce';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import store from '../assets/store';
import ToTop from '../components/ToTop';

const Home = ({theme, navigation, route}) => {
  const {colors} = useTheme();
  const isFocused = useIsFocused();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 200);
  const [loader, setLoader] = useState(false);
  const [loaderIndex, setLoaderIndex] = useState(null);
  const [cocktails, setCocktails] = useState([]);
  const [categories, setCategories] = useState([]);
  const name = route.params.name;
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollRef = useRef(null);

  const toggleScrollToTop = scrollY => {
    if (scrollY > 300) {
      if (setShowScrollToTop !== true) {
        setShowScrollToTop(true);
      }
    } else {
      if (setShowScrollToTop !== false) {
        setShowScrollToTop(false);
      }
    }
  };

  const scrollToTop = () => {
    scrollRef.current.scrollToOffset({y: 0, animated: true});
  };

  const onSearch = value => {
    setSearch(value);
  };
  const getCocktails = val => {
    return new Promise(resolve => {
      fetch(
        `https://www.thecocktaildb.com/api/json/v2/${store.apiKey}/filter.php?c=${val}`,
      )
        .then(response => response.json())
        .then(data => resolve(data.drinks))
        .catch(error => {
          console.error(error);
          resolve();
        });
    });
  };

  const getDrink = id => {
    setLoader(true);
    return new Promise(resolve => {
      fetch(
        `https://www.thecocktaildb.com/api/json/v2/${store.apiKey}/lookup.php?i=${id}`,
      )
        .then(response => response.json())
        .then(data => {
          console.log('drink by id', data.drinks);
          resolve(data.drinks[0]);
          setLoader(false);
        })
        .catch(error => {
          console.error(error);
          resolve();
          setLoader(false);
        });
    });
  };

  const RenderThumbnail = item => {
    return (
      <Image
        style={styles.thumbnail}
        source={{
          uri: item.strDrinkThumb,
        }}
      />
    );
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

  const renderDrink = ({item, index}) => (
    <Card
      style={{...styles.card, marginTop: index === 0 ? 25 : null}}
      elevation={3}
      //poll drink info to pass to details
      onPress={() => {
        setLoaderIndex(index);
        getDrink(item.idDrink).then(drink => {
          setShowScrollToTop(false);
          navigation.navigate('Details', {
            name: drink.strDrink,
            image: drink.strDrinkThumb,
            mix: collectIngredients(drink),
            recipe: drink.strInstructions,
          });
        });
      }}>
      <Card.Title
        title={item.strDrink}
        titleStyle={styles.cardTitle}
        titleNumberOfLines={2}
        right={() =>
          loader === true && loaderIndex === index ? (
            <Loader />
          ) : (
            RenderThumbnail(item)
          )
        }
        rightStyle={styles.thumbnailContainer}
      />
    </Card>
  );
  const Loader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  useEffect(() => {
    if (isFocused === true && cocktails.length === 0) {
      setLoader(true);
      getCocktails(name).then(data => {
        setCocktails(data);
        setLoader(false);
      });
    }
  }, [isFocused]);

  useEffect(() => {
    if (search.length === 0) {
      setSearch('');
    }
  }, [search]);

  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (debouncedSearch) {
        // Set isSearching state
        setLoader(true);
        // Fire off our API call
        getCocktails(debouncedSearch).then(results => {
          // Set back to false since request finished
          setLoader(false);
          // Set results state
          setCocktails(results);
        });
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearch],
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <FlatList
        ref={scrollRef}
        onScroll={event => {
          let yOffset = event.nativeEvent.contentOffset.y;
          console.log(yOffset);
          toggleScrollToTop(yOffset);
        }}
        onScrollEndDrag={event => {
          let yOffset = event.nativeEvent.contentOffset.y;
          console.log(yOffset);
          toggleScrollToTop(yOffset);
        }}
        renderItem={renderDrink}
        data={cocktails}
        keyExtractor={item => item.idDrink}
        ListHeaderComponent={
          <View style={styles.header}>
            <IconButton
              icon={() => (
                <FontAwesome5
                  name="chevron-left"
                  size={25}
                  color={colors.accent}
                />
              )}
              color={colors.accent}
              size={20}
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>{name + 's'}</Text>
          </View>
        }
        ListEmptyComponent={<Loader />}
        contentContainerStyle={styles.flatList}
        showsVerticalScrollIndicator={false}
      />
      <Portal>
        {showScrollToTop === true && <ToTop scrollToTop={scrollToTop} />}
      </Portal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 5,
    flex: 1,
  },
  searchBar: {
    borderRadius: 20,
    height: 50,
    marginBottom: 10,
    marginTop: 25,
  },
  resultsView: {},
  thumbnail: {
    height: 75,
    width: 75,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  thumbnailContainer: {
    height: 75,
    width: 75,
    margin: 25,
  },
  card: {
    marginBottom: 10,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 24,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 24,
    color: 'darkgray',
    textAlign: 'center',
    paddingVertical: 25,
  },
  flatList: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    paddingLeft: 25,
    width: '95%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 20,
  },
});
