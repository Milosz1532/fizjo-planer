import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

import { COLORS } from '../assets/colors'

export default function LoadingScreen({ transparent }) {
	return (
		<View style={[styles.loadingContainer, transparent && styles.loadingTransparent]}>
			<ActivityIndicator size={'large'} color={COLORS.main} />
		</View>
	)
}

const styles = StyleSheet.create({
	loadingContainer: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255, 1)',
	},

	loadingTransparent: {
		backgroundColor: 'rgba(255,255,255, 0.8)',
	},
})
