import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  Subheading,
  Caption,
  Paragraph,
  Checkbox,
} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Ingredients = ({theme}) => {
  //import paper theme colors
  const {colors} = useTheme();
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [ingredients, setIngredients] = useState({});
  const onSearch = value => {
    setSearch(value);
  };
  const getIngredients = (val = '') => {
    setLoader(true);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?i=${val}
    `)
      .then(response => response.json())
      .then(data => {
        setLoader(false);
        console.log('Ingredients: ', data);
        if (data.ingredients === null) {
          setIngredients(null);
        } else {
          setIngredients(data.ingredients[0]);
        }
      });
  };

  const RenderThumbnail = () => {
    return (
      ingredients.strABV !== null && (
        <View style={styles.thumbnail}>
          <Text style={{fontSize: 35}}>{ingredients.strABV}</Text>
          <Caption>ABV</Caption>
        </View>
      )
    );
  };

  const RenderItem = ({item}) => (
    <Card style={styles.card} elevation={3}>
      <Card.Title
        title={item.strIngredient}
        titleStyle={styles.cardTitle}
        subtitle={'Type: ' + item.strType}
        right={RenderThumbnail}
        rightStyle={styles.thumbnailContainer}
      />
      <Card.Content>
        <View style={styles.row}>
          <Subheading>Alcoholic? </Subheading>
          <Checkbox.Android
            status={item.strAlcohol === 'Yes' ? 'checked' : 'unchecked'}
          />
        </View>
        <Paragraph>{item.strDescription}</Paragraph>
      </Card.Content>
    </Card>
  );

  const ListEmpty = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyListText}>
        Sorry! We couldn't find that one...
      </Text>
      <FontAwesome5 name="glass-martini-alt" size={100} color="lightgray" />
      <Text style={styles.emptyListText}>Try again!</Text>
    </View>
  );

  const ListNew = () => (
    <View style={styles.emptyList}>
      <FontAwesome5 name="glass-martini-alt" size={100} color="lightgray" />
      <Text style={styles.emptyListText}>
        Search your favorite ingredient to learn more!
      </Text>
    </View>
  );

  useEffect(() => {
    getIngredients(search);
  }, [search]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Searchbar
          placeholder="Search Ingredients"
          onChangeText={val => onSearch(val)}
          value={search}
          style={styles.searchBar}
        />
        {search === '' ? (
          <ListNew />
        ) : loader === true ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : ingredients !== null ? (
          <View style={styles.loader}>
            <RenderItem item={ingredients} />
          </View>
        ) : (
          <ListEmpty />
        )}
      </ScrollView>
    </View>
  );
};

export default Ingredients;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
    marginTop: 5,
    flex: 1,
  },
  searchBar: {
    borderRadius: 20,
    height: 50,
    marginTop: 25,
    marginBottom: 10,
  },
  resultsView: {},
  thumbnail: {
    height: 75,
    width: 75,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
  },
  thumbnailContainer: {
    height: 75,
    width: 75,
    margin: 20,
  },
  card: {
    marginBottom: 25,
    marginTop: 25,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 24,
  },
  emptyList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    fontSize: 24,
    color: 'darkgray',
    textAlign: 'center',
    paddingVertical: 25,
  },
  flatList: {
    paddingBottom: 25,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});
