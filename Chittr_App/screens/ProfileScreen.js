import React, { Component } from 'react';
import { Text, View,TouchableOpacity, StyleSheet,Alert  } from 'react-native';
import { createStackNavigator} from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import UpdateScreen from './UpdateScreen'
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row"
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    }
   
  });

  

class ProfileScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            surname: '',
            email:'',
            userChits: []
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
                    this.setState({userChits: responseJson.recent_chits});
                    console.log('this is recent chits:  '+ responseJson.recent_chits);
                    console.log('user info ' + this.state.name + '  ' + this.state.surname + ' ' + this.state.email);
                    this.storeUserData();
            }).catch((error) => {
                console.log(error);
            });
          }
    /*
          getUserChits = () => {
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
          */
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
              'X-Authorization': this.state.token
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
      this.retrieveLoginData();
      this.storeUserData();
    }
  
    render(){
    return(
      <View>
        <View style={styles.tabInfo}>
        <Text>IMG {this.state.name}{' '}{this.state.surname}</Text>
        <TouchableOpacity
            style={styles.logoutBtn}
            onPress={this.logout}
        >
            <Text>Log out</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('UpdateInfo')}
        ><Text>Update Account</Text></TouchableOpacity>

       <FlatList
                    data={this.state.userChits}
                    renderItem={({ item }) => (
                        <View style={styles.viewFlatList}>
                            <Text style={styles.textName}>{this.state.name}: </Text>
                            <Text style={styles.textChit}>{item.chit_content}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.chit_id.toString()}

                />
    </View>
    );
    }
    
}

const ProfileActions = createStackNavigator ({
  UpdateInfo : {
      screen: UpdateScreen
  },
  ProfileScreen : {
    screen: ProfileScreen
  }
},
  {
    initialRouteName: 'ProfileScreen'
})
const ProfileStack = createAppContainer(ProfileActions);

   export default ProfileStack;