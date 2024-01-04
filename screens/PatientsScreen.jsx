import React, { useState, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { useGlobalStyles } from '../assets/styles'
import { useGlobalColors } from '../assets/colors'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { fetchPatientList } from '../services/Database'
import LoadingScreen from '../components/LoadingScreen'

import PatientComponent from '../components/PatientComponent'

export default function PatientsScreen() {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

	const { navigate } = useNavigation()
	const [patientList, setPatientList] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const fetchData = async () => {
		setIsLoading(true)
		try {
			fetchPatientList((error, data) => {
				if (error) {
					console.log(`Nie udało się pobrać listy pacjentów: ${error.message}`)
				} else {
					setPatientList(data)
				}
				setIsLoading(false)
			})
		} catch (error) {
			console.log(`Nie udało się pobrać listy pacjentów: ${error.message}`)
			setIsLoading(false)
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchData()
		}, [])
	)

	const handleManagePatient = id => {
		navigate('ManagePatient', { id })
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
	})

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
								<TextInput
									style={styles.searchInput}
									placeholderTextColor={COLORS.placeholder_color}
									placeholder='Wyszukaj pacjenta...'
								/>
								<FontAwesome name={'search'} size={16} color={COLORS.header_text_gray_color} />
							</View>

							<View style={{ marginTop: 10 }}>
								<Text style={globalStyles.containerTitle}>Lista pacjentów</Text>

								{patientList.map(el => (
									<PatientComponent
										key={el.id}
										fullName={el.full_name}
										dateOfBirth={el.date_of_birth}
										upcomingVisitsCount={el.upcoming_visits_count}
										onPress={() => handleManagePatient(el.id)}
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
