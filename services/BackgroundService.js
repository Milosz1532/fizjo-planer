import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'

import { pushNotification } from './NotificationService'

import { fetchAllVisitsThisWeek } from './Database'

import { addHours } from 'date-fns'

const pushNotificationAsync = async () => {
	const now = new Date()
	const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)

	fetchAllVisitsThisWeek(async visits => {
		if (visits) {
			console.log(`Znalazłem wizyty do powiadomień (${visits.length})`)

			await Notifications.cancelAllScheduledNotificationsAsync()
			console.log(`Anuluję wszystkie powiadomienia w kolejce`)

			visits.forEach(visit => {
				const visitDateTime = visit.time_start

				if (new Date(visitDateTime) > localTime) {
					const notificationTitle = 'Przypomnienie o wizycie'
					const notificationMessage = `Wizyta u pacjenta ${visit.patient_full_name} zaczyna się za godzinę.`

					const notificationTime = addHours(visitDateTime, -1)

					pushNotification(notificationTitle, notificationMessage, notificationTime)
					console.log(`Dodaję nowe powiadomienie do kolejki o godzinie ${notificationTime}`)
				}
			})
		}
	})
}

TaskManager.defineTask('CALENDAR_NOTIFICATIONS', async ({ data, error }) => {
	if (error) {
		console.error('Error in CALENDAR_NOTIFICATIONS task:', error)
		return
	}
	try {
		await pushNotificationAsync()
		return BackgroundFetch.BackgroundFetchResult.NewData
	} catch (error) {
		console.error('Error in CALENDAR_NOTIFICATIONS task:', error)
		return BackgroundFetch.BackgroundFetchResult.Failed
	}
})

const register = async () => {
	return await BackgroundFetch.registerTaskAsync('CALENDAR_NOTIFICATIONS', {
		minimumInterval: 0.1, // minutes
	})
}

const unregister = async () => {
	return BackgroundFetch.unregisterTaskAsync('CALENDAR_NOTIFICATIONS')
}

export { register, unregister }
