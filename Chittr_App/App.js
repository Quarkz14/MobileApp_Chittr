import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator} from 'react-navigation-stack'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen'
import PostScreen from './screens/PostScreen'
import ProfileScreen from './screens/ProfileScreen'
import FPanelScreen from './screens/FPanelScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'

class App extends Component{
  render() {
    //Initially it renders my login screen
    return (<StackContainer/>);
  }
}
//This is my login screen stack navigator
const StackLogin = createStackNavigator({
    LogIn: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    }
    
}, {
  initialRouteName: 'LogIn',
  headerMode: 'none'

});

//This is the rest of the app bottomTab navigator where home,post,profile and fpanel(follower panel)
const AppTabNav = createBottomTabNavigator({

  Home: {
    screen: HomeScreen
  },
  Post: {
    screen: PostScreen
  },
  Profile: {
    screen: ProfileScreen 
  },
  FPanel: {
    screen: FPanelScreen
  }
  
});

//I created a stack that combines the Log in stack and the bottomTab so I can navigate between the stack and bottomTab and the initial screen is my login stack
const StackSwitch = createStackNavigator({
  LogIn: {
    screen : StackLogin
  },
  Home: {
    screen: AppTabNav
  },
},
  {
    initialRouteName: 'LogIn',
    headerMode: 'none'
 
})

const StackContainer = createAppContainer(StackSwitch)

export default App;
