import React, { useState, useEffect, useCallback } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { useGlobalStyles } from '../assets/styles'
import { useGlobalColors } from '../assets/colors'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { fetchAllVisits } from '../services/Database'

import moment from 'moment'
import Timetable from 'react-native-calendar-timetable'

import ScheduleComponent from '../components/ScheduleComponent'

import LoadingScreen from '../components/LoadingScreen'

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

export default function CalendaScreen() {
	const { navigate } = useNavigation()

	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

	const [scheduleList, setScheduleList] = useState([])
	const [selectedDay, setSelectedDate] = useState(null)
	const [selectedDayVisits, setSelectedDateVisits] = useState(null)
	const [markedDates, setMarkedDates] = useState({})
	const [isLoading, setIsLoading] = useState(true)

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
			setIsLoading(false)
		})
	}

	useFocusEffect(
		useCallback(() => {
			setIsLoading(true)
			setSelectedDate(false)
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

			setSelectedDate(day)
			setSelectedDateVisits(formattedVisits)
		}
	}

	useEffect(() => {
		if (!selectedDay) return
		const updatedMarkedDates = {}
		Object.keys(markedDates).forEach(date => {
			updatedMarkedDates[date] = {
				...markedDates[date],
				selected: date === selectedDay.dateString,
				selectedColor: COLORS.element_color_3,
			}
		})

		setMarkedDates(updatedMarkedDates)
	}, [selectedDay])

	const [dateNow] = React.useState(new Date())

	const [from] = React.useState(moment().subtract(3, 'days').toDate())
	const [till] = React.useState(moment().add(3, 'days').toISOString())
	const range = { from, till }

	const groupColors = [
		COLORS.element_color_1,
		COLORS.element_color_2,
		COLORS.element_color_3,
		COLORS.element_color_4,
		COLORS.element_color_5,
	]

	const getColorByIndex = index => groupColors[index % groupColors.length]

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

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Kalendarz</Text>

						<View style={globalStyles.plusIconContainer}>
							<TouchableOpacity onPress={() => navigate('manageVisit', {})}>
								<FontAwesome name={'plus'} size={16} color={COLORS.main_text_light_color} />
							</TouchableOpacity>
						</View>
					</View>

					{!isLoading ? (
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
										dayTextColor: COLORS.main_text_dark_color,
										textMonthFontFamily: 'Poppins-Bold',
										textDayHeaderFontFamily: 'Poppins-Regular',
									}}
								/>
							</View>
							<View style={{ marginTop: 10, paddingStart: 5, marginBottom: 15 }}>
								{selectedDay ? (
									<>
										<Timetable
											items={selectedDayVisits}
											renderItem={props => <ScheduleComponent {...props} navigate={navigate} />}
											date={new Date(selectedDay.timestamp)}
											hourHeight={100}
											range={range}
											style={timetableStyles}
											hideNowLine={isToday(new Date(selectedDay.timestamp), dateNow) ? false : true}
										/>
									</>
								) : (
									<>
										<Timetable
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
