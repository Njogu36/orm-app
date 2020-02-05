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
const KEYS_TO_FILTERS = ['customerName', 'customerPhone','orderNo'];
import { Container, Header, Content, List, Icon, ListItem, Button, Thumbnail, Left, Body, Right } from 'native-base';




export default class complete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      modalVisible: false,
      complete: [],
      cancel:false,
      products:[],
      order:{},
      total:0
     


    }
  }
  componentDidMount() {
    this.reload()
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  reload() {
    this._getComplete()
  }

  _getComplete = async () => {
   const Complete = await AsyncStorage.getItem('CompleteOrders');
   const User = await AsyncStorage.getItem('User');
   const value = JSON.parse(User)
   const data = JSON.parse(Complete)
if(Complete===null)
{
this.setState({complete:[]})
}
else
{
  const completeFilter = data.filter((item)=>{return item.agentID === value._id})
  if(completeFilter.length===0)
  {
    this.setState({complete:[]})
  }
  else
  {
    this.setState({complete:completeFilter})
  }

}

    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        fetch('https://malimaliweb.herokuapp.com/agent/completeOrders/' + value._id, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        
        }).then((res) => res.json()).then((res) => {
          if (res.success === true) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
           
                 AsyncStorage.removeItem('CompleteOrders')
                 AsyncStorage.setItem('CompleteOrders',JSON.stringify(res.orders))
                 AsyncStorage.getItem('PendingOrders',function(err,orders){
                   if(orders===null)
                   {
console.log('Hello                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ')
                   }
                   else
                   {
                    AsyncStorage.removeItem('PendingOrders')
                    AsyncStorage.setItem('PendingOrders',JSON.stringify(res.Pendings))
                   }
                 })
                
              
               
          
          }
        })
      }

    });


  }
  refresh = async () => {
    const Complete = await AsyncStorage.getItem('CompleteOrders');
    const User = await AsyncStorage.getItem('User');
    const value = JSON.parse(User)
   const data = JSON.parse(Complete)
   if(Complete===null)
   {
    this.setState({complete:[]})
    this.reload()
   }
   else
   {

    const completeFilter = data.filter((item)=>{return item.agentID === value._id})
   if(completeFilter.length===0)
   {
    this.setState({complete:[]})
    this.reload()
   }
   else
   {
    this.setState({complete:completeFilter})
    this.reload()
   }
   
   }
  
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term, cancel: true })
    if (this.state.searchTerm !== '') {
      const filteredCustomer = this.state.complete.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      if (filteredCustomer === 0) {
        Alert.alert('No order found')
      }
      else {

        this.setState({ complete: filteredCustomer })
        setTimeout(() => {
          if (this.state.complete.length === 0) {
            Alert.alert('No order found')
          }
        }, 500)
      }
    }
    if (this.state.searchTerm === '') {
      this.reload()
    }



  }
  upload = async () => {
    const Pending = await AsyncStorage.getItem('PendingOrders');
    const User = await AsyncStorage.getItem('User');
    const value = JSON.parse(User)
    const data = JSON.parse(Pending)
    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        fetch('https://malimaliweb.herokuapp.com/agent/pendingOrders/' + value._id, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.complete)
        }).then((res) => res.json()).then((res) => {
          console.log(res.name)
          if (res.success === true) {
            Alert.alert(res.message)
          }
          else if (res.success === false) {
            Alert.alert(res.message)
          }

        })
      }
      else {
        Alert.alert('Your are offline. Kindly enable your network connection.')
      }
    });

  }
  cancel() {
    this.setState({ cancel: false, searchTerm: '' })
    this.reload()
  }


  render() {

    const complete = this.state.complete

    const completeOrderList = complete.map((item) => {
      return (

        <List key={item.orderNo}>
          <ListItem thumbnail>
           
            <Body>
              <Text numberOfLines={1} style={{ width: 150, fontSize: 15, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                Order Number - {item.orderNo}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
      {item.customerName} - {item.customerPhone}
              </Text>

            </Body>
            <Right>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                <Button transparent onPress={async () => {
                     const total2 = (parseInt(item.total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                  this.setState({ order: item,total:total2,products:item.products })

                  this.setModalVisible(true);
                }}>
                  <Icon name='arrow-forward' style={{ color: 'black' }} />
                </Button>
              </View>

            </Right>
          </ListItem>
        </List>
      )
    })
    //products
    const product = this.state.products;
    const productList = product.map((item) => {
      return (

        <List key={item.id}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={require('../assets/images/shop.png')} style={{ width: 25, height: 25 }} />
            </Left>
            <Body>
              <Text numberOfLines={1} style={{  fontSize: 15, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                KES {item.price2}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                Quantity [{item.quantity}]
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
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Complete Orders</Text>
            <Text style={{ textDecorationLine: 'underline' }}>                          </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, marginTop: 4 }}>Total complete orders [ {this.state.complete.length} ]</Text>
              <TouchableOpacity onPress={this.refresh.bind()} style={{ backgroundColor: 'green', color: 'white', marginLeft: 20,marginRight:20, padding: 5 }}>
                <Text style={{ color: 'white' }}>Refresh</Text>
              </TouchableOpacity>
            

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <SearchInput
                onChangeText={(term) => { this.searchUpdated(term) }}
                style={styles.input}
                placeholder="Type to search for a complete order"
              />
              {
                this.state.cancel ?
                  <TouchableHighlight underlayColor='white' onPress={this.cancel.bind(this)} style={{
                    paddingTop: 15,
                    paddingLeft: 0,
                    paddingRight: 15,
                    backgroundColor: 'whitesmoke',
                  }}>
                    <Icon name='close' style={{ color: "black", fontSize: 24, marginRight: 5 }} />
                  </TouchableHighlight>
                  :
                  <View></View>
              }

            </View>

          </View>
          {
            this.state.complete.length === 0 ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: 'bold' }}>You have 0 complete orders</Text>
              </View>
              :
              <ScrollView style={{ marginTop:5, marginBottom: 100 }}>
                <View style={{ marginTop: 10 }}>

                  {completeOrderList}


                </View>

              </ScrollView>
          }

        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          scrollHorizontal
          propagateSwipe
          swipeDirection={["down"]}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
       <View style={{flex:1,paddingBottom:20}}>
            <View style={{ backgroundColor: "#5F0157", paddingTop: 14, paddingBottom: 14 }}>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  this.setState({ products: [],order:{} })
                }}
                style={{ paddingLeft: 20 }}>
                <Icon name='arrow-back' style={{ fontWeight: 'bold', color: "white", fontSize: 24, marginRight: 5 }} />
              </TouchableHighlight>
            </View>
            <View style={{ paddingTop: 5, paddingLeft: 10, height: 147, paddingBottom: 10, backgroundColor: 'whitesmoke', width: Dimensions.get('window').width }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Order Number - {this.state.order.orderNo}</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{this.state.order.customerName} - {this.state.order.customerPhone}</Text>
              <Text style={{ textDecorationLine: 'underline' }}>                                                   </Text>
              <View style={{ }}>
            <Text style={{ fontSize: 12, marginTop: 2 }}>Total products [ {this.state.products.length} ] Status [ {this.state.order.status} ] Date {this.state.order.date}</Text>
            <Text style={{ fontSize: 12, marginTop: 2 }}>Delivered On: {this.state.order.delivery} </Text>
            {
             this.state.order.refNo===''?
             <Text style={{ fontSize: 12, marginTop: 0 }}>Payment Method: {this.state.order.payment}</Text>
             :
           <Text style={{ fontSize: 12, marginTop: 0 }}>Payment Method: {this.state.order.payment} | RefNo: {this.state.order.refNo}</Text>
           }
            
  <Text style={{ fontSize: 18, marginTop: 2 ,fontWeight:'bold'}}>Total Amount KES {this.state.total}</Text>
             
               

              </View>
            </View>

            <ScrollView style={{ marginTop: 10, marginBottom: 100 }}>
                <View style={{ marginTop: 10 }}>

                 {productList}


                </View>

              </ScrollView>
            </View>
        </Modal>

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
