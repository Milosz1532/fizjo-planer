import React, { useEffect, useRef, useState } from 'react'
import {
	Text,
	TextInput,
	StyleSheet,
	View,
	Animated,
	Easing,
	TouchableWithoutFeedback,
} from 'react-native'
import OutsidePressHandler from 'react-native-outside-press'

import { TextInputMask } from 'react-native-masked-text'

import { COLORS } from '../assets/colors'

const TextField = props => {
	const {
		label,
		value,
		style,
		onBlur,
		onFocus,
		onChangeText,
		contentType,
		editable,
		multiline,
		...restOfProps
	} = props
	const [isFocused, setIsFocused] = useState(false)

	const inputRef = useRef(null)
	const focusAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.timing(focusAnim, {
			toValue: isFocused || !!value ? 1 : 0,
			duration: 150,
			easing: Easing.bezier(0.4, 0, 0.2, 1),
			useNativeDriver: true,
		}).start()
	}, [focusAnim, isFocused, value])

	const handlePressOutside = () => {
		if (isFocused) inputRef.current.blur()
	}

	return (
		<OutsidePressHandler
			pointerEvents={editable === false ? 'none' : 'auto'}
			onOutsidePress={handlePressOutside}>
			<View style={style}>
				<TextInput
					ref={inputRef}
					style={[styles.input, isFocused && styles.inputFocus, multiline && { paddingTop: 20 }]}
					value={value}
					editable={editable ? editable : true}
					onChangeText={onChangeText}
					multiline={multiline}
					onBlur={event => {
						setIsFocused(false)
						onBlur?.(event)
					}}
					onFocus={event => {
						setIsFocused(true)
						onFocus?.(event)
					}}
					{...restOfProps}
				/>

				<TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
					<Animated.View
						style={[
							styles.labelContainer,
							{
								transform: [
									{
										scale: focusAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [1, 0.95],
										}),
									},
									{
										translateY: focusAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [14, -8],
										}),
									},
									{
										translateX: focusAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [10, 10],
										}),
									},
								],
							},
						]}>
						<Text style={[styles.label, isFocused && styles.labelFocus]}>{label}</Text>
					</Animated.View>
				</TouchableWithoutFeedback>
			</View>
		</OutsidePressHandler>
	)
}

const styles = StyleSheet.create({
	input: {
		padding: 13,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderRadius: 20,
		fontFamily: 'Poppins-Regular',
		fontSize: 14,
		borderColor: COLORS.border_color,
	},

	inputFocus: {
		borderWidth: 2,
		borderColor: COLORS.main,
	},
	labelContainer: {
		position: 'absolute',
		paddingHorizontal: 8,
		backgroundColor: COLORS.app_background,
	},
	label: {
		fontFamily: 'Poppins-Regular',
		fontSize: 14,
		color: COLORS.placeholder_color,
	},

	labelFocus: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 14,
		color: COLORS.main,
	},
})

export default TextField
