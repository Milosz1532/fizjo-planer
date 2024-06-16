import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { useGlobalStyles } from '../../assets/styles'
import { useGlobalColors } from '../../assets/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

import TextField from '../../components/TextField'
import { useSettings } from '../../SettingsContext'

export default function ChangePersonalDateScreen() {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

	const { settings, updateSetting } = useSettings()

	const styles = generateStyles(COLORS)
	const { navigate, goBack } = useNavigation()

	const [fullName, setFullName] = useState(settings.user)

	const handleSubmitData = async () => {
		if (fullName.trim().length === 0) return

		updateSetting('user', fullName)

		Dialog.show({
			type: ALERT_TYPE.SUCCESS,
			title: 'Sukces',
			textBody: `Twoje dane zostały zmodyfikowane.`,
			button: 'OK',
			onPressButton: () => {
				Dialog.hide()
				goBack()
			},
			closeOnOverlayTap: false,
		})
	}

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Zmiana danych</Text>
					</View>

					<ScrollView
						style={[globalStyles.roundedContainer]}
						keyboardShouldPersistTaps='handled'
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'space-between',
							flexDirection: 'column',
						}}>
						<View style={{ marginTop: 20 }}>
							<Text style={styles.text}>W tym miejscu możesz zmodyfikować swoje dane osobowe.</Text>
							<TextField
								value={fullName}
								label='Imię i Nazwisko'
								maxLength={20}
								onChangeText={text => setFullName(text)}
							/>
						</View>
						<Button text={'Zatwierdź zmiany'} onPress={() => handleSubmitData()} />
					</ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		titleText: {
			color: COLORS.main_text_dark_color,
			fontFamily: 'Poppins-SemiBold',
			textAlign: 'center',
			marginTop: 15,
			fontSize: 18,
		},

		content: {
			color: COLORS.main_text_dark_color,
			fontFamily: 'Poppins-Regular',
			marginTop: 10,
			textAlign: 'center',
		},

		text: {
			fontFamily: 'Poppins-Regular',
			marginBottom: 15,
			textAlign: 'center',
		},
	})
