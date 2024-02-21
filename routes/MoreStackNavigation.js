import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import MoreScreen from '../screens/MoreScreen'

import AboutAppScreen from '../screens/MoreScreens/AboutAppScreen'
import ChangePersonalDataScreen from '../screens/MoreScreens/ChangePersonalDataScreen'

const Stack = createStackNavigator()

const MoreStackNavigation = () => {
	const screenOptions = {
		tabBarShowLabel: false,
		tabBarHideOnKeyboard: true,
		headerShown: false,
	}

	return (
		<Stack.Navigator screenOptions={screenOptions} initialRouteName='More'>
			<Stack.Screen name='More' component={MoreScreen} />
			<Stack.Screen name='AboutApp' component={AboutAppScreen} />
			<Stack.Screen name='ChangePersonalData' component={ChangePersonalDataScreen} />
		</Stack.Navigator>
	)
}

export default MoreStackNavigation
