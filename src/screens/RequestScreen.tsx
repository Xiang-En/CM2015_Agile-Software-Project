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
  Dimensions,
  Modal
} from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { request_page,userD } from '../models';

import { getEcoEatsDBConnection, getRequestPage, getUserDetails} from '../../db-service';
import { Picker } from '@react-native-picker/picker';
import dateNtime from '../requestDateTimePicker';

import { UserContext } from '../../UserContext';

type RequestScreenRouteProp = RouteProp<
   RootStackParamList, 
   'Request'
>;
type RequestScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Request'
>;

type Props = {
  navigation: RequestScreenNavigationProp;
  route: RequestScreenRouteProp; 
};
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RequestScreen = ({ route,navigation } : Props) => {
  const { post } = route.params;
  const { userId } = useContext(UserContext);
  const isDarkMode = useColorScheme() === 'dark';
  const [requestEntity, setRequestEntity] = React.useState<request_page>();
  const [userPicture, setUserPF] = React.useState<string>();
  const [userName, setUserName] = React.useState<string>();
  const [userID, setUserID] = React.useState<number>();
  const [modalVisible, setModalVisible] = useState(false);
  // const [inputValue, setInputValue] = useState('');
  const [modalDayValue, setModalDayValue] = useState<string>("01");
  const [modalMonthValue, setModalMonthValue] = useState<string>("01");
  const [modalHourValue, setModalHourValue] = useState<string>("00");
  const [modalMinuteValue, setModalMinuteValue] = useState<string>("00");

  const [dayOptions,setDayOptions] = useState<string[]>([]);
  const [monthOptions,setMonthOptions] = useState<string[]>([]);
  const [hourOptions,setHourOptions] = useState<string[]>([]);
  const [minuteOptions,setMinuteOptions] = useState<string[]>([]);
  let db;

  const [imageUri, setImageUri] = useState('');

  const loadDataCallback = useCallback(async (id:number) =>{
    try{
        db = await getEcoEatsDBConnection();
        const result1 = await getRequestPage(db,id);
        setUserID(result1.user_Id);
        setRequestEntity(result1);
        const result2 = await getUserDetails(db,result1.user_Id);
        setUserPF(result2.pf);
        setUserName(result2.name);
    } catch(error){
        console.error(error);
    }
  },[]);

  const handleRequestModal = () => {
    setModalVisible(false);
  };

  useEffect(()=>{
    loadDataCallback(post.share_Id);
    setDayOptions(dateNtime[0]);
    setMonthOptions(dateNtime[1]);
    setHourOptions(dateNtime[2]);
    setMinuteOptions(dateNtime[3]);
    console.log(userId);
  },[loadDataCallback]);

  //display 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.All}>
        <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
          <View style={styles.container}>
            {/* <Text>REQUEST PAGE FOR ITEM SHARE{String(post.share_Id)}</Text> */}
            <Image style={styles.mainImage} source={{uri:post.picture || 'https://i.imgur.com/50exbMa.png'}}/>
            <View style={styles.middleDetails}>
              <Image style={styles.pf} source={{uri:userPicture || 'https://i.imgur.com/50exbMa.png'}}/>
              <View style={styles.titleNexpiration}>
                <Text style={styles.title}>{post.title}</Text>
                {post.expiration != 'none' && (
                  <Text style={styles.expiration}>Expiry: {post.expiration}</Text>
                )}
                {/* <Text style={styles.expiration}>Expiry: {post.expiration}</Text> */}
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('MainTabs', {screen: 'User',   params: {userID: userID}})}>
            {/* onPress={() => navigation.navigate('Request',{post})} */}
              <View style={styles.linkToProfile}><Text style={styles.username}>Post by </Text><Text style={styles.usernameLink}>"{userName}"</Text></View>
            </TouchableOpacity>
            <Text style={styles.description}>{requestEntity?.description}</Text>
            {/* Render other post details as needed */}
            <Text style={styles.username}>Meeting Location:</Text>
            <Text style={styles.location}>{post.address}</Text>
          </View>
        </ScrollView>
        <View style={styles.chatNrequest}>
          <TouchableOpacity style={styles.endButton}>
            <Text style={styles.endButtonText}>Chat</Text>
          </TouchableOpacity>
          {userId ? (          
            <TouchableOpacity style={styles.endButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.endButtonText}>Request</Text>
            </TouchableOpacity>  
          ):(
            <TouchableOpacity style={styles.endButton} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.endButtonText}>Request</Text>
            </TouchableOpacity>  
          )}    
        </View>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter Meeting Date</Text>
            <Text style={styles.modalText}>DD/MM</Text>
            <View style={styles.modalPicker}>
              <Picker
                selectedValue={modalDayValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setModalDayValue(itemValue)}
              >
                {dayOptions.map((date)=>(
                  <Picker.Item style={styles.pickerOption} label={date} value={date} key={date}/>
                ))}
                {/* <Picker.Item label="01" value= "01" />
                <Picker.Item label="JavaScript" value="javascript" />
                <Picker.Item label="Python" value="python" />
                <Picker.Item label="C++" value="cpp" /> */}
              </Picker>
              <Text style={styles.pickerText}>/</Text>
              <Picker
                selectedValue={modalMonthValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setModalMonthValue(itemValue)}
              >
                {monthOptions.map((month)=>(
                  <Picker.Item style={styles.pickerOption} label={month} value={month} key={month}/>
                ))}
                {/* <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="javascript" />
                <Picker.Item label="Python" value="python" />
                <Picker.Item label="C++" value="cpp" /> */}
              </Picker>
            </View>
            <Text style={styles.modalText}>Enter Meeting Time</Text>
            <Text style={styles.modalText}>Hour/Minute</Text>
            <View style={styles.modalPicker}>
              <Picker
                selectedValue={modalHourValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setModalHourValue(itemValue)}
              >
                {hourOptions.map((hour)=>(
                  <Picker.Item style={styles.pickerOption} label={hour} value={hour} key={hour}/>
                ))}
              </Picker>
              <Text style={styles.pickerText}>:</Text>
              <Picker
                selectedValue={modalMinuteValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setModalMinuteValue(itemValue)}
              >
                {minuteOptions.map((minute)=>(
                  <Picker.Item style={styles.pickerOption} label={minute} value={minute} key={minute}/>
                ))}
              </Picker>
            </View>
            <View style={styles.submitNcancle}>
              {/* <Button style={styles.modalButton} title="Submit" onPress={handleRequestModal} />
              <Button style={styles.modalButton} title="Cancel" onPress={() => setModalVisible(false)} /> */}
              <TouchableOpacity style={styles.modalButton} onPress={handleRequestModal}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>   
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>   
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    
  );
};

//styling for request screen
const styles = StyleSheet.create({
  safeArea:{
    flex:1
  },
  All:{
    flex:1
  },
  container:{
    padding:screenWidth*0.05,
    backgroundColor: 'rgb(250,250,250)',
    // height:screenHeight*0.9,
    flexGrow:1,
    flex:1,
  },
  scroll:{
    // flexGrow: 1,
    paddingBottom: 40,
  },
  mainImage:{
    width: screenWidth*0.9,
    height:screenWidth*0.9,
    // borderColor:'black',
    borderWidth:2,
    borderRadius: screenWidth*0.1,
    overflow:'hidden',
  },
  pf:{
    width: screenWidth*0.1,
    height:screenWidth*0.1,
    borderRadius:100,
    overflow:'hidden',
  },
  title:{
    fontWeight: 'bold',
    fontSize:28,
  },
  expiration:{
    textDecorationLine:'underline',
    fontSize:16,
  },
  middleDetails:{
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    width: '100%',
    paddingTop: screenWidth*0.025,
    paddingBottom: screenWidth*0.025,
  },
  titleNexpiration:{
    paddingLeft:screenWidth*0.05,
  },
  linkToProfile:{
    flexDirection: 'row',
  },
  username:{
    fontWeight: 'bold',
    fontStyle:'italic',
    fontSize:20,
  },
  usernameLink:{
    fontWeight: 'bold',
    fontStyle:'italic',
    fontSize:20,
    color:'#71834f',
    textDecorationLine:'underline',
  },
  description:{
    padding:10,
    fontSize:16,
    color:'black',
    fontWeight:'400',
  },
  location:{
    fontSize:24,
    fontStyle:'italic',
    color:'red',
  },
  chatNrequest:{
    flexDirection: 'row',
    alignSelf:'flex-end',
    position:'absolute',
    bottom:10,
    padding:10,
    gap:10,
    // borderTopWidth:1,
  },
  endButton:{
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 2,
    opacity: 0.8,
  },
  endButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
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
    height: screenHeight*0.5,
  },
  modalPicker:{
    flexDirection:'row',
    // backgroundColor:'gray',
    alignItems: 'center',
    alignSelf:'flex-start',
    // width:screenWidth*0.3,
    // marginLeft:10,
  },
  modalText:{
    fontSize:20,
  },
  pickerOption:{
    fontSize:20,
    fontWeight: 'bold',
  },
  pickerText:{
    fontSize:30,
    fontWeight: 'bold',
  },
  picker:{
    width: '50%',
    height: 50,
  },
  submitNcancle:{
    padding:10,
    justifyContent: 'space-between',
    margin:10,
    height:screenHeight*0.15,
  },
  modalButton:{
    // backgroundColor: 'black',
    borderColor: 'black',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtonText:{ 
    fontSize:14,
    fontWeight: 'bold',
  }
});

export default RequestScreen;