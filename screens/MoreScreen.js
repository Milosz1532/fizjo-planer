import React, { useState } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../assets/styles'
import { COLORS } from '../assets/colors'

import { SafeAreaView } from 'react-native-safe-area-context'

import { StatusBar } from 'expo-status-bar'

export default function MoreScreen() {
	return (
		<View style={{ flex: 1, backgroundColor: COLORS.main }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
				<View style={[globalStyles.screenContainer, { backgroundColor: COLORS.main }]}>
					<View style={globalStyles.topHeader}>
						<Text style={globalStyles.topHeaderText}>Więcej</Text>
					</View>

					<ScrollView style={globalStyles.roundedContainer}></ScrollView>
				</View>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({})
