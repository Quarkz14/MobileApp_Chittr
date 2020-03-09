import React, { Component } from 'react';
import { Text, View, ActivityIndicator,ScrollView,FlatList } from 'react-native';



   
class HomeScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            chitsListData: [],
            isLoading: true
        }
    }
    
    static navigationOptions = {
        header: null
       }

    getChits = () => {
        return fetch('http://10.0.2.2:3333/api/v0.0.5/chits')
      .then((response) => response.json())
      .then((responseJson) => {
      this.setState({
      isLoading: false,
      chitsListData: responseJson,
      });
      console.log(responseJson)
      }).catch((error) =>{
      console.log(error);
      });
    }
    componentDidMount(){
        this.getChits();
       }

 render(){
    if(this.state.isLoading){
        return(
        <View>
        <ActivityIndicator/>
        </View>
        )
        }
    return(
        <View>
            
        <FlatList
            data={this.state.chitsListData}
            renderItem={({item}) =>( 
                <ScrollView>
                <Text>{item.chit_content} </Text>
                </ScrollView>
            )}
        keyExtractor={({id}, index) => id}
        
        />
            
            
        </View>
    );
    }
    }
export default HomeScreen;