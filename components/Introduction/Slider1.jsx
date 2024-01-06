import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { useGlobalColors } from '../../assets/colors'

export default function Slider1({ id, windowWidth, totalSlides, onChangeSlide }) {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	return (
		<View style={{ flex: 1, width: windowWidth }}>
			<View style={styles.introductionTop}>
				<LottieView
					source={require('../../assets/animations/slider_1_animation.json')}
					autoPlay
					loop
				/>
			</View>
			<View style={styles.introductionBottom}>
				<Text style={styles.sliderTitle}>
					Zacznij już teraz planować wizyty i harmonogram pacjentów.
				</Text>
				<Text style={styles.sliderSubTitle}>
					Aplikacja Fizjo Planer została specjalnie stworzona z myślą o fizjoterapeutach,
					umożliwiając szybkie i efektywne rejestrowanie informacji o pacjentach oraz planowanie ich
					wizyt.
				</Text>

				<View style={[styles.sliderNavContainer]}>
					<TouchableOpacity style={styles.sliderBigButton} onPress={() => onChangeSlide(id)}>
						<Text style={styles.sliderButtonText}>Rozpocznij za darmo</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const generateStyles = COLORS =>
	StyleSheet.create({
		introductionTop: {
			flex: 1,
		},

		introductionBottom: {
			backgroundColor: COLORS.element_background,
			flex: 1,
			borderTopRightRadius: 30,
			borderTopLeftRadius: 30,
			paddingHorizontal: 30,
			paddingVertical: 30,
		},

		sliderTitle: {
			fontFamily: 'Poppins-Bold',
			color: COLORS.main_text_dark_color,
			textAlign: 'center',
			fontSize: 20,
			paddingHorizontal: 10,
			marginBottom: 20,
		},

		sliderSubTitle: {
			fontFamily: 'Poppins-Regular',
			fontSize: 15,
			textAlign: 'center',
			color: COLORS.placeholder_color,
			paddingHorizontal: 10,
		},

		sliderNavContainer: {
			marginTop: 50,
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
		},

		sliderBigButton: {
			backgroundColor: COLORS.main,
			paddingVertical: 18,
			paddingHorizontal: 30,
			borderRadius: 20,
		},

		sliderSmallButton: {
			backgroundColor: COLORS.main,
			paddingVertical: 10,
			paddingHorizontal: 40,
			borderRadius: 20,
		},

		sliderButtonText: {
			color: COLORS.main_text_light_color,
			fontFamily: 'Poppins-SemiBold',
			textAlign: 'center',
		},

		sliderNavDots: {
			paddingStart: 10,
			flexDirection: 'row',
		},

		sliderDot: {
			width: 10,
			height: 10,
			borderRadius: 10,
			backgroundColor: COLORS.main,
			marginEnd: 7,
		},

		activeDot: {
			width: 25,
			borderRadius: 7,
		},
	})
