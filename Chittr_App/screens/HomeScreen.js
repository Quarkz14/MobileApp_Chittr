import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet,Alert,Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//styling
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
        margin:10

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

    //gets chits of the followed users by providing the authorization token
    getChits =   () => {
        console.log("get chits token" + this.state.token);
        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits?start=0&count=50',
        {
            method:'GET',
            headers: {
                'X-Authorization': this.state.token,
            }
        }
        
        )
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    chitsListData: responseJson,
                });
                this.setState({
                    refreshing: false
                })
            }).catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        this.retrieveData();
        this.retrieveProfileData();
    }

    //gets the id and token form the local storage
    retrieveData= async () => {
        try{
            const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' home id: ' + item));
            const  token = await AsyncStorage.getItem('token',(error,item) => console.log( ' home token: ' + item));
           
            const id = JSON.parse(idIncoming);
           
            
            this.setState({token: token});
            this.setState({id: id});
            this.getChits();
            this.getUserPhoto();
        }catch(error){
            console.log(error);
        }
    }

    //Get data from async storage
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

    //gets the token form the state and logs the user out
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

    //it should get the photo of the user but when he user isn't created the default image will remain even if a new one is posted
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

      //refreshes the flatlist by calling getChits again
      handleRefresh = () => {
          
          this.setState({
              refreshing: true,
          })
          this.getChits();
          
      }

      //when the flatlist is empty it displays a text to the user
    emptyList= () => {
        return(
            <View>
                <Text>You need followers to see their chits</Text>
            </View>
        )
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
                    ListEmptyComponent={this.emptyList}
                    
                />
                </View>
            
            </View>
        );
    }
}


export default HomeScreen;