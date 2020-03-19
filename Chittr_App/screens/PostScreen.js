import React, { Component } from 'react';
import { Text, View,TextInput,StyleSheet, Alert, Image,PermissionsAndroid } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import DraftScreen from './DraftScreen'
import { createStackNavigator} from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';

const styles = StyleSheet.create({
    text : {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        borderStyle:"solid",
        borderRadius: 1
    },
    btnText: {
        backgroundColor: '#3AA18D',
        width: "17%",
        borderRadius: 8,
        
    },
    view : {
        backgroundColor: '#8BD5C7',
        flex: 1
    },
    textInputContainer: {
        alignItems: "center"
    },
    textInput: {
        backgroundColor: '#fff',
        width: '80%',
        height: "30%",
        marginTop: 200,
        alignSelf:"center"
    },
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: '#fff'
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D',
        borderRadius:7
    },
    postContainer:{
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textLimit: {
            alignSelf:"flex-end",
            paddingRight: 40
    },
    postBtn : {
        alignSelf: "flex-end",
        paddingRight: 45
    },

   
   
  });

class PostScreen extends Component{
    constructor(props){
        super(props);
        const timestamp = new Date().getTime();
        this.state = {
            chit_content: '',
            user: [],
            name: '',
            surname: '',
            id: '',
            token: '',
            email: '',
            timestamp: timestamp,
            photo: null,
            locationPermission: false,
            location: '',
            latitude: '',
            longitude: '',
            profile: null,

        }
    }
    static navigationOptions = {
        header: null
       }

       retrieveUserInfo = async() => {
           try{
                const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' post id: ' + item));
                const  token = await AsyncStorage.getItem('token',(error,item) => console.log( ' post token: ' + item));
                const id = JSON.parse(idIncoming);

               const name = await AsyncStorage.getItem('name',(error,item) => console.log( ' post name: ' + item));
               const surname = await AsyncStorage.getItem('surname',(error,item) => console.log( ' post surname: ' + item));
               const email = await AsyncStorage.getItem('email',(error,item) => console.log( ' post email: ' + item));

               this.setState({id: id});
               this.setState({token: token});
               this.setState({name: name});
               this.setState({surname: surname});
               this.setState({email: email});
                this.getUserPhoto();
           }catch(error){
               console.log(error);
           }
       }

       Chit =  () => {
        console.log(this.state.chit_content + this.state.longitude  + this.state.latitude);
    
        return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': this.state.token
            },
    
            body: JSON.stringify({
             chit_id: 0,
             timestamp: this.state.timestamp,
             chit_content: this.state.chit_content,
             location:{
                 longitude: this.state.longitude,
                 latitude: this.state.latitude
             },
             user: {
                "user_id": this.state.id,
                "given_name": this.state.name,
                "family_name": this.state.surname,
                "email": this.state.email
            }
              
            })
          }).then((response) => {
            if(response.status === 201){
                Alert.alert("Chit posted!")
                this.setState({chit_content: ''});
            }else{
                Alert.alert("Chit not sent :(")
            }
              return response.json();
          }).then((responseJson) => {
              if(this.state.photo !==null){
              this.uploadPhoto(responseJson.chit_id);
              }
          })
          .catch((error) => {
            console.error(error);
          });
      }

      uploadPhoto = (chit_id) => {
        return fetch("http://10.0.2.2:3333/api/v0.0.5/chits/"+ chit_id +"/photo" ,
          {
            method: 'POST',
            headers: {
              'X-Authorization': this.state.token
            },
            body: this.state.photo

          })
          .then((response) =>{ 
            if(response.status === 201){
                Alert.alert("Photo uploaded!")
            }else{
                Alert.alert("beep boop upload failed")
            }
          }
          ).catch((error) => {
            console.error(error);
          });
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
    //code from image-picker github
    takePicture =  () => {
   
                    const options = {
                    title: 'Select Avatar',
                    storageOptions: {
                    skipBackup: true,
                    path: 'images',
                    },
                };
                
                
                ImagePicker.showImagePicker(options, (response) => {
                    console.log('Response = ', response);
                
                    if (response.didCancel) {
                    console.log('User cancelled image picker');
                    } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                    } else {
                    const source = { uri: response.uri };
                
                    this.setState({
                        photo: response,
                    });
                    }
                });
    }

    findCoordinates = () => {
       
        Geolocation.getCurrentPosition(
        (position) => {
        const location = JSON.stringify(position);
        const locationJSON = JSON.parse(location);
        this.setState({ 
            location,
            longitude: locationJSON.coords.longitude,
            latitude: locationJSON.coords.latitude
        
        });
        },
        (error) => {
        Alert.alert(error.message)
        },
        {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
        }
        );
        };
     requestLocationPermission = async() => {
            try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
            title: 'Chittr_App',
            message:
            'This app requires access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
            },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can access location');
            return true;
            } else {
            console.log('Location permission denied');
            return false;
            }
            } catch (err) {
            console.warn(err);
            }
           }
         
    componentDidMount () {
        if(!this.state.locationPermission){
            this.state.locationPermission = this.requestLocationPermission();
            }
        this.retrieveUserInfo();
        this.findCoordinates();
        
       
    }
    getUserPhoto = () => {
        console.log("ID of getPhot" + this.state.id)
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo')
            .then((response) =>{
                this.setState({profile:response})
                console.log(response);
              })
              .catch((error) => {
                  console.log(error);
              });
      }

      saveDraft = () => {
          let chit_content = this.state.chit_content;
            try{
                await AsyncStorage.setItem('chitDraft', chit_content);
            }catch(error) {
                console.log(error);
            }
      }
    render(){
        const {profile} = this.state
    return(
    <View style={styles.view}>
        <View style={styles.tabInfo}>
                        <Text>{ profile && (
                                            <Image
                                                source={{uri:profile.url}}
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
    <View atyle={styles.textInputContainer}>
    <TextInput 
        style={styles.textInput}
        placeholder="Post a chitt...."
        multiline={true}
        numberOfLines={3}
        maxLength = {141}
        onChangeText = {(text) => this.setState({chit_content:text})}
        value = {this.state.chit_content}
    />
    <Text style={styles.textLimit}>Characters Left: {this.state.chit_content.length}/141</Text>
        
        <TouchableOpacity
            style={styles.postBtn}
            onPress={this.Chit}
        >
            <Text style={styles.btnText}>Post Chit</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={this.takePicture}
        >
        <Text>Attach a picture!</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={this.findCoordinates}
        >
        <Text>Add Location</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
         onPress={() => this.props.navigation.navigate('DraftScreen')}
        >
            <Text>Drafts</Text>
        </TouchableOpacity>
    
    </View>
    
    </View>
    
    );
    }
   }

   const PostActions = createStackNavigator ({
    PostScreen : {
        screen: PostScreen
    },
    DraftScreen : {
      screen: DraftScreen
    }
  },
    {
      initialRouteName: 'PostScreen'
  })
  const PostStack = createAppContainer(PostActions);

   export default PostStack;