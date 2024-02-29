import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { useGlobalColors } from '../assets/colors'

const PatientComponent = ({ fullName, dateOfBirth, upcomingVisitsCount, onPress }) => {
	const COLORS = useGlobalColors()

	const calculateAge = birthDate => {
		const today = new Date()
		const birthDateObj = new Date(birthDate)

		const years = today.getFullYear() - birthDateObj.getFullYear()
		const months = today.getMonth() - birthDateObj.getMonth()
		const days = today.getDate() - birthDateObj.getDate()

		if (years > 0 || (years === 0 && months > 0) || (years === 0 && months === 0 && days >= 0)) {
			if (years === 0) {
				return `${months} ${
					months === 1 ? 'miesiąc' : months > 1 && months < 5 ? 'miesiące' : 'miesięcy'
				}`
			} else {
				const yearsPart = `${years} ${
					years === 1
						? 'rok'
						: (years > 1 && years < 5) ||
						  (years % 10 >= 2 && years % 10 <= 4 && (years % 100 < 10 || years % 100 >= 20))
						? 'lata'
						: 'lat'
				}`
				const monthsPart =
					months > 0
						? ` i ${months} ${
								months === 1 ? 'miesiąc' : months > 1 && months < 5 ? 'miesiące' : 'miesięcy'
						  }`
						: ''
				return `${yearsPart}${monthsPart}`
			}
		} else {
			return `${years - 1} ${
				years - 1 === 1
					? 'rok'
					: (years - 1 > 1 && years - 1 < 5) ||
					  ((years - 1) % 10 >= 2 &&
							(years - 1) % 10 <= 4 &&
							((years - 1) % 100 < 10 || (years - 1) % 100 >= 20))
					? 'lata'
					: 'lat'
			}`
		}
	}

	const styles = StyleSheet.create({
		PatientComponent: {
			backgroundColor: COLORS.element_background,
			marginVertical: 10,
			paddingHorizontal: 10,
			paddingVertical: 20,
			borderRadius: 10,

			flexDirection: 'row',
			alignItems: 'center',
		},

		PatientComponentIcon: {
			width: 8,
			backgroundColor: COLORS.main,
			height: '100%',
			marginEnd: 8,
			borderRadius: 6,
		},

		PatientComponentContent: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},

		PatientComponentName: {
			color: COLORS.main_text_dark_color,
			fontFamily: 'Poppins-SemiBold',
			fontSize: 16,
		},

		PatientComponentAge: {
			color: COLORS.main_text_dark_color,
			fontFamily: 'Poppins-Regular',
		},

		PatientComponentTime: {
			flexDirection: 'row',
		},

		PatientComponentTimeText: {
			color: COLORS.main,
			fontFamily: 'Poppins-Bold',
			marginLeft: 10,
			marginEnd: 10,
		},
	})

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.PatientComponent}>
				<View style={styles.PatientComponentIcon}></View>

				<View style={styles.PatientComponentContent}>
					<View>
						<Text style={styles.PatientComponentName}>{fullName}</Text>
						<Text style={styles.PatientComponentAge}>
							Wiek: {dateOfBirth ? calculateAge(dateOfBirth) : 'Brak danych'}
						</Text>
					</View>
					<View style={styles.PatientComponentTime}>
						<FontAwesome name={'calendar'} size={18} color={COLORS.main} />
						<Text style={styles.PatientComponentTimeText}>{upcomingVisitsCount}</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default PatientComponent
