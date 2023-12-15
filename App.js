import React from 'react'
import BottomTabNavigation from './BottomTabNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text } from 'react-native'
import {
	useFonts,
	Poppins_400Regular,
	Poppins_700Bold,
	Poppins_600SemiBold,
} from '@expo-google-fonts/poppins'

import ManagePatient from './screens/ManagementScreens/ManagePatient'

const Stack = createNativeStackNavigator()

export default function App() {
	let [fontsLoaded] = useFonts({
		'Poppins-Regular': Poppins_400Regular,
		'Poppins-SemiBold': Poppins_600SemiBold,
		'Poppins-Bold': Poppins_700Bold,
	})

	if (!fontsLoaded) {
		return (
			<>
				<Text>Ładowanie</Text>
			</>
		)
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='BottomNavigation'
					options={{ headerShown: false }}
					component={BottomTabNavigation}
				/>
				<Stack.Screen
					name='ManagePatient'
					options={{ headerShown: false }}
					component={ManagePatient}
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
