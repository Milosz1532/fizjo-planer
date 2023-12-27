import React, { useState } from 'react'
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
	TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'
import SelectOnly from '../../components/SelectOnly'
import Button from '../../components/Button'

export default function ManageVisit() {
	const { navigate, goBack } = useNavigation()

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

	const patientList = [
		{
			id: 1,
			name: 'Jan Kowalski (Wiek 21 lat)',
		},
		{
			id: 2,
			name: 'Miłosz Konopka (Wiek 22 lat)',
		},
		{
			id: 3,
			name: 'Adam Małysz (Wiek 39 lat)',
		},
		{
			id: 4,
			name: 'Janusz Tracz (Wiek 43 lat)',
		},
	]

	const [patientLocationInputValue, setPatientLocationInputValue] = useState('')
	const [selectedPatient, setSelectedPatient] = useState('')
	const [noteInputValue, setNoteInputValue] = useState('')

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
