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
import { fetchPatientList } from '../../services/Database'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'
import SelectOnly from '../../components/SelectOnly'
import Button from '../../components/Button'

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

const DateComponent = ({ id, date, timeStart, timeEnd }) => {
	const [timeStartInput, setTimeStartInput] = useState(new Date())
	const [timeEndInput, setTimeEndInput] = useState(new Date())

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

	const hideDatePicker = () => {
		setDatePickerVisibility(false)
	}

	const handleConfirm = selectedTime => {
		if (isDatePickerVisible === 'start') {
			setTimeStartInput(selectedTime)
		} else if (isDatePickerVisible === 'end') {
			setTimeEndInput(selectedTime)
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
				<TouchableOpacity style={styles.problemRemoveIcon}>
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
							<Text style={styles.dateTimeButtonText}>{`${('0' + timeStartInput.getHours()).slice(
								-2
							)}:${('0' + timeStartInput.getMinutes()).slice(-2)}`}</Text>
						</View>
					</TouchableOpacity>

					<View style={{ paddingHorizontal: 20 }}></View>
					<TouchableOpacity onPress={() => setDatePickerVisibility('end')}>
						<View style={styles.dateTimeButton}>
							<Text style={styles.dateTimeButtonText}>{`${('0' + timeEndInput.getHours()).slice(
								-2
							)}:${('0' + timeEndInput.getMinutes()).slice(-2)}`}</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			{timeStartInput.getTime() > timeEndInput.getTime() && (
				<View style={styles.errorMessage}>
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

export default function ManageVisit() {
	const { navigate, goBack } = useNavigation()

	const [patientList, setPatientList] = useState([])

	const fetchData = async () => {
		fetchPatientList(data => {
			const patientData = data.map(patient => ({
				id: patient.id,
				name: patient.full_name,
				date_of_birth: patient.date_of_birth,
			}))
			setPatientList(patientData)
		})
	}

	useFocusEffect(
		useCallback(() => {
			fetchData()
		}, [])
	)

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

	const patientLocationList = [
		{
			id: 1,
			name: 'Basen miejski we Włocławku',
		},
		{
			id: 2,
			name: 'ul. Bajeczna 14/3 Włocławek',
		},
		{
			id: 3,
			name: 'ul. Promienna 3/43 Włocławek',
		},
		{
			id: 4,
			name: 'Gabinet fizjoterapeutyczny',
		},
	]

	const [patientLocationInputValue, setPatientLocationInputValue] = useState('')
	const [selectedPatient, setSelectedPatient] = useState('')
	const [noteInputValue, setNoteInputValue] = useState('')

	const [selectedDates, setSelectedDates] = useState([])

	const handleSelectDay = day => {
		const isDateAlreadySelected = selectedDates.some(date => date.date === day.timestamp)

		if (!isDateAlreadySelected) {
			const newDay = {
				id: selectedDates.length > 0 ? selectedDates[selectedDates.length - 1].id + 1 : 1,
				date: day.timestamp,
				timeStart: 0,
				timeEnd: 0,
			}
			const updatedDates = [...selectedDates, newDay]
			setSelectedDates(updatedDates)
		} else {
			const selectedDate = selectedDates.filter(el => el.date !== day.timestamp)
			setSelectedDates(selectedDate)
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
						<View style={{ flex: 1, justifyContent: 'flex-start' }}>
							<View style={globalStyles.topHeader}>
								<Text style={globalStyles.topHeaderTextDark}>Dodaj wizytę</Text>
								<View style={globalStyles.backIconContainer}>
									<TouchableOpacity onPress={() => goBack()}>
										<FontAwesome name={'angle-left'} size={22} color={COLORS.light_icon_color} />
									</TouchableOpacity>
								</View>
							</View>

							<View style={[globalStyles.container, { marginTop: 20 }]}>
								<View>
									<SelectOnly
										label='Pacjent'
										items={patientList}
										value={selectedPatient}
										onChangeText={item => setSelectedPatient(item)}
									/>
								</View>
								<View style={{ marginTop: 20 }}>
									<SelectField
										label='Lokalizacja'
										items={patientLocationList}
										editable={selectedPatient ? true : false}
										value={
											patientLocationInputValue.id
												? patientLocationInputValue.name
												: patientLocationInputValue
										}
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
											timeStart={'8:00'}
											timeEnd={'10:00'}
										/>
									))}
								</View>
							</View>
						</View>

						<View style={{ justifyContent: 'flex-end' }}>
							<Button text={'Dodaj wizytę'} />
						</View>
					</ScrollView>
					{/* <LoadingScreen transparent={true} /> */}
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
})
