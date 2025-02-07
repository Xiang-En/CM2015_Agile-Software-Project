////////////////////Cuong//////////////////////////////// Cuong coded the whole file
//import neccessary libraries
import React, { useCallback, useEffect, useState,useContext } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import { ShareComponent } from '../modules/EcoEatsShare';
import { share_page } from '../models';
import { getEcoEatsDBConnection, getSharePage} from '../../db-service';

import { Searchbar } from 'react-native-paper';

import { useIsFocused } from '@react-navigation/native';

import { UserContext } from '../../UserContext';

type SharingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Sharing'
>;

type Props = {
  navigation: SharingScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const columnWidth = width / 2;

const SharingScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = React.useState("");
  const [newsearchQuery, setNewSearchQuery] = React.useState("");
  const [shareEntity, setShareEntity] = React.useState<share_page[]>([]);
  let db;
  const [shareType, setShareType] = useState(0);
  const {userId} = useContext(UserContext);
  const [currentUserId, setCurrentUserId] = React.useState<number|null>();
  // const { userId } = useContext(UserContext);

// Import images
// const imageMap = {
//     "Tekas-9 Beans-1": require('../images/share/1.png'),
//   };

  const loadDataCallback = useCallback(async (type:number, searchR:string) =>{
    try{
        db = await getEcoEatsDBConnection();
        const result = await getSharePage(db,type,searchR,undefined);
        setShareEntity(result);
    } catch(error){
        console.error(error);
    }
  },[]);

 
  const isFocused = useIsFocused();

  useEffect(()=>{
    if(isFocused){
        loadDataCallback(shareType,searchQuery);
        console.log(userId);
        setCurrentUserId(userId);
    }
  },[loadDataCallback,shareType,searchQuery,isFocused, userId]);


  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.container} >
                <View style={styles.typeButtonsBoth}>
                    {/* <Button
                        title="Foods"
                        onPress={() => setShareType(0)}
                    /> */}
                    <TouchableOpacity style={[styles.button, shareType == 0 && styles.buttonPressed,]} onPress={() => setShareType(0)}>
                      <Text style={[styles.buttonText, shareType == 0 && styles.boldText]}>Foods</Text>
                    </TouchableOpacity>
                    {/* <Button
                        title="Items"
                        onPress={() => setShareType(1)}
                    /> */}
                    <TouchableOpacity style={[styles.button, shareType == 1 && styles.buttonPressed,]} onPress={() => setShareType(1)}>
                      <Text style={[styles.buttonText, shareType == 1 && styles.boldText]}>Items</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.search}>
                  {/* <TextInput style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} /> */}
                      <Searchbar style={styles.searchbar}
                          placeholder="Search"
                          onChangeText={setSearchQuery}
                          value={searchQuery}
                          icon={() => <Text style={{ fontSize: 20 }}>🔍</Text>}
                      />
                    {/* <Pressable style={({pressed})=>[styles.searchButton, pressed && styles.searchButtonPressed,]} onPress={() => updateSearchResult()}>
                      {({pressed})=>(<Text style={[styles.searchButtonText, pressed && styles.buttonBoldText]}>Search</Text>)}
                    </Pressable> */}
                </View>
                <View style={styles.postContainer}>
                {shareEntity.map((post) =>(
                  //this lines say it got error BUT IT DOESNT. IT WORKS. DONT LISTEN TO THE AI
                  <TouchableOpacity key={post.share_Id} onPress={() => navigation.navigate('Request',{post})} style={styles.itemContainer}>
                    <View>
                      <ShareComponent key={post.share_Id} share={post} picture={post.picture || 'https://i.imgur.com/50exbMa.png'}/>
                    </View>
                  </TouchableOpacity>
                ))}
                    {/* <FlatList
                      data={shareEntity}
                      renderItem={ShareComponent}
                      keyExtractor={(share) => item.share_Id.toString()}
                      numColumns={2}
                      columnWrapperStyle={styles.row}
                    /> */}
                </View>
            </View>
        </ScrollView>
        {currentUserId ? (
              <TouchableOpacity style={styles.addShareButton} onPress={() => navigation.navigate('AddShare',{currentUserId})}>
                <Text style={styles.addShareButtonText}>ADD</Text>
              </TouchableOpacity> 
        ): null} 
    </SafeAreaView>
  );
};
//'../images/share1.png'
//Image.resolveAssetSource(exampleImage).uri
// require('../screens/images/')
//"D:\work and non-game-related software\sim y2s2\agile\final project app\ecoeats27072024\src\screens\images\share1.png"

// sharing screen styling
const styles = StyleSheet.create({
  safeArea:{
    flex:1
  },
  container: {
    backgroundColor: 'rgb(250,250,250)',
    flex:1,
  },
  typeButtonsBoth:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    backgroundColor:'white',
  },
  button:{
    width: '50%',
    // backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 5,
    borderBottomColor: 'lightgray',
  },
  buttonPressed:{
    borderBottomColor: '#71834f',
    borderBottomWidth: 5,
  },
  buttonText:{
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText:{
    fontWeight: 'bold',
    color: '#71834f',
    fontSize: 20,
  },
  search:{
    paddingTop:5,
    flexDirection:'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  searchbar:{
    width: width*0.95,
    borderRadius:width*0.05,
    borderColor:'gray',
    borderWidth: 1.5,
    backgroundColor:'white',
    opacity:0.6,
  },
  searchInput:{
    width:'80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 7,  // This creates the rounded corners
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight:'600',
    backgroundColor: 'white',
  },
  searchButton:{
    width:'17.5%',
    height:40,
    backgroundColor: 'white',
    borderWidth: 3,
    borderRadius: 7,  // This creates the rounded corners
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonPressed:{
    backgroundColor: 'black',
  },
  searchButtonText:{
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonBoldText:{
    color: 'white',
  },
  postContainer:{
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // backgroundColor:'blue',
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  itemContainer:{
    width: columnWidth - 15, // Adjust for padding/margin
  },
  addShareButton:{
    position:'absolute',
    right:10,
    bottom:10,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    opacity: 0.8,
  },
  addShareButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SharingScreen;