////////////// Nicole coded whole file //////////////////
//import neccessary libraries
import React, { useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { getEcoEatsDBConnection, saveNewDeal } from '../../db-service';
import { deal_page } from '../models';
import { launchImageLibrary } from 'react-native-image-picker';


type AddDealScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddDeal'
>;

type Props = {
  navigation: AddDealScreenNavigationProp;
};

const AddDealScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState<string | null>(null);
  // save deal to database 
  const handleSaveDeal = async () => {
    const db = await getEcoEatsDBConnection();
    const newDeal: deal_page = {
      deal_Id: 0, // This will be auto-incremented by the database
      title,
      description,
      picture: picture || '', // Save the picture URI or an empty string
    };
    // wait for database to save the deal
    await saveNewDeal(db, newDeal);
    navigation.navigate('MainTabs', { screen: 'Details' });
  };
  // allow user to launch gallery to pick image
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {       // handle error
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setPicture(uri);
      }
    });
  };

  return (
    // allow users to input neccessary information to create deal
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter deal title"
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter deal description"
      />
  
      <Button title="Pick an Image" onPress={pickImage} /> 

      {picture ? (
        <Image source={{ uri: picture }} style={styles.imagePreview} />
      ) : null}

      {/* Add space here */}
      <View style={styles.space} />

      <Button title="Save Deal" onPress={handleSaveDeal} />
    </SafeAreaView>
  );
};

// styling for add deals page
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
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  space: {
    height: 20,  // Adjust the height as needed for spacing
  },
});

export default AddDealScreen;
