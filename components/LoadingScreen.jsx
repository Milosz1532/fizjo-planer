import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

import { useGlobalColors } from '../assets/colors'

export default function LoadingScreen({ transparent, onContent }) {
	const COLORS = useGlobalColors()
	return (
		<View
			style={[
				styles.loadingContainer,
				transparent && styles.loadingTransparent,
				onContent && styles.onContent,
			]}>
			<ActivityIndicator size={'large'} color={COLORS.main} />
		</View>
	)
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	loadingTransparent: {
		backgroundColor: 'rgba(255,255,255, 0.8)',
	},

	onContent: {
		backgroundColor: 'rgba(255,255,255, 1)',
		...StyleSheet.absoluteFillObject,
	},
})
