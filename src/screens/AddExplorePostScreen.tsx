////////////// Nicole coded whole file //////////////////

//import neccessary libraries
import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getEcoEatsDBConnection, saveNewExplore,updateUserExplorePosts } from '../../db-service';
import { explore_page } from '../models';
import { launchImageLibrary } from 'react-native-image-picker';

import { UserContext } from '../../UserContext';

type AddExplorePostScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddExplorePost'
>;

type Props = {
  navigation: AddExplorePostScreenNavigationProp;
};

const AddExplorePostScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [type,setType] = useState(0);
  const {userId} = useContext(UserContext);

  // funciton to handle image picker, allow user to pick image from galler
  const pickImage = () => {
  launchImageLibrary({ mediaType: 'photo' }, async (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {     // error handling
      console.log('ImagePicker Error:', response.errorMessage);
    } else {
      if (response.assets && response.assets[0].uri) {
        const uri = response.assets[0].uri;
        setPicture(uri);
      }
    }
  });
};

  // function to create explore post and save in database
  const handleSaveExplorePost = async () => {
    const db = await getEcoEatsDBConnection();
    const newExplore: explore_page = {
      explore_Id: 0, // This will be auto-incremented by the database
      title,
      description,
      picture: picture,
      date_created: new Date().toISOString(), // Current date and time
      type:type,
      user_Id: userId, // Replace with actual user ID if available
    };
    const exploreIdnew = await saveNewExplore(db, newExplore);
    console.log(exploreIdnew);
    console.log(exploreIdnew[0]["insertId"]);
    await updateUserExplorePosts(db, exploreIdnew[0]["insertId"], userId);
    navigation.navigate('MainTabs', {screen: 'Explore'}); // Navigate back to Explore page to show the posts
  };

  // allow users to input neccessary information to create explore post
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter explore post title"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter explore post description"
      />
      <Text style={styles.label}>Category:</Text>
      <View>
        {type == 0 ? (
          <TouchableOpacity onPress={() => setType(1)}>
            <Text style={styles.postType}>Restaurant</Text>
          </TouchableOpacity>  
          ):(
          <TouchableOpacity onPress={() => setType(0)}>
            <Text style={styles.postType}>Activity</Text>
          </TouchableOpacity>
          )
        }
      </View >
      <Text style={styles.label}>Picture:</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>
      {picture?(
        <Image style={styles.image} source={{uri: picture}} />
      ):null}
      <Button title="Save Post" onPress={handleSaveExplorePost} />
    </SafeAreaView>
  );
};

//styling for add explore post page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  postType:{
    fontSize:18,
    padding:5,
    backgroundColor:'#5e5d5d',
    borderRadius:4,
    margin:'auto',
    color:'white',
  },
  imageButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    margin:'auto',
    marginTop: 20,
},
});

export default AddExplorePostScreen;
