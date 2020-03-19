import React, { Component } from 'react';
import { Text, View,TouchableOpacity,StyleSheet,TextInput,Alert,Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#8BD5C7'
      },
      btnContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "90%"
      },
      btn: {
        backgroundColor: "#3AA18D",
        padding: 15,
        width: "45%"
      },
      btnText: {
        fontSize: 18,
        textAlign: "center",
      },
      image : {
        margin: 100,  
        width: 200, 
        height: 200
      }
   
  });

class PostPictureScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            surname: '',
            token: '',
            id: '',
            photo: null,
            source: null,
          }
    }
    static navigationOptions = {
        header: null
       }

       retrieveLoginData = async () => {
        try {
  
          const  idIncoming = await AsyncStorage.getItem('id',(item) => console.log( ' update id: ' + item));
          const token = await AsyncStorage.getItem('token',(item) => console.log( ' update token: ' + item));
          const id = JSON.parse(idIncoming);
          
          this.setState({id:id});
          this.setState({token: token});
          console.log("Async update retrieve :  " + this.state.id + '  ' + this.state.token);
        }catch(error){
          console.log(error);
        }
      }

      uploadPhoto = () => {
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/photo" ,
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
      takePicture =  () => {
   
        const options = {
        title: 'Select option',
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
            source: source
        });
        }
    });
}
    componentDidMount() {
        this.retrieveLoginData();
    }
    render(){
        const {source} = this.state
    return(
       
        <View style={styles.container}>
            <View style={styles.btnContainer}>
            <TouchableOpacity
                style={styles.btn}
                onPress={this.uploadPhoto}
            >
                <Text style={styles.btnText}>Add as profile picture</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.btn}
                onPress={this.takePicture}
            ><Text style={styles.btnText}>Upload picture!</Text></TouchableOpacity>
            </View>
            {source && (
            <Image
                source = {{uri:source.uri}}
                style = {styles.image}
            />
            )}
        </View>
   
    );
    }
   }
   export default PostPictureScreen;