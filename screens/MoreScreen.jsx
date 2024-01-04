import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useGlobalStyles } from '../assets/styles'
import { useGlobalColors } from '../assets/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useSettings } from '../SettingsContext'
import ToggleSwitch from 'toggle-switch-react-native'

import UserProfile from '../components/MoreScreen/UserProfile'
import SettingsItem from '../components/MoreScreen/SettingsItem'
import ToggleSettingsItem from '../components/MoreScreen/ToggleSettingsItem'

export default function MoreScreen() {
	const { settings, updateSetting } = useSettings()

	const isDarkMode = settings.darkMode || false

	const toggleDarkMode = () => {
		const newDarkModeValue = !isDarkMode
		updateSetting('darkMode', newDarkModeValue)
	}

	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

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
							initialValue={false}
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
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}
