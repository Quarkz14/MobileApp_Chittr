import React, { Component } from 'react';
import { Text, View,TextInput,StyleSheet, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const styles = StyleSheet.create({
    text : {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        borderStyle:"solid",
        borderRadius: 1
    },
    btnText: {
        backgroundColor: '#3AA18D',
        width: "15%"
    }
   
   
  });
class PostScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            chit_content: '',
            user: []
        }
    }
    static navigationOptions = {
        header: null
       }

       Chit = () => {
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

    render(){
    return(
    <View>
        <View style = {styles.text}>
        <Text> IMG </Text>
        <Text>{global.name}{' '}{global.surname}</Text>
        </View>
    
    <TextInput 
        placeholder="Post a chitt...."
        multiline={true}
        numberOfLines={3}
        maxLength = {141}
        onChangeText = {(text) => this.setState({chit_content:text})}
        value = {this.state.chit_content}
    />
    <Text>Characters Left: {this.state.chit_content.length}/141</Text>
    <Text>Maximum 141 characters</Text>
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