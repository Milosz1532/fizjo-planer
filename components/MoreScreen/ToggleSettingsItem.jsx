import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useGlobalColors } from '../../assets/colors'
import ToggleSwitch from 'toggle-switch-react-native'

export default ToggleSettingsItem = ({ icon, label, initialValue, onToggle }) => {
	const COLORS = useGlobalColors()

	const styles = StyleSheet.create({
		toggleSettingsItemContainer: {
			flexDirection: 'row',
			backgroundColor: COLORS.element_background,
			borderRadius: 10,
			padding: 10,
			alignItems: 'center',
			marginBottom: 10,
		},
		toggleSettingsItemIconContainer: {
			padding: 8,
			borderRadius: 8,
			width: 30,
		},
		toggleSettingsItemIcon: {
			fontSize: 15,
			color: COLORS.main_text_light_color,
		},
		toggleSettingsItemText: {
			fontFamily: 'Poppins-SemiBold',
			fontSize: 15,
			paddingStart: 12,
			color: COLORS.main_text_dark_color,
		},
		toggleSettingsItemToggleContainer: {
			marginLeft: 'auto',
			marginRight: 15,
		},
	})

	return (
		<View style={styles.toggleSettingsItemContainer}>
			<View
				style={[styles.toggleSettingsItemIconContainer, { backgroundColor: icon.backgroundColor }]}>
				<FontAwesome name={icon.name} style={styles.toggleSettingsItemIcon} />
			</View>
			<Text style={styles.toggleSettingsItemText}>{label}</Text>
			<View style={styles.toggleSettingsItemToggleContainer}>
				<ToggleSwitch
					isOn={initialValue}
					onColor={COLORS.element_color_2}
					offColor={COLORS.light_gray_element}
					size='medium'
					onToggle={onToggle}
				/>
			</View>
		</View>
	)
}
