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
    return (<StackContainer/>);
  }
}

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
