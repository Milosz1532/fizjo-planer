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

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'


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
		// registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response)
			console.log(`Wykonuje czynność związaną z powiadomieniem`)
		})

		return () => {
			Notifications.removeNotificationSubscription(notificationListener.current)
			Notifications.removeNotificationSubscription(responseListener.current)
		}
	}, [])

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

async function schedulePushNotification(title, body, time) {
	const now = new Date()
	const notificationTime = new Date(time)
	const delayInSeconds = Math.floor((notificationTime - now) / 1000)

	if (delayInSeconds <= 0) {
		throw new Error('Scheduled time must be in the future')
	}

	const id = await Notifications.scheduleNotificationAsync({
		content: {
			title: title,
			body: body,
			sound: 'default',
		},
		trigger: {
			seconds: delayInSeconds, // Opóźnienie w sekundach
		},
	})

	console.log('Notification scheduled successfully with ID:', id)
	return id
}
