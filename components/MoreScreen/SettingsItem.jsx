import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useGlobalColors } from '../../assets/colors'

export default function SettingsItem({ icon, label, onPress }) {
	const COLORS = useGlobalColors()

	const styles = StyleSheet.create({
		settingsItemContainer: {
			flexDirection: 'row',
			backgroundColor: COLORS.element_background,
			borderRadius: 10,
			padding: 10,
			alignItems: 'center',
			marginBottom: 10,
		},
		settingsItemIconContainer: {
			padding: 8,
			borderRadius: 8,
			width: 30,
		},
		settingsItemIcon: {
			fontSize: 15,
			color: 'white',
		},
		settingsItemText: {
			fontFamily: 'Poppins-SemiBold',
			fontSize: 15,
			paddingStart: 12,
			color: COLORS.main_text_dark_color,
		},
		settingsItemArrowIconContainer: {
			marginLeft: 'auto',
			marginRight: 15,
		},
	})

	return (
		<TouchableOpacity style={styles.settingsItemContainer} onPress={onPress}>
			<View style={[styles.settingsItemIconContainer, { backgroundColor: icon.backgroundColor }]}>
				<FontAwesome name={icon.name} style={styles.settingsItemIcon} />
			</View>
			<Text style={styles.settingsItemText}>{label}</Text>
			<View style={styles.settingsItemArrowIconContainer}>
				<FontAwesome name='angle-right' size={18} color={COLORS.tab_gray_element_color} />
			</View>
		</TouchableOpacity>
	)
}
