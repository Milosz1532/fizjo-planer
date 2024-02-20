import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { View, Text, StyleSheet } from 'react-native'
import { useGlobalColors } from '../../assets/colors'

import { format } from 'date-fns'

const ScheduledVisit = ({ patient_name, address, time_start, time_end }) => {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	const formattedStartTime = format(new Date(time_start), 'HH:mm')
	const formattedEndTime = format(new Date(time_end), 'HH:mm')

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<FontAwesome name={'calendar'} size={18} color={COLORS.main_text_light_color} />
			</View>
			<View style={styles.content}>
				<Text style={styles.nameText}>{patient_name}</Text>
				<Text style={styles.addressText}>{address}</Text>
			</View>
			<View style={styles.timeContainer}>
				<View style={styles.timeContainerBackground}>
					<Text style={styles.timeText}>{formattedStartTime}</Text>
					<View style={{ paddingHorizontal: 10 }}>
						<FontAwesome name={'angle-right'} size={18} color={COLORS.main} />
					</View>
					<Text style={styles.timeText}>{formattedEndTime}</Text>
				</View>
			</View>
		</View>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			flex: 1,
			marginTop: 20,
			borderBottomWidth: 1,
			borderRadius: 10,
			borderColor: COLORS.light_border_color,
			paddingBottom: 10,
		},
		iconContainer: {
			backgroundColor: COLORS.primary,
			justifyContent: 'center',
			alignItems: 'center',
			marginEnd: 10,
			width: 40,
			height: 40,
			borderRadius: 6,
		},
		content: {
			justifyContent: 'center',
			flex: 4,
			flexWrap: 'wrap',
		},

		nameText: {
			fontFamily: 'Poppins-SemiBold',
		},

		addressText: {
			fontFamily: 'Poppins-Regular',
			flexWrap: 'wrap',
			maxWidth: '100%',
		},

		timeContainer: {
			justifyContent: 'center',
			flex: 2,
			alignItems: 'center',
			flexDirection: 'row',
		},

		timeContainerBackground: {
			flexDirection: 'row',
			backgroundColor: COLORS.light_element_background,
			borderRadius: 6,
			padding: 6,
		},

		timeText: {
			fontFamily: 'Poppins-SemiBold',
			color: COLORS.main,
		},
	})

export default ScheduledVisit
