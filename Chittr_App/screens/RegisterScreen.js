import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

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
      return fetch("http://10.0.2.2:3333/api/v0.0.5/user",
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
  
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
            surname: this.state.surname
          })
        })
        .then((response) => response.json()).then((responseJson) => {
          this.setState({ authCode: responseJson.token });
          console.log(responseJson)
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