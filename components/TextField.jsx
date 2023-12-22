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
		maxLength,
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

	return (
		<View style={style}>
			{contentType === 'datetime' ? (
				<TextInputMask
					ref={inputRef}
					style={[styles.input, isFocused && styles.inputFocus]}
					value={value}
					onChangeText={onChangeText}
					type='datetime'
					maxLength={10}
					options={{
						format: 'DD.MM.YYYY',
					}}
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
			) : (
				<TextInput
					ref={inputRef}
					style={[styles.input, isFocused && styles.inputFocus]}
					value={value}
					onChangeText={onChangeText}
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
			)}

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
										outputRange: [16, -8],
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
