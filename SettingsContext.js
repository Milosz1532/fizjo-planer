import React, { createContext, useState, useContext, useEffect } from 'react'

import { readData, saveData } from './services/storage'
const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState({})
	const [isDataLoaded, setDataLoaded] = useState(false)

	useEffect(() => {
		readSettings()
	}, [])

	const readSettings = async () => {
		try {
			const storedSettings = await readData('settings')
			setSettings(storedSettings || {})
			setDataLoaded(true)
		} catch (error) {
			console.error('Błąd podczas odczytywania ustawień:', error)
		}
	}

	const updateSetting = async (key, value) => {
		const updatedSettings = { ...settings, [key]: value }
		setSettings(updatedSettings)
		await saveData('settings', updatedSettings)
	}

	const updateSettings = async newSettings => {
		const updatedSettings = { ...newSettings }
		setSettings(updatedSettings)
		await saveData('settings', updatedSettings)
	}

	const toggleDarkMode = () => {
		const newDarkModeValue = !settings.darkMode
		updateSetting('darkMode', newDarkModeValue)
	}

	const currentColorScheme = settings.darkMode ? 'dark' : 'light'

	return (
		<SettingsContext.Provider
			value={{
				settings,
				isDataLoaded,
				updateSetting,
				updateSettings,
				toggleDarkMode,
				currentColorScheme,
			}}>
			{children}
		</SettingsContext.Provider>
	)
}

export const useSettings = () => {
	return useContext(SettingsContext)
}
