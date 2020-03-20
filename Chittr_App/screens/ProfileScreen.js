import React, { Component } from 'react';
import { Text, View,TouchableOpacity, StyleSheet,Alert,Image  } from 'react-native';
import { createStackNavigator} from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import UpdateScreen from './UpdateScreen'
import PostPictureScreen from './PostPictureScreen'
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: '#fff'
    },
    logoutBtn: {
        backgroundColor: '#3AA18D',
        borderRadius:7,
        margin:10
    },
    container: {
      flex: 1,
      backgroundColor:'#8BD5C7'
    },
    chit: {
      fontSize:16,
      paddingBottom: 10,
      paddingLeft:10,
      backgroundColor: "#EDF8F6",
      borderStyle: "solid",
        borderColor: "#000000"
    },
    textName : {
      fontSize: 18,
      padding: 20,
      paddingLeft: 0,
      fontWeight: "bold"
    },
    updateBtnContainer : {
      alignSelf: "flex-end",
      padding: 10
      
    },
    updateBtnText : {
      backgroundColor:'#3AA18D',
      fontSize: 20,
      borderRadius: 5
    },
    pictureBtn:{
      backgroundColor:'#3AA18D',
      fontSize: 20,
      borderRadius: 5
    },
    pictureBtnContainer:{
      alignSelf: "flex-end",
      padding: 10
    },
    flatlistContainer : {
      width: "95%",
      height: "80%",
      padding: 20,
      alignItems: "center"
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
            userChits: [],
            photo: null,
        } 
    }
    static navigationOptions = {
        header: null
       }
       //gets id and token from the async storage(local storage) parse the id because async storage accepts string only
       retrieveLoginData = async () => {
        try {
  
          const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' F-panel id: ' + item));
          const  token = await AsyncStorage.getItem('token',(error,item) => console.log( 'profile token : ' + item));
         
          const id = JSON.parse(idIncoming);
          
          this.setState({id:id});
          this.setState({token:token});
          console.log("Async profile retrieve :  " + this.state.id)
          this.getUserInfo();
          this.getUserPhoto();
        }catch(error){
          console.log(error);
        }
      }
        //with the id of the user the server returns the user account info
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

    //so it can be used in post and update
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

    /**
     * Gets the user photo
     * When the user registers and sets a photo then it can get the photo the user has set 
     * However when the user is given the default image which is a white image and then the user posts an image 
     * then the user won't have the image he/she has posted but instead have the default.jpeg image
     */
    getUserPhoto = () => {
      console.log("ID of getPhot" + this.state.id)
      return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo')
          .then((response) =>{
              this.setState({photo:response})
              console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    componentDidMount() {
      this.retrieveLoginData();
      this.storeUserData();
    }
  
    render(){
      const {photo} = this.state
    return(
      <View style={styles.container}>
        <View style={styles.tabInfo}>
        <Text>{ photo && (
          <Image
              source={{uri:photo.url}}
              style={{width:30, height: 30}}
        /> )}
        {this.state.name}{' '}{this.state.surname}</Text>
        <TouchableOpacity
            style={styles.logoutBtn}
            onPress={this.logout}
        >
            <Text>Log out</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.updateBtnContainer}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('UpdateInfo')}
        ><Text style={styles.updateBtnText}>Update Account</Text></TouchableOpacity>
        </View>
        <View style = {styles.pictureBtnContainer}>
          <TouchableOpacity
          style={styles.pictureBtn}
          onPress={() => this.props.navigation.navigate('PictureScreen')}
          ><Text>Add picture</Text></TouchableOpacity>
        </View>
        <View style={styles.flatlistContainer}>
       <FlatList
                    data={this.state.userChits}
                    renderItem={({ item }) => (
                        <View style={styles.viewFlatList}>
                            <Text style={styles.textName}>{this.state.name}: </Text>
                            <Text style={styles.chit}>{item.chit_content}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.chit_id.toString()}

                />
      </View>
    </View>
    );
    }
    
}

//Another stack navigator to set a picture and update account info
const ProfileActions = createStackNavigator ({
  UpdateInfo : {
      screen: UpdateScreen
  },
  ProfileScreen : {
    screen: ProfileScreen
  },
  PictureScreen : {
    screen: PostPictureScreen
  }
},
  {
    initialRouteName: 'ProfileScreen'
})
const ProfileStack = createAppContainer(ProfileActions);

   export default ProfileStack;