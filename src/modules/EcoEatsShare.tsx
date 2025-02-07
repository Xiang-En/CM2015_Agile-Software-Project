////////////////////Cuong//////////////////////////////// Cuong coded this whole page
import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { share_page } from '../models';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
export const ShareComponent: React.FC<{
  share: share_page;
  picture:any;
}> = ({ share: {title,address,share_Id,expiration} , picture}) => {
  return (
    <View style={styles.todoContainer}>
      <Image style={styles.image} source={{uri:picture}}/>
      <View style={styles.todoTextContainer}>
        <Text
          style={styles.sectionTitle}>
          {title}
        </Text>
        {expiration != 'none' && (
          <Text style={styles.expiration}>Expiry: {expiration}</Text>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  todoContainer: {
    width: screenWidth*0.45,
    height:screenHeight*0.27,
    marginTop: 10,
    paddingHorizontal: 7.5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  todoTextContainer: {
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  expiration:{
    fontSize:16,
    textDecorationLine:'underline',
  },
  image:{
    width: screenWidth*0.4,
    height:screenHeight*0.2,
    borderRadius: 10,
  }
});