# CampusRate

API REST permettant à la communauté étudiante de consulter les endroits et services du campus, puis de publier des appréciations accompagnées d’une note.

Projet réalisé dans le cadre du travail pratique 1 du cours **420-514 – Collecte et interprétation des données**, session Automne 2026.

---

## Table des matières

- [Objectif](#objectif)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Documentation Swagger](#documentation-swagger)
- [Contrat de l’API](#contrat-de-lapi)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Persistance des données](#persistance-des-données)
- [Tests manuels](#tests-manuels)
- [Commandes utiles](#commandes-utiles)
- [Choix de conception](#choix-de-conception)
- [Limites connues](#limites-connues)
- [Utilisation de l’intelligence artificielle](#utilisation-de-lintelligence-artificielle)
- [Auteur](#auteur)

---

## Objectif

CampusRate est une API REST conçue pour permettre aux personnes étudiantes de :

- consulter les endroits et services disponibles sur le campus;
- filtrer et paginer la liste des endroits;
- consulter les détails d’un endroit;
- publier une appréciation associée à un endroit;
- modifier ou supprimer une appréciation;
- consulter les statistiques calculées d’un endroit, comme sa note moyenne et le nombre d’appréciations.

Les données sont conservées dans un fichier JSON local afin de demeurer disponibles après le redémarrage de l’application.

---

## Fonctionnalités

### Endroits

- Création d’un endroit.
- Consultation de la liste des endroits.
- Filtrage par catégorie.
- Pagination avec `page` et `limit`.
- Consultation d’un endroit par son identifiant.
- Modification partielle avec `PATCH`.
- Suppression d’un endroit lorsqu’il ne possède aucune appréciation.
- Calcul automatique de la note moyenne.
- Calcul automatique du nombre d’appréciations.

### Appréciations

- Création d’une appréciation associée à un endroit existant.
- Consultation des appréciations d’un endroit.
- Consultation d’une appréciation par son identifiant.
- Modification partielle d’une appréciation.
- Suppression d’une appréciation.
- Mise à jour automatique des statistiques de l’endroit associé.

### Validation et erreurs

- Validation stricte des données reçues.
- Refus des propriétés inconnues.
- Vérification des catégories et des états autorisés.
- Vérification que la note est comprise entre 1 et 5.
- Réponses d’erreur au format `application/problem+json`.
- Filtre global pour les erreurs attendues et inattendues.

---

## Technologies

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Node.js
- JSON
- Swagger/OpenAPI
- Postman
- Git et GitHub

---

## Architecture

Le projet est organisé par fonctionnalité et sépare les responsabilités principales.

```text
src/
├── common/
│   ├── filters/
│      └── problem-details.filter.ts
│
│   
│
├── places/
│   ├── dto/
│   │   ├── create-place.dto.ts
│   │   ├── update-place.dto.ts
│   │   └── find-places-query.dto.ts
│   ├── places.controller.ts
│   ├── places.service.ts
│   └── places.module.ts
│
├── reviews/
│   ├── dto/
│   │   ├── create-review.dto.ts
│   │   └── update-review.dto.ts
│   ├── reviews.controller.ts
│   ├── reviews.service.ts
│   └── reviews.module.ts
│
├── persistence/
│   ├── data/
│   │   └── campus-rate.json
│   └── json-data.service.ts
│
├── app.module.ts
└── main.ts
```

### Responsabilités

- Les contrôleurs reçoivent les requêtes HTTP et retournent les réponses.
- Les DTO définissent et valident les données entrantes.
- Les services contiennent la logique métier.
- Le service de persistance lit et écrit le fichier JSON.
- Le filtre global transforme les exceptions en réponses `Problem Details`.
- La documentation Swagger décrit le contrat public de l’API.

---

## Installation

### Prérequis

Les logiciels suivants doivent être installés :

- Node.js;
- npm;
- Git.

Vérifier les versions installées :

```bash
node --version
npm --version
git --version
```

### Cloner le projet

```bash
git clone <URL_DU_DEPOT_GITHUB>
cd <CampusRate>
```

### Installer les dépendances

```bash
npm ci
```

---

## Configuration

Créer un fichier `.env` à la racine du projet à partir du fichier d’exemple :

```bash
cp .env.example .env
```

Le fichier `.env.example` doit contenir au minimum :

```env
PORT=3000
DATA_FILE_PATH=./data/campus-rate.json
```

### Variables d’environnement

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port HTTP utilisé par l’application | `3000` |
| `DATA_FILE_PATH` | Chemin vers le fichier JSON de données | `./data/campus-rate.json` |

Le fichier `.env` ne doit pas être ajouté au dépôt Git. Il peut contenir des paramètres propres à l’environnement local.

---

## Démarrage

### Mode développement

```bash
npm run start:dev
```


### Mode production

```bash
npm run build


L’API sera accessible à l’adresse suivante :

```text
http://localhost:3000
```

Si un autre port est configuré dans `.env`, remplacer `3000` par la valeur correspondante.

---

## Documentation Swagger

La documentation interactive Swagger est disponible à l’adresse suivante :

```text
http://localhost:3000/docs
```

Swagger permet de :

- consulter toutes les routes disponibles;
- voir les paramètres et les corps de requête;
- visualiser les réponses possibles;
- exécuter manuellement des requêtes;
- consulter les schémas JSON;
- tester les erreurs et la pagination.

La documentation doit toujours correspondre au comportement réel de l’application.

---

## Contrat de l’API

Toutes les routes utilisent la version majeure `v1`.

Préfixe général :

```text
/api/v1
```

### Endroits

| Méthode | URI | Description |
|---|---|---|
| `POST` | `/api/v1/places` | Créer un endroit |
| `GET` | `/api/v1/places` | Lister les endroits |
| `GET` | `/api/v1/places/:id` | Consulter un endroit |
| `PATCH` | `/api/v1/places/:id` | Modifier partiellement un endroit |
| `DELETE` | `/api/v1/places/:id` | Supprimer un endroit |

### Appréciations imbriquées

| Méthode | URI | Description |
|---|---|---|
| `POST` | `/api/v1/places/:placeId/reviews` | Publier une appréciation pour un endroit |
| `GET` | `/api/v1/places/:placeId/reviews` | Lister les appréciations d’un endroit |

### Appréciations indépendantes

| Méthode | URI | Description |
|---|---|---|
| `GET` | `/api/v1/reviews/:id` | Consulter une appréciation |
| `PATCH` | `/api/v1/reviews/:id` | Modifier partiellement une appréciation |
| `DELETE` | `/api/v1/reviews/:id` | Supprimer une appréciation |

L’utilisation de `placeId` dans les routes imbriquées représente la relation réelle entre un endroit et ses appréciations. Les routes indépendantes utilisant `id` facilitent la consultation, la modification et la suppression d’une appréciation précise.

---

## Création d’un endroit

### Requête

```http
POST /api/v1/places
Content-Type: application/json
```

```json
{
  "name": "Bibliothèque principale",
  "description": "Espace calme avec prises et accès Wi-Fi.",
  "category": "LIBRARY",
  "address": "Pavillon A, local A-210",
  "services": [
    "WIFI",
    "POWER_OUTLETS"
  ],
  "status": "ACTIVE"
}
```

### Réponse

Code de succès :

```http
201 Created
Location: /api/v1/places/plc_01JABC123
```

```json
{
  "id": "plc_01JABC123",
  "name": "Bibliothèque principale",
  "description": "Espace calme avec prises et accès Wi-Fi.",
  "category": "LIBRARY",
  "address": "Pavillon A, local A-210",
  "services": [
    "WIFI",
    "POWER_OUTLETS"
  ],
  "status": "ACTIVE",
  "averageRating": null,
  "reviewCount": 0,
  "createdAt": "2026-09-24T20:00:00.000Z",
  "updatedAt": "2026-09-24T20:00:00.000Z"
}
```

Les champs suivants sont toujours générés par le serveur :

- `id`;
- `averageRating`;
- `reviewCount`;
- `createdAt`;
- `updatedAt`.

---

## Lister les endroits

```http
GET /api/v1/places
```

### Paramètres de requête

| Paramètre | Type | Obligatoire | Description |
|---|---|---:|---|
| `category` | chaîne contrôlée | Non | Filtre exact par catégorie |
| `page` | entier positif | Non | Numéro de page |
| `limit` | entier positif | Non | Nombre maximal d’éléments par page |

Exemple :

```http
GET /api/v1/places?category=STUDY_SPACE&page=1&limit=10
```

La valeur maximale de `limit` est définie par l’application afin d’éviter des réponses trop volumineuses.

### Réponse

```json
{
  "data": [
    {
      "id": "plc_01JABC123",
      "name": "Bibliothèque principale",
      "description": "Espace calme avec prises et accès Wi-Fi.",
      "category": "LIBRARY",
      "address": "Pavillon A, local A-210",
      "services": [
        "WIFI",
        "POWER_OUTLETS"
      ],
      "status": "ACTIVE",
      "averageRating": 4.25,
      "reviewCount": 12,
      "createdAt": "2026-09-24T20:00:00.000Z",
      "updatedAt": "2026-09-24T20:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

Lorsqu’aucun endroit ne correspond aux critères, l’API retourne une collection vide :

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

---

## Modifier un endroit

```http
PATCH /api/v1/places/:id
Content-Type: application/json
```

Exemple :

```json
{
  "status": "TEMPORARILY_CLOSED",
  "description": "Fermé temporairement pour travaux."
}
```

Réponse :

```http
200 OK
```

Les champs calculés et générés par le serveur ne peuvent pas être modifiés par le client.

---

## Supprimer un endroit

```http
DELETE /api/v1/places/:id
```

Réponse en cas de succès :

```http
204 No Content
```

La réponse ne contient aucun corps.

La suppression est refusée lorsqu’un endroit possède au moins une appréciation.

Dans ce cas, l’API retourne un conflit :

```http
409 Conflict
```

---

## Créer une appréciation

### Requête imbriquée

```http
POST /api/v1/places/:placeId/reviews
Content-Type: application/json
```

```json
{
  "authorName": "Samira",
  "rating": 4,
  "comment": "Endroit calme et Wi-Fi stable."
}
```

### Réponse

```http
201 Created
Location: /api/v1/reviews/rev_01JXYZ789
```

```json
{
  "id": "rev_01JXYZ789",
  "placeId": "plc_01JABC123",
  "authorName": "Samira",
  "rating": 4,
  "comment": "Endroit calme et Wi-Fi stable.",
  "createdAt": "2026-09-24T20:45:00.000Z",
  "updatedAt": "2026-09-24T20:45:00.000Z"
}
```

Une appréciation ne peut être créée que si le `placeId` correspond à un endroit existant.

---

## Règles de validation

### Endroit

- `name` est obligatoire et doit contenir un texte significatif.
- `description` est obligatoire.
- `category` doit être une catégorie autorisée.
- `address` est obligatoire.
- `services` est facultatif.
- `services` reçoit un tableau vide par défaut.
- Les doublons dans `services` sont refusés.
- `status` est facultatif et vaut `ACTIVE` par défaut.
- Les champs générés par le serveur sont refusés dans le corps de la requête.

### Catégories autorisées

```text
STUDY_SPACE
LIBRARY
FOOD_SERVICE
SPORTS
STUDENT_SERVICE
COMPUTER_LAB
OTHER
```

### États autorisés

```text
ACTIVE
TEMPORARILY_CLOSED
INACTIVE
```

### Appréciation

- `authorName` est obligatoire.
- `rating` est un entier compris entre 1 et 5.
- `comment` est obligatoire.
- La longueur minimale et maximale de `comment` est définie dans les DTO.
- `placeId` doit correspondre à un endroit existant.
- `id`, les dates et les valeurs calculées sont générés par le serveur.

---

## Gestion des erreurs

Les erreurs utilisent le type de contenu suivant :

```http
Content-Type: application/problem+json
```

Format utilisé :

```json
{
  "type": "[https://campusrate.example/problems/validation-error](https://campusrate.example/problems/validation-error)",
  "title": "Validation failed",
  "status": 400,
  "detail": "The request contains invalid properties.",
  "instance": "/api/v1/places"
}
```

### Codes HTTP utilisés

| Code | Situation |
|---:|---|
| `200 OK` | Consultation ou modification réussie |
| `201 Created` | Création réussie |
| `204 No Content` | Suppression réussie sans corps de réponse |
| `400 Bad Request` | Données invalides ou paramètres incorrects |
| `404 Not Found` | Ressource inexistante |
| `409 Conflict` | Opération incompatible avec l’état actuel |
| `500 Internal Server Error` | Erreur technique inattendue |

Une erreur interne ne doit pas exposer :

- la pile d’exécution;
- un chemin local;
- le contenu brut du fichier JSON;
- des informations sensibles.

---

## Persistance des données

Les données sont stockées dans un fichier JSON local configuré avec la variable :

```env
DATA_FILE_PATH=./data/campus-rate.json
```

Le service de persistance :

- utilise les API asynchrones de `node:fs/promises`;
- initialise le fichier s’il est absent;
- lit les données au démarrage ou lors des opérations nécessaires;
- écrit les changements dans le fichier JSON;
- détecte les fichiers JSON invalides;
- est séparé de la logique métier.

Exemple de structure du fichier :

```json
{
  "places": [],
  "reviews": []
}
```

La séparation entre les services métier et la persistance permet de modifier ultérieurement le système de stockage sans réécrire les contrôleurs.

---

## Tests manuels

Les scénarios suivants doivent être vérifiés avec Swagger UI ou Postman :

| # | Scénario | Résultat attendu |
|---:|---|---|
| 1 | Créer un endroit valide | `201 Created` |
| 2 | Consulter un endroit existant | `200 OK` |
| 3 | Créer une appréciation valide | `201 Created` |
| 4 | Lister les appréciations d’un endroit | `200 OK` |
| 5 | Modifier un endroit | `200 OK` |
| 6 | Envoyer une note invalide | `400 Bad Request` |
| 7 | Consulter une ressource inexistante | `404 Not Found` |
| 8 | Supprimer un endroit possédant des appréciations | `409 Conflict` |
| 9 | Filtrer et paginer les endroits | `200 OK` avec métadonnées |
| 10 | Redémarrer l’application et vérifier les données | Données conservées |



## Commandes utiles

Installer les dépendances :

```bash
npm ci
```

Démarrer en développement :

```bash
npm run start:dev
```

Compiler le projet :

```bash
npm run build
```

Exécuter le lint :

```bash
npm run lint
```

Exécuter les tests :

```bash
npm test
```

Exécuter les tests en mode couverture :

```bash
npm run test:cov
```

Vérifier le projet avant la remise :

```bash
npm ci
npm run lint
npm run build
```

---

## Choix de conception

| Choix | Décision | Justification |
|---|---|---|
| Nom de ressource | `places` | Représente les endroits évalués et respecte le pluriel anglais en minuscules |
| Nom de ressource | `reviews` | Représente les appréciations et respecte les conventions REST |
| Versionnement | `/api/v1` | Permet de faire évoluer le contrat sans casser les anciennes versions |
| Appréciations imbriquées | `/places/:placeId/reviews` | Exprime clairement la relation entre un endroit et ses appréciations |
| Appréciations indépendantes | `/reviews/:id` | Facilite la consultation, la modification et la suppression d’une appréciation précise |
| Création | `POST` | Utilisé pour créer une nouvelle ressource |
| Consultation | `GET` | Utilisé pour lire des ressources sans les modifier |
| Modification | `PATCH` | Utilisé pour une modification partielle |
| Suppression | `DELETE` | Utilisé pour supprimer une ressource |
| Création réussie | `201 Created` | Indique qu’une ressource a été créée |
| En-tête `Location` | Inclus après une création | Permet de retrouver la nouvelle ressource |
| Suppression réussie | `204 No Content` | L’opération réussit sans retourner de représentation |
| Ressource inexistante | `404 Not Found` | La ressource demandée n’existe pas |
| État incompatible | `409 Conflict` | La suppression d’un endroit avec appréciations est refusée |
| Erreur uniforme | `Problem Details` | Fournit une structure cohérente pour toutes les erreurs |
| Pagination | Objet `data` et `pagination` | Sépare les résultats des métadonnées de navigation |

---

## Limites connues

- Les données sont conservées dans un fichier JSON local.
- L’application ne possède pas encore de système d’authentification.
- L’API ne gère pas plusieurs utilisateurs connectés.
- Le fichier JSON n’est pas adapté à une charge élevée ou à plusieurs instances simultanées.
- Les modifications concurrentes du fichier doivent être limitées.
- Les appréciations ne sont pas associées à un compte utilisateur réel.

---

## Utilisation de l’intelligence artificielle

L’intelligence artificielle a été utilisée comme outil d’aide à la rédaction, à la compréhension, à la révision et au diagnostic.

L’utilisation de l’IA ne remplace pas les décisions de conception ni la compréhension du code. Les routes, validations, réponses, commandes et exemples présentés dans ce document doivent être vérifiés avec l’implémentation réelle.

La déclaration d’intégrité intellectuelle et la déclaration produite avec IAGraphie sont remises séparément conformément aux consignes du travail.

---

## Auteur

**Nom :** `<Jonathan Valadez-Riquelme>`

**Cours :** 420-514 – Collecte et interprétation des données

**Travail :** TP1 – CampusRate

**Session :** Automne 2026

**Dépôt GitHub :** `<[https://github.com/Riquelme04/CampusRate.git)>`
