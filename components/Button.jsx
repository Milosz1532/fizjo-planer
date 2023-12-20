import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import { globalStyles } from '../assets/styles'

export default function Button({ onPress, text }) {
	return (
		<View style={globalStyles.buttonContainer}>
			<TouchableOpacity style={globalStyles.button} onPress={onPress}>
				<Text style={globalStyles.buttonText}>{text}</Text>
			</TouchableOpacity>
		</View>
	)
}
