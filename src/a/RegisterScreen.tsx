////////////////////Cuong//////////////////////////////// Cuong coded the whole file, only inspired the style of Xiang En's login page styling
///////////////////Nicole added password hashing////////////

//import neccessary libraries
import React, { useState,useEffect,useCallback,useContext } from 'react';
import { hashPassword } from '../../db-service';

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

import { getEcoEatsDBConnection, registeringUser , getAccountType} from '../../db-service';

import {UserContext} from '../../UserContext';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterScreen'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};


const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [acountType, setAccountType] = useState<number>(2);
  const [emailAdd, setEmailAdd] = useState<string>('');
  const [error, setError] = useState<string>('');
  let db;
  const {setUserId,setIsBusinessAccount, isBusinessAccount} = useContext(UserContext);
  // const handleLogin = () => {
  //   if (username === 'admin' && password === 'admin') {
  //     navigation.navigate('User', { userID: 1 });  // Pass userID when navigating
  //   } else {
  //     setError('Invalid username or password');
  //   }
  // };
  const registerCheck = ()  => {
    handleRegister(username,password,acountType,emailAdd)
  };
    
  // handle user registration
  ///////////////////Nicole coded password hashing////////////
  const handleRegister = useCallback(async (user: string, enteredPassword: string, accT: number, email: string) => {
    try {
      db = await getEcoEatsDBConnection();
  
      // Hash the password before storing it
      const registerHashedPassword = await hashPassword(enteredPassword);
      const result = await registeringUser(db, user, registerHashedPassword, accT, email);
  
      if (result) {
        setUserId(result);  // Pass userID when navigating
        const AccountType = await getAccountType(db, result);
        setIsBusinessAccount(AccountType);
        navigation.navigate('MainTabs', { screen: 'User', params: { userID: result } });
      } else {
        setError('Username already in use');
      }
    } catch (error) {
      console.error("Error in handleRegister:", error);
    }
  }, []);
  
  //display 
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
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={emailAdd}
              onChangeText={setEmailAdd}
            />
            <View>
                <Text style={styles.accTypeText}>Whats the purpose of this account?</Text>
                <View style={styles.typeButtonLayout}>
                    <TouchableOpacity onPress={() => setAccountType(2)}
                        style={[styles.button, acountType == 2 && styles.buttonPressed,]}>
                        <Text style={[styles.buttonText, acountType == 2 && styles.boldText]}>Normal Usage</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setAccountType(1)}
                        style={[styles.button, acountType == 1 && styles.buttonPressed,]}>
                        <Text style={[styles.buttonText, acountType == 1 && styles.boldText]}>Business</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button title="Register" onPress={registerCheck} />
            <View style={styles.loginSec}>
              <Text style={styles.loginSecText}>Have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginSecButton}>Log in now!</Text>
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

//register page styling
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
    paddingTop:"30%"
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
  button:{
    width: '50%',
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  accTypeText:{
    fontSize:16,
    fontWeight: 'bold',
  
  },
  typeButtonLayout:{
    flexDirection: 'row',
    justifyContent:'space-between',
    width: '100%',
    paddingBottom:20,
  },
  buttonPressed:{
    backgroundColor: '#598ef0',
  },
  buttonText:{
    color: 'black',
    fontSize: 16,
  },
  boldText:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loginSec: {
    flexDirection: 'row',
    gap:10,
    justifyContent: 'center',
    padding: 10,
  },
  loginSecText: { 
    fontSize: 16,
    color: 'black',
    fontWeight:'600',
  }, 
  loginSecButton: {
    fontSize: 16,
    color: '#71834f',
    fontWeight:'900',
  },
  homeSec: {
    flexDirection: 'row',
    gap:10,
    justifyContent: 'center',
    padding: 10,
  },
  homeSecText: {
    fontSize: 16,
    color: 'black',
    fontWeight:'600',
  },
  homeSecButton: {
    fontSize: 16,
    color: 'red',
    fontWeight:'900',
  },
});

export default RegisterScreen;
