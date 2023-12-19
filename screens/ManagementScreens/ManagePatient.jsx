import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'

const ProblemComponent = ({ text }) => {
	return (
		<View style={styles.problemContainer}>
			<View style={styles.problemIcon}>
				<FontAwesome name={'exclamation-triangle'} size={12} color={COLORS.main_text_light_color} />
			</View>
			<Text style={styles.problemText}>{text}</Text>
			<TouchableOpacity style={styles.problemRemoveIcon}>
				<FontAwesome name={'trash'} size={15} color={COLORS.header_text_gray_color} />
			</TouchableOpacity>
		</View>
	)
}

export default function ManagePatient() {
	const { goBack } = useNavigation()
	const [fullName, setFullName] = useState('')
	const [age, setAge] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [note, setNote] = useState('')

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<ScrollView style={[globalStyles.screenContainer]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderTextDark}>Dodaj pacjenta</Text>
						<View style={globalStyles.backIconContainer}>
							<TouchableOpacity onPress={() => goBack()}>
								<FontAwesome name={'angle-left'} size={20} color={COLORS.light_icon_color} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={[globalStyles.container, { marginTop: 20 }]}>
						<View>
							<TextField
								value={fullName}
								label='Imię i Nazwisko'
								maxLength={20}
								onChangeText={text => setFullName(text)}
							/>
						</View>
						<View style={{ marginTop: 20 }}>
							<TextField
								keyboardType='numeric'
								value={age}
								maxLength={4}
								label='Rok urodzenia'
								onChangeText={text => setAge(text)}
							/>
						</View>
						<View style={{ marginTop: 20 }}>
							<TextField
								keyboardType='numeric'
								value={phoneNumber}
								maxLength={10}
								label='Numer telefonu'
								onChangeText={text => setPhoneNumber(text)}
							/>
						</View>

						<View style={{ marginTop: 20 }}>
							<TextField
								value={note}
								label='Notatka'
								maxLength={300}
								minHeight={60}
								multiline
								onChangeText={text => setNote(text)}
							/>
						</View>

						<View style={{ marginTop: 20 }}>
							<Text style={[globalStyles.containerMediumText, { textAlign: 'center' }]}>
								Problemy
							</Text>

							<View>
								<ProblemComponent text={'Mózgowe porażenie dziecięce'} />
								<ProblemComponent text={'Problemy z mową'} />
								<View style={styles.addProblemContainer}>
									<View style={styles.addProblemIcon}>
										<FontAwesome name={'plus'} size={12} color={COLORS.main_text_light_color} />
									</View>
									<TextInput
										style={styles.addProblemInput}
										placeholder='Wprowadź problem...'
										maxLength={40}
									/>
								</View>
							</View>
						</View>

						<View style={{ marginTop: 20 }}>
							<Text>Dodaj</Text>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	problemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.light_border_color,
		paddingVertical: 10,
	},
	problemIcon: {
		backgroundColor: COLORS.warning_color,
		borderRadius: 6,
		marginEnd: 10,
		minWidth: 30,
		minHeight: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	problemText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 14,
		flex: 1,
	},

	addProblemContainer: {
		flexDirection: 'row',
		marginTop: 10,
		paddingBottom: 10,
	},

	addProblemIcon: {
		backgroundColor: COLORS.border_color,
		borderRadius: 6,
		marginEnd: 10,
		minWidth: 30,
		minHeight: 30,
		alignItems: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},

	addProblemInput: {
		fontFamily: 'Poppins-Regular',
		flex: 1,
	},
})
