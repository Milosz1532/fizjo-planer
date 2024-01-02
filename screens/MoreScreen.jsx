import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { globalStyles } from '../assets/styles'
import { COLORS } from '../assets/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

import { useSettings } from '../SettingsContext'

const UserProfile = () => (
	<View style={styles.userProfileContainer}>
		<View style={styles.userProfileIconContainer}>
			<Text style={styles.userProfileIcon}>TB</Text>
		</View>
		<View style={styles.userProfileTextContainer}>
			<Text style={styles.userProfileName}>Tamara Banaszek</Text>
			<Text style={styles.userProfileEmail}>tamarabanaszek@gmail.com</Text>
		</View>
	</View>
)

const SettingsItem = ({ icon, label, onPress }) => (
	<View style={styles.settingsItemContainer}>
		<View style={[styles.settingsItemIconContainer, { backgroundColor: icon.backgroundColor }]}>
			<FontAwesome name={icon.name} style={styles.settingsItemIcon} />
		</View>
		<Text style={styles.settingsItemText}>{label}</Text>
		<View style={styles.settingsItemArrowIconContainer}>
			<FontAwesome name='angle-right' size={18} color={COLORS.tab_gray_element_color} />
		</View>
	</View>
)

const ToggleSettingsItem = ({ icon, label, initialValue, onToggle }) => (
	<View style={styles.toggleSettingsItemContainer}>
		<View
			style={[styles.toggleSettingsItemIconContainer, { backgroundColor: icon.backgroundColor }]}>
			<FontAwesome name={icon.name} style={styles.toggleSettingsItemIcon} />
		</View>
		<Text style={styles.toggleSettingsItemText}>{label}</Text>
		<View style={styles.toggleSettingsItemToggleContainer}>
			{/* <ToggleSwitch
				isOn={initialValue}
				onColor={COLORS.element_color_2}
				offColor={COLORS.light_gray_element}
				size='medium'
				onToggle={onToggle}
			/> */}
		</View>
	</View>
)

export default function MoreScreen() {
	const { settings, updateSetting } = useSettings()
	const isDarkMode = settings.darkMode || false

	const toggleDarkMode = () => {
		const newDarkModeValue = !isDarkMode
		updateSetting('darkMode', newDarkModeValue)
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

const styles = StyleSheet.create({
	userProfileContainer: {
		backgroundColor: COLORS.element_background,
		flexDirection: 'row',
		borderRadius: 10,
		padding: 15,
		marginTop: 20,
	},
	userProfileIconContainer: {
		backgroundColor: COLORS.primary,
		borderRadius: 50,
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	userProfileIcon: {
		fontSize: 30,
		fontFamily: 'Poppins-SemiBold',
		color: 'white',
		textAlignVertical: 'center',
	},
	userProfileTextContainer: {
		paddingStart: 10,
		justifyContent: 'center',
	},
	userProfileName: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 20,
	},
	userProfileEmail: {
		color: COLORS.light_icon_color,
	},
	settingsItemContainer: {
		flexDirection: 'row',
		backgroundColor: COLORS.element_background,
		borderRadius: 10,
		padding: 10,
		alignItems: 'center',
		marginBottom: 10,
	},
	settingsItemIconContainer: {
		padding: 8,
		borderRadius: 8,
	},
	settingsItemIcon: {
		fontSize: 15,
		color: 'white',
	},
	settingsItemText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 15,
		paddingStart: 12,
	},
	settingsItemArrowIconContainer: {
		marginLeft: 'auto',
		marginRight: 15,
	},
	toggleSettingsItemContainer: {
		flexDirection: 'row',
		backgroundColor: COLORS.element_background,
		borderRadius: 10,
		padding: 10,
		alignItems: 'center',
		marginBottom: 10,
	},
	toggleSettingsItemIconContainer: {
		padding: 8,
		borderRadius: 8,
	},
	toggleSettingsItemIcon: {
		fontSize: 15,
		color: COLORS.main_text_light_color,
	},
	toggleSettingsItemText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 15,
		paddingStart: 12,
	},
	toggleSettingsItemToggleContainer: {
		marginLeft: 'auto',
		marginRight: 15,
	},
})
