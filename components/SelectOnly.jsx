import React, { useState, useEffect, useRef } from 'react'
import {
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Animated,
	Easing,
	Keyboard,
} from 'react-native'

import OutsidePressHandler from 'react-native-outside-press'

import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { COLORS } from '../assets/colors'

const SelectOnly = props => {
	const { items, label, value, onChangeText, renderItem, ...restOfProps } = props

	const [isFocused, setIsFocused] = useState(false)

	const focusAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		Animated.timing(focusAnim, {
			toValue: isFocused || !!value ? 1 : 0,
			duration: 150,
			easing: Easing.bezier(0.4, 0, 0.2, 1),
			useNativeDriver: true,
		}).start()
	}, [focusAnim, isFocused, value])

	const handlePress = () => {
		setIsFocused(!isFocused)
	}

	const handleItemPress = item => {
		if (!item || !isFocused) return
		onChangeText(item)
		setIsFocused(false)
	}

	const handlePressOutside = () => {
		if (isFocused) setIsFocused(false)
	}

	return (
		<OutsidePressHandler onOutsidePress={handlePressOutside}>
			<View style={[styles.container, isFocused && styles.containerFocus]}>
				<TouchableOpacity activeOpacity={1} onPress={handlePress}>
					<View style={{ flexDirection: 'row' }}>
						<View style={{ flex: 1 }}>
							<Text style={styles.selectText}>{value ? renderItem(value) : ''}</Text>
							<TouchableWithoutFeedback>
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
				</TouchableOpacity>

				{isFocused && (
					<View style={styles.dropDownContainer}>
						{items.map(item => (
							<TouchableOpacity key={item.id} onPress={() => handleItemPress(item)}>
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

	containerFocus: {
		borderWidth: 2,
		borderColor: COLORS.main,
	},

	selectText: {
		fontFamily: 'Poppins-Bold',
		fontSize: 14,
		color: COLORS.main_text_dark_color,
		padding: 15,
		paddingHorizontal: 20,
	},

	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
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

export default SelectOnly
