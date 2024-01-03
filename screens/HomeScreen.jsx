import React, { useState, useCallback, useEffect } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { startOfWeek, addDays, format, isToday } from 'date-fns'
import plLocale from 'date-fns/locale/pl'

import { COLORS } from '../assets/colors'
import { globalStyles } from '../assets/styles'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

import { fetchAllVisitsThisWeek, fetchUpcomingVisits } from '../services/Database'

const VisitCard = ({ meeting }) => {
	const startTime = new Date(meeting.time_start).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const endTime = new Date(meeting.time_end).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	return (
		<View style={styles.visitCard}>
			<View style={styles.visitCardIcon}>
				<FontAwesome name={'calendar-week'} size={24} color={COLORS.main_text_light_color} />
			</View>
			<View style={styles.visitCardContent}>
				<Text style={styles.visitCardContentLocation}>{meeting.address}</Text>
				<Text style={styles.visitCardContentPatient}>{meeting.patient_full_name}</Text>
			</View>
			<View style={styles.visitCardTime}>
				<FontAwesome name={'clock'} size={18} color={COLORS.main_text_light_color} />
				<Text style={styles.visitCardTimeText}>
					{startTime} - {endTime}
				</Text>
			</View>
		</View>
	)
}

const UpcomingVisit = ({ meeting, color }) => {
	const startTime = new Date(meeting.time_start).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const endTime = new Date(meeting.time_end).toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})

	return (
		<View style={styles.upcomingVisitCard}>
			<View style={[styles.upcomingVisitCardIcon, { backgroundColor: color }]}></View>
			<View style={styles.upcomingVisitCardContent}>
				<View style={styles.upcommingLeftContent}>
					<Text style={styles.upcomingVisitCardLocation}>{meeting.address}</Text>
					<Text style={styles.upcomingVisitCardPatient}>{meeting.patient_full_name}</Text>
				</View>
				<View style={styles.upcomingVisitCardTime}>
					<FontAwesome name={'clock'} size={18} color={COLORS.tab_gray_element_color} />
					<Text style={styles.upcomingVisitCardTimeText}>
						{startTime} - {endTime}
					</Text>
				</View>
			</View>
		</View>
	)
}

const getCurrentWeekArray = () => {
	const today = new Date()
	const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1, locale: plLocale })

	const polishDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz']

	const weekArray = Array.from({ length: 7 }, (_, index) => {
		const day = addDays(startOfCurrentWeek, index)
		return {
			id: index,
			date: format(day, 'yyyy-MM-dd', { locale: plLocale }),
			day: format(day, 'd', { locale: plLocale }),
			name: polishDays[index],
			isToday: isToday(day),
		}
	})

	return weekArray
}

const NoMeetings = ({ text }) => (
	<View style={[globalStyles.cardBox, globalStyles.cardShadow]}>
		<View style={styles.noMeetingsContainer}>
			<View style={styles.noMeetingsIcon}>
				<FontAwesome name={'calendar-times'} size={25} color={COLORS.main_text_light_color} />
			</View>

			<Text style={[styles.tabTitle, { textAlign: 'center' }]}>{text}</Text>
		</View>
	</View>
)

export default function HomeScreen() {
	const [weekCalendarDays, setWeekCalendarDays] = useState([])
	const [selectedWeekDay, setSelectedWeekDay] = useState(weekCalendarDays[0])
	const [selectedDayMeetings, setSelectedDayMeetings] = useState([])
	const [allMeetings, setAllMeetings] = useState([])
	const [upcommingMeetings, setUpcommingMeetings] = useState({})

	const fetchData = async () => {
		fetchAllVisitsThisWeek(data => {
			const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date))

			setAllMeetings(sortedData)
		})
		fetchUpcomingVisits(data => {
			const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date))

			const groupedData = {}

			sortedData.forEach(meeting => {
				const dateKey = meeting.date

				if (!groupedData[dateKey]) {
					groupedData[dateKey] = []
				}

				groupedData[dateKey].push(meeting)
			})

			setUpcommingMeetings(groupedData)
		})
	}

	useFocusEffect(
		useCallback(() => {
			fetchData()
			const data = getCurrentWeekArray()
			setWeekCalendarDays(data)
			const todayIndex = data.findIndex(day => day.isToday)
			if (todayIndex !== -1) {
				setSelectedWeekDay(data[todayIndex])
			} else {
				setSelectedWeekDay(data[0])
			}
		}, [])
	)

	const groupColors = [
		COLORS.element_color_1,
		COLORS.element_color_2,
		COLORS.element_color_3,
		COLORS.element_color_4,
		COLORS.element_color_5,
	]

	const getColorByIndex = index => groupColors[index % groupColors.length]

	const formatDate = date => {
		const options = { day: 'numeric', month: 'long', year: 'numeric' }
		return new Date(date).toLocaleDateString('pl-PL', options)
	}

	useEffect(() => {
		if (!selectedWeekDay) return

		const dayMeetings = allMeetings.filter(meeting => meeting.date === selectedWeekDay.date)
		setSelectedDayMeetings(dayMeetings)
	}, [selectedWeekDay])

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<ScrollView style={globalStyles.screenContainer}>
					<View style={[globalStyles.container, { marginTop: 10 }]}>
						<View style={styles.titleText}>
							<Text style={globalStyles.containerTitle}>Witaj Tamara </Text>
							<TouchableOpacity>
								<View style={styles.notificationsBox}>
									<FontAwesome name={'bell'} size={18} color={COLORS.icon_color} />
								</View>
							</TouchableOpacity>
						</View>

						<View style={{ marginTop: 20 }}>
							<Text style={globalStyles.containerTitle}>Aktualny tydzień</Text>
							<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
								<View style={styles.weekCalendar}>
									{weekCalendarDays.map(d => (
										<TouchableOpacity
											key={d.id}
											style={[
												styles.dateBox,
												selectedWeekDay && selectedWeekDay.id === d.id && styles.selectedDateBox,
											]}
											onPress={() => setSelectedWeekDay(d)}>
											<Text
												style={[
													styles.dateBoxDay,
													selectedWeekDay &&
														selectedWeekDay.id === d.id &&
														styles.selectedDateBoxDay,
												]}>
												{d.day}
											</Text>
											<Text
												style={[
													styles.dateBoxWeek,
													selectedWeekDay &&
														selectedWeekDay.id === d.id &&
														styles.selectedDateBoxWeek,
												]}>
												{d.name}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</ScrollView>
						</View>

						<View style={{ marginTop: 20 }}>
							<Text style={globalStyles.containerTitle}>Zaplanowane wizyty</Text>
							<View>
								{selectedWeekDay && selectedDayMeetings.length > 0 ? (
									<>
										{selectedDayMeetings.map(meeting => (
											<VisitCard key={meeting.id} meeting={meeting} />
										))}
									</>
								) : (
									<View style={{ marginTop: 10 }}>
										<NoMeetings text={'Na wybrany dzień nie ma żadnych wizyt'} />
									</View>
								)}
							</View>
						</View>
						<View style={{ marginTop: 20 }}>
							<Text style={globalStyles.containerTitle}>Nadchodzące wizyty</Text>

							{Object.keys(upcommingMeetings) && Object.keys(upcommingMeetings).length > 0 ? (
								<View style={[globalStyles.cardBox, globalStyles.cardShadow]}>
									{Object.keys(upcommingMeetings).map((date, index) => (
										<View key={index}>
											<Text style={styles.tabTitle}>{formatDate(date)}</Text>
											{upcommingMeetings[date].map((meeting, _index) => (
												<UpcomingVisit
													key={meeting.id}
													meeting={meeting}
													color={getColorByIndex(index)}
												/>
											))}
										</View>
									))}
								</View>
							) : (
								<View style={{ marginTop: 10 }}>
									<NoMeetings text={'Nie masz jeszcze żadnych wizyt'} />
								</View>
							)}
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	titleText: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		color: COLORS.main_text_dark_color,
	},
	notificationsBox: {
		backgroundColor: COLORS.element_background,
		padding: 5,
		borderRadius: 6,
	},

	weekCalendar: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5,
	},

	dateBox: {
		backgroundColor: COLORS.element_background,
		minWidth: 60,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 6,
		marginEnd: 10,
	},

	dateBoxDay: {
		color: COLORS.main_text_dark_color,
		fontFamily: 'Poppins-Bold',
		fontSize: 20,
	},

	selectedDateBox: {
		borderColor: COLORS.main,
		borderTopWidth: 7,
		borderBottomWidth: 7,
	},

	selectedDateBoxDay: {
		color: COLORS.main,
	},

	selectedDateBoxWeek: {
		color: COLORS.main,
	},

	dateBoxWeek: {
		color: COLORS.text_gray_color,
		fontFamily: 'Poppins-Regular',
		fontSize: 12,
	},

	visitCard: {
		backgroundColor: COLORS.main,
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderRadius: 6,
		marginTop: 10,
	},

	visitCardIcon: {
		backgroundColor: COLORS.primary,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 6,
		width: 50,
		height: 50,
		marginEnd: 5,
	},

	visitCardContent: {
		flex: 3,
	},

	visitCardContentLocation: {
		fontFamily: 'Poppins-Bold',
		color: COLORS.main_text_light_color,
		fontSize: 15,
	},

	visitCardContentPatient: {
		fontFamily: 'Poppins-Regular',
		marginTop: -4,
		color: COLORS.main_text_light_color,
	},

	visitCardTime: {
		flex: 2,
		flexDirection: 'row',
	},

	visitCardTimeText: {
		fontFamily: 'Poppins-Regular',
		marginStart: 10,
		color: COLORS.main_text_light_color,
	},

	tabTitle: {
		fontFamily: 'Poppins-SemiBold',
		color: COLORS.header_text_gray_color,
		fontSize: 18,
		marginTop: 5,
	},

	upcomingVisitCard: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 10,
	},

	upcomingVisitCardIcon: {
		width: 5,
		backgroundColor: COLORS.element_color_1,
		marginEnd: 10,
		borderRadius: 6,
	},

	upcomingVisitCardContent: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	upcommingLeftContent: {
		flex: 3,
		paddingEnd: 5,
	},

	upcomingVisitCardTime: {
		flexDirection: 'row',
	},

	upcomingVisitCardTimeText: {
		marginStart: 5,
		fontFamily: 'Poppins-Regular',
	},

	upcomingVisitCardLocation: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 16,
	},

	upcomingVisitCardPatient: {
		fontFamily: 'Poppins-Regular',
		marginTop: -4,
		color: COLORS.tab_gray_element_color,
	},

	noMeetingsContainer: {
		alignItems: 'center',
		paddingVertical: 10,
	},

	noMeetingsIcon: {
		backgroundColor: COLORS.primary,
		padding: 15,
		borderRadius: 6,
	},
})
