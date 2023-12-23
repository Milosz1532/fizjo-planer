import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'
import Button from '../../components/Button'

export default function ManageVisit() {
	const { navigate, goBack } = useNavigation()

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1 }}>
					<ScrollView
						style={[globalStyles.screenContainer]}
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
									<SelectField label='Pacjent' />
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
