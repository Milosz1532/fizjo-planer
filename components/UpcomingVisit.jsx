import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { COLORS } from '../assets/colors'

const UpcomingVisit = ({ meeting, color, onPress }) => {
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

	return (
		<TouchableOpacity style={styles.upcomingVisitCard} onPress={onPress}>
			<View style={[styles.upcomingVisitCardIcon, { backgroundColor: color }]}></View>
			<View style={styles.upcomingVisitCardContent}>
				<View style={styles.upcommingLeftContent}>
					<Text style={styles.upcomingVisitCardLocation}>{meeting.address}</Text>
					<Text style={styles.upcomingVisitCardPatient}>{meeting.patient_full_name}</Text>
				</View>
				<View style={styles.upcomingVisitCardTime}>
					<FontAwesome name={'clock'} size={18} color={COLORS.tab_gray_element_color} />
					<Text style={styles.upcomingVisitCardTimeText}>
						{startTime} - {endTime}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	upcomingVisitCard: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
	},

	upcomingVisitCardIcon: {
		width: 5,
		backgroundColor: COLORS.element_color_1,
		marginEnd: 10,
		borderRadius: 6,
	},

	upcomingVisitCardContent: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	upcommingLeftContent: {
		flex: 3,
		paddingEnd: 5,
	},

	upcomingVisitCardTime: {
		flexDirection: 'row',
	},

	upcomingVisitCardTimeText: {
		marginStart: 5,
		fontFamily: 'Poppins-Regular',
	},

	upcomingVisitCardLocation: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 16,
	},

	upcomingVisitCardPatient: {
		fontFamily: 'Poppins-Regular',
		marginTop: -4,
		color: COLORS.tab_gray_element_color,
	},
})

export default UpcomingVisit
