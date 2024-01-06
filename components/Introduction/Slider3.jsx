import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { useGlobalColors } from '../../assets/colors'
import TextField from '../TextField'

export default function Slider3({ id, windowWidth, totalSlides, onChangeSlide }) {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	const renderDots = () => {
		const dots = []
		for (let i = 0; i < totalSlides; i++) {
			dots.push(<View key={i} style={[styles.sliderDot, i === id - 1 && styles.activeDot]} />)
		}
		return dots
	}

	return (
		<View style={{ flex: 1, width: windowWidth }}>
			<View style={styles.introductionTop}>
				<LottieView
					source={require('../../assets/animations/slider_3_animation.json')}
					autoPlay
					loop
				/>
			</View>
			<View style={styles.introductionBottom}>
				<Text style={styles.sliderTitle}>Bezpieczeństwo danych</Text>
				<Text style={styles.sliderSubTitle}>
					Twoje dane są bezpiecznie przechowywane w pamięci Twojego telefonu. Nie musisz się martwić
					o informacje dotyczące pacjentów i wizyt, ponieważ wszystkie dane pozostają jedynie w
					Twojej dyspozycji i nie są przesyłane nigdzie indziej.
				</Text>

				<View style={[styles.sliderNavContainer]}>
					<View style={styles.sliderNavDots}>{renderDots()}</View>

					<TouchableOpacity style={styles.sliderSmallButton} onPress={() => onChangeSlide(id)}>
						<Text style={styles.sliderButtonText}>Dalej</Text>
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
			alignItems: 'center',
			justifyContent: 'space-between',
			flexDirection: 'row',
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
