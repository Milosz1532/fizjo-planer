import React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

export default function ManagePatient() {
	const { navigate, goBack } = useNavigation()

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
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}
