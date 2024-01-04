import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { useGlobalColors } from '../assets/colors'
import { useGlobalStyles } from '../assets/styles'

export default NoMeetings = ({ text }) => {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

	const styles = StyleSheet.create({
		noMeetingsContainer: {
			alignItems: 'center',
			paddingVertical: 10,
		},

		noMeetingsIcon: {
			backgroundColor: COLORS.primary,
			padding: 15,
			borderRadius: 6,
		},
		tabTitle: {
			fontFamily: 'Poppins-SemiBold',
			color: COLORS.header_text_gray_color,
			fontSize: 18,
			marginTop: 5,
		},
	})

	return (
		<View style={[globalStyles.cardBox, globalStyles.cardShadow]}>
			<View style={styles.noMeetingsContainer}>
				<View style={styles.noMeetingsIcon}>
					<FontAwesome name={'calendar-times'} size={25} color={COLORS.main_text_light_color} />
				</View>

				<Text style={[styles.tabTitle, { textAlign: 'center' }]}>{text}</Text>
			</View>
		</View>
	)
}
