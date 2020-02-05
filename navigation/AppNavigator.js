import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Login from '../screens/login'
import View from '../screens/viewProduct'
import CustomerCart from '../screens/customercart'

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Login:Login,
    View:View,
    CustomerCart:CustomerCart,
    Main: MainTabNavigator,
  })
);
