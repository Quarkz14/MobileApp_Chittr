import React, { Component } from 'react';
import { Text, View,TouchableOpacity,StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row"
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    }
   
  });

class FPanelScreen extends Component{
    static navigationOptions = {
        header: null
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
   export default FPanelScreen;