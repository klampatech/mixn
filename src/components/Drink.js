import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Card,
  Subheading,
  Paragraph,
  Text,
  Divider,
  Caption,
} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useTheme} from 'react-native-paper';

const Drink = ({image, name, recipe, mix, navigation}) => {
  const {colors} = useTheme();

  const RenderItem = ({item}) => (
    <Subheading>
      {item.measure}
      {item.measure[-1] !== ' ' && ' '}
      {item.ingredient}
    </Subheading>
  );

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.header}>
        <FontAwesome5
          name="arrow-left"
          size={35}
          color={colors.accent}
          onPress={() => navigation.navigate('Home')}
        />
        <Text style={styles.title}>{name}</Text>
      </View>
      <Card style={styles.card} elevation={3}>
        <Card.Cover
          style={styles.cardCover}
          source={
            image !== null
              ? {uri: `${image}`}
              : require('../assets/images/nopic.jpeg')
          }
        />
        <Card.Content style={styles.cardContent}>
          <Caption style={styles.caption}>RECIPE</Caption>
          <Divider />
          <Paragraph style={styles.paragraph}>{recipe}</Paragraph>
          <Caption style={styles.caption}>MEASUREMENTS & INGREDIENTS</Caption>
          <Divider style={{marginBottom: 5}} />
          {mix.map((item, index) => (
            <RenderItem item={item} key={item.ingredient + index.toString()} />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default Drink;

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    paddingLeft: 25,
    width: '95%',
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
    paddingTop: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardCover: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  caption: {
    paddingTop: 25,
  },
});
