import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

import { Entypo } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import HomeScreen from './screens/HomeScreen'
import CalendarScreen from './screens/CalendarScreen'
import AddVisitScreen from './screens/AddVisitScreen'
import PatientsCreen from './screens/PatientsScreen'

import { COLORS } from './assets/colors'

const Tab = createBottomTabNavigator()

const screenOptions = {
	tabBarShowLabel: false,
	tabBarHideOnKeyboard: true,
	headerShown: false,
	tabBarStyle: {
		margin: 0,
		padding: 0,
	},
}

const BottomTabNavigation = () => {
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={{ top: 'maximum' }}>
			<Tab.Navigator screenOptions={screenOptions}>
				<Tab.Screen
					name='Home'
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => {
							return (
								<FontAwesome
									name={'home'}
									size={24}
									color={focused ? COLORS.nav_element_color : 'gray'}
								/>
							)
						},
					}}
				/>
				<Tab.Screen
					name='Kalendarz'
					component={CalendarScreen}
					options={{
						tabBarIcon: ({ focused }) => {
							return (
								<FontAwesome
									name={'calendar-alt'}
									size={24}
									color={focused ? COLORS.nav_element_color : 'gray'}
								/>
							)
						},
					}}
				/>
				<Tab.Screen
					name='Dodaj wizyte'
					component={AddVisitScreen}
					options={{
						tabBarIcon: ({ focused }) => {
							return (
								<>
									<View
										style={{
											backgroundColor: COLORS.main,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 50,
											width: 40,
											height: 40,
											marginBottom: 25,
										}}>
										<FontAwesome
											name={'plus'}
											size={24}
											color={COLORS.main_text_light_color}
										/>
									</View>
								</>
							)
						},
					}}
				/>
				<Tab.Screen
					name='Pacjenci'
					component={PatientsCreen}
					options={{
						tabBarIcon: ({ focused }) => {
							return (
								<FontAwesome
									name={'users'}
									size={24}
									color={focused ? COLORS.nav_element_color : 'gray'}
								/>
							)
						},
					}}
				/>
				<Tab.Screen
					name='Więcej'
					component={PatientsCreen}
					options={{
						tabBarIcon: ({ focused }) => {
							return (
								<Entypo
									name={'dots-three-horizontal'}
									size={24}
									color={focused ? COLORS.nav_element_color : 'gray'}
								/>
							)
						},
					}}
				/>
			</Tab.Navigator>
		</SafeAreaView>
	)
}

export default BottomTabNavigation
