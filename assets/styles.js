import { Platform, StyleSheet } from 'react-native'

import { COLORS } from './colors'

export const globalStyles = StyleSheet.create({
	screenContainer: {
		backgroundColor: COLORS.app_background,
		flex: 1,
	},

	container: {
		paddingHorizontal: 20,
		height: '100%',
		paddingBottom: 10,
	},

	containerTitle: {
		fontFamily: 'Poppins-Bold',
		fontSize: 22,
	},

	containerMediumText: {
		fontFamily: 'Poppins-Bold',
		fontSize: 18,
	},

	cardBox: {
		backgroundColor: COLORS.element_background,
		padding: 10,
		borderRadius: 6,
	},

	topHeader: {
		position: 'relative',
		flexDirection: 'row',
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: Platform.OS === 'android' ? 20 : 0,
	},

	topHeaderText: {
		fontFamily: 'Poppins-Bold',
		color: COLORS.main_text_light_color,
		fontSize: 20,
	},

	topHeaderTextDark: {
		fontFamily: 'Poppins-Bold',
		color: COLORS.main_text_dark_color,
		fontSize: 20,
	},

	plusIconContainer: {
		position: 'absolute',
		top: 6,
		right: 25,
	},

	backIconContainer: {
		position: 'absolute',
		top: 5,
		left: 25,
	},

	cardShadow: Platform.select({
		ios: {
			shadowColor: 'rgba(0, 0, 0, 0.15)',
			shadowOpacity: 1,
			shadowRadius: 4,
			shadowOffset: {
				width: 0,
				height: 2,
			},
		},
		android: {
			elevation: 8,
			shadowColor: 'rgba(0, 0, 0, 0.15)',
		},
	}),

	roundedContainer: {
		backgroundColor: COLORS.app_background,
		flex: 1,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingBottom: 20,
		paddingHorizontal: 20,
		marginTop: 10,
	},

	buttonContainer: {
		padding: 20,
	},

	button: {
		backgroundColor: COLORS.main,
		padding: 10,
		borderRadius: 8,
	},

	buttonText: {
		fontFamily: 'Poppins-SemiBold',
		color: COLORS.main_text_light_color,
		textAlign: 'center',
		fontSize: 20,
	},
})
