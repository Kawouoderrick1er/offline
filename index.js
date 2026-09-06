const app = document.querySelector('#app');
const USERS_KEY = 'lyceeConnectUsers';
const SESSION_KEY = 'lyceeConnectSession';

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
				<button id="logout-button" class="logout-button" type="button">Déconnexion</button>
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
}

seedUsers();

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
