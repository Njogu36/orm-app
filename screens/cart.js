
import * as WebBrowser from 'expo-web-browser';
import React,{Component} from 'react';
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

import { MonoText } from '../components/StyledText';
import { Container, Header, Content, Tab, Tabs,Button } from 'native-base';
import Existing from './exisitng';
import NewCustomer from './new';
import { withNavigation } from 'react-navigation';


export default class Cart extends Component {
  static navigationOptions = {
    title: 'Carts',
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

  render()
  {
    return (
      <Container>
       
   <Tabs tabBarUnderlineStyle='#5F0157' >
    <Tab heading="New Customer" tabStyle={{backgroundColor: '#5F0157'}} textStyle={{color: 'white'}} activeTabStyle={{backgroundColor: 'white'}} activeTextStyle={{color: 'black', fontWeight: 'normal'}}>
     
       <NewCustomer/>
    </Tab>
    <Tab navigation={this.props.navigation} heading="Existing Customer" tabStyle={{backgroundColor: '#5F0157'}} textStyle={{color: 'white'}} activeTabStyle={{backgroundColor: 'white'}} activeTextStyle={{color: 'black', fontWeight: 'normal'}}>
    <Existing/>
    </Tab>
</Tabs>
    </Container>
    );
  }
 
}




const styles = StyleSheet.create({
 
});
