import React, { useState, useEffect, useRef } from 'react'
import { AppState, ScrollView, View, Text, Button, Linking, Platform } from 'react-native'
import { useGlobalStyles } from '../assets/styles'
import { useGlobalColors } from '../assets/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useSettings } from '../SettingsContext'
import { checkNotificationPermissions } from '../services/NotificationService'
import { useFocusEffect } from '@react-navigation/native'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

import UserProfile from '../components/MoreScreen/UserProfile'
import SettingsItem from '../components/MoreScreen/SettingsItem'
import ToggleSettingsItem from '../components/MoreScreen/ToggleSettingsItem'
import { exportDatabase } from '../services/Database'
import { useNavigation } from '@react-navigation/native'

export default function MoreScreen() {
	const { settings, updateSetting } = useSettings()
	const [notificationsEnabled, setNotificationsEnabled] = useState(false)
	const isDarkMode = settings.darkMode || false

	const appState = useRef(AppState.currentState)
	const [appStateVisible, setAppStateVisible] = useState(appState.current)

	const { navigate } = useNavigation()

	useEffect(() => {
		const subscription = AppState.addEventListener('change', nextAppState => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				console.log('App has come to the foreground!')
			}

			appState.current = nextAppState
			setAppStateVisible(appState.current)
			setNotificationsStatus()
		})

		return () => {
			subscription.remove()
		}
	}, [])

	const toggleDarkMode = () => {
		const newDarkModeValue = !isDarkMode
		updateSetting('darkMode', newDarkModeValue)
	}

	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

	useFocusEffect(
		React.useCallback(() => {
			setNotificationsStatus()
		}, [])
	)

	const setNotificationsStatus = async () => {
		const status = await checkNotificationPermissions()
		if (status) {
			setNotificationsEnabled(true)
		} else {
			setNotificationsEnabled(false)
		}
	}

	const toggleNotifications = async () => {
		if (Platform.OS === 'ios') {
			Linking.openURL('app-settings:')
		} else if (Platform.OS === 'android') {
			Linking.openSettings()
		}
	}

	const handleExportDb = () => {
		exportDatabase()
	}

	const submitErrorRaport = async () => {
		const recipient = '11923@puz.wloclawek.pl'
		const subject = 'Zgłoszenie błędu aplikacji Fizjo-Planer'
		const body = `
		Zgłaszam błąd w aplikacji fizjo-planer:
		
		Typ błędu: [Tutaj wpisz typ błędu, np. "Błąd wyświetlania grafiku"]
		
		Opis:
		[Opisz tutaj, co się stało, jakie błędy zostały zauważone lub jakie zachowanie aplikacji było nieprawidłowe]
		
		Kroki do odtworzenia błędu:
		1. [Pierwszy krok, np. "Włączanie aplikacji]
		2. [Drugi krok, np. "Przejdź do sekcji kalendarza"]
		3. [Następny krok, np. "Kliknięcie w starszą wizytę powoduje wyłączenie aplikacji"]
		4. [Jeśli jest to możliwe, podaj dodatkowe kroki, które prowadzą do wystąpienia błędu]
		
		Dodatkowe informacje:
		- Wersja aplikacji: [Tutaj podaj wersję aplikacji, jeśli jest to możliwe]
		- Urządzenie: [Podaj nazwę urządzenia, na którym wystąpił błąd, np. "iPhone X"]
		- System operacyjny: [Podaj wersję systemu operacyjnego, np. "iOS 15.2"]
		
		Dziękuję za zgłoszenie błędu.
		`

		const url = `mailto:${recipient}?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`

		try {
			await Linking.openURL(url)
		} catch (error) {
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: 'Błąd',
				textBody: `Nie można otworzyć aplikacji poczty e-mail`,
				button: 'OK',
				onPressButton: () => {
					Dialog.hide()
				},
			})
		}
	}

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Więcej</Text>
					</View>

					<ScrollView style={globalStyles.roundedContainer}>
						<UserProfile />

						<Text style={[globalStyles.containerMediumText, { marginTop: 20 }]}>
							Ustawienia konta
						</Text>

						<SettingsItem
							icon={{ name: 'user-circle-o', backgroundColor: COLORS.warning_color }}
							label='Zmiana danych konta'
							onPress={() => navigate('ChangePersonalData')}
						/>

						<Text style={[globalStyles.containerMediumText, { marginTop: 20 }]}>
							Ustawienia ogólne
						</Text>
						<ToggleSettingsItem
							icon={{ name: 'bell', backgroundColor: COLORS.element_color_2 }}
							label='Powiadomienia'
							initialValue={notificationsEnabled}
							onToggle={toggleNotifications}
						/>
						<ToggleSettingsItem
							icon={{ name: 'moon-o', backgroundColor: COLORS.element_color_6 }}
							label='Tryb ciemny'
							initialValue={isDarkMode}
							onToggle={toggleDarkMode}
						/>
						<SettingsItem
							icon={{ name: 'bug', backgroundColor: COLORS.element_color_5 }}
							label='Zgłoś błąd aplikacji'
							onPress={() => submitErrorRaport()}
						/>
						<SettingsItem
							icon={{ name: 'info-circle', backgroundColor: COLORS.primary }}
							label='O aplikacji'
							onPress={() => navigate('AboutApp')}
						/>

						<Button title='test' onPress={handleExportDb}></Button>
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}
