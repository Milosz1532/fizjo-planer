import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

async function registerForPushNotificationsAsync() {
	let registerStatus = false
	if (Constants.isDevice) {
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

export { registerForPushNotificationsAsync }
