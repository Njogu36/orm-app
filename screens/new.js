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
    Dimensions,
    KeyboardAvoidingView, TextInput, Alert

} from 'react-native';
import NumericInput from 'react-native-numeric-input'
import { MonoText } from '../components/StyledText';
import { Container, Header, Content, List, Icon, ListItem, Button, Thumbnail, Left, Body, Right } from 'native-base';




export default class New extends Component {
    constructor(props) {
        super(props)
        this.state = {
            carts: [],
            tax: 0,
            tax2:0,
            total: 0,
            total2:0,
            refresh: true,
            name: '',
            phone: '',
            customerNo: 0,
            payments: false,
             cash: false,
          final:true,
          refNo:'',
            given:0,
            tillNumber:''
        }
    }
    componentDidMount() {
        this.reload()
    }
    reload() {
        this._getCart()
    }
    _getCart = async () => {
        const user = await AsyncStorage.getItem('User');
        const dat = JSON.parse(user)
          const customers  = await AsyncStorage.getItem('Customers');
          console.log(JSON.parse(customers))
          const order  = await AsyncStorage.getItem('PendingOrders');
          var value2 = JSON.parse(order);
          console.log(value2+ ' Orders')
         //AsyncStorage.removeItem('Customers');
         //AsyncStorage.removeItem('PendingOrders')


        const cart = await AsyncStorage.getItem('Cart');
        const cartData = JSON.parse(cart);
        if (cart === null) {
            console.log('Cart is empty')
        }
        else {
            let cartfilter = cartData.filter((item)=>{return item.agentID===dat._id })
           if(cartfilter.length === 0)
           {
            AsyncStorage.removeItem('Cart')
            this.setState({carts:[]})
           }
           else
           {
            let result = cartfilter.map(({ price2 }) => price2)
            let result1 = cartfilter.map(({ tax2 }) => tax2)

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

            this.setState({ carts: cartfilter, total: parseInt(total), tax: parseInt(tax),tax2:tax2,total2:total2 })
           }
          
        }

    }

    clear() {
        AsyncStorage.getItem('Cart', function (err, result) {
            if (result !== null) {
                AsyncStorage.removeItem('Cart');

            }

        })
        this.setState({ carts: [], total: 0, tax: 0,tax2:0,total2:0,name:'',phone:'',customerNo:0,given:0,payments:false })



    }
    refres = async () => {
        const cart = await AsyncStorage.getItem('Cart');
        const cartData = JSON.parse(cart);
        const user = await AsyncStorage.getItem('User');
        const dat = JSON.parse(user)
        if (cart === null) {
            console.log('hello')
            this.setState({ carts: [], total:0, tax: 0,tax2:0,total2:0,payments:false })
     
        }
        else {
            let cartfilter = cartData.filter((item)=>{return item.agentID===dat._id })
            if(cartfilter.length === 0)
            {
             AsyncStorage.removeItem('Cart')
             this.setState({ carts: [], total:0, tax: 0,tax2:0,total2:0,payments:false })
            }
            else
            {
            let result = cartfilter.map(({ price2 }) => price2)
            let result1 = cartfilter.map(({ tax2 }) => tax2)

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
          
                this.setState({ carts: cartfilter, total: parseInt(total), tax: parseInt(tax),tax2:tax2,total2:total2,payments:false })
     
        }
       }
    }
    proceed = async () => {
        var name = this.state.name;
        var phone = this.state.phone;
        if (name === '') {
            Alert.alert('Customer name is required')
        }
        else if (phone === '') {
            Alert.alert('Phone number is required')
        }
        else if (phone.length !== 12) {
            Alert.alert('Invalid phone number, 12 digits required e.g 254799...')
        }
        else {
            var value = await AsyncStorage.getItem('Customers')
                var customerFilterArray = JSON.parse(value);
                if(value===null)
                {
                    var valrandom = Math.floor(1000 + Math.random() * 9000);
                    this.setState({ name: name, phone: phone, customerNo: valrandom, payments: true })
                }
                else
                {
                    const data = customerFilterArray.filter((customer)=>{return customer.customerPhone===phone})
                    console.log(customerFilterArray)
                    console.log(data)
                    console.log(data.length + ' Search if customer exists')
                    if(data.length!==0)
                    {
                       
                      
                        Alert.alert('Customer already exists')
                        this.setState({name:'',phone:'',customerNo:0})
                    }
                    else
                    {
                        var valrandom = Math.floor(1000 + Math.random() * 9000);
                        this.setState({ name: name, phone: phone, customerNo: valrandom, payments: true })
                    }
                }
            
           
        }
    }
    cash = async () => {
        this.setState({ cash: true, payments: false,final:true })

    }
    complete = async()=>
    {
      
        var valrandom = Math.floor(1000 + Math.random() * 9000);
  
    var date = new Date();
    var year = date.getFullYear();
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var time = year + "-" + month + "-" + day
        var name = this.state.name;
        var phone = this.state.phone;
        var given = this.state.given
        if (name === '') {
            Alert.alert('Customer name is required')
        }
        else if (phone === '') {
            Alert.alert('Phone number is required')
        }
        else if (phone.length !== 12) {
            Alert.alert('Invalid phone number, 12 digits required e.g 254799...')
        }
        else if(given===0)
        {
            Alert.alert('Amount is required')
        }
        else if(given<this.state.total){
            Alert.alert('Failed to proceed, the amount given is less than the total price.')

        }
        else if(given>this.state.total){
          
                var change  = given - this.state.total
                const change2  = (parseInt(change)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                
             Alert.alert('Customer change is KES ' + change2)
            
          
      
             const user = await AsyncStorage.getItem('User')
              var data = JSON.parse(user)
           
        var orders = await AsyncStorage.getItem('PendingOrders')
              
            let orderObject = {
                agentID:data._id,
                agentName:data.firstname + ' ' + data.lastname,
                customerNo:this.state.customerNo,
                customerPhone:this.state.phone,
                customerName:this.state.name,
                products:this.state.carts,
                total:this.state.total,
                tax:this.state.tax,
                tillNumber:data.tillNumber,
                location:data.location,
                created_on:new Date(),
                date:time,
                delivery:'',
                payment:'Cash',
                refNo:'',
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

        
       const customers = await AsyncStorage.getItem('Customers')
            
           
            let customerObject = {
                agentID:data._id,
                agentName:data.firstname + ' ' + data.lastname,
                customerNo:this.state.customerNo,
                customerPhone:this.state.phone,
                customerName:this.state.name,
                products:0,
                rating:0,
                location:data.location,
                created_on:new Date(),
                date:time,
                
            }
           
            if(customers===null)
            {
            const finalArray = [customerObject];
          AsyncStorage.setItem('Customers',JSON.stringify(finalArray))
          AsyncStorage.getItem('Customers',function(err,customerA){
              console.log(customerA)
              console.log(JSON.stringify(customerA))
          })
            }
            else
            {  
                var arr =[customerObject];
                var data2 = JSON.parse(customers)
                var finalArray  = data2.concat(arr)
                AsyncStorage.removeItem('Customers')
                AsyncStorage.setItem('Customers',JSON.stringify(finalArray))
                AsyncStorage.getItem('Customers',function(err,customerA){
                    console.log(customerA)
                    console.log(JSON.stringify(customerA))
                })
            }

    
    
    setTimeout(()=>{
        
        this.setState({name:'',phone:'',customerNo:0,carts:[],total:0,total2:0,tax:0,tax2:0,given:0,payments:false})
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
        var name = this.state.name;
        var phone = this.state.phone;
        var ref = this.state.refNo
        if (name === '') {
            Alert.alert('Customer name is required')
        }
        else if (phone === '') {
            Alert.alert('Phone number is required')
        }
        else if (phone.length !== 12) {
            Alert.alert('Invalid phone number, 12 digits required e.g 254799...')
        }
        else if(ref==='')
        {
            Alert.alert('Mpesa reference number is required')
        }
       
        else{
          
             
      
             const user = await AsyncStorage.getItem('User')
              var data = JSON.parse(user)
           
        var orders = await AsyncStorage.getItem('PendingOrders')
              
            let orderObject = {
                agentID:data._id,
                agentName:data.firstname + ' ' + data.lastname,
                customerNo:this.state.customerNo,
                customerPhone:this.state.phone,
                customerName:this.state.name,
                products:this.state.carts,
                total:this.state.total,
                tax:this.state.tax,
                tillNumber:data.tillNumber,
                location:data.location,
                created_on:new Date(),
                date:time,
                delivery:'',
                payment:'MPESA',
                refNo:this.state.refNo,
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

        
       const customers = await AsyncStorage.getItem('Customers')
            
           
            let customerObject = {
                agentID:data._id,
                agentName:data.firstname + ' ' + data.lastname,
                customerNo:this.state.customerNo,
                customerPhone:this.state.phone,
                customerName:this.state.name,
                products:0,
                rating:0,
                location:data.location,
                created_on:new Date(),
                date:time,
                
            }
           
            if(customers===null)
            {
            const finalArray = [customerObject];
          AsyncStorage.setItem('Customers',JSON.stringify(finalArray))
          AsyncStorage.getItem('Customers',function(err,customerA){
              console.log(customerA)
              console.log(JSON.stringify(customerA))
          })
            }
            else
            {  
                var arr =[customerObject];
                var data2 = JSON.parse(customers)
                var finalArray  = data2.concat(arr)
                AsyncStorage.removeItem('Customers')
                AsyncStorage.setItem('Customers',JSON.stringify(finalArray))
                AsyncStorage.getItem('Customers',function(err,customerA){
                    console.log(customerA)
                    console.log(JSON.stringify(customerA))
                })
            }

    
    
    setTimeout(()=>{
        
        this.setState({name:'',phone:'',customerNo:0,carts:[],total:0,total2:0,tax:0,tax2:0,given:0,payments:false})
        AsyncStorage.removeItem('Cart')
        Alert.alert('Thank you for the purchase')
    },5000)
          
     
        }
    
 
       
    }

    render() {
        const cart = this.state.carts

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
                                    AsyncStorage.getItem('Cart', function (err, result) {
                                        var array = JSON.parse(result);
                                        const updatedArray = array.filter((cart) => { return cart.id != item.id })
                                        AsyncStorage.removeItem('Cart', function (err) {
                                            AsyncStorage.setItem('Cart', JSON.stringify(updatedArray))
                                        })

                                    })
                                    let arr = await AsyncStorage.getItem('Cart')
                                    if(arr===null)
                                    {
                                        AsyncStorage.removeItem('Cart')
                                    }
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
                                       
                                        const tax2  = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                    const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        this.setState({ carts: data, total: parseInt(total), tax: parseInt(tax),tax2:tax2,total2:total2 })

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
                                        const tax2  = (parseInt(tax)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        const total2 = (parseInt(total)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                                        this.setState({ carts: [], total: parseInt(total), tax: parseInt(tax),total2:total2,tax2:tax2 })

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
                

                {
                    this.state.refresh ?
                        <View>
                            <View style={{ paddingTop: 10, paddingLeft: 10, paddingBottom: 10, backgroundColor: 'whitesmoke', width: Dimensions.get('window').width }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>New Customer</Text>
                                <Text style={{ textDecorationLine: 'underline' }}>                                                   </Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 12, marginTop: 4 }}>Total Items in cart  [ {this.state.carts.length} ]</Text>
                                    <TouchableOpacity onPress={this.refres.bind(this)} style={{ backgroundColor: 'green', color: 'white', marginLeft: 50, padding: 5 }}>
                                        <Text style={{ color: 'white' }}>Refresh</Text>
                                    </TouchableOpacity>
                                    {
                                        this.state.carts.length ===0?
                                        <View></View>
                                        :
                                        <TouchableOpacity onPress={this.clear.bind(this)} style={{ backgroundColor: 'red', color: 'white', marginRight: 20, padding: 5 }}>
                                        <Text style={{ color: 'white' }}>Clear all</Text>
                                    </TouchableOpacity>

                                    }
                                    
                                </View>

                            </View>
                            {
                                this.state.carts.length===0?
                                  <View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:100}}>
                                      <Text style={{fontSize:18,opacity:0.8,fontWeight:'bold'}}>0 products in cart</Text>
                                      </View>
                                :
                                <ScrollView style={{ marginTop: 10, marginBottom: 20 }}>
                                <View style={{ marginTop: 10 }}>

                                    {cartList}


                                </View>
                                <View style={{ marginTop: 5, backgroundColor: 'whitesmoke', paddingTop: 10, paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Sub Total:</Text>
                                        <Text style={{fontWeight:'bold'}}>KES {this.state.total2}</Text>

                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Total Tax:</Text>
                                        <Text style={{fontWeight:'bold'}}>KES {this.state.tax2}</Text>

                                    </View>
                                </View>
                                <KeyboardAvoidingView style={styles.change} behavior='padding'>

                                    <TextInput
                                        value={this.state.name}

                                        onChangeText={(name) => this.setState({ name })}
                                        placeholder='Enter Customer Name'
                                        placeholderTextColor='black'
                                        style={styles.input}
                                    />
                                    <Text style={{ fontSize: 10, }}>This should be an M-Pesa phone number*</Text>
                                    <TextInput
                                        value={this.state.phone}
                                        keyboardType={'number-pad'}
                                        onChangeText={(phone) => this.setState({ phone })}
                                        placeholder={'Enter Phone Number'}

                                        placeholderTextColor='black'

                                        style={styles.input}
                                    />




                                    {
                                        !this.state.payments ?
                                           this.state.cash?
                                            this.state.final?
                                           <View>
                                           <TextInput
                                               value={this.state.given&&String(this.state.given)}
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
                                               onPress={() => { this.setState({ payments: !this.state.payments,given:0 }) }}
                                           >
                                               <Text style={{ color: 'white' }}> Cancel</Text>
                                           </TouchableOpacity>
                                       </View>
                                       :
                                      
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
                                                                 onPress={() => { this.setState({ payments: !this.state.payments,given:0 }) }}
                                                             >
                                                                 <Text style={{ color: 'white' }}> Cancel</Text>
                                                             </TouchableOpacity>
                                                 </View>
                                               
                                      

                                           :
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={this.proceed.bind(this)}
                                            >
                                                <Text style={{ color: 'white' }}> Proceed to Payment </Text>
                                            </TouchableOpacity>
                                            :
                                            <View>
                                                <Text>Choose mode of payment</Text>
                                                <TouchableOpacity
                                                    style={styles.button}
                                                    onPress={ this.cash.bind(this) }
                                                >
                                                    <Text style={{ color: 'white' }}> Cash </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.button1}
                                                    onPress={ ()=>{this.setState({ cash: true, payments: false,final:false })}}
                                                >
                                                    <Text style={{ color: 'white' }}> Lipa Na Mpesa </Text>
                                                </TouchableOpacity>

                                            </View>


                                    }
                                 
                                </KeyboardAvoidingView>
                            </ScrollView>
                            }
                            
                        </View>
                        :
                        <View></View>

                }
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

        fontSize: 20,
        height: 45,
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
