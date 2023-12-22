import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('fp_sqlite', '1.0')

const initDatabase = () => {
	db.transaction(tx => {
		// Patient Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS Patient (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, date_of_birth DATE, phone_number TEXT, note TEXT)',
			[],
			(_, results) => {
				console.log('Table Patient created successfully')
			},
			error => {
				console.log('Error creating Patient table:', error)
			}
		)

		// Patient_problem Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS Patient_problem (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, text TEXT)',
			[],
			(_, results) => {
				console.log('Table Patient_problem created successfully')
			},
			error => {
				console.log('Error creating Patient_problem table:', error)
			}
		)
	})
}

const insertPatient = (full_name, birthday, phone_number, note, problemList) => {
	db.transaction(
		tx => {
			tx.executeSql(
				'INSERT INTO Patient (full_name, date_of_birth, phone_number, note) VALUES (?, ?, ?, ?)',
				[full_name, birthday, phone_number, note],
				(_, results) => {
					const patientId = results.insertId

					problemList.forEach(problem => {
						tx.executeSql(
							'INSERT INTO Patient_problem (patient_id, text) VALUES (?, ?)',
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
			'INSERT INTO Patient_problem (patient_id, text) VALUES (?, ?)',
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

function convertToDate(day, month, year) {
	// Ustawienie daty w formacie dzień/miesiąc/rok
	const dateString = `${year}-${month}-${day}`

	// Utworzenie obiektu Date
	const dateObject = new Date(dateString)

	return dateObject
}

const fetchPatientData = callback => {
	db.transaction(tx => {
		tx.executeSql(
			'SELECT p.id as patientId, p.full_name, p.phone_number, p.date_of_birth, p.note, pp.id as problemId, pp.text FROM Patient p LEFT JOIN Patient_problem pp ON p.id = pp.patient_id',
			[],
			(_, { rows }) => {
				const data = rows._array

				const patientsWithProblems = data.reduce((result, current) => {
					const existingPatient = result.find(patient => patient.id === current.patientId)

					const [day, month, year] = current.date_of_birth.split('.')
					const birthDate = convertToDate(day, month, year)

					if (!existingPatient) {
						const newPatient = {
							id: current.patientId,
							full_name: current.full_name,
							phone_number: current.phone_number,
							date_of_birth: birthDate,
							note: current.note,
							problems: [],
						}
						if (current.problemId) {
							newPatient.problems.push({
								id: current.problemId,
								text: current.text,
							})
						}
						result.push(newPatient)
					} else {
						if (current.problemId) {
							existingPatient.problems.push({
								id: current.problemId,
								text: current.text,
							})
						}
					}

					return result
				}, [])

				if (callback) {
					callback(patientsWithProblems)
				}
			},
			error => {
				console.log('Error fetching patient data:', error)
				if (callback) {
					callback([])
				}
			}
		)
	})
}

export { initDatabase, insertPatient, insertPatientProblem, fetchPatientData }
