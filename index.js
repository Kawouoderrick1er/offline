const app = document.querySelector('#app');
const USERS_KEY = 'lyceeConnectUsers';
const SESSION_KEY = 'lyceeConnectSession';
const STUDENTS_KEY = 'lyceeConnectStudents';

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

seedUsers();
seedStudents();

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
