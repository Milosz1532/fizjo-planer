import React, { useState, useRef, useCallback } from 'react'
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	KeyboardAvoidingView,
	Keyboard,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Entypo from '@expo/vector-icons/Entypo'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { useGlobalStyles } from '../../assets/styles'
import { useGlobalColors } from '../../assets/colors'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import LoadingScreen from '../../components/LoadingScreen'

import { insertPatient, fetchPatientData, updatePatient } from '../../services/Database'

const ListItemComponent = ({ id, text, icon, iconSize, iconColor, onRemove }) => {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)
	return (
		<View style={[styles.problemContainer, id === 1 && styles.problemContainerFirstElement]}>
			<View style={[styles.problemIcon, { backgroundColor: iconColor }]}>
				<Entypo name={icon} size={iconSize ? iconSize : 15} color={COLORS.main_text_light_color} />
			</View>
			<Text style={styles.problemText}>{text}</Text>
			<TouchableOpacity style={styles.problemRemoveIcon} onPress={() => onRemove(id)}>
				<FontAwesome name={'trash'} size={18} color={COLORS.header_text_gray_color} />
			</TouchableOpacity>
		</View>
	)
}

export default function ManagePatient({ route }) {
	const { id } = route.params
	const { goBack } = useNavigation()

	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()
	const styles = generateStyles(COLORS)

	const PATIENT_ID = id

	const [patientData, setPatientData] = useState(null)
	const [fullName, setFullName] = useState('')
	const [birthday, setBirthday] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [note, setNote] = useState('')

	const [problemList, setProblemList] = useState([])
	const [locationList, setLocationList] = useState([])
	const [addProblemValue, setAddProblemValue] = useState('')
	const [addLocationValue, setAddLocationValue] = useState('')

	const [isLoading, setIsLoading] = useState(false)

	const scrollViewRef = useRef(null)

	const fetchData = async () => {
		setIsLoading(true)
		try {
			const result = await new Promise((resolve, reject) => {
				fetchPatientData(PATIENT_ID, data => {
					resolve(data)
				})
			})
			if (result) {
				console.log(result)
				setPatientData(result)
				setFullName(result.full_name)
				setBirthday(new Date(result.date_of_birth))
				setPhoneNumber(result.phone_number)
				setNote(result.note)
				setProblemList(result.problems)
				setLocationList(result.addresses)
				setIsLoading(false)
			} else {
				Dialog.show({
					type: ALERT_TYPE.DANGER,
					title: 'Błąd',
					textBody: 'Wystąpił problem podczas pobierania danych pacjenta',
					button: 'OK',
					onPressButton: () => {
						Dialog.hide()
						goBack()
					},
				})
			}
		} catch (error) {
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: 'Błąd',
				textBody: 'Wystąpił problem podczas pobierania danych pacjenta',
				button: 'OK',
				onPressButton: () => {
					Dialog.hide()
					goBack()
				},
			})
		}
	}

	useFocusEffect(
		useCallback(() => {
			if (PATIENT_ID) {
				fetchData()
			}
		}, [])
	)

	const handleAddNewProblem = event => {
		if (addProblemValue.length <= 0) {
			Keyboard.dismiss()
			return
		}
		const newProblem = {
			id: problemList.length > 0 ? problemList[problemList.length - 1].id + 1 : 1,
			text: addProblemValue.trim(),
		}
		setProblemList(prevList => [...prevList, newProblem])
		setAddProblemValue('')
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true })
		}
	}

	const handleAddNewLocation = () => {
		if (addLocationValue.length <= 0) {
			Keyboard.dismiss()
			return
		}
		const newLocation = {
			id: locationList.length > 0 ? locationList[locationList.length - 1].id + 1 : 1,
			text: addLocationValue.trim(),
		}
		setLocationList(prevList => [...prevList, newLocation])
		setAddLocationValue('')
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true })
		}
	}

	const handleRemoveProblem = id => {
		const prevProblems = problemList
		setProblemList(prevProblems.filter(problem => problem.id !== id))
	}

	const handleRemoveLocation = id => {
		const prevLocations = locationList
		setLocationList(prevLocations.filter(location => location.id !== id))
	}

	const handleAddPatient = () => {
		if (fullName.trim().length === 0 || !birthday || phoneNumber.trim().length === 0) {
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: 'Problem',
				textBody: 'Wypełnij poprawnie pola formularza',
				button: 'OK',
			})
			return
		}

		if (PATIENT_ID) {
			try {
				updatePatient(
					PATIENT_ID,
					fullName,
					birthday.getTime(),
					phoneNumber,
					note,
					problemList,
					locationList
				)
				Dialog.show({
					type: ALERT_TYPE.SUCCESS,
					title: 'Success',
					textBody: 'Gratulacje pacjent został pomyślnie zmodyfikowany',
					button: 'OK',
					onPressButton: () => {
						Dialog.hide()
						goBack()
					},
				})
			} catch (ex) {
				Dialog.show({
					type: ALERT_TYPE.DANGER,
					title: 'Błąd',
					textBody: 'Wystąpił problem podczas edycji pacjenta. Spróbuj ponownie.',
					button: 'OK',
				})
			}
		} else {
			try {
				insertPatient(fullName, birthday.getTime(), phoneNumber, note, problemList, locationList)
				Dialog.show({
					type: ALERT_TYPE.SUCCESS,
					title: 'Success',
					textBody: 'Gratulacje pacjent został pomyślnie dodany',
					button: 'OK',
					onPressButton: () => {
						Dialog.hide()
						goBack()
					},
				})
			} catch (ex) {
				Dialog.show({
					type: ALERT_TYPE.DANGER,
					title: 'Błąd',
					textBody: 'Wystąpił problem podczas dodawania pacjenta. Spróbuj ponownie.',
					button: 'OK',
				})
			}
		}
	}

	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

	const handleDateConfirm = selectedTime => {
		setBirthday(selectedTime)
		hideDatePicker()
	}

	const hideDatePicker = () => {
		setIsDatePickerVisible(false)
	}

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1 }}>
					<ScrollView
						style={[globalStyles.screenContainer]}
						ref={scrollViewRef}
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'space-between',
							flexDirection: 'column',
						}}>
						{!isLoading ? (
							<>
								<View style={{ flex: 1, justifyContent: 'flex-start' }}>
									<View style={globalStyles.topHeader}>
										<Text style={globalStyles.topHeaderTextDark}>
											{PATIENT_ID ? 'Zarządzanie pacjentem' : 'Dodaj pacjenta'}
										</Text>
										<View style={globalStyles.backIconContainer}>
											<TouchableOpacity onPress={() => goBack()}>
												<FontAwesome
													name={'angle-left'}
													size={22}
													color={COLORS.light_icon_color}
												/>
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
											<TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
												<TextField
													keyboardType='numeric'
													value={
														birthday &&
														`${birthday.getUTCDate()}.${
															birthday.getUTCMonth() + 1
														}.${birthday.getUTCFullYear()}`
													}
													contentType={'datetime'}
													editable={false}
													label='Data urodzenia'
													onChangeText={text => setBirthday(text)}
												/>
											</TouchableOpacity>
										</View>
										<DateTimePickerModal
											isVisible={isDatePickerVisible}
											mode='date'
											onConfirm={handleDateConfirm}
											onCancel={hideDatePicker}
										/>
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
												{problemList.map(problem => (
													<ListItemComponent
														key={problem.id}
														id={problem.id}
														text={problem.text}
														icon={'warning'}
														iconColor={COLORS.warning_color}
														onRemove={handleRemoveProblem}
													/>
												))}

												<View style={styles.addProblemContainer}>
													<View style={styles.addProblemIcon}>
														<FontAwesome
															name={'plus'}
															size={12}
															color={COLORS.main_text_light_color}
														/>
													</View>
													<TextInput
														value={addProblemValue}
														style={styles.addProblemInput}
														placeholder='Wprowadź problem...'
														placeholderTextColor={COLORS.placeholder_color}
														onChangeText={text => setAddProblemValue(text)}
														onSubmitEditing={handleAddNewProblem}
														maxLength={40}
														blurOnSubmit={false}
													/>
												</View>
											</View>
										</View>

										<View style={{ marginTop: 20 }}>
											<Text style={[globalStyles.containerMediumText, { textAlign: 'center' }]}>
												Lokalizacje
											</Text>

											<View>
												{locationList.map(location => (
													<ListItemComponent
														key={location.id}
														id={location.id}
														text={location.text}
														icon={'location-pin'}
														iconSize={18}
														iconColor={COLORS.element_color_2}
														onRemove={handleRemoveLocation}
													/>
												))}

												<View style={styles.addProblemContainer}>
													<View style={styles.addProblemIcon}>
														<FontAwesome
															name={'plus'}
															size={12}
															color={COLORS.main_text_light_color}
														/>
													</View>
													<TextInput
														value={addLocationValue}
														style={styles.addProblemInput}
														placeholder='Wprowadź lokalizcje...'
														placeholderTextColor={COLORS.placeholder_color}
														autoComplete='street-address'
														onChangeText={text => setAddLocationValue(text)}
														onSubmitEditing={handleAddNewLocation}
														maxLength={40}
														blurOnSubmit={false}
													/>
												</View>
											</View>
										</View>
									</View>
								</View>

								<View style={{ justifyContent: 'flex-end' }}>
									<Button
										text={PATIENT_ID ? 'Edytuj pacjenta' : 'Dodaj pacjenta'}
										onPress={handleAddPatient}
									/>
								</View>
							</>
						) : (
							<LoadingScreen />
						)}
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		problemContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 10,
			borderBottomWidth: 1,
			borderBottomColor: COLORS.light_border_color,
			paddingVertical: 10,
		},

		problemContainerFirstElement: {
			borderTopWidth: 1,
			borderTopColor: COLORS.light_border_color,
		},

		problemIcon: {
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
			paddingVertical: 10,
			borderBottomWidth: 1,
			borderBottomColor: COLORS.light_border_color,
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
