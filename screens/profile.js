import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";
export default class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerStyle: {
      backgroundColor:  "#5F0157",
      color:'white'
    },
    headerTintColor:  "#5F0157",
    headerTitleStyle: {
      fontWeight: 'bold',
      color:'white'
    },
  };
  constructor() {
    super()
    this.state = {
      pass: false,
      password: '',
      password2: '',
      id: '',
      fullname: '',
      phone: '',
      IDNumber: '',
      tillNumber: '',
      location: '',
      username: ''
    }
  }

  componentDidMount() {
    this._getUser().done()
  }
  _getUser = async () => {
    const value = await AsyncStorage.getItem('User');
    const data = JSON.parse(value);
    console.log(data._id)
    var id = data._id;
    var fullname = data.firstname + ' ' + data.lastname;
    var phone = data.phone;
    var IDNumber = data.idNumber;
    var username = data.username
    var tillNumber = data.tillNumber;
    var location = data.location;
    this.setState({
      id: id,
      fullname: fullname,
      phone: phone,
      IDNumber: IDNumber,
      tillNumber: tillNumber,
      location: location,
      username: username
    })

  }
  password() {
    this.setState({ pass: !this.state.pass,password:'',password2:'' })
  }
  changePassword() {
    
    if(this.state.password==='')
    {
      Alert.alert('Password is required.')
    }
    else if(this.state.password2==='')
    {
        Alert.alert('Confirm password is required.')
    }
    else if(this.state.password !== this.state.password2)
    {
       Alert.alert('Passwords do not match.')
    }
    else
    {
      const pass = this.state.password
      NetInfo.fetch().then(state => {
        if(state.isConnected)
        {
          fetch('https://malimaliweb.herokuapp.com/agent/changePassword/'+this.state.id,{
            method:'POST',
            headers:{
              'Accept':'application/json',
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              password:pass
            })
          }).then((res)=>res.json()).then((res)=>{
            if(res.success===true)
            {
              this.setState({ pass: !this.state.pass })
         Alert.alert('Your password has been successfully changed.')
      
            }
            else if(res.success===false)
            {
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
  logout() {
    AsyncStorage.removeItem('User');
    this.props.navigation.navigate('Login')
  }
  render() {
    return (

      <ScrollView style={styles.container}>

        <View>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={require('../assets/images/user.png')} />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.state.fullname}</Text>
              <Text style={styles.info}> {this.state.username} / {this.state.phone}</Text>
              <Text style={styles.description}>Location: {this.state.location}</Text>
              <Text style={styles.description}>ID No: {this.state.IDNumber}</Text>
              <Text style={styles.description}>Till No: {this.state.tillNumber}</Text>

              <View>

                <TouchableOpacity style={styles.buttonContainer} onPress={this.password.bind(this)}>
                  <Text style={styles.buttonText}>Change Your Password</Text>
                </TouchableOpacity>
              </View>
              {
                this.state.pass ?
                  <KeyboardAvoidingView style={styles.change} behavior='padding'>

                    <TextInput
                      value={this.state.email}
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({ password })}
                      placeholder='Enter Password'
                      placeholderTextColor='black'
                      style={styles.input}
                    />
                    <TextInput
                      value={this.state.password2}
                      onChangeText={(password2) => this.setState({ password2 })}
                      placeholder={'Confirm Password'}
                      secureTextEntry={true}
                      placeholderTextColor='black'
                      style={styles.input}
                    />


                    <TouchableOpacity
                      style={styles.button}
                      onPress={this.changePassword.bind(this)}
                    >
                      <Text style={styles.buttonText}> Update </Text>
                    </TouchableOpacity>
                  </KeyboardAvoidingView> :
                  <View></View>
              }
              <View>
                <TouchableOpacity style={styles.buttonContainer1} onPress={this.logout.bind(this)}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>







            </View>
          </View>
        </View>



      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5F0157",
    height: 140,
  },
  buttonText:
  {
    color: 'white'
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 70
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  input: {
    width: 300,

    fontSize: 20,
    height: 50,
    padding: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: "#5F0157",
    marginVertical: 10,
  },
  change:
  {
    marginTop: 10,
    flex: 1,
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 300,
    borderRadius: 0,
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  buttonContainer1: {
    marginTop: 5,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 0,
    backgroundColor: '#f0134d',
    borderColor: '#f0134d',
  },
  button: {
    marginTop: 8,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 0,
    backgroundColor: '#7fcd91',
    borderColor: '#7fcd91',
  },
});