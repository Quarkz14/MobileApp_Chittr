import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends Component {

    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        token: '',
        id: ''
      }
    
    }
  
    Login =  async () => {
      console.log(this.state.email + "  " + this.state.password);
  
      return fetch("http://10.0.2.2:3333/api/v0.0.5/login",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
  
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          })
        })
        .then((response) =>{ 
          if(response.status === 200){
            this.props.navigation.navigate('Home')
          }
          else{
            Alert.alert("Email or Password is invalid")
          }
          return response.json();
        }
        ).then((responseJson) => {
           //global.token = responseJson.token;
           //global.id = responseJson.id;
           this.setState({token: responseJson.token});
           this.setState({id: responseJson.id});
           this.storeData();
          console.log(this.state.id + '  '+ this.state.token);
        }).catch((error) => {
          console.error(error);cmd
        });
    }
  
    storeData = async () => {
      try {
        await AsyncStorage.setItem('token', JSON.stringify(this.state.token));
        await AsyncStorage.setItem('id', JSON.stringify(this.state.id));
        console.log('ASync stora data login : => '+ this.state.id +'  '+ this.state.token)
      }catch(error){
        console.log(error);
      }
    }
  
    render() {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Chittr</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            onChangeText={(text) => this.setState({ email: text })}
            value={this.state.email}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            onChangeText={(text) => this.setState({ password: text })}
            value={this.state.password}
            secureTextEntry={true}
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={this.Login} 
            > 
              <Text style={styles.btnText}>Log In</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.btn}
              onPress={() => this.props.navigation.navigate("Register")}
            >
              <Text style={styles.btnText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: '#8BD5C7'
    },
    title: {
      fontSize: 50,
      marginBottom: 150,
      marginTop: 100
    },
    textInput: {
      width: "90%",
      marginBottom: 10,
      backgroundColor: "#fff",
      padding: 15
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    }
  
  
  });
  
  export default Login;