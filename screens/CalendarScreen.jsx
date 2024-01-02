import React, { useState, useCallback } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { globalStyles } from '../assets/styles'
import { COLORS } from '../assets/colors'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { fetchAllVisits } from '../services/Database'

import moment from 'moment'
import Timetable from 'react-native-calendar-timetable'

const ScheduleComponent = ({ style, item, dayIndex, daysTotal }) => {
	const startTime = new Date(item.time_start).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const endTime = new Date(item.time_end).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})

	return (
		<View style={[styles.scheduleComponent, { ...style, backgroundColor: item.color }]}>
			<View style={styles.scheduleComponentIcon}></View>

			<View style={styles.scheduleComponentContent}>
				<View style={styles.ScheduleCompscheduleComponentLeftContentonent}>
					<Text style={styles.scheduleComponentTitle}>
						{!item.custom_location ? item.address_text : item.custom_location}
					</Text>
					<Text style={styles.scheduleComponentPatient}>{item.patient_full_name}</Text>
				</View>
				<View style={styles.scheduleComponentTime}>
					<FontAwesome name={'clock'} size={18} color={COLORS.main_text_light_color} />
					<Text style={styles.scheduleComponentTimeText}>
						{startTime} - {endTime}
					</Text>
				</View>
			</View>
		</View>
	)
}

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

const groupColors = [
	COLORS.element_color_1,
	COLORS.element_color_2,
	COLORS.element_color_3,
	COLORS.element_color_4,
	COLORS.element_color_5,
]

const getColorByIndex = index => groupColors[index % groupColors.length]

export default function CalendaScreen() {
	const [scheduleList, setScheduleList] = useState([])
	const [selectedDay, setSelectedDate] = useState(null)
	const [selectedDayVisits, setSelectedDateVisits] = useState(null)
	const [markedDates, setMarkedDates] = useState({})

	const fetchData = async () => {
		fetchAllVisits(data => {
			setScheduleList(data)

			const updatedMarkedDates = {}
			data.forEach((item, index) => {
				const dateString = new Date(item.date).toISOString().split('T')[0]
				if (!updatedMarkedDates[dateString]) {
					updatedMarkedDates[dateString] = {
						marked: true,
						dotColor: getColorByIndex(index),
					}
				}
			})
			setMarkedDates(updatedMarkedDates)
		})
	}

	useFocusEffect(
		useCallback(() => {
			fetchData()
		}, [])
	)

	const isToday = (date1, date2) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		)
	}

	const handleDayPress = day => {
		const clickedDate = markedDates[day.dateString]
		if (clickedDate) {
			setSelectedDate(day)
			const selectedDateString = day.dateString
			const visitsForSelectedDay = scheduleList.filter(
				item => new Date(item.date).toISOString().split('T')[0] === selectedDateString
			)

			visitsForSelectedDay.sort((a, b) => a.time_start - b.time_start)

			const formattedVisits = visitsForSelectedDay.map((visit, index) => {
				const startTime = new Date(visit.time_start)
				const endTime = new Date(visit.time_end)
				const color = getColorByIndex(index)

				return {
					...visit,
					startDate: startTime,
					endDate: endTime,
					color,
				}
			})

			const updatedMarkedDates = {}
			Object.keys(markedDates).forEach(date => {
				updatedMarkedDates[date] = {
					...markedDates[date],
					selected: date === selectedDateString,
					selectedColor: COLORS.element_color_3,
				}
			})

			setMarkedDates(updatedMarkedDates)

			console.log(formattedVisits)
			setSelectedDateVisits(formattedVisits)
		}
	}

	const [dateNow] = React.useState(new Date())

	const [from] = React.useState(moment().subtract(3, 'days').toDate())
	const [till] = React.useState(moment().add(3, 'days').toISOString())
	const range = { from, till }

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Kalendarz</Text>

						<View style={globalStyles.plusIconContainer}>
							<FontAwesome name={'plus'} size={16} color={COLORS.main_text_light_color} />
						</View>
					</View>

					<ScrollView style={[globalStyles.roundedContainer, { paddingHorizontal: 0 }]}>
						<View>
							<Calendar
								renderArrow={direction =>
									direction === 'left' ? (
										<FontAwesome name={'angle-left'} size={18} color={COLORS.main} />
									) : (
										<FontAwesome name={'angle-right'} size={18} color={COLORS.main} />
									)
								}
								onDayPress={handleDayPress}
								markedDates={markedDates}
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
						<View style={{ marginTop: 10, paddingStart: 5, marginBottom: 15 }}>
							{selectedDay && (
								<>
									<Timetable
										items={selectedDayVisits}
										renderItem={props => <ScheduleComponent {...props} />}
										date={new Date(selectedDay.timestamp)}
										hourHeight={100}
										range={range}
										style={timetableStyles}
										hideNowLine={isToday(new Date(selectedDay.timestamp), dateNow) ? false : true}
									/>
								</>
							)}
						</View>
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}

const timetableStyles = StyleSheet.create({
	timeContainer: {
		backgroundColor: COLORS.app_background,
	},
	time: {
		fontFamily: 'Poppins-Regular',
		fontSize: 16,
		color: COLORS.text_gray_color,
	},

	lines: {
		borderColor: COLORS.line_color,
		borderStartWidth: 0,
	},
	nowLine: {
		dot: {
			backgroundColor: COLORS.primary,
		},
		line: {
			backgroundColor: COLORS.primary,
		},
	},
})

const styles = StyleSheet.create({
	calendarScheduleHours: {
		fontFamily: 'Poppins-SemiBold',
		color: COLORS.header_text_gray_color,
		fontSize: 20,
	},

	calendarScheduleElements: {
		marginLeft: 10,

		justifyContent: 'space-between',
	},

	scheduleComponent: {
		backgroundColor: COLORS.main,
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderRadius: 6,
		flexDirection: 'row',
	},

	scheduleComponentIcon: {
		width: 4,
		backgroundColor: COLORS.element_background,
		height: '100%',
		marginEnd: 8,
		borderRadius: 6,
	},

	scheduleComponentContent: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	ScheduleCompscheduleComponentLeftContentonent: {
		flex: 3,
	},

	scheduleComponentTitle: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-SemiBold',
		fontSize: 16,
	},

	scheduleComponentPatient: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-Regular',
	},

	scheduleComponentTime: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 2,
	},

	scheduleComponentTimeText: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-Regular',
		marginLeft: 10,
	},
})
