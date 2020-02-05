
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
  TouchableHighlight,
  AsyncStorage,
  Dimensions,
  KeyboardAvoidingView, TextInput, Alert, Modal

} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import NumericInput from 'react-native-numeric-input'
import { MonoText } from '../components/StyledText';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['customerName', 'customerPhone'];
import { Container, Header, Content, List, Icon, ListItem, Button, Thumbnail, Left, Body, Right } from 'native-base';
import DatePicker from 'react-native-datepicker'


export default class Cart extends Component {
  static navigationOptions = {
    title: 'Sales',
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

  constructor(props) {
    super(props);
    this.state = { from: "", to: "", sales: [], total: '', tax: '', info: false, items: 0 }
  }
  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }
 

  getSales = async (date) => {
    this.setState({ to: date });
    var user = await AsyncStorage.getItem("User");
    var value = JSON.parse(user)
    if (this.state.from === '') {
      Alert.alert('All dates inputs are required')
    }
    else {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {

          fetch('https://malimaliweb.herokuapp.com/agent/getSales/' + value._id, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: this.state.to,
              from: this.state.from
            })
          }).then((res) => res.json()).then((res) => {

            if (res.success === true) {
              var array = res.sales;
              if (array.length > 0) {
                let result = array.map(({ total }) => total)
                let result1 = array.map(({ tax }) => tax)
                let result2 = array.map(({ totalProducts }) => totalProducts)

                var total = 0;
                for (var i = 0; i < result.length; i++) {
                  total += result[i];
                }

                var tax = 0;
                for (var i = 0; i < result1.length; i++) {
                  tax += result1[i];
                }
                var items = 0;
                for (var i = 0; i < result2.length; i++) {
                  items += result2[i];
                }
                const tax2 = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
               
                this.setState({ sales: res.sales, total: total2, tax: tax2, items: items, info: true })
              }
              else {
                this.setState({ sales: [], total: '', tax: '', items: 0, info: false })
              }

            }


          })
        }
        else {
          Alert.alert('Your are offline. Kindly enable your network connection.')
        }
      });
    }
  }


  render() {
    var sale = this.state.sales;
    var saleList  = sale.map((item)=>
    {

    return (  <List key={item.orderNo}>
      <ListItem thumbnail>
         
          <Body>
              <Text numberOfLines={1} style={{ width: 150, fontSize: 15, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                 Order No: {item.orderNo}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                  Total: KES {item.total} | Tax: KES {item.tax} | Products: {item.totalProducts}
              </Text>
            
           
          </Body>
          
      </ListItem>
  </List>
    )
    })

    return (
      <View style={styles.container}>


        <View>
          <View style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, backgroundColor: 'whitesmoke', width: Dimensions.get('window').width }}>


            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text>From:</Text>
                <DatePicker
                  style={{ width: 160 }}
                  date={this.state.from}
                  mode="date"
                  placeholder="From"
                  format="YYYY-MM-DD"
                  minDate="2020-01-01"
                  maxDate="3016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.setState({ from: date }) }}
                />
              </View>
              <View>
                <Text>To:</Text>
                <DatePicker
                  style={{ width: 160, marginRight: 20 }}
                  date={this.state.to}
                  mode="date"
                  placeholder="To"
                  format="YYYY-MM-DD"
                  minDate="2020-01-01"
                  maxDate="3016-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => { this.getSales(date) }}
                />
              </View>


            </View>
            </View>
          
              {
                this.state.info ?
<View>
                 <Text style={{marginLeft:10,fontSize:13}}>Total Sales: [ {this.state.sales.length} ]</Text>
                  <View style={{flexDirection:'row',justifyContent:'space-evenly',marginTop:10}}>

                    <View style={{backgroundColor:'whitesmoke',borderLeftWidth:2,borderLeftColor:'#5F0157',paddingLeft:10,paddingRight:10,width:110}}>
                     <Text>Total</Text>
                     <Text style={{textDecorationLine:'underline'}}>             </Text>
              <Text style={{marginBottom:10}}>KES {this.state.total}</Text>
                    </View>
                    <View style={{backgroundColor:'whitesmoke',borderLeftWidth:2,borderLeftColor:'#5F0157',paddingLeft:10,paddingRight:10,width:110}}>
                    <Text>Tax</Text>
                     <Text style={{textDecorationLine:'underline'}}>             </Text>
              <Text style={{marginBottom:10}}>KES {this.state.tax}</Text>
                    </View>
                    <View style={{backgroundColor:'whitesmoke',borderLeftWidth:2,borderLeftColor:'#5F0157',paddingLeft:10,paddingRight:10,width:110}}>
                    <Text>Items</Text>
                    <Text style={{textDecorationLine:'underline'}}>             </Text>
              <Text style={{marginBottom:10}}>{this.state.items}</Text>
                    </View>
                      
                  </View>
                   <ScrollView style={{marginBottom:40}}>
                    {saleList}
                   </ScrollView>
                   </View>
                  :
                  <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:50}}>
                   <Text style={{fontSize:18,opacity:0.8}}>No data available</Text>
                  </View>
              }
 

         


        </View>


      </View>
    );

  }

}




const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    paddingBottom: 100
  },
  change:
  {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 150
  },
  input: {
    width: 300,

    fontSize: 15,
    height: 40,
    padding: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: "#5F0157",
    marginVertical: 10,
  },
  button: {
    marginTop: 8,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 300,
    borderRadius: 0,
    backgroundColor: 'green',
    borderColor: 'green',
  },
  button1: {
    marginTop: 8,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 0,
    backgroundColor: 'green',
    borderColor: 'green',
  },
});
