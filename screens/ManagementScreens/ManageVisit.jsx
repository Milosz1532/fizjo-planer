import React, { useState, useCallback } from 'react'
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	StyleSheet,
} from 'react-native'

import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import {
	fetchPatientListWithAddresses,
	insertVisit,
	fetchVisitById,
	updateVisit,
} from '../../services/Database'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'
import SelectOnly from '../../components/SelectOnly'
import Button from '../../components/Button'
import LoadingScreen from '../../components/LoadingScreen'

LocaleConfig.locales['pl'] = {
	monthNames: [
		'Styczeń',
		'Luty',
		'Marzec',
		'Kwiecień',
		'Maj',
		'Czerwiec',
		'Lipiec',
		'Sierpień',
		'Wrzesień',
		'Październik',
		'Listopad',
		'Grudzień',
	],
	monthNamesShort: [
		'Janv.',
		'Févr.',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juil.',
		'Août',
		'Sept.',
		'Oct.',
		'Nov.',
		'Déc.',
	],
	dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
	dayNamesShort: ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'],
}

LocaleConfig.defaultLocale = 'pl'

const displayDateText = _date => {
	const daysOfWeek = [
		'Niedziela',
		'Poniedziałek',
		'Wtorek',
		'Środa',
		'Czwartek',
		'Piątek',
		'Sobota',
	]
	const months = [
		'stycznia',
		'lutego',
		'marca',
		'kwietnia',
		'maja',
		'czerwca',
		'lipca',
		'sierpnia',
		'września',
		'października',
		'listopada',
		'grudnia',
	]

	const date = new Date(_date)
	const dayOfWeek = daysOfWeek[date.getDay()]
	const dayOfMonth = date.getDate()
	const month = months[date.getMonth()]
	const year = date.getFullYear()

	return `${dayOfWeek} ${dayOfMonth} ${month}, ${year}`
}

const DateComponent = ({
	id,
	date,
	timeStart,
	timeEnd,
	selectStartTime,
	selectEndTime,
	onRemove,
}) => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

	const hideDatePicker = () => {
		setDatePickerVisibility(false)
	}

	const handleConfirm = selectedTime => {
		const selectedDateTime = new Date(date)
		selectedDateTime.setHours(selectedTime.getHours())
		selectedDateTime.setMinutes(selectedTime.getMinutes())
		if (isDatePickerVisible === 'start') {
			selectStartTime(id, selectedDateTime)
		} else if (isDatePickerVisible === 'end') {
			selectEndTime(id, selectedDateTime)
		}
		hideDatePicker()
	}

	return (
		<View style={styles.dateContainer}>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<View style={styles.dateIcon}>
					<FontAwesome name={'calendar'} size={12} color={COLORS.main_text_light_color} />
				</View>
				<Text style={styles.dateText}>{displayDateText(date)}</Text>
				<TouchableOpacity style={styles.problemRemoveIcon} onPress={() => onRemove(id)}>
					<FontAwesome name={'trash'} size={15} color={COLORS.header_text_gray_color} />
				</TouchableOpacity>
			</View>
			<View style={styles.dateInputs}>
				<View>
					<View style={styles.dateIcon}>
						<FontAwesome name={'clock'} size={12} color={COLORS.main_text_light_color} />
					</View>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<TouchableOpacity onPress={() => setDatePickerVisibility('start')}>
						<View style={styles.dateTimeButton}>
							<Text style={styles.dateTimeButtonText}>{`${('0' + timeStart.getHours()).slice(
								-2
							)}:${('0' + timeStart.getMinutes()).slice(-2)}`}</Text>
						</View>
					</TouchableOpacity>

					<View style={{ paddingHorizontal: 20 }}></View>
					<TouchableOpacity onPress={() => setDatePickerVisibility('end')}>
						<View style={styles.dateTimeButton}>
							<Text style={styles.dateTimeButtonText}>{`${('0' + timeEnd.getHours()).slice(-2)}:${(
								'0' + timeEnd.getMinutes()
							).slice(-2)}`}</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			{timeStart.getTime() > timeEnd.getTime() && (
				<View>
					<Text style={styles.errorMessageText}>
						Godzina rozpoczęcia jest późniejsza niż godzina zakończenia
					</Text>
				</View>
			)}

			<DateTimePickerModal
				isVisible={isDatePickerVisible ? true : false}
				mode='time'
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
			/>
		</View>
	)
}

export default function ManageVisit({ route }) {
	const { id } = route.params
	const { navigate, goBack } = useNavigation()

	const VISIT_ID = id
	const [isLoading, setIsLoading] = useState(false)
	const [patientList, setPatientList] = useState([])
	const [patientLocationInputValue, setPatientLocationInputValue] = useState('')
	const [selectedPatient, setSelectedPatient] = useState(false)
	const [noteInputValue, setNoteInputValue] = useState('')
	const [selectedDates, setSelectedDates] = useState([])

	const [selectedVisitDate, setSelectedVisitDate] = useState()
	const [selectedVisitTimeStart, setSelectedVisitTimeStart] = useState()
	const [selectedVisitTimeEnd, setSelectedVisitTimeEnd] = useState()

	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
	const [isTimePickerVisible, setIsTimePickerVisible] = useState(false)

	useFocusEffect(
		useCallback(() => {
			const fetchData = async () => {
				try {
					fetchPatientListWithAddresses(data => {
						setPatientList(data)
						if (VISIT_ID) {
							fetchVisitById(VISIT_ID, (visit, error) => {
								if (error) {
									Dialog.show({
										type: ALERT_TYPE.DANGER,
										title: 'Błąd',
										textBody: 'Wystąpił problem podczas pobierania danych wizyty',
										button: 'OK',
										onPressButton: () => {
											Dialog.hide()
											goBack()
										},
									})
								} else {
									if (visit) {
										const findPatient = data.find(patient => patient.id === visit.patient_id)
										console.log(visit)
										setSelectedPatient(findPatient)
										setPatientLocationInputValue(visit.address)
										setNoteInputValue(visit.note)

										setSelectedVisitDate(visit.date)
										setSelectedVisitTimeStart(visit.time_start)
										setSelectedVisitTimeEnd(visit.time_end)
										setIsLoading(false)
									} else {
										Dialog.show({
											type: ALERT_TYPE.DANGER,
											title: 'Błąd',
											textBody: 'Wystąpił problem podczas pobierania danych wizyty',
											button: 'OK',
											onPressButton: () => {
												Dialog.hide()
												goBack()
											},
										})
									}
								}
							})
						} else {
							setIsLoading(false)
						}
					})
				} catch (error) {
					console.error('Error fetching patient list:', error)
				}
			}
			setIsLoading(true)
			fetchData()
		}, [])
	)

	const handleSelectDay = day => {
		const isDateAlreadySelected = selectedDates.some(date => date.date === day.timestamp)

		if (!isDateAlreadySelected) {
			const newDay = {
				id: selectedDates.length > 0 ? selectedDates[selectedDates.length - 1].id + 1 : 1,
				date: day.timestamp,
				timeStart: new Date(),
				timeEnd: new Date(),
			}
			const updatedDates = [...selectedDates, newDay]
			setSelectedDates(updatedDates)
		} else {
			const selectedDate = selectedDates.filter(el => el.date !== day.timestamp)
			setSelectedDates(selectedDate)
		}
	}

	const handleStartTime = (id, selectedTime) => {
		const updatedDates = selectedDates.map(date => {
			if (date.id === id) {
				return {
					...date,
					timeStart: selectedTime,
				}
			}
			return date
		})

		setSelectedDates(updatedDates)
	}

	const handleEndTime = (id, selectedTime) => {
		const updatedDates = selectedDates.map(date => {
			if (date.id === id) {
				return {
					...date,
					timeEnd: selectedTime,
				}
			}
			return date
		})
		setSelectedDates(updatedDates)
	}

	const handleSubmitVisit = () => {
		let errorMessage = false
		if (!selectedPatient) {
			errorMessage = 'Musisz wybrać pacjenta przed dodaniem wizyty'
		} else if (patientLocationInputValue === '') {
			errorMessage = 'Musisz wpisać lub wybrać lokalizacje przed dodaniem wizyty'
		}

		if (errorMessage) {
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: 'Błąd walidacji',
				textBody: errorMessage,
				button: 'OK',
				onPressButton: () => {
					Dialog.hide()
				},
			})
			return
		}

		if (VISIT_ID) {
			console.log(`----------------------`)
			console.log(`Visit ID: ${VISIT_ID}`)
			console.log(`Patient ID: ${selectedPatient.id}`)
			console.log(`Address: ${patientLocationInputValue}`)
			console.log(`Note: ${noteInputValue}`)
			console.log(`Date: ${selectedVisitDate}`)
			console.log(`Time_start: ${selectedVisitTimeStart}`)
			console.log(`Time_end: ${selectedVisitTimeEnd}`)

			updateVisit(
				VISIT_ID,
				selectedPatient.id,
				patientLocationInputValue,
				noteInputValue,
				selectedVisitDate,
				selectedVisitTimeStart,
				selectedVisitTimeEnd,
				result => {
					if (result.success) {
						Dialog.show({
							type: ALERT_TYPE.SUCCESS,
							title: 'Sukces',
							textBody: 'Wizyta została edytowana pomyślnie',
							button: 'OK',
							onPressButton: () => {
								Dialog.hide()
								goBack()
							},
						})
					} else {
						Dialog.show({
							type: ALERT_TYPE.DANGER,
							title: 'Coś poszło nie tak',
							textBody: result.message,
							button: 'OK',
							onPressButton: () => {
								Dialog.hide()
							},
						})
					}
				}
			)
		} else {
			if (selectedDates.length <= 0) return
			const datesWithTimestamps = selectedDates.map(date => ({
				...date,
				timeStart: date.timeStart.getTime(),
				timeEnd: date.timeEnd.getTime(),
			}))

			try {
				insertVisit(
					selectedPatient.id,
					patientLocationInputValue.id ? patientLocationInputValue.text : patientLocationInputValue,
					noteInputValue,
					datesWithTimestamps
				)
				Dialog.show({
					type: ALERT_TYPE.SUCCESS,
					title: 'Sukces',
					textBody: 'Wizyta została dodana pomyślnie',
					button: 'OK',
					onPressButton: () => {
						Dialog.hide()
						goBack()
					},
				})
			} catch (error) {
				Dialog.show({
					type: ALERT_TYPE.DANGER,
					title: 'Coś poszło nie tak',
					textBody: 'Niestety nie udało się dodać wizyty. Spróbuj ponownie za chwile',
					button: 'OK',
					onPressButton: () => {
						Dialog.hide()
					},
				})
			}
		}
	}

	const handleConfirmDatePicker = selectedDay => {
		setSelectedVisitDate(selectedDay.getTime())
		setIsDatePickerVisible(false)
	}

	const handleConfirmTimePicker = selectedTime => {
		const selectedDateTime = new Date(selectedVisitDate)
		selectedDateTime.setHours(selectedTime.getHours())
		selectedDateTime.setMinutes(selectedTime.getMinutes())
		if (isTimePickerVisible === 'start') {
			setSelectedVisitTimeStart(selectedDateTime.getTime())
		} else if (isTimePickerVisible === 'end') {
			setSelectedVisitTimeEnd(selectedDateTime.getTime())
		}
		setIsTimePickerVisible(false)
	}

	const handleRemoveDatetime = id => {
		const prevDates = selectedDates
		console.log(prevDates)
		setSelectedDates(prevDates.filter(date => date.id !== id))
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
						keyboardShouldPersistTaps='handled'
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
											{VISIT_ID ? 'Zarządzanie wizytą' : 'Dodaj wizytę'}
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
											<SelectOnly
												label='Pacjent'
												items={patientList}
												value={selectedPatient}
												renderItem={item => <>{item.full_name}</>}
												onChangeText={item => setSelectedPatient(item)}
											/>
										</View>
										<View style={{ marginTop: 20 }}>
											<SelectField
												label='Lokalizacja'
												items={selectedPatient.addresses}
												editable={selectedPatient ? true : false}
												value={
													patientLocationInputValue.id
														? patientLocationInputValue.text
														: patientLocationInputValue
												}
												renderItem={item => <>{item.text}</>}
												selectedValue={setPatientLocationInputValue}
												onChangeText={text => setPatientLocationInputValue(text)}
											/>
										</View>
										<View style={{ marginTop: 20 }}>
											<TextField
												label={'Notatka'}
												value={noteInputValue}
												onChangeText={text => setNoteInputValue(text)}
											/>
										</View>

										{!VISIT_ID ? (
											<>
												<View style={{ marginTop: 20 }}>
													<Calendar
														renderArrow={direction =>
															direction === 'left' ? (
																<FontAwesome name={'angle-left'} size={18} color={COLORS.main} />
															) : (
																<FontAwesome name={'angle-right'} size={18} color={COLORS.main} />
															)
														}
														minDate={new Date().toDateString()}
														onDayPress={day => {
															handleSelectDay(day)
														}}
														markedDates={selectedDates.reduce((acc, dateObj) => {
															const dateString = new Date(dateObj.date).toISOString().split('T')[0]

															acc[dateString] = {
																selected: true,
																selectedColor: COLORS.main,
															}
															return acc
														}, {})}
														theme={{
															backgroundColor: 'transparent',
															calendarBackground: 'transparent',
															textDayFontFamily: 'Poppins-Regular',
															monthTextColor: COLORS.main,
															textMonthFontFamily: 'Poppins-Bold',
															textDayHeaderFontFamily: 'Poppins-Regular',
														}}
													/>
												</View>

												<View style={{ marginTop: 20 }}>
													{selectedDates.map(el => (
														<DateComponent
															key={el.id}
															id={el.id}
															date={el.date}
															selectStartTime={handleStartTime}
															selectEndTime={handleEndTime}
															timeStart={el.timeStart}
															timeEnd={el.timeEnd}
															onRemove={handleRemoveDatetime}
														/>
													))}
												</View>
											</>
										) : (
											<>
												<View style={{ marginTop: 20 }}>
													<TouchableOpacity
														style={styles.visitDateContainer}
														onPress={() => setIsDatePickerVisible(true)}>
														<Text style={styles.visitDateContainerText}>
															{selectedVisitDate ? displayDateText(selectedVisitDate) : ''}
														</Text>
													</TouchableOpacity>
												</View>

												<View style={{ marginTop: 20 }}>
													<View style={styles.visitTimeContainer}>
														<TouchableOpacity onPress={() => setIsTimePickerVisible('start')}>
															<Text style={styles.visitTimeContainerTitle}>Od</Text>
															<Text style={styles.visitTimeContainerTime}>
																{selectedVisitTimeStart &&
																	`${('0' + new Date(selectedVisitTimeStart).getHours()).slice(
																		-2
																	)}:${('0' + new Date(selectedVisitTimeStart).getMinutes()).slice(
																		-2
																	)}`}
															</Text>
														</TouchableOpacity>
														<View>
															<FontAwesome
																name={'angle-right'}
																size={30}
																color={COLORS.main_text_dark_color}
															/>
														</View>
														<TouchableOpacity onPress={() => setIsTimePickerVisible('end')}>
															<Text style={styles.visitTimeContainerTitle}>Do</Text>
															<Text style={styles.visitTimeContainerTime}>
																{selectedVisitTimeEnd &&
																	`${('0' + new Date(selectedVisitTimeEnd).getHours()).slice(
																		-2
																	)}:${('0' + new Date(selectedVisitTimeEnd).getMinutes()).slice(
																		-2
																	)}`}
															</Text>
														</TouchableOpacity>
													</View>
												</View>

												<DateTimePickerModal
													isVisible={isDatePickerVisible ? true : false}
													mode='date'
													onConfirm={handleConfirmDatePicker}
													onCancel={() => setIsDatePickerVisible(false)}
												/>

												<DateTimePickerModal
													isVisible={isTimePickerVisible ? true : false}
													mode='time'
													onConfirm={handleConfirmTimePicker}
													onCancel={() => setIsTimePickerVisible(false)}
												/>
											</>
										)}
									</View>
								</View>

								<View style={{ justifyContent: 'flex-end' }}>
									<Button
										text={VISIT_ID ? 'Edytuj wizytę' : 'Dodaj wizytę'}
										onPress={handleSubmitVisit}
									/>

									{VISIT_ID && <Button text={'Usuń wizytę'} />}
								</View>
							</>
						) : (
							<>
								<LoadingScreen />
							</>
						)}
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	dateContainer: {
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.light_border_color,
		paddingVertical: 10,
	},
	dateIcon: {
		backgroundColor: COLORS.primary,
		borderRadius: 6,
		marginEnd: 10,
		minWidth: 30,
		minHeight: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	dateText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 14,
		flex: 1,
	},

	dateInputs: {
		marginTop: 10,
		flexDirection: 'row',
	},

	dateTimeButton: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: COLORS.light_border_color,
		borderRadius: 6,
		minHeight: 30,
		paddingHorizontal: 10,
	},

	dateTimeButtonText: {
		fontFamily: 'Poppins-Regular',
	},

	errorMessageText: {
		fontFamily: 'Poppins-SemiBold',
		color: COLORS.text_error_color,
		marginTop: 5,
		marginStart: 35,
		fontSize: 11,
	},

	visitDateContainer: {
		backgroundColor: COLORS.light_element_background,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 12,
		height: 70,
	},

	visitDateContainerText: {
		fontFamily: 'Poppins-Bold',
		color: COLORS.main,
		fontSize: 20,
	},

	visitTimeContainer: {
		backgroundColor: COLORS.light_element_background,
		borderRadius: 12,
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingHorizontal: 50,
		paddingTop: 10,
		alignItems: 'center',
	},

	visitTimeContainerTitle: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 18,
	},

	visitTimeContainerTime: {
		fontFamily: 'Poppins-Bold',
		color: COLORS.main,
		fontSize: 30,
		marginTop: -10,
	},
})
