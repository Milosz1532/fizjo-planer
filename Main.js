import React, { useEffect } from 'react'
import BottomTabNavigation from './BottomTabNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text, View } from 'react-native'

import ManagePatient from './screens/ManagementScreens/ManagePatient'
import ManageVisit from './screens/ManagementScreens/ManageVisit'

import { useSettings } from './SettingsContext'
import AppIntro from './AppIntro'

const Stack = createNativeStackNavigator()

export default function Main() {
	const { isDataLoaded, settings } = useSettings()

	// if (!isDataLoaded) {
	// 	return (
	// 		<View style={{ flex: 1, backgroundColor: 'red' }}>
	// 			<Text>Ładowanie</Text>
	// 		</View>
	// 	)
	// }

	if (!isDataLoaded) {
		return undefined
	}

	if (!settings.user) {
		return <AppIntro />
	} else {
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
					<Stack.Screen
						name='manageVisit'
						options={{ headerShown: false }}
						component={ManageVisit}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		)
	}
}
