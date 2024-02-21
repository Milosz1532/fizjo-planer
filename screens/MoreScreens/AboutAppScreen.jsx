import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { useGlobalStyles } from '../../assets/styles'
import { useGlobalColors } from '../../assets/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'

export default function AboutAppScreen() {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()

	const styles = generateStyles(COLORS)
	const { navigate, goBack } = useNavigation()

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>O aplikacji</Text>
					</View>

					<ScrollView
						style={[globalStyles.roundedContainer]}
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'space-between',
							flexDirection: 'column',
						}}>
						<View>
							<Text style={styles.titleText}>FIZJO PLANER</Text>
							<Text style={styles.content}>
								Fizjo-Planer to kompleksowa aplikacja stworzona specjalnie dla fizjoterapeutów,
								umożliwiająca sprawną organizację pracy oraz skuteczne zarządzanie pacjentami i
								wizytami. Dzięki Fizjo-Planerowi, fizjoterapeuci mogą łatwo dodawać nowych pacjentów
								do systemu, wraz z ich danymi kontaktowymi, problemami zdrowotnymi oraz adresami.
								Aplikacja zapewnia także możliwość tworzenia spersonalizowanych profili pacjentów,
								ułatwiających śledzenie historii chorób oraz postępów terapeutycznych.
							</Text>
							<Text style={styles.content}>Autor: Miłosz Konopka</Text>
						</View>
						<Button text={'Powrót'} onPress={() => goBack()} />
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
	})
