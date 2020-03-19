import React, { Component } from 'react';
import { Text, View,TouchableOpacity,StyleSheet,TextInput,Alert,FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


// const styles = StyleSheet.create({
    
    
   
//   });

class DraftScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            draftList: [],
          }
    }
    static navigationOptions = {
        header: null
       }

       retrieveDraft = async() => {
            try{
                const chit= await AsyncStorage.getItem('chitDraft');
                draftList.push(chit);
            }catch(error){
                console.log(error);
            }
       }
      discardDraft = (chit_content) => {
            const index = draftList.indexOf("'" + chit_content + "'");
            draftList.filter(draftList !== index)
      }
       emptyDrafts = () => {
           return(
               <View>
                   <Text>No drafts!</Text>
               </View>
           )
       }
    render(){
    return(
       
        <View>
          <FlatList
                    data={this.state.draftList}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.chit_content}: </Text>
                            <TouchableOpacity><Text>Discard</Text></TouchableOpacity>
                            <TouchableOpacity><Text>Edit</Text></TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={({item}) => item.chit_content}
                    ListEmptyComponent = {this.emptyDrafts()}
                    
                />
        </View>
   
    );
    }
   }
   export default DraftScreen;