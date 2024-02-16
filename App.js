import React, { useEffect, useState, useRef } from 'react'
import BottomTabNavigation from './BottomTabNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text, View } from 'react-native'
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

import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from './services/NotificationService'

import { register, unregister } from './services/BackgroundService'

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
			console.log(`objec`)
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

	// Testowanie systemu powiadomień
	// return (
	// 	<View style={{ marginTop: 50 }}>
	// 		<Button
	// 			title='Klknij se byczku '
	// 			onPress={async () => {
	// 				try {
	// 					const currentTime = new Date()

	// 					currentTime.setSeconds(currentTime.getSeconds() + 3)
	// 					await schedulePushNotification(
	// 						'Super powiadomienie',
	// 						'Super gruby pacjent czeka',
	// 						currentTime
	// 					)
	// 					console.log(`Notification scheduled successfully!`)
	// 				} catch (error) {
	// 					console.log('Error scheduling notification: ' + error.message)
	// 				}
	// 			}}
	// 		/>
	// 	</View>
	// )

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
