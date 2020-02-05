import React, { Component } from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet, Image, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { withOrientation } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";
export default class Login extends Component {

    state = {
        username: '',
        password: '',
        online:true,
    };



    componentDidMount() {
        this._checkUser().done()
    }
    _checkUser = async () => {
        const value = await AsyncStorage.getItem('User');
        console.log(value)
        NetInfo.fetch().then(state => {
            if(state.isConnected){
          
                if (value !== null) {
                    this.props.navigation.navigate('Main')
                    
                }
                else {
                    this.props.navigation.navigate('Login')
                }
              
            }
            else
            {
             
                if (value !== null) {
                    this.props.navigation.navigate('Main')
                    
                }
                else {
                    this.props.navigation.navigate('Login')
                }
              
            }
          });
      
    }
    onLogin() {
     
        if (this.state.username === '') {
            Alert.alert('Username is required')
        }
        else if (this.state.password === '') {
            Alert.alert('Password is required')
        }
        else {
            var username = this.state.username;
            var password = this.state.password;
            NetInfo.fetch().then(state => {

                if(state.isConnected)
                {
                    console.log('You are online')
                    fetch('https://malimaliweb.herokuapp.com/agent/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }).then((res) => res.json()).then((res) => {
                        if (res.success === true) {
                     
                        AsyncStorage.setItem('User', JSON.stringify(res.agent));
                        this.props.navigation.navigate('Main')
                        }
                        else if (res.success === false) {
                            Alert.alert(res.message)
                        }
                    })
                }
                else
                {
                    Alert.alert('Your are offline. Kindly enable your network connection.')
                }
              });
           

        }



    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding'>

                <View style={styles.logo}>
                    <Image source={require('../assets/images/icon.jpg')} />
                </View>

                <TextInput
                    value={this.state.email}
                    keyboardType='email-address'
                    onChangeText={(username) => this.setState({ username })}
                    placeholder='Username'
                    placeholderTextColor='black'
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    placeholderTextColor='black'
                    style={styles.input}
                />


                <TouchableOpacity
                    style={styles.button}
                    onPress={this.onLogin.bind(this)}
                >
                    <Text style={styles.buttonText}> Login </Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#5F0157"
    },
    logo:
    {
        marginBottom: 10,
        marginTop: -25
    },
    button: {
        alignItems: 'center',

        width: 300,
        height: 50,
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#007bff',
        borderColor: '#007bff',

        marginBottom: 10,
    },
    buttonText:
    {
        color: 'white',
        fontSize: 18
    },
    input: {
        width: 300,

        fontSize: 20,
        height: 50,
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        marginVertical: 10,
    },
});
