import React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from '@expo/vector-icons/FontAwesome5'

import { globalStyles } from '../../assets/styles'
import { COLORS } from '../../assets/colors'

export default function ManageVisit() {
	const { navigate, goBack } = useNavigation()

	return (
		<View style={{ flex: 1, backgroundColor: COLORS.app_background }}>
			<StatusBar style='dark' />
			<SafeAreaView edges={['right', 'left', 'top', 'bottom']} style={{ flex: 1 }}>
				<ScrollView
					style={[globalStyles.screenContainer]}
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: 'space-between',
						flexDirection: 'column',
					}}>
					<View style={{ flex: 1, justifyContent: 'flex-start' }}>
						<View style={[globalStyles.topHeader]}>
							<Text style={globalStyles.topHeaderTextDark}>Zaplanuj wizytę</Text>
							<View style={globalStyles.backIconContainer}>
								<TouchableOpacity onPress={() => goBack()}>
									<FontAwesome name={'angle-left'} size={20} color={COLORS.light_icon_color} />
								</TouchableOpacity>
							</View>
						</View>

						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
						<View style={{ height: 100 }}>
							<Text>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque blanditiis ad
								molestias? Omnis ipsa debitis veritatis natus necessitatibus dolorem officiis
								distinctio vitae obcaecati impedit! Fugit pariatur repellat tempora cumque
								repellendus!
							</Text>
						</View>
					</View>
					<View style={{ justifyContent: 'flex-end', backgroundColor: 'blue' }}>
						<Text>1</Text>
					</View>
				</ScrollView>
			</SafeAreaView>
		</View>
	)
}
