import React, { useRef, useState } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	useWindowDimensions,
	FlatList,
} from 'react-native'
import LottieView from 'lottie-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalColors } from './assets/colors'

import Slider1 from './components/Introduction/Slider1'
import Slider2 from './components/Introduction/Slider2'
import Slider3 from './components/Introduction/Slider3'
import Slider4 from './components/Introduction/Slider4'
import { useSettings } from './SettingsContext'
import { useNavigation } from '@react-navigation/native'

const AppIntro = () => {
	const COLORS = useGlobalColors()
	const windowWidth = useWindowDimensions().width
	const scrollViewRef = useRef(null)

	const { navigate } = useNavigation()

	const handleSlideChange = index => {
		scrollViewRef.current.scrollToIndex({ index, animated: true })
	}

	const [userInput, setUserInput] = useState('')

	const slides = [
		{ id: 1, component: Slider1 },
		{ id: 2, component: Slider2 },
		{ id: 3, component: Slider3 },
		{
			id: 4,
			component: Slider4,
			userInput: userInput,
			setUserInput: setUserInput,
			handleSubmitIntroduction: () => handleSubmitIntroduction(),
		},
	]

	const keyExtractor = item => item.id.toString()

	const renderSlide = ({ item, index }) => (
		<View style={{ width: windowWidth }}>
			{React.createElement(item.component, {
				windowWidth,
				totalSlides: slides.length,
				onChangeSlide: handleSlideChange,
				...item,
			})}
		</View>
	)

	const { updateSettings } = useSettings()

	const handleSubmitIntroduction = async () => {
		if (userInput.trim().length === 0) return

		await updateSettings({
			darkMode: false,
			user: userInput,
			joinDate: new Date(),
			is_pin_code: false,
			biometricLoginEnabled: false,
		})
	}

	return (
		<View style={{ flex: 1 }}>
			<StatusBar style='dark' />
			<SafeAreaView
				edges={('top', 'left', 'right')}
				style={{ flex: 1, backgroundColor: COLORS.intro_background, paddingTop: 50 }}>
				<FlatList
					ref={scrollViewRef}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					data={slides}
					renderItem={renderSlide}
					keyExtractor={keyExtractor}
					initialNumToRender={1}
					windowSize={3}
				/>
			</SafeAreaView>
		</View>
	)
}

export default AppIntro
