import React, { Component } from 'react';
import { Text, View,FlatList,StyleSheet,Alert,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#8BD5C7',
      },
      flatlist : {
        width: "95%",
        height: "73%",
        padding: 30,
        justifyContent: "center"
      },
      text : {
          fontSize: 25
      },
      viewFlatlist : {
          margin:10
      },
      unfollowContainer : {
        justifyContent: "space-around",
        flexDirection: "row"
      },
      followingText : {
          paddingLeft: 30
      },
      unfollowBtn : {
        fontSize: 20,
        padding: 5,
        backgroundColor:'#3AA18D',
        borderRadius: 5
      }
   
  });

class FollowerScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: '',
            id: '',
            followingList: []
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
          console.log("Async followers retrieve :  " + this.state.id + '  ' + this.state.token);
          this.getFollowers();
        }catch(error){
          console.log(error);
        }
      }

      getFollowers = () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +this.state.id + "/following")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    followingList: responseJson
                });
            }).catch((error) => {
                console.log(error);
            });
      }

      unFollowUser = (following_id) => {
        console.log("This user id: " + following_id + 'is being unfollowed by: ' +this.state.id);

        return fetch("http://10.0.2.2:3333/api/v0.0.5/user/" + following_id + '/follow',
        {
          method: 'DELETE',
          headers: {
            'X-Authorization': this.state.token
          }
        })
        .then((response) =>{ 
          if(response.status === 200){
              Alert.alert("Unfollowed!")
          }else{
              Alert.alert("Beep boop something went wrong")
          }
        }
        ).catch((error) => {
          console.error(error);
        });
      }
       componentDidMount(){
           this.retrieveLoginData();
       }

    render(){
    return(
       <View style={styles.container}>
            <View style={styles.flatlist}>
            <FlatList
                        data={this.state.followingList}
                        renderItem={({ item }) => (
                            <View style={styles.viewFlatlist}>
                                <View style={styles.unfollowContainer}> 
                                <Text style={styles.text}>{item.given_name}{' '} {item.family_name}</Text>
                                <TouchableOpacity
                                    style={styles.unfollowBtn}
                                    onPress={() => this.unFollowUser(item.user_id)}
                                ><Text>Unfollow</Text></TouchableOpacity>
                                </View>
                                <Text style={styles.followingText}>Following</Text>
                            </View>
                        )}
                        keyExtractor={item => item.user_id.toString()}

                    />
            </View>
        </View>               
    );
    }
   }
   export default FollowerScreen;