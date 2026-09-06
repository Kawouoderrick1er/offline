const Database = require('better-sqlite3');
const path = require('node:path');

let database;

function initializeDatabase(userDataPath) {
	if (database) {
		return database;
	}

	const databasePath = path.join(userDataPath, 'lyceeconnect.sqlite');
	database = new Database(databasePath);
	database.pragma('journal_mode = WAL');
	database.pragma('foreign_keys = ON');
	database.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			password TEXT NOT NULL,
			role TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS students (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			class_name TEXT NOT NULL,
			status TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS classes (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL UNIQUE,
			level TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS grades (
			id TEXT PRIMARY KEY,
			student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			subject TEXT NOT NULL,
			value REAL NOT NULL CHECK(value >= 0 AND value <= 20),
			date TEXT NOT NULL
		);
		CREATE TABLE IF NOT EXISTS absences (
			id TEXT PRIMARY KEY,
			student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
			date TEXT NOT NULL,
			reason TEXT NOT NULL,
			justified INTEGER NOT NULL DEFAULT 0
		);
		CREATE TABLE IF NOT EXISTS schedule (
			id TEXT PRIMARY KEY,
			day TEXT NOT NULL,
			time TEXT NOT NULL,
			subject TEXT NOT NULL,
			class_name TEXT NOT NULL
		);
	`);

	seedDatabase();
	return database;
}

function seedDatabase() {
	const insertUser = database.prepare('INSERT OR IGNORE INTO users (id, password, role) VALUES (?, ?, ?)');
	const insertStudent = database.prepare('INSERT OR IGNORE INTO students (id, name, class_name, status) VALUES (?, ?, ?, ?)');
	const insertClass = database.prepare('INSERT OR IGNORE INTO classes (id, name, level) VALUES (?, ?, ?)');
	const insertGrade = database.prepare('INSERT OR IGNORE INTO grades (id, student_id, subject, value, date) VALUES (?, ?, ?, ?, ?)');
	const insertAbsence = database.prepare('INSERT OR IGNORE INTO absences (id, student_id, date, reason, justified) VALUES (?, ?, ?, ?, ?)');
	const insertSchedule = database.prepare('INSERT OR IGNORE INTO schedule (id, day, time, subject, class_name) VALUES (?, ?, ?, ?, ?)');

	database.transaction(() => {
		insertUser.run('admin', 'admin123', 'directeur');
		insertUser.run('secretaire', 'secret123', 'secrétariat');
		insertUser.run('prof', 'prof123', 'enseignant');
		insertStudent.run('1', 'Amina Diallo', 'Terminale A', 'Inscrite');
		insertStudent.run('2', 'Lucas Martin', 'Première C', 'Inscrit');
		insertStudent.run('3', 'Mariam Koné', 'Seconde B', 'Inscrite');
		insertClass.run('1', 'Seconde B', 'Seconde');
		insertClass.run('2', 'Première C', 'Première');
		insertClass.run('3', 'Terminale A', 'Terminale');
		insertGrade.run('1', '1', 'Mathématiques', 15, '2026-09-01');
		insertGrade.run('2', '2', 'Français', 13, '2026-09-02');
		insertGrade.run('3', '3', 'Histoire', 16, '2026-09-03');
		insertAbsence.run('1', '1', '2026-09-04', 'Rendez-vous médical', 1);
		insertAbsence.run('2', '2', '2026-09-05', 'Non précisée', 0);
		insertSchedule.run('1', 'Lundi', '08:00', 'Mathématiques', 'Terminale A');
		insertSchedule.run('2', 'Mardi', '10:00', 'Français', 'Première C');
		insertSchedule.run('3', 'Jeudi', '14:00', 'Histoire', 'Seconde B');
	})();
}

function getDashboardStats() {
	return {
		students: database.prepare('SELECT COUNT(*) AS count FROM students').get().count,
		absences: database.prepare('SELECT COUNT(*) AS count FROM absences').get().count,
		unjustifiedAbsences: database.prepare('SELECT COUNT(*) AS count FROM absences WHERE justified = 0').get().count,
		grades: database.prepare('SELECT COUNT(*) AS count FROM grades').get().count,
		average: database.prepare('SELECT COALESCE(AVG(value), 0) AS average FROM grades').get().average
	};
}

function closeDatabase() {
	if (database) {
		database.close();
		database = undefined;
	}
}

module.exports = { initializeDatabase, getDashboardStats, closeDatabase };
