import React, { useEffect, useRef, useState } from 'react'
import {
	Text,
	TextInput,
	StyleSheet,
	View,
	Animated,
	Easing,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native'

import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { COLORS } from '../assets/colors'

const SelectField = props => {
	const { label, value, style, onBlur, onFocus, onChangeText, ...restOfProps } = props
	const [isFocused, setIsFocused] = useState(false)

	const inputRef = useRef(null)
	const focusAnim = useRef(new Animated.Value(0)).current

	const [selectedItem, setSelectedItem] = useState(null)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	useEffect(() => {
		Animated.timing(focusAnim, {
			toValue: isFocused || !!value ? 1 : 0,
			duration: 150,
			easing: Easing.bezier(0.4, 0, 0.2, 1),
			useNativeDriver: true,
		}).start()
	}, [focusAnim, isFocused, value])

	useEffect(() => {
		setIsDropdownOpen(isFocused)
	}, [isFocused])

	const handleSelectItem = async item => {
		console.log(`Wybieram element: ${item}`)
		setSelectedItem(item)
	}

	return (
		<View style={[styles.container, isFocused && styles.containerFocus]}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 1 }}>
					<TextInput
						ref={inputRef}
						style={[styles.input]}
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
						returnKeyLabel='Test'
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
				<View style={styles.iconContainer}>
					<TouchableOpacity style={styles.iconBtn}>
						<FontAwesome name={'angle-down'} size={20} color={COLORS.placeholder_color} />
					</TouchableOpacity>
				</View>
			</View>

			{isDropdownOpen && (
				<View style={styles.dropDownContainer}>
					<TouchableOpacity onPress={() => handleSelectItem('Basen Miejski Włocławek')}>
						<View style={styles.dropDownItem}>
							<Text style={styles.dropDownItemText}>Basen Miejski Włocławek</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleSelectItem('ul. Bajeczna 14/3 Włocławek')}>
						<View style={styles.dropDownItem}>
							<Text style={styles.dropDownItemText}>ul. Bajeczna 14/3 Włocławek</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleSelectItem('ul. Promienna 3/43 Włocławek')}>
						<View style={styles.dropDownItem}>
							<Text style={styles.dropDownItemText}>ul. Promienna 3/43 Włocławek</Text>
						</View>
					</TouchableOpacity>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: COLORS.border_color,
		borderRadius: 20,
	},

	containerFocus: {
		borderWidth: 2,
		borderColor: COLORS.main,
	},

	input: {
		padding: 13,
		paddingHorizontal: 20,
		fontFamily: 'Poppins-Regular',
		fontSize: 14,
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

	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
	},

	dropDownContainer: {},

	dropDownItem: {
		borderTopWidth: 1,
		borderColor: COLORS.border_color,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},

	dropDownItemText: {
		fontFamily: 'Poppins-Regular',
		fontSize: 14,
		color: COLORS.placeholder_color,
	},
})

export default SelectField
