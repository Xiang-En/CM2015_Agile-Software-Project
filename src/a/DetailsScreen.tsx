////////////// Nicole coded whole file //////////////////

//import neccessary libraries 
import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Dimensions,
  Image, 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { DealComponent } from '../modules/EcoEatsDeals';
import { deal_page } from '../models';
import { getEcoEatsDBConnection, getDealsPage } from '../../db-service';
import { Searchbar } from 'react-native-paper';
import { UserContext } from '../../UserContext';
import { useIsFocused } from '@react-navigation/native';

type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Details'
>;

type Props = {
  navigation: DetailsScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const columnWidth = width / 2;

const DetailsScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dealsEntity, setDealsEntity] = React.useState<deal_page[]>([]);
  const [displayAdd, setDisplayAdd] = React.useState(false);
  const { isBusinessAccount } = useContext(UserContext);

  let db;

  const loadDataCallback = useCallback(async (searchR: string) => {
    try {
      const db = await getEcoEatsDBConnection();
      const result = await getDealsPage(db, searchR);
      setDealsEntity(result);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const accTypeCheck = () =>{
    if(isBusinessAccount == 1 || isBusinessAccount == 0){
      setDisplayAdd(true);
    }else{
      setDisplayAdd(false);
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      loadDataCallback(searchQuery);
      console.log("deals screen");
      console.log(isBusinessAccount);
      accTypeCheck();
      console.log(displayAdd);
    }
  }, [loadDataCallback, searchQuery, isFocused,displayAdd]);

// display search bar and deal posts and correct image for each deal
  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.search}>
            <Searchbar
              style={styles.searchbar}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              icon={() => <Text style={{ fontSize: 20 }}>🔍</Text>}
            />
          </View>
          {displayAdd? (
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => navigation.navigate('AddDeal')}
            >
              <Text style={styles.plusButtonText}>+</Text>
            </TouchableOpacity>
          ):null} 
          <View style={styles.postContainer}>
            {dealsEntity.map((deal) => (
              <TouchableOpacity
                key={deal.deal_Id}
                onPress={() => navigation.navigate('DealDetails', { deal })}
                style={styles.itemContainer}
              >
                <View>
                  <DealComponent
                    key={deal.deal_Id}
                    deal={deal}
                    picture={deal.picture ? deal.picture : { uri: 'https://i.imgur.com/50exbMa.png' }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// deal page styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(250,250,250)',
    flex: 1,
  },
  search: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  searchbar: {
    width: width * 0.95,
    borderRadius: width * 0.05,
    borderColor: 'gray',
    borderWidth: 1.5,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  postContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  itemContainer: {
    width: columnWidth - 15,
  },
  plusButton: {
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1,
  },
  plusButtonText: {
    color: 'white',
    fontSize: 30,
  },
  image: {
    width: columnWidth - 15,
    height: columnWidth - 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default DetailsScreen;
