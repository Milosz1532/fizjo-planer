import React, { useEffect } from 'react'
import BottomTabNavigation from './BottomTabNavigation'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Text } from 'react-native'
import {
	useFonts,
	Poppins_400Regular,
	Poppins_700Bold,
	Poppins_600SemiBold,
} from '@expo-google-fonts/poppins'

import { AlertNotificationRoot } from 'react-native-alert-notification'

import { initDatabase, fetchPatientData } from './services/Database'
import ManagePatient from './screens/ManagementScreens/ManagePatient'
import ManageVisit from './screens/ManagementScreens/ManageVisit'

const Stack = createNativeStackNavigator()

export default function App() {
	useEffect(() => {
		initDatabase()
		// insertPatient('Tamara Banaszek', 2022, 123456789, 'test')
		// insertPatientProblem(1, 'Problem Tamary')
		fetchPatientData(data => {
			const patientList = data
			patientList.forEach(element => {
				console.log(`------------ PACJENT ------------------`)
				console.log('ID: ' + element.id)
				console.log('Full_name: ' + element.full_name)
				console.log('Phone number: ' + element.phone_number)
				console.log(`Year of birth: ` + element.year_of_birth)
				console.log('Note: ' + element.note)

				console.log(`Problemy: `)
				element.problems.forEach(problem => {
					console.log(`ID: ${problem.id}`)
					console.log(`Text: ${problem.text}`)
				})
			})
		})
	}, [])

	let [fontsLoaded] = useFonts({
		'Poppins-Regular': Poppins_400Regular,
		'Poppins-SemiBold': Poppins_600SemiBold,
		'Poppins-Bold': Poppins_700Bold,
	})

	if (!fontsLoaded) {
		return (
			<>
				<Text>Ładowanie</Text>
			</>
		)
	}

	return (
		<AlertNotificationRoot>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name='BottomNavigation'
						options={{ headerShown: false }}
						component={BottomTabNavigation}
					/>
					<Stack.Screen
						name='ManagePatient'
						options={{ headerShown: false }}
						component={ManagePatient}
					/>
					<Stack.Screen
						name='manageVisit'
						options={{ headerShown: false }}
						component={ManageVisit}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</AlertNotificationRoot>
	)
}
