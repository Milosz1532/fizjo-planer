import React, { useEffect } from 'react'
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

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { EventProvider } from 'react-native-outside-press'

import { initDatabase, fetchPatientData } from './services/Database'
import ManagePatient from './screens/ManagementScreens/ManagePatient'
import ManageVisit from './screens/ManagementScreens/ManageVisit'

import { SettingsProvider } from './SettingsContext'
import AppIntro from './AppIntro'
import Main from './Main'

import * as SplashScreen from 'expo-splash-screen'

export default function App() {
	useEffect(() => {
		initDatabase()
	}, [])

	let [fontsLoaded] = useFonts({
		'Poppins-Regular': Poppins_400Regular,
		'Poppins-SemiBold': Poppins_600SemiBold,
		'Poppins-Bold': Poppins_700Bold,
	})

	useEffect(() => {
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
	}, [])

	if (!fontsLoaded) {
		return undefined
	} else {
		SplashScreen.hideAsync()
	}

	return (
		<AlertNotificationRoot>
			<EventProvider>
				<SettingsProvider>
					<Main />
				</SettingsProvider>
			</EventProvider>
		</AlertNotificationRoot>
	)
}
