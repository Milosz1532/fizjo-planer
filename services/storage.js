import AsyncStorage from '@react-native-async-storage/async-storage'

const saveData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value))
		console.log(`Dane o kluczu "${key}" zostały zapisane.`)
	} catch (error) {
		console.error(`Błąd podczas zapisywania danych o kluczu "${key}":`, error)
	}
}

const readData = async key => {
	try {
		const dataString = await AsyncStorage.getItem(key)
		const data = JSON.parse(dataString)
		console.log(`Odczytane dane o kluczu "${key}":`, data)
		return data
	} catch (error) {
		console.error(`Błąd podczas odczytywania danych o kluczu "${key}":`, error)
		return null
	}
}

export { saveData, readData }
