import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'

import { pushNotification } from './NotificationService'

const pushNotificationAsync = async () => {
	const currentTime = new Date()
	currentTime.setSeconds(currentTime.getSeconds() + 3)
	await pushNotification('Super powiadomienie', 'Super gruby pacjent czeka', currentTime)
}

TaskManager.defineTask('CALENDAR_NOTIFICATIONS', ({ data, error }) => {
	console.log(`Wykonuje się`)
	if (error) {
		console.error('Error in CALENDAR_NOTIFICATIONS task:', error)
		return
	}

	try {
		const now = Date.now()
		console.log(`Wysyłam powiadomienie za 3 sekundy: ${new Date(now).toISOString()}`)
		return BackgroundFetch.BackgroundFetchResult.NewData
	} catch (error) {
		console.error('Error in CALENDAR_NOTIFICATIONS task:', error)
		return BackgroundFetch.BackgroundFetchResult.Failed
	}
})

const register = async () => {
	console.log(`Test`)
	return BackgroundFetch.registerTaskAsync('CALENDAR_NOTIFICATIONS', {
		minimumInterval: 1, // minuts
	})
}

const unregister = async () => {
	return BackgroundFetch.unregisterTaskAsync('CALENDAR_NOTIFICATIONS')
}

export { register, unregister }
