import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { COLORS } from '../assets/colors'

const ScheduleComponent = ({ style, item, navigate, dayIndex, daysTotal }) => {
	const startTime = new Date(item.time_start).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const endTime = new Date(item.time_end).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})

	return (
		<TouchableOpacity
			style={[styles.scheduleComponent, { ...style, backgroundColor: item.color }]}
			onPress={() => navigate('manageVisit', { id: item.id })}>
			<View style={styles.scheduleComponentIcon}></View>

			<View style={styles.scheduleComponentContent}>
				<View style={styles.ScheduleCompscheduleComponentLeftContentonent}>
					<Text style={styles.scheduleComponentTitle}>{item.address}</Text>
					<Text style={styles.scheduleComponentPatient}>{item.patient_full_name}</Text>
				</View>
				<View style={styles.scheduleComponentTime}>
					<FontAwesome name={'clock'} size={18} color={COLORS.main_text_light_color} />
					<Text style={styles.scheduleComponentTimeText}>
						{startTime} - {endTime}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	scheduleComponent: {
		backgroundColor: COLORS.main,
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderRadius: 6,
		flexDirection: 'row',
	},

	scheduleComponentIcon: {
		width: 4,
		backgroundColor: COLORS.element_background,
		height: '100%',
		marginEnd: 8,
		borderRadius: 6,
	},

	scheduleComponentContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	ScheduleCompscheduleComponentLeftContentonent: {
		flex: 3,
	},

	scheduleComponentTitle: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-SemiBold',
		fontSize: 16,
	},

	scheduleComponentPatient: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-Regular',
	},

	scheduleComponentTime: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 2,
	},

	scheduleComponentTimeText: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-Regular',
		marginLeft: 10,
	},
})

export default ScheduleComponent
