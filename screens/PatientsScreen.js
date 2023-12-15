import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../assets/styles'
import { COLORS } from '../assets/colors'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

const PatientComponent = () => {
	return (
		<View style={styles.PatientComponent}>
			<View style={styles.PatientComponentIcon}></View>

			<View style={styles.PatientComponentContent}>
				<View>
					<Text style={styles.PatientComponentName}>Jasiu Kowalski</Text>
					<Text style={styles.PatientComponentAge}>Wiek: 10 lat</Text>
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

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Pacjenci</Text>

						<View style={globalStyles.plusIconContainer}>
							<TouchableOpacity onPress={() => navigate('ManagePatient', {})}>
								<FontAwesome name={'plus'} size={14} color={COLORS.main_text_light_color} />
							</TouchableOpacity>
						</View>
					</View>

					<ScrollView style={globalStyles.roundedContainer}>
						<View style={[styles.searchBar, globalStyles.cardShadow]}>
							<TextInput style={styles.searchInput} placeholder='Wyszukaj pacjenta...' />
							<FontAwesome name={'search'} size={16} color={COLORS.header_text_gray_color} />
						</View>

						<View style={{ marginTop: 10 }}>
							<Text style={globalStyles.containerTitle}>Lista pacjentów</Text>

							<PatientComponent />
							<PatientComponent />
							<PatientComponent />
							<PatientComponent />
							<PatientComponent />
						</View>
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	searchBar: {
		margin: 2,
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
