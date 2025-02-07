////////////////////Cuong & Xiang En////////////////////////////////
///////////////////Nicole added some parts to make deal and explore restrictions work////////////

////////////////////Cuong////////////////////////////////
import React, { useState,useEffect,useCallback,useContext } from 'react';
////////////////////Nicole////////////////////////////////
import { hashPassword } from '../../db-service'; // or wherever you defined it

////////////////////Xiang En////////////////////////////////
//import libraries needed
import { 
View, 
TextInput, 
Button, 
Text, 
StyleSheet,  
SafeAreaView,
ScrollView, 
StatusBar,   
useColorScheme,
TouchableOpacity,} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

import { getEcoEatsDBConnection, checkLoginDetails, getAccountType } from '../../db-service';

import {UserContext} from '../../UserContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  ////////////////////Cuong////////////////////////////////
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userNameCheck, setUserNameCheck] = useState<string>('');
  const [passWordCheck, setPassWordCheck] = useState<string>('');
  const [error, setError] = useState<string>('');
  let db;
  const {setUserId,setIsBusinessAccount, isBusinessAccount} = useContext(UserContext);
 
  ////////////////////Cuong////////////////////////////////
  const checkInputs = () => {
    console.log("2"+username + " " + password);
    handleLogin(username, password);
  };

  ////////////////////Cuong & Nicole////////////////////////////////
  const handleLogin = useCallback(async (user: string, enteredPassword: string) => {
    try {
      const db = await getEcoEatsDBConnection();
      
      // Hash the entered password
      const loginHashedPassword = await hashPassword(enteredPassword);
      console.log("Plain Password during Login:", enteredPassword);
      console.log("Hashed Password during Login:", loginHashedPassword);
  
      // Check if the hashed password matches the stored hashed password in the database
      const userData = await checkLoginDetails(db, user, loginHashedPassword);
  
      if (userData && userData.user_Id) {
        console.log("User data found:", userData.user_Id);
  
        // Set the user ID and account type in context
        setUserId(userData.user_Id);
        
        const AccountType = await getAccountType(db, userData.user_Id);
        console.log("Account Type retrieved:", AccountType);
  
        setIsBusinessAccount(AccountType);
  
        // Navigate to the User screen
        navigation.navigate('MainTabs', { screen: 'User', params: { userID: userData.user_Id } });
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      setError('An error occurred during login. Please try again.');
    }
  }, []);
  
  
  
////////////////////Xiang En////////////////////////////////
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scroll} contentInsetAdjustmentBehavior="automatic">
          <View style={styles.container}>
            <Text style={styles.headerText}>Eco Eats</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button title="Login" onPress={checkInputs} />
            {/* ////////////////////Cuong//////////////////////////////// */}
            <View style={styles.registerSec}>
              <Text style={styles.registerSecText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.registerSecButton}>Register now!</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.homeSec}>
              <Text style={styles.homeSecText}>Just want to look around?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MainTabs', {screen: 'Sharing'})}>
                <Text style={styles.homeSecButton}>Return to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

////////////////////Xiang En////////////////////////////////
//login page styling
const styles = StyleSheet.create({
  safeArea:{
    flex:1
},
scroll:{
    paddingBottom: 40,
},
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop:"50%"
  },
  headerText: {
    fontSize: 50,
    fontFamily: 'Monospace',
    color: '#71834f',
    fontWeight: '900',
    margin:'auto',
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  ////////////////////Cuong////////////////////////////////
  registerSec: {
    flexDirection: 'row',
    gap:10,
    justifyContent: 'center',
    padding: 10,
  },
  ////////////////////Cuong////////////////////////////////
  registerSecText: { 
    fontSize: 16,
    color: 'black',
    fontWeight:'600',
  }, 
  ////////////////////Cuong////////////////////////////////
  registerSecButton: {
    fontSize: 16,
    color: '#71834f',
    fontWeight:'900',
  },
  ////////////////////Cuong////////////////////////////////
  homeSec: {
    flexDirection: 'row',
    gap:10,
    justifyContent: 'center',
    padding: 10,
  },
  ////////////////////Cuong////////////////////////////////
  homeSecText: {
    fontSize: 16,
    color: 'black',
    fontWeight:'600',
  },
  ////////////////////Cuong////////////////////////////////
  homeSecButton: {
    fontSize: 16,
    color: 'red',
    fontWeight:'900',
  },
});

export default LoginScreen;
