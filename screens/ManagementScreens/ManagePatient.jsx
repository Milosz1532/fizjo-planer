import React, { useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

import TextField from '../../components/TextField'

export default function ManagePatient() {
	const { goBack } = useNavigation()
	const [fullName, setFullName] = useState('')
	const [age, setAge] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<ScrollView style={globalStyles.screenContainer}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderTextDark}>Dodaj pacjenta</Text>
						<View style={globalStyles.backIconContainer}>
							<TouchableOpacity onPress={() => goBack()}>
								<FontAwesome name={'angle-left'} size={20} color={COLORS.light_icon_color} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={[globalStyles.container, { marginTop: 20 }]}>
						<View>
							<TextField
								value={fullName}
								label='Imię i Nazwisko'
								maxLength={20}
								onChangeText={text => setFullName(text)}
							/>
						</View>
						<View style={{ marginTop: 20 }}>
							<TextField
								keyboardType='numeric'
								value={age}
								maxLength={4}
								label='Rok urodzenia'
								onChangeText={text => setAge(text)}
							/>
						</View>
						<View style={{ marginTop: 20 }}>
							<TextField
								keyboardType='numeric'
								value={phoneNumber}
								maxLength={10}
								label='Numer telefonu'
								onChangeText={text => setPhoneNumber(text)}
							/>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}
