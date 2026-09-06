const app = document.querySelector('#app');
const USERS_KEY = 'lyceeConnectUsers';
const SESSION_KEY = 'lyceeConnectSession';
const STUDENTS_KEY = 'lyceeConnectStudents';
const CLASSES_KEY = 'lyceeConnectClasses';
const GRADES_KEY = 'lyceeConnectGrades';

function seedUsers() {
	const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || 'null');
	if (existingUsers && Array.isArray(existingUsers) && existingUsers.length) {
		return;
	}

	const defaultUsers = [
		{ id: 'admin', password: 'admin123', role: 'directeur' },
		{ id: 'secretaire', password: 'secret123', role: 'secrétariat' },
		{ id: 'prof', password: 'prof123', role: 'enseignant' }
	];

	localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
}

function getUsers() {
	return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveSession(user) {
	localStorage.setItem(SESSION_KEY, JSON.stringify({
		id: user.id,
		role: user.role,
		connectedAt: new Date().toISOString()
	}));
}

function getSession() {
	const session = localStorage.getItem(SESSION_KEY);
	return session ? JSON.parse(session) : null;
}

function clearSession() {
	localStorage.removeItem(SESSION_KEY);
}

function seedStudents() {
	const existingStudents = JSON.parse(localStorage.getItem(STUDENTS_KEY) || 'null');
	if (Array.isArray(existingStudents)) {
		return;
	}

	const defaultStudents = [
		{ id: '1', name: 'Amina Diallo', className: 'Terminale A', status: 'Inscrite' },
		{ id: '2', name: 'Lucas Martin', className: 'Première C', status: 'Inscrit' },
		{ id: '3', name: 'Mariam Koné', className: 'Seconde B', status: 'Inscrite' }
	];

	localStorage.setItem(STUDENTS_KEY, JSON.stringify(defaultStudents));
}

function getStudents() {
	return JSON.parse(localStorage.getItem(STUDENTS_KEY) || '[]');
}

function saveStudents(students) {
	localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

function seedClasses() {
	const existingClasses = JSON.parse(localStorage.getItem(CLASSES_KEY) || 'null');
	if (Array.isArray(existingClasses)) {
		return;
	}

	localStorage.setItem(CLASSES_KEY, JSON.stringify([
		{ id: '1', name: 'Seconde B', level: 'Seconde' },
		{ id: '2', name: 'Première C', level: 'Première' },
		{ id: '3', name: 'Terminale A', level: 'Terminale' }
	]));
}

function getClasses() {
	return JSON.parse(localStorage.getItem(CLASSES_KEY) || '[]');
}

function saveClasses(classes) {
	localStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
}

function seedGrades() {
	const existingGrades = JSON.parse(localStorage.getItem(GRADES_KEY) || 'null');
	if (Array.isArray(existingGrades)) {
		return;
	}

	localStorage.setItem(GRADES_KEY, JSON.stringify([
		{ id: '1', studentId: '1', subject: 'Mathématiques', value: 15, date: '2026-09-01' },
		{ id: '2', studentId: '2', subject: 'Français', value: 13, date: '2026-09-02' },
		{ id: '3', studentId: '3', subject: 'Histoire', value: 16, date: '2026-09-03' }
	]));
}

function getGrades() {
	return JSON.parse(localStorage.getItem(GRADES_KEY) || '[]');
}

function saveGrades(grades) {
	localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
}

function escapeHtml(value) {
	return String(value).replace(/[&<>'"]/g, (character) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		"'": '&#39;',
		'"': '&quot;'
	}[character]));
}

function renderLogin() {
	app.innerHTML = `
		<section class="login-shell" aria-labelledby="login-title">
			<div class="brand-panel">
				<p class="eyebrow">Gestion scolaire · Offline-first</p>
				<h1>LycéeConnect<br><span>Offline</span></h1>
				<p class="brand-copy">La gestion pédagogique continue, même lorsque la connexion s’interrompt.</p>
				<div class="status-pill"><span class="status-dot"></span> Données locales protégées</div>
			</div>
			<div class="login-panel">
				<div class="login-heading">
					<p class="eyebrow">Espace établissement</p>
					<h2 id="login-title">Bienvenue</h2>
					<p>Connectez-vous pour accéder à votre tableau de bord.</p>
				</div>
				<form id="login-form">
					<label for="identifier">Identifiant</label>
					<input id="identifier" name="identifier" type="text" autocomplete="username" placeholder="Votre identifiant" required>
					<label for="password">Mot de passe</label>
					<input id="password" name="password" type="password" autocomplete="current-password" placeholder="Votre mot de passe" required>
					<button type="submit">Se connecter <span aria-hidden="true">→</span></button>
					<p id="login-message" class="form-message" role="status"></p>
				</form>
				<p class="offline-note"><span class="status-dot"></span> Le mode hors ligne est disponible après une première connexion.</p>
			</div>
		</section>
	`;

	document.querySelector('#login-form').addEventListener('submit', (event) => {
		event.preventDefault();
		const identifier = document.querySelector('#identifier').value.trim();
		const password = document.querySelector('#password').value.trim();
		const message = document.querySelector('#login-message');

		const user = getUsers().find((entry) => entry.id === identifier && entry.password === password);

		if (!user) {
			message.textContent = 'Identifiant ou mot de passe incorrect.';
			message.style.color = '#b23a3a';
			return;
		}

		message.textContent = 'Connexion réussie.';
		message.style.color = '#1f6b58';
		saveSession(user);
		setTimeout(() => renderDashboard(user), 300);
	});
}

function renderDashboard(user) {
	app.innerHTML = `
		<section class="dashboard-shell">
			<header class="topbar">
				<div>
					<p class="eyebrow">Tableau de bord</p>
					<h2>Bienvenue, ${user.id}</h2>
				</div>
				<div class="topbar-actions">
					<button id="students-button" class="secondary-button" type="button">Élèves</button>
					<button id="classes-button" class="secondary-button" type="button">Classes</button>
					<button id="grades-button" class="secondary-button" type="button">Notes</button>
					<button id="logout-button" class="logout-button" type="button">Déconnexion</button>
				</div>
			</header>

			<div class="stat-grid">
				<article class="stat-card">
					<span class="stat-label">Élèves</span>
					<strong>248</strong>
					<small>+12 ce mois</small>
				</article>
				<article class="stat-card">
					<span class="stat-label">Absences</span>
					<strong>18</strong>
					<small>3 non justifiées</small>
				</article>
				<article class="stat-card">
					<span class="stat-label">Notes</span>
					<strong>91%</strong>
					<small>Moyenne générale</small>
				</article>
			</div>

			<div class="panel-grid">
				<section class="panel">
					<h3>Vue rapide</h3>
					<ul>
						<li>Pointage des enseignants : OK</li>
						<li>Synchronisation locale : activée</li>
						<li>Mode hors ligne : disponible</li>
					</ul>
				</section>
				<section class="panel">
					<h3>Rôle</h3>
					<p>${user.role}</p>
					<p>Session active : ${new Date().toLocaleString('fr-FR')}</p>
				</section>
			</div>
		</section>
	`;

	document.querySelector('#logout-button').addEventListener('click', () => {
		clearSession();
		renderLogin();
	});
	document.querySelector('#students-button').addEventListener('click', () => renderStudents(user));
	document.querySelector('#classes-button').addEventListener('click', () => renderClasses(user));
	document.querySelector('#grades-button').addEventListener('click', () => renderGrades(user));
}

function renderStudents(user) {
	const students = getStudents();
	app.innerHTML = `
		<section class="dashboard-shell">
			<header class="topbar">
				<div>
					<p class="eyebrow">Dossier scolaire</p>
					<h2>Élèves</h2>
				</div>
				<div class="topbar-actions">
					<button id="back-button" class="secondary-button" type="button">Tableau de bord</button>
					<button id="logout-button" class="logout-button" type="button">Déconnexion</button>
				</div>
			</header>

			<section class="panel students-panel">
				<div class="section-heading">
					<div>
						<h3>Liste des élèves</h3>
						<p id="student-count">${students.length} élève${students.length > 1 ? 's' : ''} enregistré${students.length > 1 ? 's' : ''}</p>
					</div>
					<input id="student-search" class="search-input" type="search" placeholder="Rechercher un élève" aria-label="Rechercher un élève">
				</div>
				<form id="student-form" class="student-form">
					<input id="student-name" type="text" placeholder="Nom complet" aria-label="Nom complet" required>
					<input id="student-class" type="text" placeholder="Classe" aria-label="Classe" required>
					<button type="submit">Ajouter l'élève <span aria-hidden="true">+</span></button>
				</form>
				<p id="student-message" class="form-message" role="status"></p>
				<div id="student-list" class="student-list"></div>
			</section>
		</section>
	`;

	const renderStudentList = (query = '') => {
		const normalizedQuery = query.trim().toLowerCase();
		const filteredStudents = getStudents().filter((student) =>
			`${student.name} ${student.className}`.toLowerCase().includes(normalizedQuery)
		);
		const list = document.querySelector('#student-list');
		list.innerHTML = filteredStudents.length ? filteredStudents.map((student) => `
			<article class="student-row">
				<div><strong>${escapeHtml(student.name)}</strong><span>${escapeHtml(student.className)}</span></div>
				<div class="student-row-actions"><span class="student-status">${escapeHtml(student.status)}</span><button class="delete-student" data-id="${escapeHtml(student.id)}" type="button" aria-label="Supprimer ${escapeHtml(student.name)}">Supprimer</button></div>
			</article>
		`).join('') : '<p class="empty-state">Aucun élève trouvé.</p>';
		document.querySelector('#student-count').textContent = `${filteredStudents.length} élève${filteredStudents.length > 1 ? 's' : ''} affiché${filteredStudents.length > 1 ? 's' : ''}`;
		list.querySelectorAll('.delete-student').forEach((button) => {
			button.addEventListener('click', () => {
				saveStudents(getStudents().filter((student) => student.id !== button.dataset.id));
				renderStudentList(document.querySelector('#student-search').value);
			});
		});
	};

	document.querySelector('#student-search').addEventListener('input', (event) => renderStudentList(event.target.value));
	document.querySelector('#student-form').addEventListener('submit', (event) => {
		event.preventDefault();
		const nameInput = document.querySelector('#student-name');
		const classInput = document.querySelector('#student-class');
		const students = getStudents();
		students.push({ id: crypto.randomUUID(), name: nameInput.value.trim(), className: classInput.value.trim(), status: 'Inscrit' });
		saveStudents(students);
		event.target.reset();
		document.querySelector('#student-message').textContent = 'Élève ajouté localement.';
		renderStudentList();
	});

	document.querySelector('#back-button').addEventListener('click', () => renderDashboard(user));
	document.querySelector('#logout-button').addEventListener('click', () => {
		clearSession();
		renderLogin();
	});
	renderStudentList();
}

function renderClasses(user) {
	app.innerHTML = `
		<section class="dashboard-shell">
			<header class="topbar">
				<div>
					<p class="eyebrow">Organisation pédagogique</p>
					<h2>Classes</h2>
				</div>
				<div class="topbar-actions">
					<button id="back-button" class="secondary-button" type="button">Tableau de bord</button>
					<button id="logout-button" class="logout-button" type="button">Déconnexion</button>
				</div>
			</header>

			<section class="panel classes-panel">
				<div class="section-heading">
					<div>
						<h3>Répertoire des classes</h3>
						<p>Les effectifs sont calculés depuis les élèves enregistrés.</p>
					</div>
				</div>
				<form id="class-form" class="class-form">
					<input id="class-name" type="text" placeholder="Nom de la classe" aria-label="Nom de la classe" required>
					<input id="class-level" type="text" placeholder="Niveau" aria-label="Niveau" required>
					<button type="submit">Ajouter la classe <span aria-hidden="true">+</span></button>
				</form>
				<p id="class-message" class="form-message" role="status"></p>
				<div id="class-list" class="class-list"></div>
			</section>
		</section>
	`;

	const renderClassList = () => {
		const students = getStudents();
		const list = document.querySelector('#class-list');
		list.innerHTML = getClasses().length ? getClasses().map((schoolClass) => {
			const studentCount = students.filter((student) => student.className === schoolClass.name).length;
			return `
				<article class="class-row">
					<div><strong>${escapeHtml(schoolClass.name)}</strong><span>${escapeHtml(schoolClass.level)}</span></div>
					<div class="class-row-actions"><span>${studentCount} élève${studentCount > 1 ? 's' : ''}</span><button class="delete-class" data-id="${escapeHtml(schoolClass.id)}" type="button" aria-label="Supprimer ${escapeHtml(schoolClass.name)}">Supprimer</button></div>
				</article>
			`;
		}).join('') : '<p class="empty-state">Aucune classe enregistrée.</p>';
		list.querySelectorAll('.delete-class').forEach((button) => {
			button.addEventListener('click', () => {
				saveClasses(getClasses().filter((schoolClass) => schoolClass.id !== button.dataset.id));
				renderClassList();
			});
		});
	};

	document.querySelector('#class-form').addEventListener('submit', (event) => {
		event.preventDefault();
		const nameInput = document.querySelector('#class-name');
		const levelInput = document.querySelector('#class-level');
		const classes = getClasses();
		if (classes.some((schoolClass) => schoolClass.name.toLowerCase() === nameInput.value.trim().toLowerCase())) {
			document.querySelector('#class-message').textContent = 'Cette classe existe déjà.';
			return;
		}
		classes.push({ id: crypto.randomUUID(), name: nameInput.value.trim(), level: levelInput.value.trim() });
		saveClasses(classes);
		event.target.reset();
		document.querySelector('#class-message').textContent = 'Classe ajoutée localement.';
		renderClassList();
	});

	document.querySelector('#back-button').addEventListener('click', () => renderDashboard(user));
	document.querySelector('#logout-button').addEventListener('click', () => {
		clearSession();
		renderLogin();
	});
	renderClassList();
}

function renderGrades(user) {
	const students = getStudents();
	app.innerHTML = `
		<section class="dashboard-shell">
			<header class="topbar">
				<div>
					<p class="eyebrow">Suivi pédagogique</p>
					<h2>Notes</h2>
				</div>
				<div class="topbar-actions">
					<button id="back-button" class="secondary-button" type="button">Tableau de bord</button>
					<button id="logout-button" class="logout-button" type="button">Déconnexion</button>
				</div>
			</header>

			<section class="panel grades-panel">
				<div class="section-heading">
					<div>
						<h3>Carnet de notes</h3>
						<p id="grade-summary"></p>
					</div>
				</div>
				<form id="grade-form" class="grade-form">
					<select id="grade-student" aria-label="Élève" required>
						<option value="">Choisir un élève</option>
						${students.map((student) => `<option value="${escapeHtml(student.id)}">${escapeHtml(student.name)}</option>`).join('')}
					</select>
					<input id="grade-subject" type="text" placeholder="Matière" aria-label="Matière" required>
					<input id="grade-value" type="number" min="0" max="20" step="0.5" placeholder="Note / 20" aria-label="Note sur 20" required>
					<button type="submit">Ajouter la note <span aria-hidden="true">+</span></button>
				</form>
				<p id="grade-message" class="form-message" role="status"></p>
				<div id="grade-list" class="grade-list"></div>
			</section>
		</section>
	`;

	const renderGradeList = () => {
		const currentStudents = getStudents();
		const currentGrades = getGrades();
		const list = document.querySelector('#grade-list');
		const average = currentGrades.length ? currentGrades.reduce((total, grade) => total + Number(grade.value), 0) / currentGrades.length : 0;
		document.querySelector('#grade-summary').textContent = `${currentGrades.length} note${currentGrades.length > 1 ? 's' : ''} enregistrée${currentGrades.length > 1 ? 's' : ''} · moyenne générale ${average.toFixed(1)}/20`;
		list.innerHTML = currentGrades.length ? currentGrades.map((grade) => {
			const student = currentStudents.find((entry) => entry.id === grade.studentId);
			return `
				<article class="grade-row">
					<div><strong>${escapeHtml(student ? student.name : 'Élève supprimé')}</strong><span>${escapeHtml(grade.subject)} · ${escapeHtml(grade.date)}</span></div>
					<div class="grade-row-actions"><strong class="grade-value">${Number(grade.value).toFixed(1)}/20</strong><button class="delete-grade" data-id="${escapeHtml(grade.id)}" type="button" aria-label="Supprimer cette note">Supprimer</button></div>
				</article>
			`;
		}).join('') : '<p class="empty-state">Aucune note enregistrée.</p>';
		list.querySelectorAll('.delete-grade').forEach((button) => {
			button.addEventListener('click', () => {
				saveGrades(getGrades().filter((grade) => grade.id !== button.dataset.id));
				renderGradeList();
			});
		});
	};

	document.querySelector('#grade-form').addEventListener('submit', (event) => {
		event.preventDefault();
		const value = Number(document.querySelector('#grade-value').value);
		if (value < 0 || value > 20) {
			document.querySelector('#grade-message').textContent = 'La note doit être comprise entre 0 et 20.';
			return;
		}
		const grades = getGrades();
		grades.push({
			id: crypto.randomUUID(),
			studentId: document.querySelector('#grade-student').value,
			subject: document.querySelector('#grade-subject').value.trim(),
			value,
			date: new Date().toISOString().slice(0, 10)
		});
		saveGrades(grades);
		event.target.reset();
		document.querySelector('#grade-message').textContent = 'Note ajoutée localement.';
		renderGradeList();
	});

	document.querySelector('#back-button').addEventListener('click', () => renderDashboard(user));
	document.querySelector('#logout-button').addEventListener('click', () => {
		clearSession();
		renderLogin();
	});
	renderGradeList();
}

seedUsers();
seedStudents();
seedClasses();
seedGrades();

const savedSession = getSession();
if (savedSession) {
	const user = getUsers().find((entry) => entry.id === savedSession.id);
	if (user) {
		renderDashboard(user);
	} else {
		clearSession();
		renderLogin();
	}
} else {
	renderLogin();
}
