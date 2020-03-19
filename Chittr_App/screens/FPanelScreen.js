import React, { Component } from 'react';
import { Text, View,TouchableOpacity,StyleSheet,TextInput, FlatList,Alert ,Image} from 'react-native';
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
        backgroundColor: '#3AA18D',
        borderRadius:7
    },
    textInput : {
        backgroundColor: '#fff',
        width: "80%",
        margin:20,
        
    },
    searchBtn : {
    backgroundColor: '#3AA18D',
    margin:30,
    borderRadius: 5,
    height: "25%"
    },
    container: {
        flex:1,
        backgroundColor: '#8BD5C7',
      },
      searchContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "80%",
        margin: 10
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
      },
      ScrollViewContainer : {
        width: "95%",
        height: "70%",
        padding: 20
        
     },
     listContainer: {
      justifyContent: "space-around",
      flexDirection: "row"
     },
     listText: {
       fontSize: 20
     },
     btnText : {
       fontSize: 20,
       padding: 5,
       backgroundColor:'#3AA18D'
     },
     searchText: {
          fontSize: 20,
          alignSelf: "center"
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
            photo: null,
        }
    }
    static navigationOptions = {
        header: null
       }

       retrieveLoginData = async () => {
        try {
  
          const  idIncoming = await AsyncStorage.getItem('id',(error,item) => console.log( ' F-panel id: ' + item));
          const  token = await AsyncStorage.getItem('token',(error,item) => console.log( ' F-panel token: ' + item));
          const name = await AsyncStorage.getItem('name',(error,item) => console.log( ' F-panel name: ' + item));
          const surname = await AsyncStorage.getItem('surname',(error,item) => console.log( ' F-panel surname: ' + item));
          const id = JSON.parse(idIncoming);
          
          this.setState({id:id});
          this.setState({token:token});
          this.setState({name:name});
          this.setState({surname: surname});
          this.getUserPhoto();
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

    followUser = (follower_id) => {
      console.log("This user id:" + follower_id + 'is being followed by' +this.state.id);

      return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + follower_id + '/follow',
      {
        method: 'POST',
        headers: {
          'X-Authorization': this.state.token
        }
      })
      .then((response) =>{ 
        if(response.status === 200){
            Alert.alert("Followed!")
        }else{
            Alert.alert("You already follow them!")
        }
      }
      ).catch((error) => {
        console.error(error);
      });
    }
    componentDidMount() {
        this.retrieveLoginData();
        
      }
      emptyComponent= () => {
        return(
        <View>
          <Text style={styles.searchText}>Search a user</Text>
        </View>);
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
    render(){
      const {photo} =this.state
    return(
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
            <View style={styles.searchContainer}>
                <TextInput
                style={styles.textInput}
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
            <View style={styles.ScrollViewContainer}>
                <FlatList
                    data={this.state.arrayUsers}
                    renderItem={({ item }) => (
                        <View style={styles.listContainer}>
                            <Text style={styles.listText}>{item.given_name}{' '}{item.family_name} </Text>
                            <TouchableOpacity
                            style={styles.btnText}
                            onPress={()=>this.followUser(item.user_id)}
                            ><Text>Follow</Text></TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={item => item.user_id.toString()}
                    ListEmptyComponent={this.emptyComponent}
                />
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