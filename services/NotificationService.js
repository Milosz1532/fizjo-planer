import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

async function registerForPushNotificationsAsync() {
	let registerStatus = false
	if (Platform.OS !== 'web') {
		const { status: existingStatus } = await Notifications.getPermissionsAsync()
		let finalStatus = existingStatus
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync()
			finalStatus = status
		}
		if (finalStatus !== 'granted') {
			return false
		}
		token = (await Notifications.getExpoPushTokenAsync()).data
		console.log(token)
		registerStatus = true
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			sound: true,
			lightColor: '#FF231F7C',
			lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
			bypassDnd: true,
		})
		registerStatus = true
	}

	return registerStatus
}

async function pushNotification(title, body, time, visitId) {
	const now = new Date()
	const notificationTime = new Date(time)
	const delayInSeconds = Math.floor((notificationTime - now) / 1000)

	if (delayInSeconds <= 0) {
		throw new Error('Scheduled time must be in the future')
	}

	const notificationContent = {
		title: title,
		body: body,
		sound: true,
		data: { visitId: visitId },
	}

	const id = await Notifications.scheduleNotificationAsync({
		content: notificationContent,
		trigger: {
			seconds: delayInSeconds,
		},
	})

	return id
}

async function checkNotificationPermissions() {
	let hasPermission = false
	if (Platform.OS !== 'web') {
		const { status: existingStatus } = await Notifications.getPermissionsAsync()
		if (existingStatus === 'granted') {
			hasPermission = true
		}
	}

	return hasPermission
}

export { registerForPushNotificationsAsync, checkNotificationPermissions, pushNotification }
