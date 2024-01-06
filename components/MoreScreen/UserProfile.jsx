import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'

import { useGlobalColors } from '../../assets/colors'
import { useSettings } from '../../SettingsContext'

import { format } from 'date-fns'

export default UserProfile = () => {
	const COLORS = useGlobalColors()

	const { settings } = useSettings()

	const initials = settings.user
		.split(' ')
		.map(name => name[0])
		.join('')

	const date = format(settings.joinDate, 'dd.MM.yyy')

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
			color: COLORS.main_text_dark_color,
		},
		userProfileEmail: {
			color: COLORS.light_icon_color,
		},
	})

	return (
		<View style={styles.userProfileContainer}>
			<View style={styles.userProfileIconContainer}>
				<Text style={styles.userProfileIcon}>{initials}</Text>
			</View>
			<View style={styles.userProfileTextContainer}>
				<Text style={styles.userProfileName}>{settings.user}</Text>
				<Text style={styles.userProfileEmail}>Data dołączenia: {date}</Text>
			</View>
		</View>
	)
}
