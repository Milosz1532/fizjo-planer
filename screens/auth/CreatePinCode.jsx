import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalColors } from '../../assets/colors'
import { useGlobalStyles } from '../../assets/styles'
import { useSettings } from '../../SettingsContext'

import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import * as Haptics from 'expo-haptics'

import pinCodeIcon from '../../assets/images/see-no-evil-monkey.png'

import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated'

export default function CreatePinCode() {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()
	const styles = generateStyles(COLORS)

	const [code, setCode] = useState([])
	const [confirmCode, setConfirmCode] = useState([])
	const [pinEntered, setPinEntered] = useState(false)
	const [message, setMessage] = useState()

	const codeLength = Array(6).fill(0)
	const { updateSetting } = useSettings()

	const handleNumberPress = number => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		if (pinEntered) {
			setConfirmCode([...confirmCode, number])
		} else {
			setCode([...code, number])
		}
	}

	const handleNumberBackspace = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		if (pinEntered) {
			setConfirmCode(confirmCode.slice(0, -1))
		} else {
			setCode(code.slice(0, -1))
		}
	}

	const handleBackBtnPress = () => {
		setConfirmCode([])
		setCode([])
		setPinEntered(false)
	}

	const dots_offset = useSharedValue(0)
	const dots_style = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: dots_offset.value }],
		}
	})

	const compareCodes = (code1, code2) => {
		return code1.join('') === code2.join('')
	}

	useEffect(() => {
		if (code.length === 6) {
			setPinEntered(true)
		}
	}, [code])

	const savePinCode = async () => {
		SecureStore.setItemAsync('PIN_CODE', confirmCode.join(''))
		await updateSetting('is_pin_code', true)
	}

	useEffect(() => {
		if (code.length === 6 && confirmCode.length === 6) {
			if (compareCodes(code, confirmCode)) {
				savePinCode()
			} else {
				dots_offset.value = withSequence(
					withTiming(-20, { duration: 40 }),
					withRepeat(withTiming(20, { duration: 80 }), 4, true),
					withTiming(0, { duration: 40 })
				)
				setMessage('Podany kod PIN nie zgadza się z poprzednim')
				setTimeout(() => {
					setMessage(false)
				}, 5000)
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
				setConfirmCode([])
			}
		}
	}, [confirmCode])

	const offset = useSharedValue(1)
	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: offset.value,
		}
	})

	useEffect(() => {
		offset.value = withSequence(
			withTiming(0.5, { duration: 150 }),
			withTiming(1, { duration: 150 })
		)
	}, [pinEntered])

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.primary }}>
			<SafeAreaView
				edges={['right', 'left', 'top']}
				style={{ flex: 1, justifyContent: 'space-between' }}>
				<StatusBar style='dark' />

				<View style={styles.topContainer}></View>

				<Animated.View style={[styles.container, animatedStyle]}>
					{pinEntered && (
						<TouchableOpacity style={styles.goBackContainer} onPress={handleBackBtnPress}>
							<MaterialIcons
								name='keyboard-arrow-left'
								size={30}
								color={COLORS.main_text_dark_color}
							/>

							<Text style={styles.goBackText}>Wróć</Text>
						</TouchableOpacity>
					)}
					<View style={styles.imageContainer}>
						<Image style={styles.pinCodeIcon} source={pinCodeIcon} />
					</View>
					<Text style={styles.titleText}>{pinEntered ? 'Powtórz kod' : 'Utwórz kod PIN'}</Text>

					<View>
						<Animated.View style={[styles.codeView, dots_style]}>
							{pinEntered
								? codeLength.map((_, index) => (
										<View
											key={index}
											style={[
												styles.codeEmpty,
												{
													backgroundColor:
														confirmCode[index] !== undefined
															? COLORS.main
															: COLORS.light_border_color,
												},
											]}
										/>
								  ))
								: codeLength.map((_, index) => (
										<View
											key={index}
											style={[
												styles.codeEmpty,
												{
													backgroundColor:
														code[index] !== undefined ? COLORS.main : COLORS.light_border_color,
												},
											]}
										/>
								  ))}
						</Animated.View>
						{message && (
							<View style={styles.messageContainer}>
								<Text style={styles.messageText}>{message}</Text>
							</View>
						)}
					</View>

					<View style={styles.numbersView}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							{[1, 2, 3].map(number => (
								<TouchableOpacity
									key={number}
									style={styles.numberView}
									onPress={() => handleNumberPress(number)}>
									<Text style={styles.number}>{number}</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							{[4, 5, 6].map(number => (
								<TouchableOpacity
									key={number}
									style={styles.numberView}
									onPress={() => handleNumberPress(number)}>
									<Text style={styles.number}>{number}</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							{[7, 8, 9].map(number => (
								<TouchableOpacity
									key={number}
									style={styles.numberView}
									onPress={() => handleNumberPress(number)}>
									<Text style={styles.number}>{number}</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
							<View style={styles.numberView}></View>

							<TouchableOpacity style={styles.numberView} onPress={() => handleNumberPress(0)}>
								<Text style={styles.number}> 0</Text>
							</TouchableOpacity>

							<TouchableOpacity style={styles.numberView} onPress={handleNumberBackspace}>
								<Ionicons name='backspace-outline' size={24} color={COLORS.main_text_dark_color} />
							</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
			</SafeAreaView>
		</View>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		titleText: {
			color: COLORS.main_text_dark_color,
			fontFamily: 'Poppins-Bold',
			fontSize: 22,
			textAlign: 'center',
			marginTop: 30,
		},

		goBackContainer: {
			marginHorizontal: 20,
			marginVertical: 20,
			flexDirection: 'row',
			alignItems: 'center',
		},

		goBackText: {
			marginStart: 5,
			fontFamily: 'Poppins-SemiBold',
			color: COLORS.text_gray_color,
			fontSize: 16,
		},

		topContainer: {
			flex: 1,
			marginVertical: 30,
			marginHorizontal: 30,
			justifyContent: 'center',
		},

		container: {
			paddingHorizontal: 30,
			paddingVertical: 40,
			justifyContent: 'space-between',
			backgroundColor: COLORS.element_background,
			borderTopLeftRadius: 40,
			borderTopRightRadius: 40,
		},

		messageContainer: {
			backgroundColor: 'tomato',
			alignItems: 'center',
			marginHorizontal: 30,
			paddingVertical: 5,
			paddingHorizontal: 20,
			borderRadius: 10,
		},

		messageText: {
			fontFamily: 'Poppins-SemiBold',
			color: COLORS.main_text_light_color,
			textAlign: 'center',
		},

		imageContainer: {
			alignItems: 'center',
		},

		pinCodeIcon: {
			width: 70,
			height: 70,
		},

		codeView: {
			justifyContent: 'center',
			flexDirection: 'row',
			marginHorizontal: 30,
			marginTop: 10,
			marginBottom: 30,
		},

		codeEmpty: {
			width: 15,
			height: 15,
			borderRadius: 10,
			marginHorizontal: 15,
			marginTop: 15,
		},

		numbersView: {
			marginVertical: 50,
			marginHorizontal: 30,
		},

		numberView: {
			justifyContent: 'center',
			alignItems: 'center',
			height: 60,
			width: 40,
			margin: 10,
		},

		number: {
			fontFamily: 'Poppins-SemiBold',
			fontSize: 20,
			color: COLORS.main_text_dark_color,
		},
	})
