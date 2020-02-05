import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, TouchableHighlight, TextInput, View, StyleSheet, Image, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { withOrientation } from 'react-navigation';
import { Container, Button, Header, Content, Footer, Card, CardItem, Thumbnail, FooterTab, Left, Body, Icon, Title, Right } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
export default class CustomerCart extends Component {

    static navigationOptions = {
        header: {
            visible: true
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            index:0,
            continue:false
        }
    }
  
    render() {
      
        return (
            <Container>
                <Header style={styles.header}>
                    <Left>
                        <Button transparent onPress={() => { this.props.navigation.navigate('Cart') }}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body></Body>
                    <Right></Right>
                </Header>
                <Content style={{ paddingLeft: 5, paddingRight: 5 }}>
                   <Text>Hello</Text>
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
