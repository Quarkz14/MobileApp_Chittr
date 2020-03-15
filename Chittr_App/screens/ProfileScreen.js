import React, { Component } from 'react';
import { Text, View,TouchableOpacity, StyleSheet,Alert  } from 'react-native';
import { createStackNavigator} from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import UpdateScreen from './UpdateScreen'
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
    
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row"
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    }
   
  });

  const ProfileActions = createStackNavigator ({
    UpdateInfo : {
        screen: UpdateScreen
    }
  })
const UpdateStack = createAppContainer(ProfileActions);
class ProfileScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            surname: '',
            email:''
        } 
    }
    static navigationOptions = {
        header: null
       }

       retrieveLoginData = async () => {
        try {
  
          const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' Profile id: ' + item));
          const id = JSON.parse(idIncoming);
          this.setState({id:id});
          console.log("Async profile retrieve :  " + this.state.id)
          this.getUserInfo();
        }catch(error){
          console.log(error);
        }
      }

       getUserInfo =  () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id)
            .then((response) => response.json())
            .then((responseJson) => {
                
                    this.setState({name: responseJson.given_name});
                    this.setState({surname: responseJson.family_name});
                    this.setState({email: responseJson.email});
                    this.storeUserData();
                console.log('user info ' + this.state.name + '  ' + this.state.surname + ' ' + this.state.email);
            }).catch((error) => {
                console.log(error);
            });
          }
    

    storeUserData = async () => {
      try{

         await AsyncStorage.setItem('name', this.state.name);
         await AsyncStorage.setItem('surname', this.state.surname);
         await AsyncStorage.setItem('email', this.state.email);

      }catch(error){
        console.log(error);
      }
    }
    
       logout = () => {
        return fetch("http://10.0.2.2:3333/api/v0.0.5/logout",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': global.token
            }

          })
          .then((response) =>{ 
            if(response.status === 200){
                this.props.navigation.navigate("LogIn")
                Alert.alert("Acount logged out!")
            }else{
                Alert.alert("Account not logged out")
            }
          }
          ).catch((error) => {
            console.error(error);
          });
    }
    
    componentDidMount() {
     // this.logout();
      this.getUserInfo();
      this.retrieveLoginData();
      this.storeUserData();
    }
    
    render(){
    return(
        <View style={styles.tabInfo}>
        <Text>IMG {this.state.name}{' '}{this.state.surname}</Text>
        <TouchableOpacity
            style={styles.logoutBtn}
            onPress={this.logout}
        >
            <Text>Log out</Text>
        </TouchableOpacity>
    </View>
    );
    }
    
}


   export default ProfileScreen;