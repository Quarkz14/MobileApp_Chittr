import React, { Component } from 'react';
import { Text, View,TouchableOpacity,StyleSheet,TextInput, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator} from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation';
import FollowerScreen from './FollowerScreen';
import FollowingScreen from './FollowingScreen';

const styles = StyleSheet.create({
    
    tabInfo: {
        justifyContent: "space-around",
        flexDirection: "row"
    },
    logoutBtn: {
        backgroundColor: '#3AA18D'
    },
    textInput : {
        backgroundColor: '#fff'
    },
    searchBtn : {
    backgroundColor: '#3AA18D',
    margin:15
    },
    container: {
        flex:1,
        backgroundColor: '#8BD5C7',
      },
      searchContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
        
      },
      followContainer : {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "90%",
        alignItems:"flex-end"
        
      },
      followBtn : {
        backgroundColor: "#3AA18D",
        padding: 15,
        width: "45%"
      },
      followText: {
        fontSize: 18,
        textAlign: "center",
      }
   
  });

class FPanelScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            token: '',
            name: '',
            surname: '',
            searchInput: '',
            arrayUsers: [],
            searchedUserID:'',
        }
    }
    static navigationOptions = {
        header: null
       }

       retrieveLoginData = async () => {
        try {
  
          const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' F-panel id: ' + item));
          const  tokenIncoming = await AsyncStorage.getItem('token',(error,item) => console.log( ' F-panel token: ' + item));
          const name = await AsyncStorage.getItem('name',(error,item) => console.log( ' F-panel name: ' + item));
          const surname = await AsyncStorage.getItem('surname',(error,item) => console.log( ' F-panel surname: ' + item));
          const id = JSON.parse(idIncoming);
          const token = JSON.parse(tokenIncoming);
          this.setState({id:id});
          this.setState({token:token});
          this.setState({name:name});
          this.setState({surname: surname});

          console.log("Async f-panel retrieve :  " + this.state.id + '  token:' + this.state.token + ' name:' + this.state.name + ' surname: ' + this.state.surname);
            
        }catch(error){
          console.log(error);
        }
      }

      searchUser = () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/search_user?q='+ this.state.searchInput)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    arrayUsers: responseJson
                });
                console.log("this is searcheduser " + this.state.arrayUsers);
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

    componentDidMount() {
        this.retrieveLoginData();
        
      }


    render(){
    return(
        <View style={styles.container}>
            <View style={styles.tabInfo}>
            <Text>IMG {this.state.name}{' '}{this.state.surname}</Text>
            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={this.logout}
            >
                <Text>Log out</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <TextInput
                placeholder="Search"
                onChangeText={(text) => this.setState({ searchInput: text })}
                value={this.state.searchInput}
                />
                <TouchableOpacity
                    onPress={this.searchUser}
                    style={styles.searchBtn}
                >
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.followContainer}>
                <TouchableOpacity
                style={styles.followBtn}
                onPress={()=> this.props.navigation.navigate('Followers')}
                ><Text style={styles.followText}>Followers</Text></TouchableOpacity>
                <TouchableOpacity
                style={styles.followBtn}
                onPress={()=> this.props.navigation.navigate('Following')}
                ><Text style={styles.followText}>Following</Text></TouchableOpacity>
            </View>

        </View>
    );
    }
}
    const FPanel = createStackNavigator ({
        Followers : {
            screen: FollowerScreen
        },
        Following : {
          screen: FollowingScreen
        },
        FPanel:{
            screen: FPanelScreen
        }
      },
        {
          initialRouteName: 'FPanel'
      })
      const FPanelStack = createAppContainer(FPanel);
   
   export default FPanelStack;