import React, { useState, useMemo, useCallback, useRef } from 'react'
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	StyleSheet,
	Alert,
	Platform,
	Linking,
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
	fetchVisitsByDate,
	deleteVisit,
} from '../../services/Database'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { addMinutes, format } from 'date-fns'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'
import * as SMS from 'expo-sms'

import { useGlobalStyles } from '../../assets/styles'
import { useGlobalColors } from '../../assets/colors'

import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'
import SelectOnly from '../../components/SelectOnly'
import Button from '../../components/Button'
import LoadingScreen from '../../components/LoadingScreen'
import { useSettings } from '../../SettingsContext'

import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'

import SugestionsDetails from '../../components/ManageVisit/SugestionsDetails'

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
	dayNamesShort: ['Nd', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
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
	selectTime,
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

	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	const bottomSheetModalRef = useRef(null)

	const snapPoints = useMemo(() => ['25%', '50%'], [])

	const [details, setDetails] = useState(null)

	const handleSugestionClick = async (time_start, time_end) => {
		selectTime(id, time_start, time_end)
		bottomSheetModalRef.current?.close()
	}

	const handlePresentModalPress = useCallback(() => {
		fetchVisitsByDate(date, (visits, error) => {
			setDetails(visits)

			bottomSheetModalRef.current?.present()
		})
	}, [])

	const formattedStartTime = format(new Date(timeStart), 'HH:mm')
	const formattedEndTime = format(new Date(timeEnd), 'HH:mm')

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
					<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
						<TouchableOpacity onPress={() => setDatePickerVisibility('start')}>
							<View style={styles.dateTimeButton}>
								<Text style={styles.dateTimeButtonText}>{formattedStartTime}</Text>
							</View>
						</TouchableOpacity>
						<View style={{ paddingHorizontal: 10 }}>
							<FontAwesome name={'angle-right'} size={18} color={COLORS.main} />
						</View>
						<TouchableOpacity onPress={() => setDatePickerVisibility('end')}>
							<View style={styles.dateTimeButton}>
								<Text style={styles.dateTimeButtonText}>{formattedEndTime}</Text>
							</View>
						</TouchableOpacity>
					</View>

					<View>
						<TouchableOpacity style={styles.sugestionButton} onPress={handlePresentModalPress}>
							<Text style={styles.sugestionButtonText}>Sugestie</Text>
						</TouchableOpacity>
					</View>
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

			<SugestionsDetails
				bottomSheetModalRef={bottomSheetModalRef}
				snapPoints={snapPoints}
				styles={styles}
				details={details}
				handleSugestionClick={handleSugestionClick}
			/>
		</View>
	)
}

const ActionComponent = ({ icon, text, action }) => {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)
	const globalStyles = useGlobalStyles()

	return (
		<TouchableOpacity onPress={action} style={[globalStyles.cardBox, styles.actionContainer]}>
			<View style={[styles.actionIcon, { backgroundColor: icon.backgroundColor }]}>
				<FontAwesome name={icon.icon} size={15} color={COLORS.element_background} />
			</View>

			<Text style={styles.actionText}>{text}</Text>

			<View style={styles.actionRightIcon}>
				<FontAwesome name={'angle-right'} size={18} color={COLORS.light_border_color} />
			</View>
		</TouchableOpacity>
	)
}

export default function ManageVisit({ route }) {
	const { id } = route.params
	const { navigate, goBack } = useNavigation()
	const { settings } = useSettings()

	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()
	const styles = generateStyles(COLORS)

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
										setSelectedPatient(findPatient)

										setPatientLocationInputValue({
											id: visit.address_id,
											text: visit.address,
										})
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

		const VISIT_INTERVAL = 60

		console.log(day.timestamp)

		if (!isDateAlreadySelected) {
			let currentTime = new Date(day.timestamp)
			console.log(currentTime)
			currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30)

			const newDay = {
				id: selectedDates.length > 0 ? selectedDates[selectedDates.length - 1].id + 1 : 1,
				date: day.timestamp,
				timeStart: new Date(currentTime),
			}

			let endTime = addMinutes(new Date(newDay.timeStart), VISIT_INTERVAL)
			newDay.timeEnd = endTime

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

	const handleSelectTime = (id, selectedStartTime, selectedEndTime) => {
		const updatedDates = selectedDates.map(date => {
			if (date.id === id) {
				return {
					...date,
					timeStart: selectedStartTime,
					timeEnd: selectedEndTime,
				}
			}
			return date
		})
		setSelectedDates(updatedDates)
	}

	const handleSubmitVisit = () => {
		let errorMessage = false

		const datesWithTimestamps = selectedDates.map(date => ({
			...date,
			timeStart: date.timeStart.getTime(),
			timeEnd: date.timeEnd.getTime(),
		}))

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
			updateVisit(
				VISIT_ID,
				selectedPatient.id,
				patientLocationInputValue.id ? patientLocationInputValue.id : null,
				patientLocationInputValue.id ? null : patientLocationInputValue,
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
					patientLocationInputValue.id ? patientLocationInputValue.id : null,
					patientLocationInputValue.id ? null : patientLocationInputValue,
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
		setSelectedDates(prevDates.filter(date => date.id !== id))
	}

	const handleRemoveVisit = () => {
		if (!VISIT_ID || VISIT_ID === null) return

		Alert.alert(
			'Potwierdzenie',
			'Czy na pewno chcesz usunąć tą wizyte?',
			[
				{
					text: 'Anuluj',
					style: 'cancel',
				},
				{
					text: 'Potwierdź',
					onPress: () => {
						deleteVisit(VISIT_ID, (success, errorMessage) => {
							if (success) {
								Dialog.show({
									type: ALERT_TYPE.SUCCESS,
									title: 'Sukces',
									textBody: `Wizyta została pomyślnie usunięta`,
									button: 'OK',
									onPressButton: () => {
										Dialog.hide()
										goBack()
									},
								})
							} else {
								Dialog.show({
									type: ALERT_TYPE.DANGER,
									title: 'Wystąpił błąd',
									textBody: `Wystąpił błąd podczas usuwania wizyty. \n Symbol błędu: ${errorMessage}`,
									button: 'OK',
									onPressButton: () => {
										Dialog.hide()
									},
								})
							}
						})
					},
				},
			],
			{ cancelable: false }
		)
	}

	const handleSendReminder = async () => {
		const date = displayDateText(selectedVisitDate)
		const time_start = format(new Date(selectedVisitTimeStart), 'HH:mm')
		const time_end = format(new Date(selectedVisitTimeEnd), 'HH:mm')

		const phoneNumber = selectedPatient.phone_number
		const messageContent = `Witam serdecznie,\nPrzypominam o zaplanowanej wizycie fizjoterapeutycznej na dzień: ${date} w godzinach ${time_start} - ${time_end}. Bardzo proszę o informację, jeśli wizyta nie będzie mogła się odbyć.\nPozdrawiam, ${settings.user}.`

		await SMS.sendSMSAsync(phoneNumber, messageContent)
	}

	const handlePhoneCall = () => {
		if (Platform.OS === 'android') {
			Linking.openURL(`tel:${selectedPatient.phone_number}`)
			return
		}
		if (Platform.OS === 'ios') {
			Linking.openURL(`telprompt:${selectedPatient.phone_number}`)
			return
		}
	}

	const handleNavigateMaps = () => {
		const address = patientLocationInputValue.id
			? patientLocationInputValue.text
			: patientLocationInputValue
		const navigationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
			address
		)}`
		if (Linking.canOpenURL(navigationUrl)) {
			Linking.openURL(navigationUrl)
		} else {
			console.log('Nie można otworzyć URL-a')
		}
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
															dayTextColor: COLORS.main_text_dark_color,
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
															selectTime={handleSelectTime}
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

												<View style={{ marginTop: 20 }}>
													<Text style={[globalStyles.containerMediumText, { textAlign: 'center' }]}>
														Czynności
													</Text>
													<ActionComponent
														icon={{ icon: 'phone-alt', backgroundColor: COLORS.element_color_2 }}
														text={'Zadzwoń do pacjenta'}
														action={handlePhoneCall}
													/>
													<ActionComponent
														icon={{ icon: 'bell', backgroundColor: COLORS.element_color_3 }}
														text={'Wyślij przypomnienie'}
														action={handleSendReminder}
													/>
													<ActionComponent
														icon={{
															icon: 'location-arrow',
															backgroundColor: COLORS.element_color_1,
														}}
														text={'Nawigacja do adresu'}
														action={handleNavigateMaps}
													/>
													<ActionComponent
														icon={{ icon: 'user', backgroundColor: COLORS.element_color_4 }}
														text={'Dane pacjenta'}
														action={() => navigate('ManagePatient', { id: selectedPatient.id })}
													/>
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
													date={
														new Date(
															isTimePickerVisible === 'start'
																? selectedVisitTimeStart
																: selectedVisitTimeEnd
														)
													}
												/>
											</>
										)}
									</View>
								</View>

								<View style={{ justifyContent: 'flex-end', marginTop: 30 }}>
									<Button
										text={VISIT_ID ? 'Edytuj wizytę' : 'Dodaj wizytę'}
										onPress={handleSubmitVisit}
									/>

									{VISIT_ID && <Button text={'Usuń wizytę'} onPress={handleRemoveVisit} />}
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

const generateStyles = COLORS =>
	StyleSheet.create({
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
			color: COLORS.main_text_dark_color,
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
			color: COLORS.main_text_dark_color,
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
			paddingBottom: 6,
			alignItems: 'center',
		},

		visitTimeContainerTitle: {
			fontFamily: 'Poppins-SemiBold',
			fontSize: 18,
			color: COLORS.main_text_dark_color,
		},

		visitTimeContainerTime: {
			fontFamily: 'Poppins-Bold',
			color: COLORS.main,
			fontSize: 30,
			marginTop: -8,
		},

		actionContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: 15,
			borderRadius: 10,
		},

		actionIcon: {
			width: 30,
			height: 30,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'red',
			borderRadius: 6,
			marginEnd: 10,
		},

		actionText: {
			flex: 1,
			fontFamily: 'Poppins-SemiBold',
			fontSize: 17,
			color: COLORS.text_gray_color,
		},

		actionRightIcon: {
			marginEnd: 10,
		},

		sugestionButton: {
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			borderRadius: 10,
			backgroundColor: COLORS.element_color_2,
		},

		sugestionButtonText: {
			fontFamily: 'Poppins-Regular',
			fontSize: 13,
			color: COLORS.main_text_light_color,
			paddingHorizontal: 10,
			paddingVertical: 5,
		},
	})
