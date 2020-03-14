import React, { Component } from 'react';
import { Text, View,Button,  } from 'react-native';

class ProfileScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            suname: ''
        } 
    }
    static navigationOptions = {
        header: null
       }
    getUserInfo = () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id)
            .then((response) => response.json())
            .then((responseJson) => {
                
                    global.name = responseJson.given_name;
                    global.surname = responseJson.family_name;
                console.log(responseJson.given_name);
                console.log(responseJson.family_name);
                
            }).catch((error) => {
                console.log(error);
            });
    }
    
    componentDidMount() {
        this.getUserInfo();
    }
   

    
    render(){
    return(
    <View>
    <Text>Profile Screen</Text>
    </View>
    );
    }
    
}
   export default ProfileScreen;