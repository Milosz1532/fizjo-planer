import React, { useState, useEffect, useRef } from 'react'
import {
	AppState,
	ScrollView,
	View,
	Text,
	StyleSheet,
	Button,
	Linking,
	Platform,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useGlobalStyles } from '../assets/styles'
import { useGlobalColors } from '../assets/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useSettings } from '../SettingsContext'
import ToggleSwitch from 'toggle-switch-react-native'
import { registerForPushNotificationsAsync } from '../services/NotificationService'
import { useFocusEffect } from '@react-navigation/native'

import UserProfile from '../components/MoreScreen/UserProfile'
import SettingsItem from '../components/MoreScreen/SettingsItem'
import ToggleSettingsItem from '../components/MoreScreen/ToggleSettingsItem'
import { exportDatabase } from '../services/Database'

export default function MoreScreen() {
	const { settings, updateSetting } = useSettings()
	const [notificationsEnabled, setNotificationsEnabled] = useState(false)
	const isDarkMode = settings.darkMode || false

	const appState = useRef(AppState.currentState)
	const [appStateVisible, setAppStateVisible] = useState(appState.current)

	useEffect(() => {
		const subscription = AppState.addEventListener('change', nextAppState => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				console.log('App has come to the foreground!')
			}

			appState.current = nextAppState
			setAppStateVisible(appState.current)
			checkNotificationPermissions()
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
			checkNotificationPermissions()
		}, [])
	)

	const checkNotificationPermissions = async () => {
		const status = await registerForPushNotificationsAsync()
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
							icon={{ name: 'envelope', backgroundColor: COLORS.element_color_3 }}
							label='Zmiana adresu e-mail'
						/>
						<SettingsItem
							icon={{ name: 'user-circle-o', backgroundColor: COLORS.warning_color }}
							label='Zmiana danych konta'
						/>

						<Text style={[globalStyles.containerMediumText, { marginTop: 20 }]}>
							Ustawienia ogólne
						</Text>
						<ToggleSettingsItem
							icon={{ name: 'bell', backgroundColor: COLORS.element_color_2 }}
							label='Powiadomienia'
							initialValue={notificationsEnabled}
							onToggle={toggleNotifications} // Ustaw funkcję obsługującą zmianę stanu suwaka
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
						/>
						<SettingsItem
							icon={{ name: 'language', backgroundColor: COLORS.primary }}
							label='Język aplikacji'
						/>

						<Button title='test' onPress={handleExportDb}></Button>
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}
