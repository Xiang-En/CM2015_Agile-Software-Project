////////////// coded by Nicole and Thien Tran ///////////////////

///////////Nicole coded this///////////
//import neccessary libraries
import React, { useCallback, useEffect, useState, useContext} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import { ExploreComponent } from '../modules/EcoEatsExplore'; // Create this component similar to DealComponent
import { explore_page } from '../models'; // Create this model similar to deal_page
import { getEcoEatsDBConnection, getExplorePage } from '../../db-service'; // Create functions similar to getDealsPage
import { Searchbar } from 'react-native-paper';


import { useIsFocused } from '@react-navigation/native';
import { UserContext } from '../../UserContext';

///////////Nicole coded this///////////
type ExploreScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Explore'
>;

type Props = {
  navigation: ExploreScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const columnWidth = width / 2;
const ExploreScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Food');
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreEntity, setExploreEntity] = useState<explore_page[]>([]);
  let db: any;  // Make sure to define the type for db if needed
  const {userId} = useContext(UserContext);

  ///////////Nicole coded this///////////
  //check if item is food or activitiy and display in correct food/item page
  const loadDataCallback = useCallback(async (searchR: string) => {
    try {
      // 0 for food, 1 for activity
      const type = activeTab === 'Food' ? 0 : 1;
      db = await getEcoEatsDBConnection();
      const result = await getExplorePage(db, type, searchR);
      setExploreEntity(result);
      console.log("explore entity");
      console.log(exploreEntity);
    } catch (error) {
      console.error(error);
    }
  }, [activeTab]);
  ///////////Thien Tran coded this///////////
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      loadDataCallback(searchQuery);
    }
  }, [loadDataCallback, searchQuery,isFocused]);

  return (
    ///////////Thien Tran coded this///////////
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* food and activity bar */}
        <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Food' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('Food')}
        >
          <Text style={[styles.tabText, activeTab === 'Food' && styles.boldText]}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Activities' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('Activities')}
        >
          <Text style={[styles.tabText, activeTab === 'Activities' && styles.boldText]}>Activities</Text>
        </TouchableOpacity>
        </View>

        {/* cuong coded this */}
        <View style={styles.container}>
          <View style={styles.searchFilterContainer}>
            <Searchbar
              style={styles.searchbar}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              icon={() => <Text style={{ fontSize: 20 }}>🔍</Text>}
            />
            {/* add filter icon next to the search bar */}
            <TouchableOpacity onPress={() => console.log('Filter pressed')}>
            <Image
              source={require('../images/filter-icon.png')}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
          </View>
          {/* Nicole coded this */}
          {userId ? (
          <TouchableOpacity
          style={styles.plusButton}
          onPress={() => navigation.navigate('AddExplorePost')}>
            <Text style={styles.plusButtonText}>+</Text>
          </TouchableOpacity>
          ): null}
          {/* Nicole coded this */}
          <View style={styles.postContainer}>
            {exploreEntity.map((explore) => (
              <TouchableOpacity
                key={explore.explore_Id}
                onPress={() => navigation.navigate('ExploreDetails', { explore })}
                style={styles.itemContainer}
              >
                <View>
                  {/* Nicole coded this */}
                  <ExploreComponent
                    key={explore.explore_Id}
                    explore={explore}
                    picture={
                      explore.picture || 'https://i.imgur.com/50exbMa.png'
                    }
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
///////////Nicole coded this///////////
//styling for explore page
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(250,250,250)',
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor:'white',
  },
   tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 5,
    borderBottomColor: 'lightgray',
  },
  activeTabButton: {
    borderBottomColor: '#71834f',
    borderBottomWidth: 5,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText:{
    fontWeight: 'bold',
    color: '#71834f',
    fontSize: 20,
  },
  searchFilterContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between', // Space between search bar and filter icon
  },
  search: {
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  searchbar: {
    // width: width * 0.95,
    flex: 1,
    borderRadius: width * 0.05,
    borderColor: 'gray',
    borderWidth: 1.5,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  filterIcon: {
    width: 24,
    height: 24,
    marginLeft: 10,
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

});

export default ExploreScreen;
