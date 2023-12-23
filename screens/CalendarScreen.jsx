import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../assets/styles'
import { COLORS } from '../assets/colors'

import CustomStatusBar from '../components/CustomStatusBar'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

const ScheduleComponent = ({ item, color }) => {
	return (
		<View style={[styles.scheduleComponent, { backgroundColor: color }]}>
			<View style={styles.scheduleComponentIcon}></View>

			<View style={styles.scheduleComponentContent}>
				<View>
					<Text style={styles.scheduleComponentTitle}>Basen miejski</Text>
					<Text style={styles.scheduleComponentPatient}>Jaś Kowalski</Text>
				</View>
				<View style={styles.scheduleComponentTime}>
					<FontAwesome name={'clock'} size={18} color={COLORS.main_text_light_color} />
					<Text style={styles.scheduleComponentTimeText}>12:00 - 14:00</Text>
				</View>
			</View>
		</View>
	)
}

export default function CalendaScreen() {
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

	const schedule = [
		{
			id: 1,
			date: new Date(2023, 11, 7),
			time_start: '8:00',
			time_end: '8:30',
		},
		{
			id: 2,
			date: new Date(2023, 11, 7),
			time_start: '8:30',
			time_end: '9:00',
		},
		{
			id: 3,
			date: new Date(2023, 11, 7),
			time_start: '9:00',
			time_end: '10:00',
		},
		{
			id: 4,
			date: new Date(2023, 11, 7),
			time_start: '10:00',
			time_end: '11:00',
		},
		{
			id: 5,
			date: new Date(2023, 11, 8),
			time_start: '13:00',
			time_end: '14:00',
		},
		{
			id: 6,
			date: new Date(2023, 11, 7),
			time_start: '14:00',
			time_end: '17:00',
		},
	]

	const [scheduleList, setScheduleList] = useState(schedule)

	const markedDates = {}
	schedule.forEach(item => {
		const dateString = item.date.toISOString().split('T')[0]
		if (!markedDates[dateString]) {
			markedDates[dateString] = { marked: true }
		}
	})

	const groupColors = [
		COLORS.element_color_1,
		COLORS.element_color_2,
		COLORS.element_color_3,
		COLORS.element_color_4,
		COLORS.element_color_5,
	]

	const getColorForGroup = groupId => {
		const index = (groupId - 1) % groupColors.length
		return groupColors[index]
	}

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

					<ScrollView style={globalStyles.roundedContainer}>
						<View>
							<Calendar
								markedDates={markedDates}
								theme={{
									backgroundColor: 'transparent',
									calendarBackground: 'transparent',
									textDayFontFamily: 'Poppins-Regular',
									textMonthFontFamily: 'Poppins-Regular',
									textDayHeaderFontFamily: 'Poppins-Regular',
								}}
							/>
						</View>
						<View style={{ marginTop: 10 }}>
							{scheduleList.map((item, index, array) => (
								<View key={index}>
									{index === 0 || item.time_start !== array[index - 1].time_start ? (
										item.time_start.endsWith(':00') ? (
											<Text style={[styles.calendarScheduleHours, { marginTop: 10 }]}>
												{item.time_start}
											</Text>
										) : null
									) : null}

									<View style={styles.calendarScheduleElements}>
										<ScheduleComponent item={item} color={getColorForGroup(item.id)} />
									</View>

									{index === array.length - 1 || item.time_end !== array[index + 1].time_start ? (
										item.time_end.endsWith(':00') ? (
											<Text style={styles.calendarScheduleHours}>{item.time_end}</Text>
										) : null
									) : null}
								</View>
							))}
						</View>
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	calendarScheduleHours: {
		fontFamily: 'Poppins-SemiBold',
		color: COLORS.header_text_gray_color,
		fontSize: 20,
	},

	calendarScheduleElements: {
		marginLeft: 10,
		paddingHorizontal: 10,
		borderLeftWidth: 2,
		borderStyle: 'dotted',
		borderColor: COLORS.header_text_gray_color,

		justifyContent: 'space-between',
	},

	scheduleComponent: {
		backgroundColor: COLORS.main,
		marginVertical: 10,
		paddingHorizontal: 10,
		paddingVertical: 20,
		borderRadius: 6,

		flexDirection: 'row',
		alignItems: 'center',
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
	},

	scheduleComponentTimeText: {
		color: COLORS.main_text_light_color,
		fontFamily: 'Poppins-Regular',
		marginLeft: 10,
	},
})
