import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalColors } from '../assets/colors'
import { useGlobalStyles } from '../assets/styles'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Haptics from 'expo-haptics'
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated'

export default function LoginPage() {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()
	const styles = generateStyles(COLORS)

	const [code, setCode] = useState([])
	const codeLength = Array(6).fill(0)

	const offset = useSharedValue(0)
	const style = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: offset.value }],
		}
	})

	const [biometricType, setBiometricType] = useState(null)

	useEffect(() => {
		checkBiometricSupport()
	}, [])

	const checkBiometricSupport = async () => {
		try {
			const hasHardware = await LocalAuthentication.hasHardwareAsync()
			if (!hasHardware) {
				setBiometricType(null)
				return
			}

			const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
			if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
				setBiometricType('Face ID')
			} else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
				setBiometricType('Touch ID')
			} else {
				setBiometricType(null)
			}
		} catch (error) {
			console.error('Error checking biometric support', error)
		}
	}

	const handleNumberPress = number => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		setCode([...code, number])
	}

	const handleNumberBackspace = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		setCode(code.slice(0, -1))
	}

	const onBiometricPress = async () => {
		const { success } = await LocalAuthentication.authenticateAsync()
		if (success) {
			console.log(`Logujemy`)
		} else {
			console.log(`Nie udało się :(`)
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
		}
	}

	const OFFSET = 20
	const TIME = 80

	useEffect(() => {
		if (code.length === 6) {
			if (code.join('') === '123456') {
				console.log(`Zalogowany`)
				setCode([])
			} else {
				console.log(`Błędy PIN`)
				offset.value = withSequence(
					withTiming(-OFFSET, { duration: TIME / 2 }),
					withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
					withTiming(0, { duration: TIME / 2 })
				)
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
				setCode([])
			}
		}
	}, [code])

	return (
		<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
			<StatusBar style='dark' />

			<View style={styles.container}>
				<Text style={styles.titleText}>Witaj ponownie</Text>

				<Animated.View style={[styles.codeView, style]}>
					{codeLength.map((_, index) => (
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
						{biometricType && (
							<TouchableOpacity style={styles.numberView} onPress={onBiometricPress}>
								{biometricType === 'Face ID' ? (
									<Ionicons name='backspace-outline' size={24} color='black' />
								) : (
									<Ionicons name='finger-print-outline' size={24} color='black' />
								)}
							</TouchableOpacity>
						)}

						<TouchableOpacity style={styles.numberView} onPress={() => handleNumberPress(0)}>
							<Text style={styles.number}>0</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.numberView} onPress={handleNumberBackspace}>
							<Ionicons name='backspace-outline' size={24} color='black' />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		titleText: {
			color: COLORS.main_text_dark_color,
			fontFamily: 'Poppins-Bold',
			fontSize: 22,
			textAlign: 'center',
		},
		container: {
			marginHorizontal: 30,
			marginVertical: 90,
		},

		codeView: {
			justifyContent: 'center',
			flexDirection: 'row',
			marginHorizontal: 30,
			marginVertical: 30,
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
		},
	})
