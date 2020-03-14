import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, FlatList, StyleSheet,Alert } from 'react-native';

const styles = StyleSheet.create({
    container : {
       flex: 1,
       alignItems: "center",
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
       padding: 20
       
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
        justifyContent: "space-around",
        flexDirection: "row"
        

    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    }
   
  });

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chitsListData: [],
            isLoading: true,
            authCode: '',
            id: ''
        }

    }

    static navigationOptions = {
        header: null
    }
    /*
    _retrieveData = async () => {
        try{
            const token = await AsyncStorage.getItem('token');
            const id  = await AsyncStorage.getItem('id');

            if(token !== null && id !== null) {
                this.setState({authCode: token});
                this.setState({id: id});
                console.log(token + "  " + id);
            }
        }catch(error) {
            console.log(error);
        }
    }
*/
    getChits =   () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    chitsListData: responseJson,
                });
                
            }).catch((error) => {
                console.log(error);
            });
    }
    componentDidMount() {
        this.getChits();
        this.getUserInfo();
    }
    getUserInfo = () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' + global.id)
            .then((response) => response.json())
            .then((responseJson) => {
                
                    global.name = responseJson.given_name;
                    global.surname = responseJson.family_name;
                    global.email = responseJson.email;
                console.log(global.name);
                console.log(global.surname);
                
            }).catch((error) => {
                console.log(error);
            });
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
    
    render() {
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
                    <Text>IMG {global.name}{' '}{global.surname}</Text>
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
                    keyExtractor={item => item.chit_id}

                />
                </View>
            
            </View>
        );
    }
}


export default HomeScreen;