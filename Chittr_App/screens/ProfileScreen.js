import React, { Component } from 'react';
import { Text, View,TouchableOpacity, StyleSheet  } from 'react-native';
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
            
        } 
    }
    static navigationOptions = {
        header: null
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
        <View style={styles.tabInfo}>
        <Text>IMG {global.name}{' '}{global.surname}</Text>
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