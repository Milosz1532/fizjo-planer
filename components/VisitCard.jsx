import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { useGlobalColors } from '../assets/colors'

const VisitCard = ({ meeting, onPress }) => {
	const startTime = new Date(meeting.time_start).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const endTime = new Date(meeting.time_end).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})

	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	return (
		<TouchableOpacity style={styles.visitCard} onPress={onPress}>
			<View style={styles.visitCardIcon}>
				<FontAwesome name={'calendar-week'} size={24} color={COLORS.main_text_light_color} />
			</View>
			<View style={styles.visitCardContent}>
				<Text style={styles.visitCardContentLocation}>{meeting.address}</Text>
				<Text style={styles.visitCardContentPatient}>{meeting.patient_full_name}</Text>
			</View>
			<View style={styles.visitCardTime}>
				<FontAwesome name={'clock'} size={18} color={COLORS.main_text_light_color} />
				<Text style={styles.visitCardTimeText}>
					{startTime} - {endTime}
				</Text>
			</View>
		</TouchableOpacity>
	)
}
const generateStyles = COLORS =>
	StyleSheet.create({
		visitCard: {
			backgroundColor: COLORS.main,
			display: 'flex',
			justifyContent: 'space-between',
			flexDirection: 'row',
			alignItems: 'center',
			padding: 10,
			borderRadius: 6,
			marginTop: 10,
		},

		visitCardIcon: {
			backgroundColor: COLORS.primary,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 6,
			width: 50,
			height: 50,
			marginEnd: 5,
		},

		visitCardContent: {
			flex: 3,
		},

		visitCardContentLocation: {
			fontFamily: 'Poppins-Bold',
			color: COLORS.main_text_light_color,
			fontSize: 15,
		},

		visitCardContentPatient: {
			fontFamily: 'Poppins-Regular',
			marginTop: -4,
			color: COLORS.main_text_light_color,
		},

		visitCardTime: {
			flex: 2,
			flexDirection: 'row',
		},

		visitCardTimeText: {
			fontFamily: 'Poppins-Regular',
			marginStart: 10,
			color: COLORS.main_text_light_color,
		},
	})

export default VisitCard
