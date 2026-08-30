# LeadFlow Pro

Crée une application web CRM (Customer Relationship Management) simple et professionnelle pour gérer des leads clients générés depuis un formulaire de contact. Design épuré, palette bleu marine et blanc, orienté productivité et clarté.

Structure de l'application :

1. TABLEAU DE BORD / LISTE DES LEADS

- Vue tableau affichant tous les leads avec colonnes : Nom, Email, Source, Statut, Date d'ajout

- Filtre par statut (Nouveau / Contacté / Converti)

- Barre de recherche par nom ou email

- Bouton "Ajouter un lead" en haut à droite

2. AJOUT / ÉDITION D'UN LEAD

- Formulaire avec champs : Nom, Email, Téléphone, Source (site web, réseaux sociaux, recommandation, autre), Statut, Notes

- Bouton Enregistrer / Annuler

3. DÉTAIL D'UN LEAD

- Page ou modal affichant toutes les infos du lead

- Historique des notes et follow-ups (ajout de notes horodatées)

- Bouton pour changer le statut rapidement (badges colorés : gris pour Nouveau, orange pour Contacté, vert pour Converti)

4. AUTHENTIFICATION SIMPLE (admin)

- Page de connexion simple (email + mot de passe)

- Un seul compte admin protégeant l'accès au CRM

Exigences techniques :

- Frontend : React avec composants propres (Dashboard, LeadTable, LeadForm, LeadDetail, Login)

- Backend : Node.js + Express pour les routes API (CRUD complet : créer, lire, modifier, supprimer un lead)

- Base de données : MongoDB (via Mongoose)

- Design responsive, interface claire type SaaS professionnel

- Code propre et commenté, facile à comprendre et expliquer

- Gestion des statuts avec badges visuels colorés

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b351a5c8-7f70-4427-a8bc-4dbc992aef05).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
