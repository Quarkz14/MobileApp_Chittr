import React, { Component } from 'react';
import { Text, View,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class FollowerScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: '',
            id: '',
            followersList: []
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
        return fetch('http://10.0.2.2:3333/api/v0.0.5/user/' +this.state.id + "/followers")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    followersList: responseJson
                });
            }).catch((error) => {
                console.log(error);
            });
      }
       componentDidMount(){
           this.retrieveLoginData();
       }

    render(){
    return(
       
        <View>
         <FlatList
                    data={this.state.followersList}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.given_name}{' '} {item.family_name} </Text>
                            <Text>Follows you</Text>
                        </View>
                    )}
                    keyExtractor={item => item.user_id.toString()}

                />
        </View>
   
    );
    }
   }
   export default FollowerScreen;