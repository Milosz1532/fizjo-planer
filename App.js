import React, { useEffect, useRef } from 'react'

import {
	useFonts,
	Poppins_400Regular,
	Poppins_700Bold,
	Poppins_600SemiBold,
} from '@expo-google-fonts/poppins'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { EventProvider } from 'react-native-outside-press'

import { initDatabase } from './services/Database'

import { SettingsProvider } from './SettingsContext'
import Main from './Main'
import * as SplashScreen from 'expo-splash-screen'

import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from './services/NotificationService'

import { register } from './services/BackgroundService'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
})

export default function App() {
	const notificationListener = useRef()
	const responseListener = useRef()

	useEffect(() => {
		registerForPushNotificationsAsync()

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response)
			console.log(`Wykonuje czynność związaną z powiadomieniem`)
		})

		return () => {
			if (notificationListener.current) {
				Notifications.removeNotificationSubscription(notificationListener.current)
			}
			if (responseListener.current) {
				Notifications.removeNotificationSubscription(responseListener.current)
			}
		}
	}, [])

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
		<AlertNotificationRoot>
			<EventProvider>
				<SettingsProvider>
					<Main />
				</SettingsProvider>
			</EventProvider>
		</AlertNotificationRoot>
	)
}
