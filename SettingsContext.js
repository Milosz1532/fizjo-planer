import React, { createContext, useState, useContext, useEffect } from 'react'
import { readData, saveData } from './services/storage'
const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
	const [settings, setSettings] = useState({})

	useEffect(() => {
		readSettings()
	}, [])

	const readSettings = async () => {
		const storedSettings = await readData('settings')
		setSettings(storedSettings || {})
	}

	const updateSetting = async (key, value) => {
		const updatedSettings = { ...settings, [key]: value }
		setSettings(updatedSettings)
		await saveData('settings', updatedSettings)
	}

	return (
		<SettingsContext.Provider value={{ settings, updateSetting }}>
			{children}
		</SettingsContext.Provider>
	)
}

export const useSettings = () => {
	return useContext(SettingsContext)
}
