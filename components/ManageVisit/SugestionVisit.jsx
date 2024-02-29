import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useGlobalColors } from '../../assets/colors'

import { format } from 'date-fns'

const SugestionVisit = ({ time_start, time_end, handleSugestionClick }) => {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	const formattedStartTime = format(new Date(time_start), 'HH:mm')
	const formattedEndTime = format(new Date(time_end), 'HH:mm')

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => handleSugestionClick(new Date(time_start), new Date(time_end))}>
			<View style={styles.iconContainer}>
				<FontAwesome name={'calendar'} size={18} color={COLORS.main_text_light_color} />
			</View>
			<View style={styles.content}>
				<View style={styles.dateTextContainer}>
					<Text style={styles.dateText}>Sobota, 30 grudnia 2023</Text>
				</View>
				<View style={styles.timeContainer}>
					<Text style={styles.timeText}>{formattedStartTime}</Text>
					<View style={{ paddingHorizontal: 5, padding: 0 }}>
						<FontAwesome name={'angle-right'} size={18} color={COLORS.main} />
					</View>
					<Text style={styles.timeText}>{formattedEndTime}</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			flex: 1,
			marginTop: 20,
			borderBottomWidth: 1,
			borderRadius: 10,
			borderColor: COLORS.light_border_color,
			backgroundColor: COLORS.light_element_background,
			padding: 10,
		},

		iconContainer: {
			width: 40,
			height: 40,
			backgroundColor: COLORS.element_color_3,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 5,
			marginEnd: 10,
		},

		content: {
			alignItems: 'center',
			justifyContent: 'space-between',
			flexDirection: 'row',
			flexWrap: 'wrap',
			flex: 1,
		},

		dateTextContainer: {
			flex: 3,
		},

		dateText: {
			fontFamily: 'Poppins-SemiBold',
			marginEnd: 20,
			flexWrap: 'wrap',
			maxWidth: '100%',
		},

		timeContainer: {
			flexDirection: 'row',
			flex: 2,
			flexWrap: 'wrap',
			alignItems: 'center',
		},

		timeText: {
			fontFamily: 'Poppins-Bold',
			fontSize: 16,
			color: COLORS.main,
		},
	})

export default SugestionVisit
