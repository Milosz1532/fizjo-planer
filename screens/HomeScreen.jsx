import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { COLORS } from '../assets/colors'
import { globalStyles } from '../assets/styles'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

const VisitCard = () => {
	return (
		<View style={styles.visitCard}>
			<View style={styles.visitCardIcon}>
				<FontAwesome name={'calendar-week'} size={24} color={COLORS.main_text_light_color} />
			</View>
			<View style={styles.visitCardContent}>
				<Text style={styles.visitCardContentLocation}>Basen miejski</Text>
				<Text style={styles.visitCardContentPatient}>Jan Kowalski</Text>
			</View>
			<View style={styles.visitCardTime}>
				<FontAwesome name={'clock'} size={18} color={COLORS.main_text_light_color} />
				<Text style={styles.visitCardTimeText}>12:00 - 14:00</Text>
			</View>
		</View>
	)
}

const UpcomingVisit = () => {
	return (
		<View style={styles.upcomingVisitCard}>
			<View style={styles.upcomingVisitCardIcon}></View>
			<View style={styles.upcomingVisitCardContent}>
				<View>
					<Text style={styles.upcomingVisitCardLocation}>Basen miejski</Text>
					<Text style={styles.upcomingVisitCardPatient}>Jan Kowalski</Text>
				</View>
				<View style={styles.upcomingVisitCardTime}>
					<FontAwesome name={'clock'} size={18} color={COLORS.tab_gray_element_color} />
					<Text style={styles.upcomingVisitCardTimeText}>12:00 - 14:00</Text>
				</View>
			</View>
		</View>
	)
}

export default function HomeScreen() {
	const weekCalendarDays = [
		{
			id: 1,
			day: 4,
			name: 'Pn',
		},
		{
			id: 2,
			day: 5,
			name: 'Wt',
		},
		{
			id: 3,
			day: 6,
			name: 'Śr',
		},
		{
			id: 4,
			day: 7,
			name: 'Czw',
		},
		{
			id: 5,
			day: 8,
			name: 'Pt',
		},
		{
			id: 6,
			day: 9,
			name: 'Sob',
		},
		{
			id: 7,
			day: 10,
			name: 'Nd',
		},
	]
	const [selectedWeekDay, setSelectedWeekDay] = useState(weekCalendarDays[0])

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<ScrollView style={globalStyles.screenContainer}>
					<View style={globalStyles.container}>
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
											<Text style={styles.dateBoxDay}>{d.day}</Text>
											<Text style={styles.dateBoxWeek}>{d.name}</Text>
										</TouchableOpacity>
									))}
								</View>
							</ScrollView>
						</View>

						<View style={{ marginTop: 20 }}>
							<Text style={globalStyles.containerTitle}>Zaplanowane wizyty</Text>
							<View>
								<VisitCard />
								<VisitCard />
								<VisitCard />
								<VisitCard />
							</View>
						</View>
						<View style={{ marginTop: 20 }}>
							<Text style={globalStyles.containerTitle}>Nadchodzące wizyty</Text>
							<View style={[globalStyles.cardBox, globalStyles.cardShadow]}>
								<Text style={styles.tabTitle}>6 grudnia 2023</Text>
								<UpcomingVisit />
								<UpcomingVisit />
								<UpcomingVisit />
							</View>
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
		color: COLORS.tab_gray_element_color,
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
		fontSize: 16,
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
})
