import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalColors } from '../../assets/colors'
import { useGlobalStyles } from '../../assets/styles'
import { useSettings } from '../../SettingsContext'

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
import { useNavigation } from '@react-navigation/native'

import LoadingScreen from '../../components/LoadingScreen'

function BiometricButton({ biometricType, settings, onBiometricPress, styles }) {
	if (!settings.biometricLoginEnabled) {
		return <View style={styles.numberView}></View>
	} else {
		return (
			<View>
				{biometricType && (
					<TouchableOpacity style={styles.numberView} onPress={onBiometricPress}>
						{biometricType === 'Face ID' ? (
							<MaterialCommunityIcons name='face-recognition' size={24} color='black' />
						) : (
							<Ionicons name='finger-print-outline' size={24} color='black' />
						)}
					</TouchableOpacity>
				)}
			</View>
		)
	}
}

export default function LoginPage() {
	const COLORS = useGlobalColors()
	const globalStyles = useGlobalStyles()
	const styles = generateStyles(COLORS)

	const [isLoading, setIsLoading] = useState(false)

	const [code, setCode] = useState([])
	const codeLength = Array(6).fill(0)

	const offset = useSharedValue(0)
	const style = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: offset.value }],
		}
	})

	const { navigate } = useNavigation()

	const [biometricType, setBiometricType] = useState(null)
	const { settings } = useSettings()

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
		if (isLoading) return
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		setCode([...code, number])
	}

	const handleNumberBackspace = () => {
		if (isLoading) return
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		setCode(code.slice(0, -1))
	}

	const onBiometricPress = async () => {
		if (isLoading) return
		setIsLoading(true)
		try {
			const { success } = await LocalAuthentication.authenticateAsync()
			if (success) {
				navigate('BottomNavigation', {})
			} else {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
			}
		} catch (error) {
			console.error('Error during biometric authentication', error)
		} finally {
			setIsLoading(false)
		}
	}

	const OFFSET = 20
	const TIME = 80

	useEffect(() => {
		const verifyPin = async () => {
			if (code.length === 6) {
				setIsLoading(true)
				try {
					const savedPin = await SecureStore.getItemAsync('PIN_CODE')
					if (savedPin && code.join('') === savedPin) {
						setCode([])
						navigate('BottomNavigation', {})
					} else {
						offset.value = withSequence(
							withTiming(-OFFSET, { duration: TIME / 2 }),
							withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
							withTiming(0, { duration: TIME / 2 })
						)
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
						setCode([])
					}
				} catch (error) {
					console.error('Błąd podczas odczytu PIN-u:', error)
				} finally {
					setIsLoading(false)
				}
			}
		}

		verifyPin()
	}, [code])

	return (
		<SafeAreaView edges={['right', 'left', 'top']} style={{ flex: 1 }}>
			<StatusBar style='dark' />

			<View style={styles.container}>
				<View></View>

				<View>
					<Text style={styles.titleText}>Witaj ponownie</Text>

					{!isLoading ? (
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
					) : (
						<View style={{ paddingTop: 80 }}>
							<LoadingScreen />
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
						<BiometricButton
							biometricType={biometricType}
							settings={settings}
							onBiometricPress={onBiometricPress}
							styles={styles}
						/>

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
			marginVertical: 40,
			justifyContent: 'space-between',
			flex: 1,
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
