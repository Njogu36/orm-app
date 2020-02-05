import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, TouchableHighlight, TextInput, View, StyleSheet, Image, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { withOrientation } from 'react-navigation';
import { Container, Button, Header, Content, Footer, Card, CardItem, Thumbnail, FooterTab, Left, Body, Icon, Title, Right } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
export default class Viewproduct extends Component {

    static navigationOptions = {
        header: {
            visible: true
        }
    };
    constructor(props) {
        super()
        this.state = {
            products: [],
            index:0,
            continue:false
        }
    }
    componentDidMount() {
        this._getProduct()
    }
    _getProduct = async () => {
        var value = await AsyncStorage.getItem('Products')
        var data = JSON.parse(value);
        var filterProduct = data.filter((product) => {
            return product._id === this.props.navigation.state.params._id
        })
        this.setState({ products:filterProduct })


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
          parent: item.parent,
          category: item.category,
          location: item.location,
          quantity2:item.balance,
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
            AsyncStorage.setItem('Cart', JSON.stringify(array))
          }
          else {
         
              var data = JSON.parse(result);
    
              if (data.length !== 0) {
              
                    console.log('Doesn"t exist yet')
                  var arrayTwo = data;
                  arrayTwo.push(dataCart);
                  AsyncStorage.setItem('Cart', JSON.stringify(arrayTwo))
                  AsyncStorage.getItem('Cart', function (err, num) {
    
                  })
                
    
    
              }
       
    
          }
    
        })
        this.setState({continue:true})
    
      }


    render() {
        const Product = this.state.products
        const productCard = Product.map((item) => {
            return (
                <Card key={item._id} style={{ marginTop: 30 }}>
                    <CardItem header bordered>
                        <Text style={{ fontSize: 13, opacity: 0.8, marginRight: 3 }}>All</Text>
                        <Text>> </Text>
                        <Text style={{ fontSize: 13, opacity: 0.8, marginRight: 3 }}>{item.parent}</Text>
                        <Text>> </Text>
                        <Text style={{ fontSize: 13, opacity: 0.8, marginRight: 3 }}>{item.category}</Text>
                        <Text>|</Text>
                        <Text style={{ fontSize: 13, opacity: 0.8, marginLeft: 3 }}>{item.quantityReceived}</Text>
                        <Text>- </Text>
                        <Text style={{ fontSize: 13, opacity: 0.8, marginLeft: 3 }}>{item.location}</Text>
                    </CardItem>
                    <CardItem cardBody>
                        <Image source={require('../assets/images/shop.png')} style={{ width: 60, flex: 1 }} />
                    </CardItem>
                    <CardItem bordered>
                        <Body>
                            <Text numberOfLines={2} style={{ fontSize: 19, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                                {item.name}
                            </Text>
                            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: 'bold', opacity: 0.8, marginLeft: 3 }}>
                                KES {item.price}
                            </Text>
                            <Text style={{marginTop:10}}>
                                {item.description}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem footer bordered>

                        {
                            item.balance === 0 ?
                                <View style={{ backgroundColor: 'red', padding: 15 }}>
                                    <Text style={{ color: 'white' }}>Out of Stock</Text>
                                </View>
                                :
                                       

                                !this.state.continue?
                                <TouchableOpacity onPress={()=>{this._addtoCart(item)}} style={{
                                    backgroundColor: '#007bff',
                                    borderColor: '#007bff', padding: 10
                                }}><Text style={{ color: 'white' }}>Add to cart</Text></TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Main')}} style={{
                                    backgroundColor: 'green',
                                    borderColor: 'green', padding: 10
                                }}><Text style={{ color: 'white' }}>Continue shopping</Text></TouchableOpacity>



                        }

                    </CardItem>
                </Card>
            )
        })
      
        return (
            <Container>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => { this.props.navigation.navigate('Main') }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body></Body>
                    <Right></Right>
                </Header>
                <Content style={{ paddingLeft: 5, paddingRight: 5 }}>
                    {productCard}
                </Content>
            
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header:
    {
        paddingTop: 40,
        backgroundColor: '#5F0157',
        paddingBottom: 25
    }
});
