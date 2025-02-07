////////////////////Nicole coded whole file////////////////////////////////
import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { explore_page } from '../models';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ExploreComponent: React.FC<{
  explore: explore_page;
  picture: any;
}> = ({ explore: { title, description, explore_Id, date_created }, picture }) => {
  return (
    <View style={styles.exploreContainer}>
      <Image style={styles.image} source={{uri:picture}} />
      <View style={styles.exploreTextContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{date_created}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  exploreContainer: {
    width: screenWidth * 0.45,
    height: screenHeight * 0.27,
    marginTop: 10,
    paddingHorizontal: 7.5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  exploreTextContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  description: {
    fontSize: 16,
    color: 'gray',
  },
  image: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.2,
    borderRadius: 10,
  },
});

export default ExploreComponent;
