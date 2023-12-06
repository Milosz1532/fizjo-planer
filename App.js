import React from 'react'
import BottomTabNavigation from './BottomTabNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='BottomNavigation'
					options={{ headerShown: false }}
					component={BottomTabNavigation}
				/>
				{/* <Stack.Screen
					name='RecipeDetails'
					options={{ headerShown: false }}
					component={RecipeDetailsScreen}
				/> */}
			</Stack.Navigator>
		</NavigationContainer>
	)
}
