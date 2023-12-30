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
	KeyboardAvoidingView,
	Keyboard,
} from 'react-native'
import OutsidePressHandler from 'react-native-outside-press'

import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { COLORS } from '../assets/colors'

const SelectField = props => {
	const {
		label,
		value,
		style,
		onBlur,
		onFocus,
		onChangeText,
		items,
		editable,
		renderItem,
		selectedValue,
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

	const handleSelectItem = item => {
		onChangeText(item.text)
		inputRef.current.blur()
		selectedValue(item)
	}

	return (
		<OutsidePressHandler onOutsidePress={handlePressOutside}>
			<View
				pointerEvents={editable ? 'auto' : 'none'}
				style={[
					styles.container,
					isFocused && styles.containerFocus,
					!editable && styles.containerDisabled,
				]}
				keyboardShouldPersistTaps='handled'>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1 }}>
						<TextInput
							ref={inputRef}
							style={[styles.input]}
							value={value}
							editable={editable}
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
													outputRange: [12, -8],
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
						<View style={styles.iconBtn}>
							<FontAwesome name={'angle-down'} size={20} color={COLORS.placeholder_color} />
						</View>
					</View>
				</View>

				{isFocused && (
					<View style={styles.dropDownContainer}>
						{items.map(item => (
							<TouchableOpacity key={item.id} onPress={() => handleSelectItem(item)}>
								<View style={styles.dropDownItem}>
									{renderItem ? (
										<Text style={styles.dropDownItemText}>{renderItem(item)}</Text>
									) : (
										<Text style={styles.dropDownItemText}>{item.name}</Text>
									)}
								</View>
							</TouchableOpacity>
						))}
					</View>
				)}
			</View>
		</OutsidePressHandler>
	)
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: COLORS.border_color,
		borderRadius: 20,
	},

	containerDisabled: {
		opacity: 0.6,
	},

	containerFocus: {
		borderWidth: 2,
		borderColor: COLORS.main,
	},

	input: {
		padding: 13,
		paddingHorizontal: 20,
		fontFamily: 'Poppins-Bold',
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

	addItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderTopWidth: 1,
		borderColor: COLORS.border_color,
	},

	addItemIcon: {
		backgroundColor: COLORS.main,
		borderRadius: 6,
		width: 20,
		height: 20,
		marginEnd: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},

	addItemInputContainer: {
		flex: 1,
	},

	addItemInput: {
		fontFamily: 'Poppins-Regular',
		flex: 1,
		color: COLORS.placeholder_color,
	},
})

export default SelectField
