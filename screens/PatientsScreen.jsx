import React, { useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../assets/styles'
import { COLORS } from '../assets/colors'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { fetchPatientData } from '../services/Database'
import LoadingScreen from '../components/LoadingScreen'

const PatientComponent = ({ fullName, dateOfBirth }) => {
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

	return (
		<View style={styles.PatientComponent}>
			<View style={styles.PatientComponentIcon}></View>

			<View style={styles.PatientComponentContent}>
				<View>
					<Text style={styles.PatientComponentName}>{fullName}</Text>
					<Text style={styles.PatientComponentAge}>Wiek: {calculateAge(dateOfBirth)}</Text>
				</View>
				<View style={styles.PatientComponentTime}>
					<FontAwesome name={'calendar'} size={18} color={COLORS.main} />
					<Text style={styles.PatientComponentTimeText}>3</Text>
				</View>
			</View>
		</View>
	)
}

export default function PatientsScreen() {
	const { navigate } = useNavigation()
	const [patientList, setPatientList] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const fetchData = async () => {
		console.log(`Pobieram listę pacjentów`)
		setIsLoading(true)
		fetchPatientData(data => {
			setPatientList(data)
			setIsLoading(false)
		})
	}

	useFocusEffect(
		useCallback(() => {
			fetchData()
		}, [])
	)

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Pacjenci</Text>

						<View style={globalStyles.plusIconContainer}>
							<TouchableOpacity onPress={() => navigate('ManagePatient', {})}>
								<FontAwesome name={'plus'} size={16} color={COLORS.main_text_light_color} />
							</TouchableOpacity>
						</View>
					</View>

					{!isLoading ? (
						<ScrollView style={globalStyles.roundedContainer}>
							<View style={[styles.searchBar, globalStyles.cardShadow]}>
								<TextInput style={styles.searchInput} placeholder='Wyszukaj pacjenta...' />
								<FontAwesome name={'search'} size={16} color={COLORS.header_text_gray_color} />
							</View>

							<View style={{ marginTop: 10 }}>
								<Text style={globalStyles.containerTitle}>Lista pacjentów</Text>

								{patientList.map(el => (
									<PatientComponent
										key={el.id}
										fullName={el.full_name}
										dateOfBirth={el.date_of_birth}
									/>
								))}
							</View>
						</ScrollView>
					) : (
						<View style={globalStyles.roundedContainer}>
							<LoadingScreen />
						</View>
					)}
				</View>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	searchBar: {
		margin: 2,
		marginTop: 20,
		backgroundColor: COLORS.element_background,
		height: 50,
		borderRadius: 20,
		paddingHorizontal: 15,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	searchInput: {
		flex: 1,
		paddingEnd: 10,
		fontFamily: 'Poppins-Regular',
	},

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
