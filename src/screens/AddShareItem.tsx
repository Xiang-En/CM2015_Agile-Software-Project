////////////////////Cuong//////////////////////////////// Cuong coded this whole page

//import neccessary libraries
import React, { useCallback, useEffect, useState } from 'react';
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
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

import { share_page, request_page } from '../models';
import { getEcoEatsDBConnection, saveNewShareItem, saveNewRequestItem, getLastestRequestItem, updateUserSharePosts} from '../../db-service';

import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import uploadImageToImgur from '../uploadToImgur';
// import localImages from '../imageImports';

type AddShareScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddShare'
>;

type AddShareScreenRouteProp = RouteProp<
   RootStackParamList, 
   'AddShare'
>;

type Props = {
  navigation: AddShareScreenNavigationProp;
  route: AddShareScreenRouteProp; 
};

const { width } = Dimensions.get('window');
const columnWidth = width / 2;

const AddShareScreen: React.FC<Props> = ({ route,navigation } : Props) => {
  const { currentUserId } = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [address, setAdress] = React.useState<string>('');
  const [tags, setTags] = React.useState<string|null>(null);

  const [imageUrl, setImageUrl] = React.useState<string>('https://i.imgur.com/50exbMa.png');

  const [expiration, setExpiration] = React.useState<string>('');
  const [itemType, setItemType] = React.useState<number>(0);
  let db;
  const [shareDetails, setShareDetails] = React.useState<share_page>();
  const [requestDetails, setRequestDetails] = React.useState<request_page>();


  const loadDataCallback = useCallback(async (user_Id:number,description:string,itemType:number,title:string,tags:string,address:string,picture:string,expiration:string) =>{
    try{
        console.log(user_Id,description,itemType,title,tags,address,picture,expiration);
        db = await getEcoEatsDBConnection();
        const shareIdnew = await saveNewRequestItem(db,user_Id,description);
        console.log(shareIdnew);
        console.log(shareIdnew[0]["insertId"]);
        console.log(await saveNewShareItem(db,itemType,title,tags,address,picture,expiration,shareIdnew[0]["insertId"]));
        console.log(shareIdnew[0]["insertId"]+user_Id+"addashreitem page adding item");
        await updateUserSharePosts(db,shareIdnew[0]["insertId"],user_Id);

        navigation.navigate('MainTabs', {screen: 'Sharing'});
    } catch(error){
        console.error(error);
    }
  },[]);


  const handleItemChangeFood = () =>{
    setItemType(1);
    setExpiration('none');
  };

  const handleItemChangeObject = () =>{
    setItemType(0);
    setExpiration('');
  };

  const handleItemSubmit = () =>{
    loadDataCallback(currentUserId,description,itemType,title,tags,address,selectedImageUri,expiration);
  };

  //image testing----------------------------------------------------------------
  const [imageId, setImageUId] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUId] = useState<string | null>(null);

  const pickImage = () => {
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
  //----------------------------------------------------------------

  useEffect(()=>{
    console.log(currentUserId);
    setImageUrl('https://i.imgur.com/50exbMa.png');
  },[]);

  // allow user to input neccessary information and image to create share post
  return (
    <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
            <View style={styles.all}>
                <View>
                    <Text style={styles.postText}>Title:</Text>
                    <TextInput style={styles.textBox} value={title} onChangeText={setTitle} />
                </View>
                <View>
                    <Text style={styles.postText}>Description:</Text>
                    <TextInput style={styles.textBox} value={description} onChangeText={setDescription} />
                </View>
                <View>
                    <Text style={styles.postText}>Address:</Text>
                    <TextInput style={styles.textBox} value={address} onChangeText={setAdress} />
                </View>
                <View>
                    <Text style={styles.postText}>Tags, if any:</Text>
                    <TextInput style={styles.textBox} value={tags ? tags : ""} onChangeText={setTags} />
                </View>
                <View>
                    {itemType == 0 ? (
                            <TouchableOpacity onPress={handleItemChangeFood}>
                                <Text style={styles.postType}>this item is Food</Text>
                            </TouchableOpacity>  
                        ):(
                            <TouchableOpacity onPress={handleItemChangeObject}>
                                <Text style={styles.postType}>this item is an Object</Text>
                            </TouchableOpacity>
                        )
                    }
                </View >
                {itemType==0 ? (
                    <View style={styles.postExpi}>
                        <Text style={styles.postText}>Expiration:</Text>
                        <TextInput style={styles.textBoxExpi} value={expiration} onChangeText={setExpiration} placeholder="DD/MM/YYYY"/>
                    </View>
                ):(
                    <View style={styles.postExpi}>
                        <Text style={styles.postText}>Expiration: none</Text>
                    </View>
                )}
                <Button title="Pick an Image" onPress={pickImage} />
                {/* <Text>{imageUri}</Text>
                <Text>{imageUrl}</Text> */}
                {/* {imageUri &&
                    <Image source={{ uri: imageUri }} style={styles.image}/>
                } */}
                {imageUrl &&
                    <Image source={{ uri: selectedImageUri || 'https://i.imgur.com/50exbMa.png'}} style={styles.image}/>
                }
                <TouchableOpacity onPress={handleItemSubmit}>
                    <Text style={styles.postUpload}>UPLOAD</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};


//styling for add share item page
const styles = StyleSheet.create({
  safeArea:{
    flex:1
},
scroll:{
    paddingBottom: 40,
},
all:{
  backgroundColor:'white',
  flexDirection: 'column',
  margin: 'auto',
  width: '85%',
  paddingLeft:15,
  paddingRight:15,
  paddingBottom:15,
  gap:4,
},
postText:{
  fontSize:16,
  fontWeight: 'bold',

},
textBox:{
  borderColor:'black',
  borderWidth:3,
  borderRadius:4,
  padding:3,
},
postType:{
  fontSize:18,
  padding:5,
  backgroundColor:'#5e5d5d',
  borderRadius:4,
  margin:'auto',
  color:'white',
},
image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginTop: 20,
},
postExpi:{
  flexDirection: 'row',
  width: '100%',
},
textBoxExpi:{
  padding:0,
  paddingLeft: 10,
},
postUpload:{
  fontSize:18,
  padding:5,
  backgroundColor:'#026605',
  borderRadius:4,
  margin:'auto',
  color:'white',
},
});

export default AddShareScreen;