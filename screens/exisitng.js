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
import { enableScreens } from 'react-native-screens';




export default class New extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      customer: {},
      searchTerm: '',
      cancel: false,
      modalVisible: false,
      carts: [],
      tax: 0,
      tax2: 0,
      total: 0,
      total2: 0,
      refresh: true,
      payments: false,
      complete: false,
      pay:true,
      given: 0,
      mpesa:false,
      refresh: true,
      refNo:''


    }
  }
  componentDidMount() {
    this.reload()
    //AsyncStorage.removeItem('Customers')
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  reload() {
    this._getCustomers()
  }

  _getCustomers = async () => {
    const customers = await AsyncStorage.getItem('Customers');
  
    var user = await AsyncStorage.getItem('User');
    var value = JSON.parse(user)
    var cart = await AsyncStorage.getItem('Cart');
    var cartArray = JSON.parse(cart)
    if (customers === null) {
      this.setState({ customers: [] })
    }
    else {
      var data = JSON.parse(customers);
      var customerFilter = data.filter((item)=>{return item.agentID === value._id});
    
      if(customerFilter.length===0)
      {
        console.log('hello')
      }
      else
      {

        this.setState({ customers: customerFilter })
      }
    
      if(customerFilter.length===0)
      {
        console.log('Hello')
      }
      else
      {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
  
          fetch('https://malimaliweb.herokuapp.com/agent/getCustomers/' + value._id, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).then((res) => res.json()).then((res) => {
            if (res.success === true) {
  
              if (res.total === data.length) {
                console.log('Everything is okey')
              }
              else {
                Alert.alert('Kindly upload your new customers on the cloud')
              }
            }
          })
        }
  
      });
    }
     
    }
    if (cart === null) {
      this.setState({ carts: [] })
    }
    else {
      var cartFilter = cartArray.filter((item)=>{return item.agentID === value._id});
      console.log(cartFilter.length)
      if(cartFilter.length===0)
      {
        console.log('Done')
      }
      else
      {
      let result = cartFilter.map(({ price2 }) => price2)
      let result1 = cartFilter.map(({ tax2 }) => tax2)

      var total = 0;
      for (var i = 0; i < result.length; i++) {
        total += result[i];
      }


      var tax = 0;
      for (var i = 0; i < result1.length; i++) {
        tax += result1[i];
      }

      const tax2 = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

      this.setState({ carts: cartFilter, total: parseInt(total), tax: parseInt(tax), tax2: tax2, total2: total2, payments: false })


    }
    }

 


  }
  refresh = async () => {
    const customers = await AsyncStorage.getItem('Customers');
    var data = JSON.parse(customers);
    var user = await AsyncStorage.getItem('User');
    var value = JSON.parse(user)
    if (customers === null) {
      this.setState({ customers: [], cancel: false })
    }
    else {
      var customerFilter = data.filter((item)=>{return item.agentID === value._id});
      if(customerFilter.length===0)
      {
        this.setState({ customers: [] ,cancel:false})
      }
      else
      {
        this.setState({ customers: customerFilter, cancel: false })
      }
     
    }
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term, cancel: true })
    if (this.state.searchTerm !== '') {
      const filteredCustomer = this.state.customers.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      if (filteredCustomer === 0) {
        Alert.alert('No customer found')
      }
      else {

        this.setState({ customers: filteredCustomer })
        setTimeout(() => {
          if (this.state.customers.length === 0) {
            Alert.alert('No customer found')
          }
        }, 500)
      }
    }
    if (this.state.searchTerm === '') {
      this.reload()
    }



  }
  upload = async () => {
    //AsyncStorage.removeItem("Customers")
    var customers = await AsyncStorage.getItem('Customers');
    var user = await AsyncStorage.getItem('User');
    var value = JSON.stringify(user)
    if(customers===null)
    {
console.log('hh')
    }
    else
    {
    var data = JSON.stringify(customers);
   
    NetInfo.fetch().then(state => {
      if (state.isConnected) {

        fetch('https://malimaliweb.herokuapp.com/agent/addCustomers/' + value._id, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.customers)
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
  }
  cancel() {
    this.setState({ cancel: false, searchTerm: '' })
    this.reload()
  }
  //cart fuctions ============================

  refres = async () => {
    const cart = await AsyncStorage.getItem('Cart');

    var user = await AsyncStorage.getItem('User');
    var value = JSON.stringify(user)
    if (cart === null) {
      console.log('hello')
      this.setState({ carts: [], total: 0, tax: 0, tax2: 0, total2: 0, payments: false })

    }
    else {
      const cartData = JSON.parse(cart);
     
        let result = cartData.map(({ price2 }) => price2)
        let result1 = cartData.map(({ tax2 }) => tax2)
  
        var total = 0;
        for (var i = 0; i < result.length; i++) {
          total += result[i];
        }
  
  
        var tax = 0;
        for (var i = 0; i < result1.length; i++) {
          tax += result1[i];
        }
  
        const tax2 = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  
        this.setState({ carts: cartData, total: parseInt(total), tax: parseInt(tax), tax2: tax2, total2: total2, payments: false })
  
      
    

    }
  }
  clear() {
    AsyncStorage.getItem('Cart', function (err, result) {
      if (result !== null) {
        AsyncStorage.removeItem('Cart');

      }

    })
    this.setState({ carts: [], total: 0, tax: 0, tax2: 0, total2: 0, name: '', phone: '', customerNo: 0, given: 0, payments: false })

  }
  cash = async () => {
    this.setState({ cash: true, payments: false })

  }
  complete = async()=>
  {
   
      var valrandom = Math.floor(1000 + Math.random() * 9000);

  var date = new Date();
  var year = date.getFullYear();
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var time = year + "-" + month + "-" + day
      
      var given = this.state.given
    
    if(given===0)
      {
          Alert.alert('Amount is required')
      }
      else if(given<this.state.total){
          Alert.alert('Failed to proceed, the amount given is less than the total price.')

      }
      else if(given>this.state.total){
        this.setModalVisible(!this.state.modalVisible);
              var change  = given - this.state.total
              const change2  = (parseInt(change)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              
           Alert.alert('Customer change is KES ' + change2)
          
        
    
           const user = await AsyncStorage.getItem('User')
            var data = JSON.parse(user)
         
      var orders = await AsyncStorage.getItem('PendingOrders')
            
          let orderObject = {
              agentID:data._id,
              agentName:data.firstname + ' ' + data.lastname,
              customerNo:this.state.customer.customerNo,
              customerPhone:this.state.customer.customerPhone,
              customerName:this.state.customer.customerName,
              products:this.state.carts,
              total:this.state.total,
              tax:this.state.tax,
              location:this.state.customer.location,
              created_on:new Date(),
              tillNumber:data.tillNumber,
              date:time,
              delivery:"",
              refNo:'',
              payment:'Cash',
              given:this.state.given,
              change:parseInt(change),
              orderNo:valrandom,
              status:'Pending'
          }
       
          if(orders===null)
          {
          var finalArray = [orderObject];
          AsyncStorage.setItem('PendingOrders',JSON.stringify(finalArray))
          AsyncStorage.getItem('PendingOrders',function(err,orders){
              console.log(orders)
              console.log(JSON.parse(orders))
          })
         
          }
          else
          {
              var arr =[orderObject];
              var dat = JSON.parse(orders)
              var finalArray  = dat.concat(arr)
            AsyncStorage.removeItem('PendingOrders')
          AsyncStorage.setItem('PendingOrders',JSON.stringify(finalArray))
          AsyncStorage.getItem('PendingOrders',function(err,orders){
              console.log(orders)
              console.log(JSON.parse(orders))
          })
          }

  

  
  
  setTimeout(()=>{
      this.setState({carts:[],total:0,total2:0,tax:0,tax2:0,given:0,customer:{}})
      AsyncStorage.removeItem('Cart')
     
      Alert.alert('Thank you for the purchase')
  },5000)
        
   
      }
  

     
  }
  mpesa = async()=>
  {
   
      var valrandom = Math.floor(1000 + Math.random() * 9000);

  var date = new Date();
  var year = date.getFullYear();
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var time = year + "-" + month + "-" + day
      
      var ref = this.state.refNo
    
    if(ref==='')
      {
          Alert.alert('Mpesa reference number is required')
      }
     
      else{
        this.setModalVisible(!this.state.modalVisible);
           
    
           const user = await AsyncStorage.getItem('User')
            var data = JSON.parse(user)
         
      var orders = await AsyncStorage.getItem('PendingOrders')
            
          let orderObject = {
              agentID:data._id,
              agentName:data.firstname + ' ' + data.lastname,
              customerNo:this.state.customer.customerNo,
              customerPhone:this.state.customer.customerPhone,
              customerName:this.state.customer.customerName,
              products:this.state.carts,
              total:this.state.total,
              tax:this.state.tax,
              location:this.state.customer.location,
              created_on:new Date(),
              tillNumber:data.tillNumber,
              date:time,
              delivery:"",
              refNo:ref,
              payment:'MPESA',
              given:0,
              change:0,
              orderNo:valrandom,
              status:'Pending'
          }
       
          if(orders===null)
          {
          var finalArray = [orderObject];
          AsyncStorage.setItem('PendingOrders',JSON.stringify(finalArray))
          AsyncStorage.getItem('PendingOrders',function(err,orders){
              console.log(orders)
              console.log(JSON.parse(orders))
          })
         
          }
          else
          {
              var arr =[orderObject];
              var dat = JSON.parse(orders)
              var finalArray  = dat.concat(arr)
            AsyncStorage.removeItem('PendingOrders')
          AsyncStorage.setItem('PendingOrders',JSON.stringify(finalArray))
          AsyncStorage.getItem('PendingOrders',function(err,orders){
              console.log(orders)
              console.log(JSON.parse(orders))
          })
          }

  

  
  
  setTimeout(()=>{
      this.setState({carts:[],total:0,total2:0,tax:0,tax2:0,given:0,customer:{}})
      AsyncStorage.removeItem('Cart')
     
      Alert.alert('Thank you for the purchase')
  },5000)
        
   
      }
  

     
  }

  render() {

    const customer = this.state.customers

    const customerList = customer.map((item) => {
      return (

        <List key={item.customerNo}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={require('../assets/images/customer.png')} style={{ width: 25, height: 25 }} />
            </Left>
            <Body>
              <Text numberOfLines={1} style={{ width: 150, fontSize: 15, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                {item.customerName}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                {item.customerPhone}
              </Text>

            </Body>
            <Right>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                <Button transparent onPress={async () => {
                  this.setState({ customer: item })

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
    //carts 
    const cart = this.state.carts;
    const cartList = cart.map((item) => {
      return (

        <List key={item.id}>
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={require('../assets/images/shop.png')} style={{ width: 25, height: 25 }} />
            </Left>
            <Body>
              <Text numberOfLines={1} style={{ width: 150, fontSize: 15, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                KES {item.price2}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                Quantity [{item.quantity}] | In Stock [ {item.quantity2} ] 
        </Text>
            </Body>
            <Right>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <NumericInput type='up-down' totalWidth={80}

                  totalHeight={40}
                  iconSize={20}
                  step={1}
                  minValue={1}
                  valueType='real'
                  onChange={async (value) => {
                    var array = this.state.carts;
                    var cartfilter = array.filter((cart)=>{return cart.id===item.id})
                    delete cartfilter[0].price2;
                    delete cartfilter[0].tax2;
                    delete cartfilter[0].quantity;
                    const pp = parseInt(item.price) * parseInt(value)
                    cartfilter[0].price2 = parseInt(item.price) * parseInt(value);
                    cartfilter[0].tax2 = parseInt(pp) * 16 / 100
                    cartfilter[0].quantity = parseInt(value)
                    const newArray = array.filter((cart) => { return cart.id != item.id });
                    var finalArray = newArray.concat(cartfilter);
                    let result = finalArray.map(({ price2 }) => price2)
                    let result1 = finalArray.map(({ tax2 }) => tax2)

                    var total = 0;
                    for (var i = 0; i < result.length; i++) {
                        total += result[i];
                    }


                    var tax = 0;
                    for (var i = 0; i < result1.length; i++) {
                        tax += result1[i];
                    }

                    const tax2  = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                    this.setState({ carts: finalArray, total: parseInt(total), tax: parseInt(tax),total2:total2,tax2:tax2 })


                  }} />
                <Button transparent onPress={async () => {
                  let ar = await AsyncStorage.getItem('Cart')
                  let dat = JSON.parse(ar);
                  if(dat.length===1){
                       AsyncStorage.removeItem('Cart')
                  }
                  else
                  {
                    AsyncStorage.getItem('Cart', function (err, result) {
                      var array = JSON.parse(result);
                      const updatedArray = array.filter((cart) => { return cart.id != item.id })
                      AsyncStorage.removeItem('Cart', function (err) {
                        AsyncStorage.setItem('Cart', JSON.stringify(updatedArray))
                      })
  
                    })
                    let arr = await AsyncStorage.getItem('Cart')
                    let data = JSON.parse(arr);
                    if (data.length !== 0) {
                      let result = data.map(({ price2 }) => price2)
                      let result1 = data.map(({ tax2 }) => tax2)
  
                      var total = 0;
                      for (var i = 0; i < result.length; i++) {
                        total += result[i];
                      }
  
                      var tax = 0;
                      for (var i = 0; i < result1.length; i++) {
                        tax += result1[i];
                      }
  
                      const tax2 = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      this.setState({ carts: data, total: parseInt(total), tax: parseInt(tax), tax2: tax2, total2: total2 })
  
                    }
                    else {
                      let result = data.map(({ price2 }) => price2)
                      let result1 = data.map(({ tax2 }) => tax2)
  
                      var total = 0;
                      for (var i = 0; i < result.length; i++) {
                        total += result[i];
                      }
  
                      var tax = 0;
                      for (var i = 0; i < result1.length; i++) {
                        tax += result1[i];
                      }
                      AsyncStorage.removeItem('Cart')
                      const tax2 = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                      this.setState({ carts: [], total: parseInt(total), tax: parseInt(tax), total2: total2, tax2: tax2 })
  
                    }
                  }
                 



                }}>
                  <Icon name='close' style={{ color: 'red' }} />
                </Button>
              </View>

            </Right>
          </ListItem>
        </List>
      )
    })


    return (
      <View style={styles.container}>


        <View>
          <View style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, backgroundColor: 'whitesmoke', width: Dimensions.get('window').width }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Existing Customers</Text>
            <Text style={{ textDecorationLine: 'underline' }}>                          </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, marginTop: 4 }}>Total customers [ {this.state.customers.length} ]</Text>
              <TouchableOpacity onPress={this.refresh.bind()} style={{ backgroundColor: 'green', color: 'white', marginLeft: 50, padding: 5 }}>
                <Text style={{ color: 'white' }}>Refresh</Text>
              </TouchableOpacity>
              {
                this.state.customers.length === 0 ?
                  <View></View>
                  :
                  <TouchableOpacity onPress={this.upload.bind(this)} style={{ backgroundColor: 'whitesmoke', color: 'white', marginRight: 20, padding: 5 }}>
                    <Icon name='cloud-upload' style={{ color: "black", fontSize: 24, marginRight: 5 }} />
                  </TouchableOpacity>

              }

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <SearchInput
                onChangeText={(term) => { this.searchUpdated(term) }}
                style={styles.input}
                placeholder="Type to search for a customer"
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
            this.state.customers.length === 0 ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: 'bold' }}>You have 0 customers</Text>
              </View>
              :
              <ScrollView style={{ marginTop: 10, marginBottom: 100 }}>
                <View style={{ marginTop: 10 }}>

                  {customerList}


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
                  this.setState({ customer: {} })
                }}
                style={{ paddingLeft: 20 }}>
                <Icon name='arrow-back' style={{ fontWeight: 'bold', color: "white", fontSize: 24, marginRight: 5 }} />
              </TouchableHighlight>
            </View>
            <View style={{ paddingTop: 5, paddingLeft: 10, height: 110, paddingBottom: 10, backgroundColor: 'whitesmoke', width: Dimensions.get('window').width }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.customer.customerName}</Text>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{this.state.customer.customerPhone}</Text>
              <Text style={{ textDecorationLine: 'underline' }}>                                                   </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, marginTop: 2 }}>Total Items in cart  [ {this.state.carts.length} ]</Text>
                <TouchableOpacity onPress={this.refres.bind(this)} style={{ backgroundColor: 'green', color: 'white', marginLeft: 50, padding: 5 }}>
                  <Text style={{ color: 'white' }}>Refresh</Text>
                </TouchableOpacity>
                {
                  this.state.carts.length === 0 ?
                    <View></View>
                    :
                    <TouchableOpacity onPress={this.clear.bind(this)} style={{ backgroundColor: 'red', color: 'white', marginRight: 20, padding: 5 }}>
                      <Text style={{ color: 'white' }}>Clear all</Text>
                    </TouchableOpacity>

                }

              </View>
            </View>
            {
              this.state.carts.length === 0 ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                  <Text style={{ fontSize: 18, opacity: 0.8, fontWeight: 'bold' }}>0 products in cart</Text>
                </View>
                :
                <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
                  {cartList}

                  <View style={{ marginTop: 5, backgroundColor: 'whitesmoke', paddingTop: 10, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Sub Total:</Text>
                      <Text style={{ fontWeight: 'bold' }}>KES {this.state.total2}</Text>

                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Total Tax:</Text>
                      <Text style={{ fontWeight: 'bold' }}>KES {this.state.tax2}</Text>

                    </View>
                  </View>
                  <View style={{paddingRight:35,paddingLeft:35}}>
                    {
                      this.state.complete?
                      <View>
                      <TextInput
                                   value={this.state.given}
                                   keyboardType={'number-pad'}
                                   onChangeText={(given) => this.setState({ given:given })}
                                   placeholder={'Amount Given'}

                                   placeholderTextColor='black'

                                   style={styles.input}
                               />
                              <TouchableOpacity
                                   style={styles.button}
                                   onPress={this.complete.bind(this)}
                               >
                                 
                                   <Text style={{ color: 'white' }}> Complete Payment </Text>
                               </TouchableOpacity>
                               <TouchableOpacity
                                               style={styles.button}
                                               onPress={() => { this.setState({pay:true, payments:false,complete:false,given:0 }) }}
                                           >
                                               <Text style={{ color: 'white' }}> Cancel</Text>
                                           </TouchableOpacity>
                               </View>
                               :
                               <View></View>
                    }
                      {
                      this.state.mpesa?
                      <View>
                       <TextInput
                                        value={this.state.refNo}

                                        onChangeText={(refNo) => this.setState({ refNo })}
                                        placeholder='Enter MPESA ref number'
                                        placeholderTextColor='black'
                                        style={styles.input}
                                    />
                              <TouchableOpacity
                                   style={styles.button}
                                   onPress={this.mpesa.bind(this)}
                               >
                                 
                                   <Text style={{ color: 'white' }}> Complete Payment </Text>
                               </TouchableOpacity>
                               <TouchableOpacity
                                               style={styles.button}
                                               onPress={() => { this.setState({pay:true, payments:false,mpesa:false,given:0 }) }}
                                           >
                                               <Text style={{ color: 'white' }}> Cancel</Text>
                                           </TouchableOpacity>
                               </View>
                               :
                               <View></View>
                    }

                  </View>
                  <View style={{paddingRight:35,paddingLeft:35}}>
                  {
                    this.state.pay?
                    !this.state.payments ?
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.setState({ payments: true }) }}
                      >
                        <Text style={{ color: 'white' }}> Proceed to Payment </Text>
                      </TouchableOpacity>
                      :
                      <View>
                        <Text>Choose mode of payment</Text>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={()=>{this.setState({complete:true,pay:false})}}
                        >
                          <Text style={{ color: 'white' }}> Cash </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.button1}
                          onPress={()=>{this.setState({mpesa:true,pay:false})}}
                        >
                          <Text style={{ color: 'white' }}> Lipa Na Mpesa </Text>
                        </TouchableOpacity>

                      </View>
                      :
                      <View>
                        </View>

                  }
                  </View>
                </ScrollView>


            }

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
