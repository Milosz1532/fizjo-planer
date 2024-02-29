// SugestionsDetails.js
import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'

import SugestionVisit from './SugestionVisit'
import ScheduledVisit from './ScheduledVisit'

import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useGlobalColors } from '../../assets/colors'

import { startOfDay, endOfDay, addMinutes } from 'date-fns'

const generateSuggestions = visits => {
	if (visits === null) return []
	const sortedVisits = visits.sort((a, b) => a.time_start - b.time_start)

	const suggestions = []

	const MINIMUM_GAP = 30 * 60 * 1000 // 30 minut w milisekundach
	const VISIT_INTERVAL = 60 // 60 minut

	for (let i = 0; i < sortedVisits.length - 1; i++) {
		const currentVisitEnd = sortedVisits[i].time_end
		const nextVisitStart = sortedVisits[i + 1].time_start
		const timeDifference = nextVisitStart - currentVisitEnd

		if (timeDifference >= MINIMUM_GAP) {
			suggestions.push({
				start: currentVisitEnd,
				end: nextVisitStart,
			})
		}
	}

	if (sortedVisits.length > 0) {
		const firstVisit = sortedVisits[0]
		const startOfDayTimestamp = addMinutes(firstVisit.time_start, -VISIT_INTERVAL)
		if (startOfDayTimestamp >= startOfDay(firstVisit.time_start).getTime()) {
			suggestions.unshift({
				start: startOfDayTimestamp,
				end: firstVisit.time_start,
			})
		}
	} else {
		const startOfDayTimestamp = startOfDay(new Date()).getTime()
		const endOfDayTimestamp = endOfDay(new Date()).getTime()
		suggestions.push({
			start: startOfDayTimestamp,
			end: endOfDayTimestamp,
		})
	}

	if (sortedVisits.length > 0) {
		const lastVisit = sortedVisits[sortedVisits.length - 1]
		const endOfDayTimestamp = addMinutes(lastVisit.time_end, VISIT_INTERVAL)
		if (lastVisit.time_end < endOfDayTimestamp) {
			suggestions.push({
				start: lastVisit.time_end,
				end: endOfDayTimestamp,
			})
		}
	}

	return suggestions
}

export default function SugestionsDetails({
	bottomSheetModalRef,
	snapPoints,
	details,
	handleSugestionClick,
}) {
	const COLORS = useGlobalColors()

	const styles = generateStyles(COLORS)

	const sugestions = generateSuggestions(details)

	return (
		<View style={{ flex: 1 }}>
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={snapPoints}
				backdropComponent={props => (
					<BottomSheetBackdrop {...props} onPress={() => bottomSheetModalRef.current?.close()} />
				)}>
				<BottomSheetScrollView contentContainerStyle={styles.BottomSheetContainer}>
					<Text style={styles.BottomContainerTitle}>Zaplanowane wizyty</Text>

					<View>
						{details &&
							details.length > 0 &&
							details.map(visit => {
								return (
									<ScheduledVisit
										key={visit.id}
										patient_name={visit.patient_name}
										address={visit.address}
										time_start={visit.time_start}
										time_end={visit.time_end}
									/>
								)
							})}
					</View>

					<Text style={[styles.BottomContainerTitle, { marginTop: 20 }]}>Sugerowane godziny</Text>
					<View style={{ marginBottom: 50 }}>
						{sugestions.length > 0 &&
							sugestions.map((sugestion, index) => {
								return (
									<SugestionVisit
										key={index}
										time_start={sugestion.start}
										time_end={sugestion.end}
										handleSugestionClick={handleSugestionClick}
									/>
								)
							})}
					</View>
				</BottomSheetScrollView>
			</BottomSheetModal>
		</View>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		BottomSheetContainer: {
			padding: 20,
		},

		BottomContainerTitle: {
			fontFamily: 'Poppins-SemiBold',
			fontSize: 15,
			color: COLORS.main_text_dark_color,
		},
	})
