import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

  class Register extends Component {

    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        name: '',
        surname: '',
        authCode: ''
      }
    }
  
    
    Register = () => {
      console.log(this.state.email + "  " + this.state.password + " " + this.state.name + " " + this.state.surname);

      return fetch("http://10.0.2.2:3333/api/v0.0.5/user",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
  
          body: JSON.stringify({
            given_name: this.state.name,
            family_name: this.state.surname,
            email: this.state.email,
            password: this.state.password
          })
        })
        .then((response) => {
          if(response.status === 201){
            Alert.alert("Account created!")
            this.props.navigation.navigate("LogIn");
          }
          else{
            Alert.alert("An error occured!")
          }
        }).catch((error) => {
          console.error(error);
        });
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
          <TextInput
            style={styles.textInput}
            placeholder="Name"
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Surname"
            onChangeText={(text) => this.setState({ surname: text })}
            value={this.state.surname}
          />
          <View style={styles.btnContainer}>
           
  
            <TouchableOpacity
              style={styles.btn}
              onPress={this.Register}
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
      justifyContent: "center",
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
  
  export default Register;