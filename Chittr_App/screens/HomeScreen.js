import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet,Alert,Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
    container : {
       flex: 1,
       backgroundColor: '#8BD5C7'
    },
   title : { 
      fontSize: 50,   
      marginBottom: 150,
      marginTop: 100
    },
    textName : {
      fontSize: 18,
      padding: 20,
      paddingLeft: 0,
      fontWeight: "bold" 
    },
    ScrollViewContainer : {
       width: "95%",
       height: "95%",
       padding: 20,
       alignItems: "center"
       
    },
    viewFlatList : {
        flexDirection: "column",
        justifyContent: "center",
        width: "90%"
        
    },
    textChit: {
      fontSize:16,
      paddingBottom: 10,
      paddingLeft:10,
      backgroundColor: "#EDF8F6",
      borderStyle: "solid",
        borderColor: "#000000"
    },
    tabInfo: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: '#fff'
    },
    logoutBtn: {
        backgroundColor: '#3AA18D',
        borderRadius:7,
        
    }
   
  });

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chitsListData: [],
            isLoading: true,
            token: '',
            id: '',
            name: '',
            surname: '',
            photo: null,
            refreshing: false,
        }

    }

    static navigationOptions = {
        header: null
    }

    getChits =   () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=50')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    chitsListData: responseJson,
                });
                this.retrieveData();
                this.setState({
                    refreshing: false
                })
            }).catch((error) => {
                console.log(error);
            });
    }
    componentDidMount() {
        this.getChits();
        this.retrieveData();
        this.retrieveProfileData();
    }

    retrieveData= async () => {
        try{
            const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' home id: ' + item));
            const  token = await AsyncStorage.getItem('token',(error,item) => console.log( ' home token: ' + item));
           
            const id = JSON.parse(idIncoming);
           
            
            this.setState({token: token});
            this.setState({id: id});
            this.getUserPhoto();
        }catch(error){
            console.log(error);
        }
    }
    //Get data form the profile 
    retrieveProfileData = async() => {
        try{
            const name = await AsyncStorage.getItem('name',(error,item) => console.log( ' Profile name ' + item));
            const surname = await AsyncStorage.getItem('surname',(error,item) => console.log( ' Profile surname ' + item))
             
            this.setState({name : name});
            this.setState({surname : surname});


        }catch(error){
            console.log(error);
        }
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
    getUserPhoto = () => {
        console.log("ID of getPhot" + this.state.id)
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + this.state.id + '/photo')
            .then((response) =>{
                this.setState({photo:response})
                console.log(response);
              })
              .catch((error) => {
                  console.log(error);
              });
      }
      handleRefresh = () => {
          
          this.setState({
              refreshing: true,
          })
          this.getChits();
          
      }
    
    render() {
        const {photo} = this.state
        if (this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.tabInfo}>
                <Text>{ photo && (
                            <Image
                                source={{uri:photo.url}}
                                style={{width:30, height: 30}}
                            /> )}
                            {this.state.name}{' '}{this.state.surname}</Text>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={this.logout}
                    >
                        <Text>Log out</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.ScrollViewContainer}>
                <FlatList
                    data={this.state.chitsListData}
                    renderItem={({ item }) => (
                        <View style={styles.viewFlatList}>
                            <Text style={styles.textName}>{item.user.given_name}: </Text>
                            <Text style={styles.textChit}>{item.chit_content}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.chit_id.toString()}
                    refreshing = {this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    
                />
                </View>
            
            </View>
        );
    }
}


export default HomeScreen;