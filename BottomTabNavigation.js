import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'

import { Entypo } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import HomeScreen from './screens/HomeScreen'
import CalendarScreen from './screens/CalendarScreen'
import PatientsCreen from './screens/PatientsScreen'
import MoreScreen from './screens/MoreScreen'
import ManageVisit from './screens/ManagementScreens/ManageVisit'

import { useGlobalColors } from './assets/colors'
import { TouchableOpacity } from 'react-native'

const Tab = createBottomTabNavigator()

const CustomTabBarButton = ({ onPress }) => {
	return <TouchableOpacity onPress={onPress}></TouchableOpacity>
}

const BottomTabNavigation = () => {
	const { navigate } = useNavigation()

	const COLORS = useGlobalColors()

	const screenOptions = {
		tabBarShowLabel: false,
		tabBarHideOnKeyboard: true,
		headerShown: false,
		tabBarStyle: {
			margin: 0,
			padding: 0,
			backgroundColor: COLORS.navigation_background
		},
	}

	return (
		<Tab.Navigator screenOptions={screenOptions} initialRouteName='home'>
			<Tab.Screen
				name='home'
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
				name='calendar'
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
				name='PlusButton'
				component={CustomTabBarButton}
				options={{
					tabBarIcon: ({ focused }) => (
						<TouchableOpacity
							onPress={() => navigate('manageVisit', {})}
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
							<FontAwesome name={'plus'} size={24} color={COLORS.main_text_light_color} />
						</TouchableOpacity>
					),
				}}
				listeners={({ navigation }) => ({
					tabPress: e => {
						e.preventDefault()
						navigate('manageVisit', {})
					},
				})}
			/>
			<Tab.Screen
				name='patients'
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
				name='more'
				component={MoreScreen}
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
	)
}

export default BottomTabNavigation
