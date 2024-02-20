import * as SQLite from 'expo-sqlite'
import * as DocumentPicker from 'expo-document-picker'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'
import { startOfWeek, endOfWeek, format, addDays, startOfDay, endOfDay } from 'date-fns'
import plLocale from 'date-fns/locale/pl'
import { Platform } from 'react-native'

const db = SQLite.openDatabase('fp_sqlite', '1.0')

const initDatabase = () => {
	db.transaction(tx => {
		// Patient Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, date_of_birth DATE, phone_number TEXT, note TEXT, is_deleted INTEGER DEFAULT 0)',
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
			'CREATE TABLE IF NOT EXISTS patient_problem (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, text TEXT, is_deleted INTEGER DEFAULT 0)',
			[],
			(_, results) => {
				console.log('Table patient_problem created successfully')
			},
			error => {
				console.log('Error creating Patient_problem table:', error)
			}
		)

		// Patient_address Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS patient_address (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, text TEXT, is_deleted INTEGER DEFAULT 0, is_disposable INTEGER DEFAULT 0)',
			[],
			(_, results) => {
				console.log('Table patient_address created successfully')
			},
			error => {
				console.log('Error creating patient_address table:', error)
			}
		)

		// Visit Table
		tx.executeSql(
			'CREATE TABLE IF NOT EXISTS visit (id INTEGER PRIMARY KEY AUTOINCREMENT, patient_id INTEGER, address_id INTEGER, note TEXT, date INTEGER, time_start INTEGER, time_end INTEGER, is_deleted INTEGER DEFAULT 0)',
			[],
			(_, results) => {
				console.log('Table visit created successfully')
			},
			error => {
				console.log('Error creating visit table:', error)
			}
		)
	})
}

// const updateVisit = (visit_id, patient_id, address, note, date, time_start, time_end, callback) => {
// 	db.transaction(
// 		tx => {
// 			tx.executeSql(
// 				'UPDATE visit SET patient_id = ?, address = ?, note = ?, date = ?, time_start = ?, time_end = ? WHERE id = ?',
// 				[patient_id, address, note, date, time_start, time_end, visit_id],
// 				(_, results) => {
// 					if (results.rowsAffected > 0) {
// 						console.log('Visit data updated successfully')
// 						callback({ success: true, message: 'Visit data updated successfully' })
// 					} else {
// 						console.log('No rows updated')
// 						callback({ success: false, message: 'No rows updated' })
// 					}
// 				},
// 				(tx, error) => {
// 					console.log('Error updating visit data:', error)
// 					callback({ success: false, message: 'Error updating visit data' })
// 				}
// 			)
// 		},
// 		error => {
// 			console.log('Transaction error:', error)
// 			callback({ success: false, message: 'Transaction failed' })
// 		}
// 	)
// }

const updateVisit = (
	visit_id,
	patient_id,
	address_id,
	address_text,
	note,
	date,
	time_start,
	time_end,
	callback
) => {
	db.transaction(
		tx => {
			const updateVisitWithAddress = (
				visit_id,
				patient_id,
				address_id,
				note,
				date,
				time_start,
				time_end,
				callback
			) => {
				tx.executeSql(
					'UPDATE visit SET patient_id = ?, address_id = ?, note = ?, date = ?, time_start = ?, time_end = ? WHERE id = ?',
					[patient_id, address_id, note, date, time_start, time_end, visit_id],
					(_, results) => {
						if (results.rowsAffected > 0) {
							console.log('Visit data updated successfully')
							callback({ success: true, message: 'Visit data updated successfully' })
						} else {
							console.log('No rows updated')
							callback({ success: false, message: 'No rows updated' })
						}
					},
					(tx, error) => {
						console.log('Error updating visit data:', error)
						callback({ success: false, message: 'Error updating visit data' })
					}
				)
			}

			if (address_id !== null) {
				updateVisitWithAddress(
					visit_id,
					patient_id,
					address_id,
					note,
					date,
					time_start,
					time_end,
					callback
				)
			} else {
				// Sprawdź, czy istnieje adres o podanym tekście
				tx.executeSql(
					'SELECT id FROM patient_address WHERE text = ? AND is_deleted = 0',
					[address_text],
					(_, { rows }) => {
						if (rows.length > 0) {
							const existingAddressId = rows.item(0).id
							updateVisitWithAddress(
								visit_id,
								patient_id,
								existingAddressId,
								note,
								date,
								time_start,
								time_end,
								callback
							)
						} else {
							// Dodaj nowy adres do bazy danych
							tx.executeSql(
								'INSERT INTO patient_address (patient_id, text) VALUES (?, ?)',
								[patient_id, address_text],
								(_, { insertId }) => {
									updateVisitWithAddress(
										visit_id,
										patient_id,
										insertId,
										note,
										date,
										time_start,
										time_end,
										callback
									)
								},
								error => {
									console.log('Error inserting new Address data:', error)
									throw new Error('Update failed')
								}
							)
						}
					},
					error => {
						console.log('Error checking existing Address:', error)
						throw new Error('Transaction failed')
					}
				)
			}
		},
		error => {
			console.log('Transaction error:', error)
			callback({ success: false, message: 'Transaction failed' })
		}
	)
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

const updatePatient = (
	patientId,
	full_name,
	birthday,
	phone_number,
	note,
	updatedProblems,
	updatedAddresses
) => {
	db.transaction(
		tx => {
			tx.executeSql(
				'UPDATE patients SET full_name = ?, date_of_birth = ?, phone_number = ?, note = ? WHERE id = ?',
				[full_name, birthday, phone_number, note, patientId],
				(_, results) => {
					console.log('Patient data updated successfully')
				},
				error => {
					console.log('Error updating Patient data:', error)
					throw new Error('Update failed')
				}
			)

			tx.executeSql(
				'DELETE FROM patient_problem WHERE patient_id = ?',
				[patientId],
				(_, results) => {
					console.log('Deleted old problems successfully')
				},
				error => {
					console.log('Error deleting old problems:', error)
					throw new Error('Update failed')
				}
			)

			updatedProblems.forEach(problem => {
				tx.executeSql(
					'INSERT INTO patient_problem (patient_id, text) VALUES (?, ?)',
					[patientId, problem.text],
					(_, results) => {
						console.log('Problem data inserted successfully')
					},
					error => {
						console.log('Error inserting Problem data:', error)
						throw new Error('Update failed')
					}
				)
			})

			tx.executeSql(
				'DELETE FROM patient_address WHERE patient_id = ?',
				[patientId],
				(_, results) => {
					console.log('Deleted old addresses successfully')
				},
				error => {
					console.log('Error deleting old addresses:', error)
					throw new Error('Update failed')
				}
			)

			updatedAddresses.forEach(address => {
				tx.executeSql(
					'INSERT INTO patient_address (patient_id, text) VALUES (?, ?)',
					[patientId, address.text],
					(_, results) => {
						console.log('Address data inserted successfully')
					},
					error => {
						console.log('Error inserting Address data:', error)
						throw new Error('Update failed')
					}
				)
			})
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const fetchPatientData = (patientId, callback) => {
	const currentDate = new Date()
	const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`

	db.transaction(tx => {
		tx.executeSql(
			'SELECT p.id as patientId, p.full_name, p.phone_number, p.date_of_birth, p.note, ' +
				'pp.id as problemId, pp.text as problemText, pa.id as addressId, pa.text as addressText, ' +
				'v.id as visitId, v.note as visitNote, v.address_id as visitAddressId, strftime("%Y-%m-%d", v.date/1000, "unixepoch", "localtime") as visitDate, ' +
				'v.time_start as visitTimeStart, v.time_end as visitTimeEnd ' +
				'FROM patients p ' +
				'LEFT JOIN patient_problem pp ON p.id = pp.patient_id AND pp.is_deleted = 0 ' +
				'LEFT JOIN patient_address pa ON p.id = pa.patient_id AND pa.is_deleted = 0 ' +
				'LEFT JOIN visit v ON p.id = v.patient_id AND v.is_deleted = 0 ' +
				'WHERE p.id = ? AND p.is_deleted = 0 ' +
				'ORDER BY visitDate ASC',
			[patientId],
			(_, { rows }) => {
				const data = rows._array

				if (data.length === 0) {
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
					visits: [],
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

					if (current.visitId) {
						const visitDate = new Date(current.visitDate)
						if (visitDate >= currentDate) {
							if (!patientData.visits.some(visit => visit.id === current.visitId)) {
								const visitAddress = data.find(
									address => address.addressId === current.visitAddressId
								)
								patientData.visits.push({
									id: current.visitId,
									address: visitAddress ? visitAddress.addressText : null, // Dodaj adres wizyty
									note: current.visitNote,
									date: current.visitDate,
									time_start: current.visitTimeStart,
									time_end: current.visitTimeEnd,
								})
							}
						}
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
	const currentDate = new Date()
	const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`

	db.transaction(tx => {
		tx.executeSql(
			'SELECT p.id, p.full_name, p.date_of_birth, COUNT(v.id) as upcoming_visits_count ' +
				'FROM patients p ' +
				"LEFT JOIN visit v ON p.id = v.patient_id AND strftime('%Y-%m-%d', v.date/1000, 'unixepoch', 'localtime') >= ? " +
				'WHERE p.is_deleted = 0 ' +
				'GROUP BY p.id, p.full_name ' +
				'ORDER BY upcoming_visits_count DESC',
			[formattedCurrentDate],
			(_, { rows }) => {
				const data = rows._array
				if (callback) {
					callback(null, data)
				}
			},
			error => {
				console.log('Error fetching patient data:', error)
				if (callback) {
					callback(error, [])
				}
			}
		)
	})
}

const fetchPatientListWithAddresses = callback => {
	db.transaction(tx => {
		tx.executeSql(
			'SELECT p.id as patientId, p.full_name, p.date_of_birth, p.phone_number, p.note, pa.id as addressId, pa.text as addressText ' +
				'FROM patients p ' +
				'LEFT JOIN patient_address pa ON p.id = pa.patient_id ' +
				'WHERE pa.is_deleted = 0 AND pa.is_disposable = 0',
			[],
			(_, { rows }) => {
				const data = rows._array

				const patientsWithAddresses = data.reduce((acc, current) => {
					const existingPatient = acc.find(patient => patient.id === current.patientId)

					if (!existingPatient) {
						const newPatient = {
							id: current.patientId,
							full_name: current.full_name,
							date_of_birth: current.date_of_birth,
							phone_number: current.phone_number,
							note: current.note,
							addresses: current.addressId
								? [
										{
											id: current.addressId,
											text: current.addressText,
										},
								  ]
								: [],
						}

						acc.push(newPatient)
					} else {
						if (current.addressId) {
							existingPatient.addresses.push({
								id: current.addressId,
								text: current.addressText,
							})
						}
					}

					return acc
				}, [])

				if (callback) {
					callback(patientsWithAddresses.length > 0 ? patientsWithAddresses : [])
				}
			},
			error => {
				console.log('Error fetching patient data with addresses:', error)
				if (callback) {
					callback([])
				}
			}
		)
	})
}

const insertVisit = (patient_id, address_id, address_text, note, dateList) => {
	console.log(`Address_id: ${address_id}`)
	console.log(`Address_text: ${address_text}`)

	db.transaction(
		tx => {
			const insertVisitWithAddress = (patient_id, address_id, note, dateList) => {
				dateList.forEach(date => {
					tx.executeSql(
						'INSERT INTO visit (patient_id, address_id, note, date, time_start, time_end) VALUES (?, ?, ?, ?, ?, ?)',
						[patient_id, address_id, note, date.date, date.timeStart, date.timeEnd],
						(_, results) => {
							console.log('Visit data inserted successfully')
						},
						error => {
							console.log('Error inserting Visit data:', error)
							throw new Error('Insert failed')
						}
					)
				})
			}

			if (address_id !== null) {
				insertVisitWithAddress(patient_id, address_id, note, dateList)
			} else {
				// Sprawdź, czy istnieje adres o podanym tekście
				tx.executeSql(
					'SELECT id FROM patient_address WHERE text = ? AND is_deleted = 0',
					[address_text],
					(_, { rows }) => {
						if (rows.length > 0) {
							const existingAddressId = rows.item(0).id
							insertVisitWithAddress(patient_id, existingAddressId, note, dateList)
						} else {
							// Dodaj nowy adres do bazy danych
							tx.executeSql(
								'INSERT INTO patient_address (patient_id, text, is_disposable) VALUES (?, ?, ?)',
								[patient_id, address_text, 1],
								(_, { insertId }) => {
									insertVisitWithAddress(patient_id, insertId, note, dateList)
								},
								error => {
									console.log('Error inserting new Address data:', error)
									throw new Error('Insert failed')
								}
							)
						}
					},
					error => {
						console.log('Error checking existing Address:', error)
						throw new Error('Transaction failed')
					}
				)
			}
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

// const fetchAllVisits = callback => {
// 	db.transaction(
// 		tx => {
// 			tx.executeSql(
// 				'SELECT v.id as visitId, v.patient_id, v.address, v.note, v.date, v.time_start, v.time_end, ' +
// 					'p.full_name ' +
// 					'FROM visit v ' +
// 					'LEFT JOIN patients p ON v.patient_id = p.id ' +
// 					'WHERE v.is_deleted = 0',
// 				[],
// 				(_, { rows }) => {
// 					const data = rows._array

// 					const visits = data.map(current => ({
// 						id: current.visitId,
// 						patient_id: current.patient_id,
// 						address: current.address,
// 						note: current.note,
// 						date: current.date,
// 						time_start: current.time_start,
// 						time_end: current.time_end,
// 						patient_full_name: current.full_name,
// 					}))

// 					if (callback) {
// 						callback(visits)
// 					}
// 				},
// 				(tx, error) => {
// 					console.log('Transaction error:', error)

// 					if (callback) {
// 						callback([], error)
// 					}
// 				}
// 			)
// 		},
// 		error => {
// 			console.log('Transaction error:', error)
// 			throw new Error('Transaction failed')
// 		}
// 	)
// }

const fetchAllVisits = callback => {
	db.transaction(
		tx => {
			tx.executeSql(
				'SELECT v.id as visitId, v.patient_id, v.address_id, v.note, v.date, v.time_start, v.time_end, ' +
					'p.full_name, pa.text as addressText ' +
					'FROM visit v ' +
					'LEFT JOIN patients p ON v.patient_id = p.id ' +
					'LEFT JOIN patient_address pa ON v.address_id = pa.id ' +
					'WHERE v.is_deleted = 0',
				[],
				(_, { rows }) => {
					const data = rows._array

					const visits = data.map(current => ({
						id: current.visitId,
						patient_id: current.patient_id,
						address: current.addressText,
						note: current.note,
						date: current.date,
						time_start: current.time_start,
						time_end: current.time_end,
						patient_full_name: current.full_name,
					}))

					if (callback) {
						callback(visits)
					}
				},
				(tx, error) => {
					console.log('Transaction error:', error)

					if (callback) {
						callback([], error)
					}
				}
			)
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const fetchVisitById = (visitId, callback) => {
	db.transaction(
		tx => {
			tx.executeSql(
				'SELECT v.id as visitId, v.patient_id, v.address_id, v.note, v.date, v.time_start, v.time_end, ' +
					'p.full_name, pa.text as addressText ' +
					'FROM visit v ' +
					'LEFT JOIN patients p ON v.patient_id = p.id ' +
					'LEFT JOIN patient_address pa ON v.address_id = pa.id ' +
					'WHERE v.id = ? AND v.is_deleted = 0',
				[visitId],
				(_, { rows }) => {
					if (rows.length > 0) {
						const visitData = rows.item(0)
						const visit = {
							id: visitData.visitId,
							patient_id: visitData.patient_id,
							address_id: visitData.address_id,
							address: visitData.addressText,
							note: visitData.note,
							date: visitData.date,
							time_start: visitData.time_start,
							time_end: visitData.time_end,
							patient_full_name: visitData.full_name,
						}
						callback(visit)
					} else {
						callback(null, 'Visit not found')
					}
				},
				(tx, error) => {
					console.log('Transaction error:', error)
					callback(null, 'Error fetching visit')
				}
			)
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const fetchAllVisitsThisWeek = callback => {
	const currentDate = new Date()

	const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1, locale: plLocale })
	const endOfCurrentWeek = addDays(startOfCurrentWeek, 6)

	const formattedStartOfWeek = `${startOfCurrentWeek.getFullYear()}-${(
		startOfCurrentWeek.getMonth() + 1
	)
		.toString()
		.padStart(2, '0')}-${startOfCurrentWeek.getDate().toString().padStart(2, '0')}`

	const formattedEndOfWeek = `${endOfCurrentWeek.getFullYear()}-${(endOfCurrentWeek.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${endOfCurrentWeek.getDate().toString().padStart(2, '0')}`

	db.transaction(
		tx => {
			tx.executeSql(
				"SELECT v.id as visitId, v.patient_id, v.note, strftime('%Y-%m-%d', v.date/1000, 'unixepoch') as formattedDate, v.time_start, v.time_end, p.full_name, pa.text as addressText " +
					'FROM visit v ' +
					'LEFT JOIN patients p ON v.patient_id = p.id ' +
					'LEFT JOIN patient_address pa ON v.address_id = pa.id ' +
					'WHERE formattedDate BETWEEN ? AND ? AND v.is_deleted = 0',
				[formattedStartOfWeek, formattedEndOfWeek],
				(_, { rows }) => {
					const data = rows._array

					const visits = data.map(current => ({
						id: current.visitId,
						patient_id: current.patient_id,
						address: current.addressText,
						note: current.note,
						date: current.formattedDate,
						time_start: current.time_start,
						time_end: current.time_end,
						patient_full_name: current.full_name,
					}))

					if (callback) {
						callback(visits)
					}
				},
				(tx, error) => {
					console.log('Transaction error:', error)

					if (callback) {
						callback([], error)
					}
				}
			)
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const fetchUpcomingVisits = callback => {
	const currentDate = new Date()
	const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`

	db.transaction(
		tx => {
			tx.executeSql(
				"SELECT v.id as visitId, v.patient_id, pa.text as addressText, v.note, strftime('%Y-%m-%d', v.date/1000, 'unixepoch', 'localtime') as formattedDate, v.time_start, v.time_end, p.full_name " +
					'FROM visit v ' +
					'LEFT JOIN patients p ON v.patient_id = p.id ' +
					'LEFT JOIN patient_address pa ON v.address_id = pa.id ' +
					'WHERE formattedDate >= ? AND v.is_deleted = 0 ' +
					'ORDER BY formattedDate ASC ' +
					'LIMIT 10',
				[formattedCurrentDate],
				(_, { rows }) => {
					const data = rows._array

					const visits = data.map(current => ({
						id: current.visitId,
						patient_id: current.patient_id,
						address: current.addressText,
						note: current.note,
						date: current.formattedDate,
						time_start: current.time_start,
						time_end: current.time_end,
						patient_full_name: current.full_name,
					}))

					if (callback) {
						callback(visits)
					}
				},
				(tx, error) => {
					console.log('Transaction error:', error)

					if (callback) {
						callback([], error)
					}
				}
			)
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const deleteVisit = (id, callback) => {
	db.transaction(
		tx => {
			tx.executeSql(
				'UPDATE visit SET is_deleted = 1 WHERE id = ?',
				[id],
				(_, results) => {
					if (results.rowsAffected > 0) {
						callback(true)
					} else {
						callback(false, '[record not found]')
					}
				},
				error => {
					callback(false, '[sql error]')
				}
			)
		},
		error => {
			callback(false, '[transaction error]')
		}
	)
}

const deletePatient = (id, callback) => {
	db.transaction(
		tx => {
			tx.executeSql(
				'UPDATE patients SET is_deleted = 1 WHERE id = ?',
				[id],
				(_, results) => {
					if (results.rowsAffected > 0) {
						tx.executeSql(
							'UPDATE patient_problem SET is_deleted = 1 WHERE patient_id = ?',
							[id],
							(_, results) => {}
						)
						tx.executeSql(
							'UPDATE patient_address SET is_deleted = 1 WHERE patient_id = ?',
							[id],
							(_, results) => {}
						)

						callback(true)
					} else {
						callback(false, '[record not found]')
					}
				},
				error => {
					callback(false, '[sql error]')
				}
			)
		},
		error => {
			callback(false, '[transaction error]')
		}
	)
}

const fetchVisitsByDate = (date, callback) => {
	const startOfDayTimestamp = startOfDay(date).getTime()
	const endOfDayTimestamp = endOfDay(date).getTime()

	db.transaction(
		tx => {
			tx.executeSql(
				`SELECT v.id, v.patient_id, v.note, v.time_start, v.time_end, p.full_name AS patient_name,
				pa.text as addressText 
                FROM visit v 
                LEFT JOIN patients p ON v.patient_id = p.id 
				LEFT JOIN patient_address pa ON v.address_id = pa.id 
                WHERE v.date BETWEEN ? AND ? AND v.is_deleted = 0`,
				[startOfDayTimestamp, endOfDayTimestamp],
				(_, { rows }) => {
					const data = rows._array
					const visits = data.map(current => ({
						id: current.id,
						patient_id: current.patient_id,
						patient_name: current.patient_name,
						address: current.addressText,
						note: current.note,
						time_start: current.time_start,
						time_end: current.time_end,
					}))
					if (callback) {
						callback(visits)
					}
				},
				(_, error) => {
					console.log('Error fetching visits by date:', error)
					if (callback) {
						callback([], error)
					}
				}
			)
		},
		error => {
			console.log('Transaction error:', error)
			throw new Error('Transaction failed')
		}
	)
}

const exportDatabase = async () => {
	if (Platform.OS === 'android') {
		const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
		if (permissions.granted) {
			const base64 = await FileSystem.readAsStringAsync(
				FileSystem.documentDirectory + 'SQLite/fp_sqlite.db',
				{
					encoding: FileSystem.EncodingType.Base64,
				}
			)

			await FileSystem.StorageAccessFramework.createFileAsync(
				permissions.directoryUri,
				'fp_sqlite.db',
				'application/octet-stream'
			)
				.then(async uri => {
					await FileSystem.writeAsStringAsync(uri, base64, {
						encoding: FileSystem.EncodingType.Base64,
					})
				})
				.catch(e => console.log(e))
		} else {
			console.log(`Permission not granted`)
		}
	} else {
		await Sharing.shareAsync(FileSystem.documentDirectory + 'fp_sqlite.db')
	}
}

const importDatabase = async () => {
	let result = await DocumentPicker.getDocumentAsync({
		copyToCacheDirectory: true,
	})

	if (result.type === 'success') {
		console.log('Wczytuje')

		if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
			await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite')
		}
	}

	const base64 = await FileSystem.readAsStringAsync(result.uri, {
		encoding: FileSystem.EncodingType.Base64,
	})

	await FileSystem.writeAsStringAsync(
		FileSystem.documentDirectory + 'SQLite/fp_sqlite.db',
		base64,
		{
			encoding: FileSystem.EncodingType.Base64,
		}
	)
	await db.closeAsync()
	//setDb(SQLite.openDatabase('example.db'))
}

export {
	initDatabase,
	insertPatient,
	updatePatient,
	insertPatientProblem,
	fetchPatientData,
	fetchPatientList,
	fetchPatientListWithAddresses,
	insertVisit,
	fetchAllVisits,
	fetchVisitById,
	updateVisit,
	fetchAllVisitsThisWeek,
	fetchUpcomingVisits,
	deleteVisit,
	deletePatient,
	fetchVisitsByDate,
	exportDatabase,
}
