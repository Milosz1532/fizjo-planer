import React, { useEffect, useRef } from 'react'

import {
	useFonts,
	Poppins_400Regular,
	Poppins_700Bold,
	Poppins_600SemiBold,
} from '@expo-google-fonts/poppins'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { EventProvider } from 'react-native-outside-press'
import { NavigationContainer } from '@react-navigation/native'

import { initDatabase } from './services/Database'

import { SettingsProvider } from './SettingsContext'
import Main from './Main'
import * as SplashScreen from 'expo-splash-screen'

import { register } from './services/BackgroundService'

export default function App() {
	useEffect(() => {
		initDatabase()
		register().then(() => console.log(`Task registered`))
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
		<NavigationContainer>
			<AlertNotificationRoot>
				<EventProvider>
					<SettingsProvider>
						<Main />
					</SettingsProvider>
				</EventProvider>
			</AlertNotificationRoot>
		</NavigationContainer>
	)
}
