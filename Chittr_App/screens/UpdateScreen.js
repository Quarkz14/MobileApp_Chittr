import React, { Component } from 'react';
import { Text, View,TouchableOpacity,StyleSheet,TextInput,Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
    
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row"
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    },
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#8BD5C7'
      },
      title: {
        fontSize: 30,
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

class UpdateScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            surname: '',
            token: '',
            id: ''
          }
    }
    static navigationOptions = {
        header: null
       }

       retrieveLoginData = async () => {
        try {
  
          const  idIncoming = await AsyncStorage.getItem('id',(item) => console.log( ' update id: ' + item));
          const tokenIncoming = await AsyncStorage.getItem('token',(item) => console.log( ' update token: ' + item));
          const id = JSON.parse(idIncoming);
          const token = JSON.parse(tokenIncoming);
          this.setState({id:id});
          this.setState({token: token});
          console.log("Async update retrieve :  " + this.state.id + '  ' + this.state.token);
        }catch(error){
          console.log(error);
        }
      }

       updateUser = ()=> {
        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" +this.state.id,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': this.state.token
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
            Alert.alert("Account updated!")
            this.props.navigation.navigate("ProfileScreen");
          }
          else{
            Alert.alert("An error occured!")
          }
        }).catch((error) => {
          console.error(error);
        });
       }
       componentDidMount(){
           this.retrieveLoginData();
       }

    render(){
    return(
       
        <View style={styles.container}>
          <Text style={styles.title}>Account Info Update</Text>
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
              onPress={this.updateUser}
            >
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
   
    );
    }
   }
   export default UpdateScreen;