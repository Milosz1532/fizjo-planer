import React from 'react'
import { View, StatusBar, Platform } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

export default CustomStatusBar = ({ backgroundColor, height, ...props }) => (
	<View style={{ backgroundColor, height: height ? height : Platform.OS === 'ios' ? 44 : 56 }}>
		<SafeAreaView>
			<StatusBar translucent backgroundColor={backgroundColor} {...props} />
		</SafeAreaView>
	</View>
)
