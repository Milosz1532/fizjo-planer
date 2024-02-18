import React, { useEffect, useRef } from 'react'
import BottomTabNavigation from './BottomTabNavigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text, View } from 'react-native'

import ManagePatient from './screens/ManagementScreens/ManagePatient'
import ManageVisit from './screens/ManagementScreens/ManageVisit'

import { useSettings } from './SettingsContext'
import AppIntro from './AppIntro'
import { useNavigation } from '@react-navigation/native'

import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from './services/NotificationService'

const Stack = createNativeStackNavigator()

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
})

export default function Main() {
	const { isDataLoaded, settings } = useSettings()
	const { navigate } = useNavigation()

	const notificationListener = useRef()
	const responseListener = useRef()

	useEffect(() => {
		registerForPushNotificationsAsync()

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			const visitId = response.notification.request.content.data.visitId
			if (visitId) {
				navigate('manageVisit', { id: visitId })
				console.log(`Użytkownik kliknął powiadomienie o spotkaniu o identyfikatorze: ${visitId}`)
			}
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

	if (!isDataLoaded) {
		return undefined
	}

	if (!settings.user) {
		return <AppIntro />
	} else {
		return (
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
				<Stack.Screen name='manageVisit' options={{ headerShown: false }} component={ManageVisit} />
			</Stack.Navigator>
		)
	}
}
