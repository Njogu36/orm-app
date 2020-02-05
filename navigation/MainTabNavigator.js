import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';

import Product from '../screens/products';
import Cart from '../screens/cart';
import Order from '../screens/orders';
import Sale from '../screens/sales'
import Profile from '../screens/profile';
import Dashboard from '../screens/dashboard'
import View from '../screens/viewProduct'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

// Product Page ===================================
const ProductStack = createStackNavigator(
  {
    Product: Product,
  },
  config
);

ProductStack.navigationOptions = {
  tabBarLabel: 'Items',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-list${focused ? '' : '-outline'}`
          : 'md-list'
      }
    />
  ),
};

ProductStack.path = '';
// Cart Page ====================================
const CartStack = createStackNavigator(
  {
    Cart: Cart,
  },
  config
);

CartStack.navigationOptions = {
  tabBarLabel: 'Cart',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'} />
  ),
};

CartStack.path = '';

// Order Page ==================================
const OrderStack = createStackNavigator(
  {
    Order: Order,
  },
  config
);

OrderStack.navigationOptions = {
  tabBarLabel: 'Orders',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-reorder' : 'md-reorder'} />
  ),
};

OrderStack.path = '';

// Sale Page ======================================

const SaleStack = createStackNavigator(
  {
    Sale: Sale,
  },
  config
);

SaleStack.navigationOptions = {
  tabBarLabel: 'Sales',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-podium' : 'md-podium'} />
  ),
};

SaleStack.path = '';

// Dashboard Page =================================

const DashboardStack = createStackNavigator(
  {
    Dashboard: Dashboard,
  },
  config
);

DashboardStack.navigationOptions = {
  
  tabBarLabel: 'Dashboard',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-home' : 'md-home'} />
  ),
};

DashboardStack.path = '';

// Profile Page ====================================

const ProfileStack = createStackNavigator(
  {
    Profile: Profile,
  },
  config
);

ProfileStack.navigationOptions = {
  
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

ProfileStack.path = '';


const tabNavigator = createBottomTabNavigator({
  ProductStack,
  CartStack,
  OrderStack,
  SaleStack,
  DashboardStack,
  ProfileStack
});

tabNavigator.path = '';

export default tabNavigator;
