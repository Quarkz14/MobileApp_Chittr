import React, { Component } from 'react';
import { Text, View, ActivityIndicator, ScrollView, FlatList, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container : {
       flex: 1,
       alignItems: "center",
       backgroundColor: '#54CBFF'
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
       width: "90%",
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
      backgroundColor: "#38B0DE",
      borderStyle: "solid",
        borderColor: "#000000"
    } 
   
   
  });

class HomeScreen extends Component {
    constructor(props) {
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
            }).catch((error) => {
                console.log(error);
            });
    }
    componentDidMount() {
        this.getChits();
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
                <ScrollView style={styles.ScrollViewContainer}>
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
                </ScrollView>

            </View>
        );
    }
}


export default HomeScreen;