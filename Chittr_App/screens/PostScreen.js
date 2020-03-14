import React, { Component } from 'react';
import { Text, View,TextInput,StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
        width: "15%"
    },
    view : {
        backgroundColor: '#8BD5C7',
        flex: 1
    },
    textInput: {
        backgroundColor: '#fff',
        width: '60%'
    },
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row"
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    }
   
   
  });
class PostScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            chit_content: '',
            user: [],
            name: '',
            surname: ''
        }
    }
    static navigationOptions = {
        header: null
       }

       Chit = async () => {
        console.log(this.state.chit);
    
        return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': global.token
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
                "user_id": global.id,
                "given_name": global.name,
                "family_name": global.surname,
                "email": global.email
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
    

    render(){
    return(
    <View style={styles.view}>
        <View style={styles.tabInfo}>
                    <Text>IMG {global.name}{' '}{global.surname}</Text>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={this.logout}
                    >
                        <Text>Log out</Text>
                    </TouchableOpacity>
                </View>
    
    <TextInput 
        style={styles.textInput}
        placeholder="Post a chitt...."
        multiline={true}
        numberOfLines={3}
        maxLength = {141}
        onChangeText = {(text) => this.setState({chit_content:text})}
        value = {this.state.chit_content}
    />
    <Text>Characters Left: {this.state.chit_content.length}/141</Text>
    
    <TouchableOpacity
        onPress={this.Chit}
    >
        <Text style={styles.btnText}>Post Chit</Text>
    </TouchableOpacity>
    </View>
    );
    }
   }

   export default PostScreen;