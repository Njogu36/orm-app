//POWER IN THE NAME OF JESUS
import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  FlatList,
  View,
  Alert,
  RefreshControl,
  Dimensions,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import { Container, Header, Left, Body, Right, Title, Card, CardItem, Content, Thumbnail, Footer, FooterTab, Button, Icon, Badge } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import { MonoText } from '../components/StyledText';
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['name', 'parent', 'category', 'description', 'price'];

export default class Product extends Component {
  static navigationOptions = {
    title: 'Items',
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
    super(props)
    this.state = {
      search: '',
      products: [],
      parents: [],
      customers: [],
      carts: [],
      searchTerm: '',
      header: true,
      refreshing: true,
      cancel: false

    }
  }

  componentDidMount() {
    this._offData()

  }
  _offData = async () => {
   // AsyncStorage.removeItem('Cart')

    var value = await AsyncStorage.getItem('Parent');
    var data = JSON.parse(value);
    //Products
    var value2 = await AsyncStorage.getItem('Products');
    var data2 = JSON.parse(value2);

    var value3 = await AsyncStorage.getItem('Customers');
    
    var data3 = JSON.parse(value3)
    var user = await AsyncStorage.getItem('User');
    var val =  JSON.parse(user)
    
    if(value3===null)
    {
      console.log('No customers')
      this.setState({customers:[]})
    }
    else
    {
      const customerFilter = data3.filter((item)=>{return item.agentID===val._id})
      this.setState({customers:customerFilter})
    }
    

    var value4 = await AsyncStorage.getItem('Cart');

    if (value4 === null) {
      console.log('No products in cart')
   
    }
    if (value4 !== null) {
      var data4 = JSON.parse(value4)
      
      const cartFilter = data4.filter((item)=>{return item.agentID===val._id})
      console.log(cartFilter)
      this.setState({ carts: cartFilter })

    }
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this._getDetails();
        this.setState({ parents: data, products: data2,refreshing: false })
      }
      else {
        this.setState({ parents: data, products: data2, refreshing: false })
      }
    });
  }

  _getDetails = async () => {
    var value = await AsyncStorage.getItem('User');
    var parents = await AsyncStorage.getItem('Parent');
    var products = await AsyncStorage.getItem('Products')
    var customers = await AsyncStorage.getItem('Customers')
    //AsyncStorage.removeItem('Cart')

    var data = JSON.parse(value);
    var id = data._id

    fetch('https://malimaliweb.herokuapp.com/agent/getDetails', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    }).then((res) => res.json()).then((res) => {
      if (res.success === false) {
        Alert.alert(res.message)
      }
      else if (res.success === true) {

        if (parents !== null) {
          AsyncStorage.removeItem('Parent')
          AsyncStorage.setItem('Parent', JSON.stringify(res.parents))
        }
        else {
          AsyncStorage.setItem('Parent', JSON.stringify(res.parents))
        }
        //Products
        if (products !== null) {
          AsyncStorage.removeItem('Products')
          AsyncStorage.setItem('Products', JSON.stringify(res.products))
        }
        else {
          AsyncStorage.setItem('Products', JSON.stringify(res.products))
        }
       





      }
    })
  };
  searchUpdated(term) {
    this.setState({ searchTerm: term, cancel: true })
    if (this.state.searchTerm !== '') {
      const filteredProduct = this.state.products.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      if (filteredProduct === 0) {
        Alert.alert('No product found')
      }
      else {

        this.setState({ products: filteredProduct })
        setTimeout(() => {
          if (this.state.products.length === 0) {
            Alert.alert('No products found')
          }
        }, 500)
      }
    }
    else if (this.state.searchTerm === '') {
      this._offData()
    }



  }
  onRefresh = async () => {

    this._offData();
    var value4 = await AsyncStorage.getItem('Cart');
    var user = await AsyncStorage.getItem('User');
    var val = JSON.parse(user)

    if (value4 === null) {
      this.setState({ carts: [] })
      AsyncStorage.removeItem('Cart')
    }
    if (value4 !== null) {
      var data4 = JSON.parse(value4)
      const cartFilter = data4.filter((item)=>{return item.agentID===val._id})
      this.setState({ carts: cartFilter })
      if(data4.length===0)
      {
        AsyncStorage.removeItem('Cart')
      }

    }
    var value3 = await AsyncStorage.getItem('Customers');
    
    var data3 = JSON.parse(value3)
    if(value3===null)
    {
      console.log('No customers')
      this.setState({customers:[]})
    }
    else
    {
      const customerFilter = data3.filter((item)=>{return item.agentID===val._id})
      this.setState({customers:customerFilter})
    }
    
  }
  _addtoCart = async (item) => {
    var valrandom = Math.floor(1000 + Math.random() * 9000);
    var value = await AsyncStorage.getItem('User')
    var user = JSON.parse(value)
    var date = new Date();
    var year = date.getFullYear();
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var time = year + "-" + month + "-" + day
    let dataCart = {
      id: valrandom,
      name: item.name,
      quantity: 1,
      quantity2:item.balance,
      parent: item.parent,
      category: item.category,
      location: item.location,
      tax: 0,
      tax2: parseInt(item.price) * 16/100,
      productId: item._id,
      productNo: item.productNo,
      price: item.price,
      price2: item.price,
      agentID: user._id,
      created_on: new Date(),
      date: time
    }
    var array = [];
    array.push(dataCart)
    AsyncStorage.getItem('Cart', function (err, result) {
      if (result === null) {
        AsyncStorage.removeItem('Cart')
        AsyncStorage.setItem('Cart', JSON.stringify([dataCart]))
      }
      else {
     
          var data = JSON.parse(result);

          if (data.length !== 0) {
          
                console.log('Doesn"t exist yet')
              var arrayTwo = data;
              arrayTwo.push(dataCart);
              AsyncStorage.setItem('Cart', JSON.stringify(arrayTwo))
              AsyncStorage.getItem('Cart', function (err, num) {
               console.log(num)
              })
            


          }
   

      }

    })
    this._offData()

  }
  render() {


    const parent = this.state.parents;
    const products = this.state.products;

    const Category = parent.map((item) => {
      return (
        <TouchableOpacity key={item._id} style={styles.categoryLists} onPress={async () => {
          var value = await AsyncStorage.getItem('Products');
          var data = JSON.parse(value)


          var productFilter = data.filter((product) => {
            return product.parent === item.name
          })


          if (productFilter.length === 0) {



            Alert.alert('No products found in ' + item.name)

          }
          else {
            this.setState({ products: productFilter })
          }



        }}>
          <Text style={{ color: 'white' }}>{item.name}</Text>
        </TouchableOpacity>

      )
    })
    //Products
    const Product = products.map((item) => {
      return (
        <View key={item._id} style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Card >
            <CardItem header bordered>
              <Text style={{ fontSize: 13, opacity: 0.8, marginRight: 3 }}>All</Text>
              <Text>> </Text>
              <Text style={{ fontSize: 10, opacity: 0.8, marginRight: 3 }}>{item.parent}</Text>
              <Text>> </Text>
              <Text style={{ fontSize: 10, opacity: 0.8, marginRight: 3 }}>{item.category}</Text>
              <Text>|</Text>
              <Text style={{ fontSize: 10, opacity: 0.8, marginLeft: 3 }}>{item.balance} </Text>
              <Text>- </Text>
              <Text style={{ fontSize: 13, opacity: 0.8, marginLeft: 3 }}>{item.location}</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                  {item.name}
                </Text>
                <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '300', opacity: 0.8, marginLeft: 3 }}>
                  KES {item.price}
                </Text>

              </Body>
            </CardItem>
            <CardItem footer bordered>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('View', { _id: item._id }) }} style={{
                backgroundColor: 'green',
                borderColor: 'green', padding: 10, marginRight: 10
              }}><Text style={{ color: 'white' }}>View Details</Text></TouchableOpacity>
              {
                item.balance === 0 ?
                  <View style={{ backgroundColor: 'red', padding: 15 }}>
                    <Text style={{ color: 'white' }}>Out of Stock</Text>
                  </View>
                  :

                  <TouchableOpacity onPress={async () => {

                    this._addtoCart(item)



                  }} style={{
                    backgroundColor: '#007bff',
                    borderColor: '#007bff', padding: 10
                  }}><Text style={{ color: 'white' }}>Add to cart</Text></TouchableOpacity>



              }

            </CardItem>
          </Card>
        </View>

      )

    })


    return (
      <View style={styles.container}>
        {
          this.state.header ?
            <View style={styles.header}>

              <View style={styles.iconheader}>

                <Icon name='cart' style={{ color: "black", fontSize: 20, marginRight: 5 }} />
                <TouchableHighlight underlayColor='white' onPress={() => { this.props.navigation.navigate('Cart') }} style={{
                  alignItems: 'center',
                  backgroundColor: 'whitesmoke',
                }}>
                  <Badge warning style={{ marginRight: 8, paddingTop: 2 }}><Text style={{ color: 'white' }}>{this.state.carts.length}</Text></Badge>
                </TouchableHighlight>
                <Text>|</Text>

                <Icon name='people' style={{ color: "black", fontSize: 20, marginLeft: 15 }} />
                <TouchableHighlight underlayColor='white' onPress={() => { console.log('Done') }} style={{
                  alignItems: 'center',
                  backgroundColor: 'whitesmoke',
                  marginLeft: 5
                }}>
                  <Badge warning style={{ marginRight: 0, paddingTop: 2 }}><Text style={{ color: 'white' }}>{this.state.customers.length}</Text></Badge>
                </TouchableHighlight>
                <Text style={{ marginRight: 8, marginLeft: 8 }}>|</Text>
                <TouchableHighlight underlayColor='white' onPress={() => { this.setState({ header: !this.state.header }) }} style={{
                  alignItems: 'center',
                  backgroundColor: 'whitesmoke',
                }}>
                  <Icon name='close' style={{ color: "black", fontSize: 24, marginRight: 5 }} />
                </TouchableHighlight>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <SearchInput
                    onChangeText={(term) => { this.searchUpdated(term) }}
                    style={styles.input}
                    placeholder="Type to search for a product"
                  />
                  {
                    this.state.cancel ?
                      <TouchableHighlight underlayColor='white' onPress={() => { this._offData(); this.setState({ searchTerm: '', cancel: false }); }} style={{
                        paddingTop: 15,
                        paddingLeft: 10,
                        backgroundColor: 'whitesmoke',
                      }}>
                        <Icon name='close' style={{ color: "black", fontSize: 24, marginRight: 5 }} />
                      </TouchableHighlight>
                      :
                      <View></View>
                  }

                </View>

                <ScrollView horizontal={true} style={styles.categories} showsHorizontalScrollIndicator={false}>
                  {Category}
                </ScrollView>
              </View>

            </View>
            :
            <View>
              <View style={styles.iconheader}>


                <TouchableHighlight underlayColor='white' onPress={() => { this.setState({ header: !this.state.header }) }} style={{
                  alignItems: 'center',
                  backgroundColor: 'white',
                }}>
                  <Icon name='list-box' style={{ color: "black", fontSize: 33, marginRight: 5 }} />
                </TouchableHighlight>
              </View>
            </View>
        }

        <SafeAreaView >
          <ScrollView style={{marginBottom:120}}refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
            {Product}
          </ScrollView>
        </SafeAreaView>

      </View>
    );

  }
}




const styles = StyleSheet.create({
  container:
  {
    paddingBottom: 0
  },
  header:
  {
    width: Dimensions.get('window').width,

    height: 160,
    backgroundColor: 'whitesmoke',
    borderBottomColor: 'black'
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
  categories:
  {
    flexDirection: 'row',
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10
  },
  categoryLists:
  {
    marginRight: 10,
    backgroundColor: "#5F0157",
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    padding: 10,
    height: 30,
    paddingTop: 5

  },
  iconheader:
  {
    flexDirection: 'row',
    paddingTop: 8,
    paddingRight: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'



  }

});
