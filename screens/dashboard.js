
import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import NumberFormat from 'react-number-format';
import { MonoText } from '../components/StyledText';
import NetInfo from "@react-native-community/netinfo";

export default class Dashboard extends Component {
  static navigationOptions = {
    title: 'Dashboard',
    headerStyle: {
      backgroundColor: "#5F0157",
      color: 'white'
    },
    headerTintColor: "#5F0157",
    headerTitleStyle: {
      fontWeight: 'bold',
      color: 'white'
    },
  };
  constructor()
  {
    super()
    this.state= {
      commission:'0',
      items:0,
      wallet:'0',
      user:[],
      customers:[]
    }
  }
  componentDidMount()
  {
this._getDetails().done()
  }
  _getDetails=async()=>{
 
  
    var user  = await AsyncStorage.getItem('User')
    var data = JSON.parse(user)
    var customer = await AsyncStorage.getItem('Customers');
    var customerData = JSON.parse(customer)
   if(customer===null)
   {
    this.setState({customers:[]})
   }
   else
   {
     const customerFilter = customerData.filter((item)=>{return item.agentID === data._id})
    this.setState({customers:customerFilter})
   }
  
  
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        fetch('https://malimaliweb.herokuapp.com/agent/getAgent/'+data._id,{
          method:'GET',
          headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
          }
        }).then(res=>res.json()).then((res)=>{
          if(res.success===true){
            console.log(res.agent)
            AsyncStorage.removeItem('User');
            AsyncStorage.setItem('User',JSON.stringify(res.agent))
            var agent = res.agent;
            var commission = agent.commission;
            var debt =agent.debt;
            var items = agent.soldItems
            var com = (parseInt(commission)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            var deb= (parseInt(debt)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            this.setState({user:res.agent,commission:com,wallet:deb,items:items})
          }
         
        })
    
      }
      else {
        Alert.alert('Kindly enable your internet connection')
      }
    });
    
  }
  render() {
    return (
      <ScrollView>
         <View>
          <Card style={{ backgroundColor: '#ebe6e6', marginTop: 20, marginLeft: 20, marginRight: 20,borderLeftWidth:2,borderLeftColor:'#5F0157' }}>

            <Card.Content>
              <Title>Customers</Title>
    <Paragraph>{this.state.customers.length}</Paragraph>
            </Card.Content>


          </Card>
        </View>
        <View>
          <Card style={{ backgroundColor: '#ebe6e6', marginTop: 20, marginLeft: 20, marginRight: 20 ,borderLeftWidth:2,borderLeftColor:'#5F0157'}}>

            <Card.Content>
              <Title>Total Commission</Title>
              <Paragraph>KES {this.state.commission}</Paragraph>
            </Card.Content>


          </Card>
        </View>
        <View>
          <Card style={{ backgroundColor: '#ebe6e6', marginTop: 20, marginLeft: 20, marginRight: 20,borderLeftWidth:2,borderLeftColor:'#5F0157' }}>

            <Card.Content>
              <Title>Wallet</Title>
  <Paragraph>KES {this.state.wallet}</Paragraph>
            </Card.Content>


          </Card>
        </View>
        <View>
          <Card style={{ backgroundColor: '#ebe6e6', marginTop: 20, marginLeft: 20, marginRight: 20,borderLeftWidth:2,borderLeftColor:'#5F0157' }}>

            <Card.Content>
              <Title>Sold Items</Title>
    <Paragraph>{this.state.items}</Paragraph>
            </Card.Content>


          </Card>
        </View>


      </ScrollView>

    );
  }
}




const styles = StyleSheet.create({
  commission:
  {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  }
});
