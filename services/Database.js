import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('fp_sqlite', '1.0')

const initDatabase = () => {
	db.transaction(tx => {
		// Patient Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, date_of_birth DATE, phone_number TEXT, note TEXT)',
			[],
			(_, results) => {
				console.log('Table patient created successfully')
			},
			error => {
				console.log('Error creating Patient table:', error)
			}
		)

		// Patient_problem Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS patient_problem (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, text TEXT)',
			[],
			(_, results) => {
				console.log('Table patient_problem created successfully')
			},
			error => {
				console.log('Error creating Patient_problem table:', error)
			}
		)

		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS patient_address (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, text TEXT)',
			[],
			(_, results) => {
				console.log('Table patient_address created successfully')
			},
			error => {
				console.log('Error creating patient_address table:', error)
			}
		)
	})
}

const insertPatient = (full_name, birthday, phone_number, note, problemList, locationList) => {
	db.transaction(
		tx => {
			tx.executeSql(
				'INSERT INTO patients (full_name, date_of_birth, phone_number, note) VALUES (?, ?, ?, ?)',
				[full_name, birthday, phone_number, note],
				(_, results) => {
					const patientId = results.insertId

					problemList.forEach(problem => {
						tx.executeSql(
							'INSERT INTO patient_problem (patient_id, text) VALUES (?, ?)',
							[patientId, problem.text],
							(_, results) => {
								console.log('Problem data inserted successfully')
							},
							error => {
								console.log('Error inserting Problem data:', error)
								throw new Error('Insert failed')
							}
						)
					})

					locationList.forEach(location => {
						tx.executeSql(
							'INSERT INTO patient_address (patient_id, text) VALUES (?, ?)',
							[patientId, location.text],
							(_, results) => {
								console.log('Location data inserted successfully')
							},
							error => {
								console.log('Error inserting Location data:', error)
								throw new Error('Insert failed')
							}
						)
					})
				},
				error => {
					console.log('Error inserting Patient data:', error)
					throw new Error('Insert failed')
				}
			)
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const insertPatientProblem = (patient_id, text) => {
	db.transaction(tx => {
		tx.executeSql(
			'INSERT INTO patient_problem (patient_id, text) VALUES (?, ?)',
			[patient_id, text],
			(_, results) => {
				console.log('Patient_problem data inserted successfully')
			},
			error => {
				console.log('Error inserting Patient_problem data:', error)
			}
		)
	})
}

const fetchPatientData = (patientId, callback) => {
	db.transaction(tx => {
		tx.executeSql(
			'SELECT p.id as patientId, p.full_name, p.phone_number, p.date_of_birth, p.note, pp.id as problemId, pp.text as problemText, pa.id as addressId, pa.text as addressText FROM patients p LEFT JOIN patient_problem pp ON p.id = pp.patient_id LEFT JOIN patient_address pa ON p.id = pa.patient_id WHERE p.id = ?',
			[patientId],
			(_, { rows }) => {
				const data = rows._array

				if (data.length === 0) {
					// Pacjent o podanym ID nie został znaleziony
					if (callback) {
						callback(null)
					}
					return
				}

				const patientData = {
					id: data[0].patientId,
					full_name: data[0].full_name,
					phone_number: data[0].phone_number,
					date_of_birth: data[0].date_of_birth,
					note: data[0].note,
					problems: [],
					addresses: [],
				}

				data.forEach(current => {
					if (
						current.problemId &&
						!patientData.problems.some(problem => problem.id === current.problemId)
					) {
						patientData.problems.push({
							id: current.problemId,
							text: current.problemText,
						})
					}

					if (
						current.addressId &&
						!patientData.addresses.some(address => address.id === current.addressId)
					) {
						patientData.addresses.push({
							id: current.addressId,
							text: current.addressText,
						})
					}
				})

				if (callback) {
					callback(patientData)
				}
			},
			error => {
				console.log('Error fetching patient data:', error)
				if (callback) {
					callback(null)
				}
			}
		)
	})
}

const fetchPatientList = callback => {
	db.transaction(tx => {
		tx.executeSql('SELECT * FROM patients', [], (_, { rows }) => {
			const data = rows._array
			if (callback) {
				callback(data)
			}
		})
		error => {
			console.log('Error fetching patient data:', error)
			if (callback) {
				callback([])
			}
		}
	})
}

export { initDatabase, insertPatient, insertPatientProblem, fetchPatientData, fetchPatientList }
