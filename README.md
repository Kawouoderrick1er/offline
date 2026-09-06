# LycéeConnect Offline

Application Electron de gestion scolaire, conçue pour fonctionner hors ligne avec une base SQLite locale.

## Lancer le projet

Depuis le dossier du projet :

```bash
npm install
npm start
```

La fenêtre de l’application s’ouvre automatiquement.

## Identifiants de démonstration

| Identifiant | Mot de passe | Rôle |
| --- | --- | --- |
| `admin` | `admin123` | Directeur |
| `secretaire` | `secret123` | Secrétariat |
| `prof` | `prof123` | Enseignant |
| `eleve1` | `eleve123` | Élève : Amina Diallo |

La base SQLite est créée automatiquement dans le dossier de données utilisateur d’Electron. Les données restent disponibles sans connexion Internet.

Le compte élève affiche uniquement ses propres notes, absences et cours. Les comptes adultes conservent l’accès aux outils de gestion.
