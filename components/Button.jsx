import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import { useGlobalStyles } from '../assets/styles'

export default function Button({ onPress, text, style }) {
	const globalStyles = useGlobalStyles()
	return (
		<View style={globalStyles.buttonContainer}>
			<TouchableOpacity style={[globalStyles.button, style]} onPress={onPress}>
				<Text style={globalStyles.buttonText}>{text}</Text>
			</TouchableOpacity>
		</View>
	)
}
