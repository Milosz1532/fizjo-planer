import React, { useState, useRef } from 'react'
import {
	ScrollView,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	KeyboardAvoidingView,
	Keyboard,
	ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'
import TextField from '../../components/TextField'
import SelectField from '../../components/SelectField'
import Button from '../../components/Button'
import LoadingScreen from '../../components/LoadingScreen'

const ProblemComponent = ({ id, text, onRemove }) => {
	return (
		<View style={styles.problemContainer}>
			<View style={styles.problemIcon}>
				<FontAwesome name={'exclamation-triangle'} size={12} color={COLORS.main_text_light_color} />
			</View>
			<Text style={styles.problemText}>{text}</Text>
			<TouchableOpacity style={styles.problemRemoveIcon} onPress={() => onRemove(id)}>
				<FontAwesome name={'trash'} size={15} color={COLORS.header_text_gray_color} />
			</TouchableOpacity>
		</View>
	)
}

export default function ManagePatient() {
	const { goBack } = useNavigation()
	const [fullName, setFullName] = useState('')
	const [age, setAge] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [note, setNote] = useState('')

	const [problemList, setProblemList] = useState([])
	const [addProblemValue, setAddProblemValue] = useState()

	const scrollViewRef = useRef(null)

	const handleAddNewProblem = event => {
		if (addProblemValue.length <= 0) {
			Keyboard.dismiss()
			return
		}
		const newProblem = {
			id: problemList.length + 1,
			text: addProblemValue.trim(),
		}
		setProblemList(prevList => [...prevList, newProblem])
		setAddProblemValue('')
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true })
		}
	}

	const handleRemoveProblem = id => {
		const prevProblems = problemList
		setProblemList(prevProblems.filter(problem => problem.id !== id))
	}

	const handleAddPatient = () => {
		console.log(`Pacjent dodany`)
		const payload = {
			fullName: fullName,
			age: age,
			phoneNumber: phoneNumber,
			note: note,
			problems: problemList,
		}

		Dialog.show({
			type: ALERT_TYPE.SUCCESS,
			title: 'Success',
			textBody: 'Gratulacje pacjent został pomyślnie dodany',
			button: 'OK',
		})
	}

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView style={{ flex: 1 }}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1 }}>
					<ScrollView
						style={[globalStyles.screenContainer]}
						ref={scrollViewRef}
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'space-between',
							flexDirection: 'column',
						}}>
						<View style={{ flex: 1, justifyContent: 'flex-start' }}>
							<View style={globalStyles.topHeader}>
								<Text style={globalStyles.topHeaderTextDark}>Dodaj pacjenta</Text>
								<View style={globalStyles.backIconContainer}>
									<TouchableOpacity onPress={() => goBack()}>
										<FontAwesome name={'angle-left'} size={20} color={COLORS.light_icon_color} />
									</TouchableOpacity>
								</View>
							</View>

							<View style={[globalStyles.container, { marginTop: 20 }]}>
								<View>
									<TextField
										value={fullName}
										label='Imię i Nazwisko'
										maxLength={20}
										onChangeText={text => setFullName(text)}
									/>
								</View>
								<View style={{ marginTop: 20 }}>
									<TextField
										keyboardType='numeric'
										value={age}
										maxLength={4}
										label='Rok urodzenia'
										onChangeText={text => setAge(text)}
									/>
								</View>
								<View style={{ marginTop: 20 }}>
									<TextField
										keyboardType='numeric'
										value={phoneNumber}
										maxLength={10}
										label='Numer telefonu'
										onChangeText={text => setPhoneNumber(text)}
									/>
								</View>

								<View style={{ marginTop: 20 }}>
									<TextField
										value={note}
										label='Notatka'
										maxLength={300}
										minHeight={60}
										multiline
										onChangeText={text => setNote(text)}
									/>
								</View>

								<View style={{ marginTop: 20 }}>
									<Text style={[globalStyles.containerMediumText, { textAlign: 'center' }]}>
										Problemy
									</Text>

									<View>
										{problemList.map(problem => (
											<ProblemComponent
												key={problem.id}
												id={problem.id}
												text={problem.text}
												onRemove={handleRemoveProblem}
											/>
										))}

										<View style={styles.addProblemContainer}>
											<View style={styles.addProblemIcon}>
												<FontAwesome name={'plus'} size={12} color={COLORS.main_text_light_color} />
											</View>
											<TextInput
												value={addProblemValue}
												style={styles.addProblemInput}
												placeholder='Wprowadź problem...'
												onChangeText={text => setAddProblemValue(text)}
												onSubmitEditing={handleAddNewProblem}
												maxLength={40}
												blurOnSubmit={false}
											/>
										</View>
									</View>
								</View>
							</View>
						</View>

						<View style={{ justifyContent: 'flex-end' }}>
							<Button text={'Dodaj pacjenta'} onPress={handleAddPatient} />
						</View>
					</ScrollView>
					<LoadingScreen transparent={true} />
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	)
}

const styles = StyleSheet.create({
	problemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.light_border_color,
		paddingVertical: 10,
	},
	problemIcon: {
		backgroundColor: COLORS.warning_color,
		borderRadius: 6,
		marginEnd: 10,
		minWidth: 30,
		minHeight: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	problemText: {
		fontFamily: 'Poppins-SemiBold',
		fontSize: 14,
		flex: 1,
	},

	addProblemContainer: {
		flexDirection: 'row',
		marginTop: 10,
		paddingBottom: 10,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.light_border_color,
	},

	addProblemIcon: {
		backgroundColor: COLORS.border_color,
		borderRadius: 6,
		marginEnd: 10,
		minWidth: 30,
		minHeight: 30,
		alignItems: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
	},

	addProblemInput: {
		fontFamily: 'Poppins-Regular',
		flex: 1,
	},
})
