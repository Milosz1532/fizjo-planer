import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { useGlobalColors } from '../../assets/colors'
import TextField from '../TextField'

export default function Slider({
	id,
	title,
	description,
	animation,
	buttonText,
	windowWidth,
	totalSlides,
	scrollToSlide,
}) {
	const COLORS = useGlobalColors()
	const styles = generateStyles(COLORS)

	const firstSlide = id > 1 ? false : true

	const handleDotPress = index => {
		if (scrollToSlide) {
			scrollToSlide(index)
		}
	}

	return (
		<View style={{ flex: 1, width: windowWidth }}>
			<View style={styles.introductionTop}>
				{animation && <LottieView source={animation} autoPlay loop />}
			</View>
			<View style={styles.introductionBottom}>
				<Text style={styles.sliderTitle}>{title}</Text>
				<Text style={styles.sliderSubTitle}>{description}</Text>

				<TextField
					value={''}
					label='Imię i Nazwisko'
					onChangeText={text => console.log(`object`)}
				/>

				<View
					style={[
						styles.sliderNavContainer,
						!firstSlide ? { justifyContent: 'space-between' } : { justifyContent: 'center' },
					]}>
					{!firstSlide && (
						<View style={styles.sliderNavDots}>
							{[...Array(totalSlides).keys()].map(index => (
								<TouchableOpacity
									key={index}
									onPress={() => handleDotPress(index)}
									style={[styles.sliderDot, id - 1 === index && styles.activeDot]}
								/>
							))}
						</View>
					)}

					<TouchableOpacity
						style={firstSlide ? styles.sliderBigButton : styles.sliderSmallButton}
						onPress={() => scrollToSlide(id)}>
						<Text style={styles.sliderButtonText}>{buttonText}</Text>
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
