import React, { Component } from 'react';
import { StyleSheet,Text, View,TextInput, Button, TouchableOpacity} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from './screens/HomeScreen'
import PostScreen from './screens/PostScreen'
import ProfileScreen from './screens/ProfileScreen'
import FPanelScreen from './screens/FPanelScreen'



class App extends Component{

  constructor(props){
    super(props);
     this.state={
       email: '',
       password: '',
       authCode: ''
     }
    }
   
   Login = () => {
     console.log(this.state.email + "  " + this.state.password);

     return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
        
        })
        })
        .then((response) => response.json()).then((responseJson) => {
          this.setState({authCode : responseJson.token});
          console.log(responseJson)
        }).catch((error) => {
        console.error(error);
        });
   }
   
    render() {
    return (
      <View style= {styles.container}>
        <Text style = {styles.title}>Chittr</Text>
     <TextInput
       style={styles.textInput}
       placeholder = "Email"
       onChangeText={(text) => this.setState({email: text})} 
       value = {this.state.email}
     />
     <TextInput 
       style={styles.textInput}
       placeholder = "Password"
       onChangeText={(text) => this.setState({password: text})} 
       value = {this.state.password}
       secureTextEntry={true}
     />
     <View style={styles.btnContainer}>
      <TouchableOpacity
        style={styles.btn}
        onPress={this.Login}
      >
        <Text style={styles.btnText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
      >
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
     </View>
   </View>
     );
    }
   }
   
   const styles = StyleSheet.create({
     container : {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#8BD5C7'
     },
    title : { 
       fontSize: 50,   
       marginBottom: 150,
       marginTop: 100
     },
     textInput : {
       width: "90%",
       marginBottom: 10,
       backgroundColor: "#fff",
       padding: 15
     },
     btnContainer : {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%"
     },
     btn : {
       backgroundColor: "#3AA18D",
       padding: 15,
       width: "45%"
     },
     btnText: {
       fontSize:18,
       textAlign: "center",
     } 
    
    
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
 
 const AppContainer = createAppContainer(AppTabNav)

 export default AppContainer;
