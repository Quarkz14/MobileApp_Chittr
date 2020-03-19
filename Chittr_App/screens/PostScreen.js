import React, { Component } from 'react';
import { Text, View,TextInput,StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

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
        this.state = {
            chit_content: '',
            user: [],
            name: '',
            surname: '',
            id: '',
            token: '',
            email: ''
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

           }catch(error){
               console.log(error);
           }
       }

       Chit =  () => {
        console.log(this.state.chit_content);
    
        return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': this.state.token
            },
    
            body: JSON.stringify({
             chit_id: 0,
             timestamp: 0,
             chit_content: this.state.chit_content,
             location:{
                 longitude: 0,
                 latitude: 0
             },
             user: {
                "user_id": this.state.id,
                "given_name": this.state.name,
                "family_name": this.state.surname,
                "email": this.state.email
            }
              
            })
          })
          .then((response) =>{ 
            if(response.status === 201){
                Alert.alert("Chit posted!")
            }else{
                Alert.alert("Chit not sent :(")
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
    
    componentDidMount () {
        
        this.retrieveUserInfo();
    }

    render(){
    return(
    <View style={styles.view}>
        <View style={styles.tabInfo}>
                    <Text>IMG {this.state.name}{' '}{this.state.surname}</Text>
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
    </View>

    </View>
    
    );
    }
   }

   export default PostScreen;