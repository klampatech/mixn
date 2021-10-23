import React, {useEffect, useRef, useState} from 'react';
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
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import useDebounce from '../hooks/useDebounce';
import ToTop from '../components/ToTop';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNBootSplash from 'react-native-bootsplash';
import store from '../assets/store';

const Home = ({theme, navigation}) => {
  //import paper theme colors
  const {colors} = useTheme();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 200);
  const [loader, setLoader] = useState(true);
  const [cocktails, setCocktails] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // const ToTop = (scrollRef) => {
  //   return (
  //     <FAB
  //       style={styles.fab}
  //       large
  //       icon="chevron-up"
  //       onPress={() => scrollToTop()}
  //     />
  //   );
  // };

  const scrollToTop = () => {
    scrollRef.current.scrollToOffset({y: 0, animated: true});
  };

  const onSearch = value => {
    setSearch(value);
  };
  const getCocktails = (val = '') => {
    return fetch(
      `https://www.thecocktaildb.com/api/json/v2/${store.apiKey}/search.php?s=${val}`,
    )
      .then(response => response.json())
      .then(data => data.drinks)
      .catch(error => {
        console.error(error);
        return [];
      });
  };

  const getCategories = () => {
    fetch(
      `https://www.thecocktaildb.com/api/json/v2/${store.apiKey}/list.php?c=list`,
    )
      .then(response => response.json())
      .then(data => {
        console.log('categories', data);
        setCategories(data.drinks);
        setLoader(false);
      })
      .catch(error => {
        console.error(error);
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

  const renderDrink = ({item, index}) =>
    loader === true && index === 0 ? (
      <Loader />
    ) : loader === false ? (
      <Card
        style={{...styles.card, marginTop: index === 0 ? 25 : null}}
        elevation={3}
        onPress={() =>
          navigation.navigate('Details', {
            name: item.strDrink,
            image: item.strDrinkThumb,
            mix: collectIngredients(item),
            recipe: item.strInstructions,
          })
        }>
        <Card.Title
          title={item.strDrink}
          titleStyle={styles.cardTitle}
          subtitle={item.strCategory}
          right={() => RenderThumbnail(item)}
          rightStyle={styles.thumbnailContainer}
        />
        <Card.Content>
          <Subheading>{item.strAlcoholic}</Subheading>
          <Paragraph>
            Ingredients: {item.strIngredient1}, {item.strIngredient2},{' '}
            {item.strIngredient3}
          </Paragraph>
        </Card.Content>
      </Card>
    ) : null;

  const renderCategory = ({item, index}) =>
    loader === true ? (
      <Loader />
    ) : loader === false ? (
      <Card
        style={{...styles.card, marginTop: index === 0 ? 25 : null}}
        elevation={3}
        onPress={() =>
          navigation.navigate('Category', {
            name: item.strCategory,
          })
        }>
        <Card.Title
          title={item.strCategory + 's'}
          titleStyle={styles.cardTitle}
          right={() => (
            <FontAwesome5
              name="chevron-right"
              size={25}
              color={colors.accent}
            />
          )}
          rightStyle={styles.arrowContainer}
        />
      </Card>
    ) : null;

  const Loader = () => {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  useEffect(() => {
    // Fire off our API call
    getCategories();
  }, []);

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
    <View
      style={styles.container}
      onLayout={() => RNBootSplash.hide({fade: true})}>
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
        renderItem={search.length === 0 ? renderCategory : renderDrink}
        data={search.length === 0 ? categories : cocktails}
        keyExtractor={item => item.idDrink}
        ListHeaderComponent={
          <Searchbar
            placeholder="Search Cocktails"
            onChangeText={onSearch}
            value={search}
            style={styles.searchBar}
          />
        }
        ListEmptyComponent={
          categories.length === 0 ? (
            <Loader />
          ) : (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>
                Sorry! We couldn't find that one...
              </Text>
              <FontAwesome5
                name="glass-martini-alt"
                size={100}
                color="lightgray"
              />

              <Text style={styles.emptyListText}>Try again!</Text>
            </View>
          )
        }
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
    marginRight: 15,
    marginTop: 15,
  },
  arrowContainer: {
    height: 75,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingRight: 25,
  },
});
