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
               const chit = await AsyncStorage.getItem('chitDraft');
               this.state.draftList = await AsyncStorage.getItem('draftList');
               const chitSon = JSON.parse(chit); 
               this.state.draftList.push(chitSon);
               console.log(this.state.draftList);
               await AsyncStorage.setItem('draftList',JSON.stringify(this.state.draftList));
           }catch(error){
               console.log(error);
           }
       }

      discardDraft = (i) => {
        this.setState(
            prevState => {
              let draftList = prevState.draftList.slice();
      
              draftList.splice(i, 1);
      
              return { draftList };
            }
          );
      }
       emptyDrafts = () => {
           return(
               <View>
                   <Text>No drafts!</Text>
               </View>
           )
       }
       componentDidMount(){
           this.retrieveDraft();
       }
    render(){
    return(
       
        <View>
          <FlatList
                    data={this.state.draftList}
                    renderItem={({ item, index }) => (
                        <View>
                            <Text>{item.chit_content}: </Text>
                            <TouchableOpacity
                                onPress={this.discardDraft(index)}
                            ><Text>Discard</Text></TouchableOpacity>
                            <TouchableOpacity><Text>Edit</Text></TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent = {this.emptyDrafts()}
                    
                />
        </View>
   
    );
    }
   }
   export default DraftScreen;