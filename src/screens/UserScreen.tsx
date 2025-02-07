////////////////////Cuong&Xiang En//////////////////////////////// Cuong coded the 99% file, Xiang En only provides the log out button style
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
  Dimensions,
  Modal
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { userD,share_page,explore_page } from '../models';

import { ShareComponent } from '../modules/EcoEatsShare';
import { ExploreComponent } from '../modules/EcoEatsExplore';
import { getEcoEatsDBConnection, getUserDetails, getSharePage, updateProfilePicture, getExplorePageUser} from '../../db-service';
// import localImages from '../imageImports';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

import { useIsFocused } from '@react-navigation/native';

import { UserContext } from '../../UserContext';

type RequestScreenRouteProp = RouteProp<
   RootStackParamList, 
   'User'
>;
type RequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'User'
>;

type Props = {
  navigation: RequestScreenNavigationProp;
  route: RequestScreenRouteProp; 
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const columnWidth = screenWidth / 2;

const UserScreen: React.FC<Props> = ({ route,navigation }) => {
  const { userID } = route.params;
  const { userId } = useContext(UserContext);
  const {setUserId} = useContext(UserContext);
  const isDarkMode = useColorScheme() === 'dark';
  const [profile, setProfile] = React.useState<userD>();
  const [shareEntity, setShareEntity] = React.useState<share_page[]>([]);
  const [exploreEntity, setExploreEntity] = React.useState<explore_page[]>([]);

  const [explore, setExplore] = React.useState<number[]>([]);
  const [share, setShare] = React.useState<number[]>([]);
  const [follower, setFollower] = React.useState<number[]>([]);
  const [following, setFollowing] = React.useState<number[]>([]);

  const [postType, setPostType] = useState(true); //share = 0, explore = 1

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUId] = useState<string | null>(null);
  
  const [newName,setNewName] = useState<string | null>(null);

  let db;

  const checkUserLoggedIn = () =>{
    if(!userId){
      // navigation.navigate('MainTabs', {screen:'LoginScreen'});
      navigation.navigate('LoginScreen');
    }
  };

  const processTextToNumberArray = (text:string) => {
    if(text){
      let temp = text.split(",");
      let output : any[] = [];
      temp.forEach((post)=>{
        output.push(Number(post));
      });
      return output;
    }else{
      return [];
    }
  };

  const loadShareCallback = useCallback(async (id:string) =>{
    try{
      db = await getEcoEatsDBConnection();
      console.log(id);
      const shareResult = await getSharePage(db,undefined,"",id);
      setShareEntity(shareResult);
    } catch(error){
      console.error(error);
    }
  },[]);

  const loadExploreCallback = useCallback(async (id:string) =>{
    try{
      db = await getEcoEatsDBConnection();
      console.log(id);
      const ExploreResult = await getExplorePageUser(db,id);
      setExploreEntity(ExploreResult);
    } catch(error){
      console.error(error);
    }
  },[]);

  const loadDataCallback = useCallback(async (id:number) =>{
    try{
        db = await getEcoEatsDBConnection();
        const result = await getUserDetails(db,id);
        setProfile(result);
        setExplore(processTextToNumberArray(result.explore_Posts));
        setShare(processTextToNumberArray(result.share_Posts));
        setFollower(processTextToNumberArray(result.followers));
        setFollowing(processTextToNumberArray(result.following));
        loadShareCallback(result.share_Posts);
        loadExploreCallback(result.explore_Posts);
    } catch(error){
        console.error(error);
    }
  },[]);

  const pickImage = () => {
    // if(imageUrl != 'https://i.imgur.com/50exbMa.png'){
    //     deleteImageFromImgur(imageId);
    // }
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorMessage);
      } else {
        if (response.assets && response.assets[0].uri) {
          const uri = response.assets[0].uri;
          setSelectedImageUId(uri);
        }
      }
    });
  };

  const handleRequestModal = (async() => {
    setModalVisible(false);
    db = await getEcoEatsDBConnection();
    await updateProfilePicture(db,userID,selectedImageUri,newName);
    setSelectedImageUId(null);
    setNewName(null);
    navigation.navigate('MainTabs', {screen: 'User',   params: {userID: userId}});
  });

  const cancelPfChange = () => {
    setModalVisible(false);
  };

  const isFocused = useIsFocused();

  useEffect(()=>{
    if(isFocused){
      checkUserLoggedIn();
      if(userID){
        loadDataCallback(userID);
        // navigation.setParams({ userID });
      }
    }
    setSelectedImageUId('https://i.imgur.com/50exbMa.png');
  },[loadDataCallback,isFocused,modalVisible,userID,userId]);

  //display
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
          <View style={styles.headerSec}>
            <View style= {styles.profileImgSec}>
              <Image style={styles.profileImg} source={{uri:profile?.pf || 'https://i.imgur.com/50exbMa.png'}}/>
              <Text style={styles.profileName}>{profile?.name}</Text>
              {userId==userID ? (
                <TouchableOpacity style={styles.editPf} onPress={() => setModalVisible(true)}>
                  <Text style={styles.editPfText}>Edit profile image</Text>
                </TouchableOpacity> 
              ):null} 
            </View>
            <View style={styles.PFF}>
              {/* <Text>{userID}+{userId}</Text> */}
              <View style={styles.PFFsection}>
                <Text style={styles.PFFtext}>Posts</Text>
                <Text style={styles.PFFvalue}>{explore.length + share.length}</Text>
              </View>
              <View style={styles.PFFsection}>
                <Text style={styles.PFFtext}>Followers</Text>
                <Text style={styles.PFFvalue}>{follower.length}</Text>
              </View>
              <View style={styles.PFFsection}>
                <Text style={styles.PFFtext}>Following</Text>
                <Text style={styles.PFFvalue}>{following.length}</Text>
              </View>
            </View>
          </View>
          <View style={styles.shareSearchSaveLike}>
            <View style={styles.shareSearch}>
              <TouchableOpacity style={styles.SSSLbutton}>
                <Text style={styles.SSSLtext}>🔗</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={styles.SSSLbutton}>
                <Text style={styles.SSSLtext}>🔎</Text>
              </TouchableOpacity> 
            </View> 
            <View style={styles.saveLike}>
              <TouchableOpacity style={styles.SSSLbutton}>
                <Text style={styles.SSSLtext}>💾</Text>
              </TouchableOpacity>  
              <TouchableOpacity style={styles.SSSLbutton}>
                <Text style={styles.SSSLtext}>🖤</Text>
              </TouchableOpacity>   
            </View>
          </View>
          <View>
            <View style={styles.typeButtonsBoth}>
              <TouchableOpacity style={[styles.button, postType && styles.buttonPressed,]} onPress={() => setPostType(true)}>
                  <Text style={[styles.buttonText, postType && styles.boldText]}>Share Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, !postType && styles.buttonPressed,]} onPress={() => setPostType(false)}>
                <Text style={[styles.buttonText, !postType && styles.boldText]}>Explore Posts</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            {postType === true?(
              <View style={styles.postContainer}>
                {shareEntity.map((post) =>(
                  <TouchableOpacity key={post.share_Id} onPress={() => navigation.navigate('Request',{post})} style={styles.itemContainer}>
                    <View>
                      <ShareComponent key={post.share_Id} share={post} picture={post.picture}/>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ):(
              <View style={styles.postContainer}>
                {exploreEntity.map((explore) =>(
                  <TouchableOpacity key={explore.explore_Id} onPress={() => navigation.navigate('ExploreDetails', {explore})} style={styles.itemContainer}>
                    <View>
                      <ExploreComponent key={explore.explore_Id} explore={explore} picture={explore.picture}/>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
    
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalPfHeader}>
                  <Text style={styles.modalHeaderText}>New Profile Image</Text>
                  <TouchableOpacity onPress={cancelPfChange}>
                    <Text style={styles.modalHeaderTextCancel}>X</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.userNameChangeModal}>
                  <Text style={styles.userNameChangeModalText}>Change Username?</Text>
                  <TextInput style={styles.textBox} value={newName ? newName : ''} onChangeText={setNewName} placeholder={profile?.name}/>
                </View>
                <Image source={{ uri: selectedImageUri || 'https://i.imgur.com/50exbMa.png'}} style={styles.newPfImage}/>
                <Button title="Pick an Image" onPress={pickImage} />
                {/* <Button  title="Save" onPress={handleRequestModal} /> */}
                <TouchableOpacity onPress={handleRequestModal} style={styles.pfSaveButton}>
                    <Text style={styles.modalHeaderTextSave}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
        </Modal>                                        
        {userId == userID ? (
              <TouchableOpacity style={styles.logoutButton} onPress={() => setUserId(undefined)}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity> 
        ): null} 
    </SafeAreaView>
    
  );
};

//styling for user screen
const styles = StyleSheet.create({
  safeArea:{
      flex:1
  },
  scroll:{
      paddingBottom: 40,
  },

  headerSec:{
    width:'100%',
    backgroundColor: 'white',
    flexDirection:'row',
    // marginLeft:'auto',
    // marginRight: 'auto',
    justifyContent: 'space-between',
    // marginLeft:screenWidth/3,
  },
  textBox:{
    borderColor:'black',
    borderWidth:3,
    borderRadius:4,
    padding:3,
  },

  profileImgSec:{
    flexDirection:'column',
    // width:'50%',
    paddingLeft:'10%',
    // alignItems:"flex-start",
  },
  profileImg:{
    width: screenWidth*0.2,
    height:screenWidth*0.2,
    borderRadius:100,
    overflow:'hidden',
  },

  profileName:{
    fontSize:screenWidth*0.045,
    maxWidth:screenWidth*0.30,
    fontWeight:'bold',
    overflow:'hidden',
  },

  editPfText:{
    color:'lightblue',
  }, 

  PFF:{
    // width: '50%',
    // padding:'2%',
    flexDirection:'row',
    paddingRight:'10%',
    gap:10,
  },

  PFFsection:{
    flexDirection:'column',
    justifyContent: 'center',
    alignItems:'center',
  },

  PFFtext:{
    fontSize:16,
    fontWeight:'bold',
  },

  PFFvalue:{
    fontSize:18,
    fontWeight:'bold',
  },

  SSSLbutton:{
    padding:2,
  },

  shareSearchSaveLike:{
    width:'100%',
    flexDirection:'row',
    backgroundColor: 'white',
    marginTop:2,
    marginBottom:2,
  },

  shareSearch:{
    width:'50%',
    flexDirection:'row',
    justifyContent: 'flex-start',
  },

  saveLike:{
    width:'50%',
    flexDirection:'row',
    justifyContent: 'flex-end',
    gap:10,
  },

  SSSLtext:{
    padding:'0.5%',
    fontSize:20,
  },

  // SSSLtextHeart:{
  //   padding:0,
  //   margin:0,
  //   fontSize:20,
  // },

  typeButtonsBoth:{
    marginTop:1,
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
  buttonText:{
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText:{
    fontWeight: 'bold',
    color: '#71834f',
    fontSize: 20,
  },
  buttonPressed:{
    borderBottomColor: '#71834f',
    borderBottomWidth: 5,
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
  modalOverlay:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent:{
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    width:screenWidth*0.7,
    height: screenHeight*0.7,
  },

  modalHeaderText:{
    fontSize: 18,
    fontWeight:'bold',
  },

  modalHeaderTextCancel:{
    fontSize: 18,
    fontWeight:'bold',
    color:'red',
  },

  modalPfHeader:{
    flexDirection:'row',
    gap:80,
    justifyContent:'space-between',
  },

  newPfImage:{
    width:'75%',
    height: '75%',
    resizeMode: 'contain',
  },

  pfSaveButton:{
    borderColor:'rgba(0,0,0,0.9)',
    borderWidth:2,
    borderRadius:5,
    backgroundColor:'rgba(0,0,0,0.5)',
    width: '30%',
  },

  modalHeaderTextSave:{
    padding:5,
    fontSize: 18,
    fontWeight:'bold',
    color:'white',
    margin:'auto',
  },
  ////////////////////Xiang En////////////////////////////////
  logoutButton:{
    position:'absolute',
    right:10,
    top:10,
    backgroundColor: 'red',
    padding:2,
    borderRadius: 3,
    opacity: 0.8,
  },
  ////////////////////Xiang En////////////////////////////////
  logoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userNameChangeModalText:{
    fontSize: 18,
    fontWeight:'bold',
    marginBottom:10,
  },
});

export default UserScreen;