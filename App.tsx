////////////////////Team//////////////////////////////// But other than adding new pages, Cuong coded the whole file
import 'react-native-gesture-handler';
import React, { useEffect, useContext,useState, } from 'react';
import { NavigationContainer,useIsFocused,useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from './src/screens/ExploreScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ViewDataScreen from './src/screens/ViewDataScreen';
import SharingScreen from './src/screens/SharingScreen';
import AddShareScreen from './src/screens/AddShareItem';
import RequestScreen from './src/screens/RequestScreen';
import AddDealScreen from './src/screens/AddDealScreen';  
import DealDetailsScreen from './src/screens/DealDetailsScreen';  
import AddExplorePostScreen from './src/screens/AddExplorePostScreen'; 
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import UserScreen from './src/screens/UserScreen';

// Navigation bar
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { share_page, userD, deal_page, explore_page } from './src/models'; // Import all necessary models
import ExploreDetailsScreen from './src/screens/ExploreDetailsScreen';

import { copyDatabase } from './db-service';

import { UserProvider, UserContext } from './UserContext';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
// import CustomTabBarButton from './userBottomTabNav';

export type RootStackParamList = {
  MainTabs: undefined;
  Explore: undefined;
  Details: undefined;
  ViewData: undefined;
  Sharing: undefined;
  Request: { post: share_page };
  User: { userID: any };
  AddDeal: undefined;
  DealDetails: { deal: deal_page }; 
  AddExplorePost: undefined; 
  ExploreDetails: { explore: explore_page }; 
  AddShare: {currentUserId: any}
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  const { userId } = useContext(UserContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  useEffect(() => {
    if(isFocused){
      console.log("logged user is"+userId);
    }
  },[userId]);
  return (
    <Tab.Navigator
      initialRouteName="Sharing"
      screenOptions={{
        tabBarActiveTintColor: '#f5f5f5',
        tabBarInactiveTintColor: '#2e2e2e',
        tabBarActiveBackgroundColor: '#71834f',
      }}
    >
      <Tab.Screen
        name="Sharing"
        component={SharingScreen}
        options={{
          tabBarLabel: 'Sharing',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>🏠︎</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>🧭</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          tabBarLabel: 'Details',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>🏷️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        initialParams={{ userID: userId }}
        options={{
          tabBarButton: (props) => 
          <TouchableOpacity
          {...props}
          onPress={() => {
            // Navigate to the User screen with the loggedUser parameter
            navigation.navigate('MainTabs', { screen: 'User', params: { userID: userId } });
            // // If you want to include the default behavior after your custom action:
            // props.onPress(); // This will still trigger the default navigation behavior
          }}
          />,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
const App = () => {
  useEffect(() => {
      copyDatabase();
  });

  //   copyImage();
  // }, []); // The empty dependency array ensures this runs only once
  return (
    <UserProvider>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Sharing" component={SharingScreen}/>
        <Stack.Screen name="Request" component={RequestScreen} />
        <Stack.Screen name="AddShare" component={AddShareScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="AddDeal" component={AddDealScreen} />
        <Stack.Screen name="DealDetails" component={DealDetailsScreen} />
        <Stack.Screen name="AddExplorePost" component={AddExplorePostScreen} />
        <Stack.Screen name="ExploreDetails" component={ExploreDetailsScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
