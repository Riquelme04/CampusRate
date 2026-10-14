# CampusRate

API REST permettant à la communauté étudiante de consulter les endroits et services du campus, puis de publier des appréciations accompagnées d’une note.

Projet réalisé dans le cadre du travail pratique 2 du cours **420-514 — Collecte et interprétation des données**, session Automne 2026.

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
- [Création d’un endroit](#création-dun-endroit)
- [Lister les endroits](#lister-les-endroits)
- [Modifier un endroit](#modifier-un-endroit)
- [Supprimer un endroit](#supprimer-un-endroit)
- [Créer une appréciation](#créer-une-appréciation)
- [Règles de validation](#règles-de-validation)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Persistance des données](#persistance-des-données)
- [Sécurité HTTP et journalisation](#sécurité-http-et-journalisation)
- [Fonctionnalités optionnelles](#fonctionnalités-optionnelles)
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
- consulter la moyenne des notes et le nombre d’appréciations d’un endroit.

Le TP2 remplace la persistance JSON du TP1 par MongoDB, renforce la validation et ajoute des protections HTTP. Les données restent disponibles après le redémarrage de l’API. Le contrat public conserve les routes et la version `v1`.

---

## Fonctionnalités

### Endroits

- Créer, lister, consulter, modifier partiellement et supprimer un endroit.
- Filtrer la liste par catégorie et paginer les résultats.
- Exposer la moyenne des notes et le nombre d’appréciations.
- Refuser la suppression d’un endroit ayant des appréciations.

### Appréciations

- Publier une appréciation pour un endroit existant.
- Lister les appréciations d’un endroit et consulter une appréciation précise.
- Modifier ou supprimer une appréciation.
- Recalculer les statistiques de l’endroit après une création, une modification ou une suppression.

### Contrôles transversaux

- DTO et `ValidationPipe` global.
- Refus des propriétés inconnues et des champs contrôlés par le serveur.
- Opérations MongoDB construites à partir de propriétés sélectionnées explicitement.
- Erreurs au format `application/problem+json`.
- Documentation Swagger/OpenAPI générée depuis le code.
- CORS explicite, Helmet et options de sécurité détaillées ci-dessous.

---

## Technologies

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Node.js et npm
- MongoDB et Mongoose
- `@nestjs/config` et Joi
- `class-validator` et `class-transformer`
- Swagger/OpenAPI
- Helmet et `@nestjs/throttler`
- Swagger UI et Postman pour les vérifications
- Git et GitHub

---

## Architecture

Le projet est organisé par fonctionnalité et sépare les responsabilités principales.

### Responsabilités

| Composant | Responsabilité |
|---|---|
| Contrôleurs | Recevoir les requêtes HTTP, appeler les services et définir les réponses et en-têtes. |
| DTO | Définir et valider les propriétés acceptées par l’API. |
| Services | Appliquer les règles métier et coordonner les opérations. |
| Repositories | Exécuter les recherches et écritures Mongoose. |
| Schémas Mongoose | Décrire les documents, contraintes de stockage et index. |
| Mappers | Produire les représentations publiques, sans `_id` ni `__v`, avec des dates ISO 8601. |
| `src/config/database.config.ts` | Exposer l’URI MongoDB à travers la configuration NestJS. |
| `src/app.module.ts` | Configurer Joi, MongoDB et les guards globaux. |
| `src/main.ts` | Configurer le préfixe, le versionnement, la validation, Swagger, CORS, Helmet, les méthodes, la taille des corps et les logs HTTP. |
| `src/common/guards/content-type.guard.ts` | Contrôler le type de contenu des requêtes POST et PATCH. |
| `src/common/filter/problem-details.filter.ts` | Traduire les exceptions en erreurs publiques et journaliser le contexte des erreurs techniques. |

### Principaux fichiers

| Fonctionnalité | Fichiers |
|---|---|
| Configuration | `src/config/config.ts`, `src/config/database.config.ts`, `src/app.module.ts` |
| Endroits | `src/places/places.controller.ts`, `places.service.ts`, `places.repository.ts`, `place.mapper.ts`, `places.module.ts` |
| Modèle et validation des endroits | `src/places/entities/place.entity.ts`, `src/places/schemas/place.schema.ts`, `src/places/dto/` |
| Appréciations | `src/reviews/reviews.controller.ts`, `reviews.service.ts`, `reviews.repository.ts`, `review.mapper.ts`, `reviews.module.ts` |
| Modèle et validation des appréciations | `src/reviews/entities/review.entity.ts`, `src/reviews/schemas/review.schema.ts`, `src/reviews/dto/` |
| Composants communs | `src/common/filter/` et `src/common/guards/` |
| Démarrage | `src/main.ts` |

Les fichiers des colonnes fonctionnelles abrégés sans préfixe appartiennent au même dossier que le contrôleur indiqué.

---

## Installation

### Prérequis

- Node.js : le projet a été utilisé avec **20.19.5**.
- npm et Git.
- Un serveur MongoDB accessible : l’environnement local utilisé repose sur **MongoDB Community 8.0**.
- `mongosh` pour inspecter les données, ou MongoDB Compass.

MongoDB Atlas n’est pas nécessaire pour utiliser la configuration locale. Une autre installation MongoDB peut être utilisée en adaptant `MONGO_URI`.

### Cloner le projet et installer les dépendances

```bash
git clone --branch main https://github.com/Riquelme04/CampusRate.git
cd CampusRate
npm ci
```

Ces instructions supposent que la version TP2 a été intégrée à `main`. Pour examiner une PR avant sa fusion, utiliser sa branche source.

`npm ci` installe les versions définies par `package-lock.json`. Ce fichier doit rester dans le dépôt.

### MongoDB local sur macOS avec Homebrew

Pour un poste où MongoDB n’est pas encore installé :

```bash
brew tap mongodb/brew
brew install mongodb-community@8.0
brew services start mongodb-community@8.0
```

Si MongoDB est déjà installé, démarrer simplement le service correspondant à la version installée.

Vérifier la connexion locale :

```bash
mongosh "mongodb://127.0.0.1:27017/campusrate"
```

Sur un autre système, installer MongoDB selon sa documentation officielle, démarrer le serveur et adapter l’URI si nécessaire.

---

## Configuration

Créer le fichier local à partir du modèle :

```bash
cp .env.example .env
```

Configuration de développement :

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/campusrate
NODE_ENV=development
CORS_ORIGINS_DEVELOPMENT=http://localhost:3000,http://localhost:5173
CORS_ORIGINS_PRODUCTION=https://campusrate.example
```

`https://campusrate.example` est une origine fictive d’exemple, pas une application déployée. La remplacer par l’origine réellement autorisée avant d’utiliser un environnement de production.

| Variable | Rôle et validation |
|---|---|
| `PORT` | Obligatoire ; entier entre 1 et 65535. |
| `MONGO_URI` | Obligatoire ; URI du serveur et de la base MongoDB. |
| `NODE_ENV` | `development`, `test` ou `production` ; `development` par défaut. |
| `CORS_ORIGINS_DEVELOPMENT` | Origines séparées par des virgules ; obligatoire hors production. |
| `CORS_ORIGINS_PRODUCTION` | Origines séparées par des virgules ; obligatoire en production. |

Joi valide la configuration au démarrage. La connexion Mongoose utilise `database.uri`, issue de `MONGO_URI`.

La variable `DATA_FILE_PATH` du TP1 n’est plus utilisée. Les lectures et écritures dans le fichier JSON ont été remplacées par les repositories MongoDB.

Le fichier `.env` est ignoré par Git. Ne jamais publier de mot de passe, jeton, clé privée ou URI contenant des identifiants réels. `.env.example` contient uniquement des exemples sans secrets.

---

## Démarrage

MongoDB doit être disponible avant le démarrage de l’API.

### Mode développement

```bash
npm run start:dev
```

L’API est disponible sur `http://localhost:3000/api/v1` lorsque `PORT=3000`.

### Mode production

```bash
npm run build
npm run start:prod
```

Le script `start:prod` exécute le code compilé ; il ne définit pas automatiquement `NODE_ENV=production`. L’environnement effectif dépend de la configuration fournie.

En production, configurer `NODE_ENV=production` et les origines CORS correspondantes. L’auto-indexation Mongoose y est désactivée : les index nécessaires doivent être créés avant l’exploitation de cette base.

---

## Documentation Swagger

Swagger UI : **http://localhost:3000/swagger**.

La spécification OpenAPI est générée par `SwaggerModule.createDocument()` dans `src/main.ts`, à partir des contrôleurs, DTO et modèles documentés. La configuration de génération est donc fournie dans le code source.

Swagger permet de consulter les schémas, paramètres et réponses, puis d’exécuter les requêtes avec **Try it out** et **Execute**.

---

## Contrat de l’API

Toutes les routes utilisent le préfixe `/api/v1`. Le passage à MongoDB ne modifie pas leur nom.

### Endroits

| Méthode | URI | Description |
|---|---|---|
| POST | `/api/v1/places` | Créer un endroit |
| GET | `/api/v1/places` | Lister, filtrer et paginer les endroits |
| GET | `/api/v1/places/:id` | Consulter un endroit |
| PATCH | `/api/v1/places/:id` | Modifier partiellement un endroit |
| DELETE | `/api/v1/places/:id` | Supprimer un endroit sans appréciations |

### Appréciations imbriquées

| Méthode | URI | Description |
|---|---|---|
| POST | `/api/v1/places/:placeId/reviews` | Publier une appréciation pour un endroit |
| GET | `/api/v1/places/:placeId/reviews` | Lister les appréciations d’un endroit |

### Appréciations indépendantes

| Méthode | URI | Description |
|---|---|---|
| GET | `/api/v1/reviews/:id` | Consulter une appréciation |
| PATCH | `/api/v1/reviews/:id` | Modifier partiellement une appréciation |
| DELETE | `/api/v1/reviews/:id` | Supprimer une appréciation |

L’imbrication des URI exprime la relation entre un endroit et ses appréciations. Les URI indépendantes permettent de gérer une appréciation individuellement. La technologie MongoDB n’apparaît pas dans les URI.

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
  "description": "Un espace calme pour étudier et lire.",
  "category": "LIBRARY",
  "address": "Pavillon A",
  "services": ["WIFI", "POWER_OUTLETS"],
  "status": "ACTIVE"
}
```

### Réponse

```http
201 Created
Location: /api/v1/places/11111111-1111-4111-8111-111111111111
```

Exemple illustratif de représentation retournée ; l’identifiant et les dates réels sont générés lors de la création :

```json
{
  "id": "11111111-1111-4111-8111-111111111111",
  "name": "Bibliothèque principale",
  "description": "Un espace calme pour étudier et lire.",
  "category": "LIBRARY",
  "address": "Pavillon A",
  "services": ["WIFI", "POWER_OUTLETS"],
  "status": "ACTIVE",
  "averageRating": null,
  "reviewCount": 0,
  "createdAt": "2026-10-14T12:00:00.000Z",
  "updatedAt": "2026-10-14T12:00:00.000Z"
}
```

`id`, `createdAt`, `updatedAt`, `averageRating` et `reviewCount` sont générés ou calculés par le serveur.

---

## Lister les endroits

```http
GET /api/v1/places
```

### Paramètres de requête

```text
GET /api/v1/places?category=LIBRARY&page=1&limit=10
```

| Paramètre | Règle | Valeur par défaut |
|---|---|---|
| `category` | Catégorie autorisée ; filtre exact facultatif. | Aucun filtre |
| `page` | Entier supérieur ou égal à 1. | 1 |
| `limit` | Entier entre 1 et 50. | 10 |

Les endroits sont triés par `createdAt`, puis `id`, dans l’ordre croissant. Le tri n’est pas configurable par le client. Les paramètres inconnus, dont `sort`, sont refusés.

### Réponse

La réponse sépare les ressources des métadonnées. Sans résultat :

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

Pour un résultat non vide, `data` contient les endroits. `totalItems` indique le nombre d’endroits correspondant au filtre et `totalPages` le nombre de pages.

---

## Modifier un endroit

```http
PATCH /api/v1/places/:id
Content-Type: application/json
```

### Requête

```json
{
  "status": "TEMPORARILY_CLOSED",
  "description": "Fermé temporairement pour travaux."
}
```

### Réponse

```http
200 OK
```

La réponse contient l’endroit modifié. Les propriétés omises restent inchangées. Les propriétés fournies doivent respecter les contraintes de validation. Les identifiants, les dates et les statistiques ne peuvent pas être imposés par le client.

---

## Supprimer un endroit

```http
DELETE /api/v1/places/:id
```

Réponse en cas de succès :

```http
204 No Content
```

La réponse ne contient aucun corps. La suppression est refusée avec **409 Conflict** si l’endroit possède au moins une appréciation. Il faut supprimer ses appréciations avant de pouvoir supprimer l’endroit.

---

## Créer une appréciation

### Requête imbriquée

```http
POST /api/v1/places/:placeId/reviews
Content-Type: application/json
```

```json
{
  "authorName": "Jonathan",
  "rating": 4,
  "comment": "Un endroit calme et agréable pour étudier."
}
```

`placeId` est fourni dans le chemin, pas dans le corps. Le serveur vérifie que l’endroit existe. La réponse contient `id`, `placeId`, `authorName`, `rating`, `comment`, `createdAt` et `updatedAt`.

### Réponse

```http
201 Created
Location: /api/v1/reviews/22222222-2222-4222-8222-222222222222
```

Exemple illustratif ; les identifiants et dates réels sont générés par le serveur :

```json
{
  "id": "22222222-2222-4222-8222-222222222222",
  "placeId": "11111111-1111-4111-8111-111111111111",
  "authorName": "Jonathan",
  "rating": 4,
  "comment": "Un endroit calme et agréable pour étudier.",
  "createdAt": "2026-10-14T12:10:00.000Z",
  "updatedAt": "2026-10-14T12:10:00.000Z"
}
```

### Modifier ou supprimer une appréciation

Une requête PATCH sur `/api/v1/reviews/:id` permet de modifier `authorName`, `rating` ou `comment`. Par exemple :

```json
{
  "rating": 5
}
```

Une modification réussie retourne 200 et l’appréciation modifiée. Une suppression avec DELETE retourne 204 sans corps. Dans les deux cas, les statistiques de l’endroit sont recalculées.

---

## Règles de validation

Le `ValidationPipe` global utilise `whitelist: true`, `forbidNonWhitelisted: true` et `transform: true`. Les propriétés non autorisées sont refusées avec 400 ; les paramètres numériques de pagination sont transformés et validés.

### DTO des endroits

| Propriété | Création | Contraintes |
|---|---|---|
| `name` | Obligatoire | Chaîne non vide, de 2 à 100 caractères. |
| `description` | Obligatoire | Chaîne non vide, de 5 à 500 caractères. |
| `category` | Obligatoire | Valeur de `PlaceCategory`. |
| `address` | Obligatoire | Chaîne non vide, maximum 200 caractères. |
| `services` | Facultative | Tableau de chaînes sans doublons ; tableau vide par défaut. |
| `status` | Facultative | Valeur de `PlaceStatus` ; `ACTIVE` par défaut. |

Catégories : `STUDY_SPACE`, `LIBRARY`, `FOOD_SERVICE`, `SPORTS`, `STUDENT_SERVICE`, `COMPUTER_LAB`, `OTHER`.

États : `ACTIVE`, `TEMPORARILY_CLOSED`, `INACTIVE`.

### DTO des appréciations

| Propriété | Création | Contraintes |
|---|---|---|
| `authorName` | Obligatoire | Chaîne non vide, de 2 à 100 caractères. |
| `rating` | Obligatoire | Entier entre 1 et 5. |
| `comment` | Obligatoire | Chaîne non vide, de 5 à 500 caractères. |

Les DTO de modification rendent les propriétés facultatives sans autoriser les valeurs `null`. Une propriété facultative peut être omise ; cela ne signifie pas que `null` est accepté.

### Propriétés contrôlées par le serveur

Le client ne peut pas imposer ou modifier `id`, `createdAt`, `updatedAt`, `averageRating` ou `reviewCount`. Le `placeId` d’une appréciation est fixé par le contexte de création et n’est pas modifiable.

Les repositories sélectionnent explicitement les propriétés à créer ou à modifier. Les mises à jour utilisent `$set` et `runValidators: true` ; elles ne transmettent pas directement l’objet HTTP complet à MongoDB.

---

## Gestion des erreurs

Le filtre global produit le type de contenu `application/problem+json` avec `type`, `title`, `status`, `detail` et `instance`. Plusieurs erreurs de validation peuvent également produire une propriété `errors`.

Exemple :

```json
{
  "type": "about:blank",
  "title": "Données invalides",
  "status": 400,
  "detail": "property inconnu should not exist",
  "instance": "/api/v1/places"
}
```

| Statut | Situation |
|---|---|
| 400 | Données, propriétés ou paramètres invalides. |
| 404 | Endroit ou appréciation absent. |
| 405 | Méthode interdite par le middleware de l’API. |
| 409 | Suppression d’un endroit ayant des appréciations, ou violation d’un index unique. |
| 413 | Corps dépassant la limite configurée. |
| 415 | Type de contenu absent ou non pris en charge pour POST/PATCH. |
| 429 | Limite de requêtes dépassée. |
| 500 | Erreur inattendue ; message public générique. |
| 503 | Indisponibilité MongoDB reconnue par le filtre. |

Le filtre ne révèle pas le message brut des erreurs MongoDB, les noms des collections, les chemins internes ou la chaîne de connexion. Si la base n’est pas disponible au démarrage, l’application ne termine pas normalement son initialisation.

---

## Persistance des données

Les données sont conservées dans MongoDB. L’URI provient de la configuration :

```env
MONGO_URI=mongodb://127.0.0.1:27017/campusrate
```

Les repositories utilisent les opérations asynchrones Mongoose pour lire, créer, modifier et supprimer les documents. Le fichier JSON du TP1 n’est plus utilisé comme stockage principal.

### Collections et représentations

La base contient deux collections : `places` et `reviews`. Chaque appréciation conserve le UUID public de son endroit dans `placeId`.

Les identifiants publics restent des UUID générés par le serveur, comme au TP1. MongoDB conserve aussi un `_id` interne. Pour les requêtes de l’API, utiliser **`id`**, pas `_id`. Les mappers masquent `_id` et `__v` et convertissent les dates en chaînes ISO 8601.

### Statistiques et règles métier

- La moyenne correspond à la somme des notes divisée par le nombre d’appréciations.
- Sans appréciation, `averageRating` vaut `null` et `reviewCount` vaut `0`.
- Une création, modification ou suppression d’appréciation déclenche un recalcul.
- Supprimer un endroit ayant des appréciations produit 409. Aucune suppression en cascade n’est effectuée.

### Index MongoDB

| Collection | Index | Justification |
|---|---|---|
| `places` | `id`, unique | Recherche par identifiant public et protection contre les doublons. |
| `places` | `{ category: 1, createdAt: 1, id: 1 }` | Correspond au filtre par catégorie et au tri de la liste paginée. |
| `reviews` | `id`, unique | Recherche et unicité de l’identifiant public d’une appréciation. |
| `reviews` | `placeId` | Recherche des appréciations et comptage pour un endroit. |

L’index composé ne garantit pas à lui seul l’optimisation du tri lorsque le filtre par catégorie est absent. Les gains de performance n’ont pas été mesurés dans ce projet.

Une violation d’index unique produit une erreur MongoDB 11000, traduite par le filtre global en 409 avec un message public générique.

---

## Sécurité HTTP et journalisation

### CORS

Les origines autorisées viennent de la variable correspondant à `NODE_ENV`. Elles sont séparées par des virgules et les espaces autour de chaque origine sont retirés. Aucune origine générique `*` n’est configurée.

Les méthodes déclarées sont `GET`, `HEAD`, `POST`, `PATCH`, `DELETE` et `OPTIONS`. Les en-têtes autorisés sont `Content-Type` et `Accept` ; `Location` est exposé au navigateur.

CORS contrôle la possibilité, pour un navigateur, de rendre une réponse accessible à un code d’une autre origine. Ce n’est pas une authentification : un client comme curl ou Postman peut appeler l’API, même sans origine autorisée.

### Helmet

Helmet ajoute des en-têtes HTTP de sécurité, notamment une politique de contenu et des protections relatives au type de contenu et à l’intégration dans une page. Il complète les autres contrôles ; il ne remplace ni les validations ni une authentification.

### Protections optionnelles

| Protection | Comportement |
|---|---|
| H1 — Rate limiting | Guard global configuré avec une limite de 10 requêtes sur 60 secondes ; dépassement : 429 et en-tête `Retry-After`. |
| H2 — Taille du corps | Parseurs JSON et URL-encoded limités à `10kb`, soit 10 240 octets ; dépassement : 413. |
| H3 — Content-Type | Les POST et PATCH exigent `application/json`. Un paramètre comme `charset=utf-8` est accepté par le contrôle du type de média ; type absent ou différent : 415. |
| H4 — CORS par environnement | Liste de développement distincte de celle de production. |
| H5 — Méthodes HTTP | Middleware sur `/api` et ses sous-chemins ; une méthode hors de la liste autorisée retourne 405 avec `Allow`. Cela ne crée pas de routes supplémentaires pour les méthodes autorisées. |
| P1 — Filtres autorisés | Filtre MongoDB construit uniquement à partir de `category`, validée par le DTO de requête. |
| P2 — Propriétés modifiables | Construction explicite des changements autorisés dans chaque repository. |

### Journalisation — L1 et L2

Les opérations sur les routes de l’API sont journalisées avec `timestamp`, `method`, `path`, `statusCode` et `duration`.

- Les réponses de statut inférieur à 400 utilisent les logs normaux du `Logger` NestJS.
- Les réponses de statut supérieur ou égal à 400 utilisent le niveau ERROR.
- Pour les erreurs de statut supérieur ou égal à 500 prises en charge par le filtre, un événement technique supplémentaire indique le type d’erreur et le titre public.

Les logs n’incluent pas le corps de la requête, les paramètres de recherche, les mots de passe, les jetons, les en-têtes d’authentification ou l’URI MongoDB complète. Aucune stack trace n’est retournée au client.

### Rôle de HTTPS — T1

HTTPS utilise TLS pour chiffrer les données échangées et protéger leur intégrité pendant le transport. Un certificat correctement vérifié permet au client de vérifier l’identité du serveur. HTTPS ne remplace pas l’authentification des utilisateurs ni les autorisations.

La configuration actuelle fonctionne localement en HTTP. Le projet ne revendique pas les options de serveur HTTPS local, de certificat autosigné ou de redirection HTTP vers HTTPS.

---

## Fonctionnalités optionnelles

| Code | Option | Points prévus dans l’énoncé |
|---|---|---:|
| M1 | Index pertinent, index unique et traitement des duplications | 6 |
| M3 | Justification du choix entre référence et imbrication | 2 |
| H1 | Rate limiting | 4 |
| H2 | Limite du corps et gestion de 413 | 2 |
| H3 | Content-Type et gestion de 415 | 2 |
| H4 | CORS selon l’environnement | 2 |
| H5 | Restriction explicite des méthodes | 1 |
| P1 | Liste explicite des filtres autorisés | 2 |
| P2 | Sélection explicite des propriétés modifiables | 2 |
| L1 | Journalisation des opérations normales | 3 |
| L2 | Journalisation des erreurs | 3 |
| T1 | Explication du rôle de HTTPS dans ce README | 1 |
| **Total présenté** | | **30** |

Ce tableau identifie les réalisations et les points prévus par l’énoncé ; il ne garantit pas la note. Leur attribution dépend de l’évaluation, de leur démonstration et de la règle empêchant de compter plusieurs fois exactement le même travail.

Les options M2, P3, T2, T3, T4, A1 et A2 ne sont pas revendiquées.

---

## Tests manuels

**Vidéo de démonstration du TP2 :** [Voir la vidéo](https://uploadnow.io/files/qhH2g3j).

Les scénarios ci-dessous constituent le document de vérification manuelle. Ils indiquent les résultats attendus, pas un relevé automatique de tests exécutés.

Utiliser Swagger UI sur `/swagger`. Conserver le même identifiant public pendant les huit étapes ; ne pas utiliser le `_id` interne de MongoDB et ne pas supprimer la ressource pendant la démonstration.

### Les huit scénarios obligatoires

| Nº | Action | Résultat attendu |
|---:|---|---|
| 1 | POST valide avec le corps A ci-dessous. | 201, `Location`, UUID et dates générés. |
| 2 | GET de l’endroit créé ; rechercher son `id` dans MongoDB. | 200 et document présent dans `places`. |
| 3 | Arrêter uniquement l’API avec Ctrl+C, relancer `npm run start:dev`, puis refaire le GET avec le même `id`. | 200 ; la ressource est toujours présente. |
| 4 | Refaire le POST en retirant `name` du corps A. | 400, erreur de propriété obligatoire. |
| 5 | Refaire le POST en remplaçant `category` par `"Maison"`. | 400, catégorie non autorisée. |
| 6 | Refaire le POST en ajoutant `"inconnu": "test"`. | 400, propriété non autorisée. |
| 7 | PATCH du même endroit avec le corps B ; refaire le GET. | 200 et nouveau nom enregistré. |
| 8 | PATCH avec le corps C ; refaire le GET. | 400 ; moyenne et nombre d’appréciations restent inchangés. |

Corps A — création valide :

```json
{
  "name": "Test vidéo Swagger",
  "description": "Un endroit pour la démonstration du TP2.",
  "category": "LIBRARY",
  "address": "Pavillon A"
}
```

Corps B — modification valide :

```json
{
  "name": "Test vidéo modifié"
}
```

Corps C — modification interdite :

```json
{
  "averageRating": 5,
  "reviewCount": 100
}
```

Inspection avec le shell :

```bash
mongosh "mongodb://127.0.0.1:27017/campusrate"
```

Dans `mongosh`, remplacer le texte par le véritable UUID retourné lors de la création :

```javascript
db.places.findOne({ id: "UUID_RETOURNE_PAR_API" })
```

### Vérifications complémentaires des règles métier

| Action | Résultat attendu |
|---|---|
| Créer deux appréciations avec les notes 4 et 2 pour un endroit sans appréciations. | Moyenne 3 et nombre 2. |
| Modifier la note 2 pour la remplacer par 5. | Moyenne 4,5 et nombre 2. |
| Tenter de supprimer cet endroit. | 409, endroit conservé. |
| Supprimer l’appréciation de note 4. | Moyenne 5 et nombre 1. |
| Supprimer la dernière appréciation. | Moyenne `null` et nombre 0. |
| Supprimer l’endroit désormais sans appréciations. | 204 ; une consultation ultérieure retourne 404. |
| Envoyer une appréciation avec `rating: 6`. | 400. |

### Vérifications des options

| Option | Démonstration attendue |
|---|---|
| M1 | Inspecter `db.places.getIndexes()` et `db.reviews.getIndexes()` ; vérifier le refus d’une duplication d’`id` et la traduction en 409 lorsqu’elle atteint l’API. |
| M3 | Expliquer la relation `reviews.placeId` et le choix de collections séparées. |
| H1 | Répéter plus de dix appels sur une même route dans la fenêtre ; observer 429 et `Retry-After`, puis un succès après le délai. |
| H2 | Envoyer un corps JSON de plus de 10 240 octets ; observer 413. |
| H3 | Envoyer POST/PATCH en `text/plain` ; observer 415. Vérifier une requête JSON normale. |
| H4 | Comparer une origine autorisée et une origine non autorisée en développement, puis avec la configuration de production ; vérifier `Access-Control-Allow-Origin`. |
| H5 | Envoyer PUT sur `/api/v1/places` ; observer 405 et `Allow`. Vérifier que GET et le preflight OPTIONS fonctionnent. |
| P1 | Tester `category=LIBRARY`, puis un filtre inconnu ou une structure comme `category[$ne]=LIBRARY` ; le premier est accepté et les autres refusés avec 400. |
| P2 | Inspecter la sélection des champs dans les repositories et démontrer un PATCH valide puis un PATCH contenant un champ interdit. |
| L1 | Observer le log d’une requête réussie avec date, méthode, chemin, statut et durée. |
| L2 | Observer le log d’un 404, puis, dans l’environnement local de test, d’une indisponibilité MongoDB ; relancer MongoDB et confirmer le retour à un fonctionnement normal. |
| T1 | Présenter l’explication de HTTPS dans ce README. |

Les clients curl ou Postman peuvent compléter Swagger pour les contrôles portant sur les en-têtes, les méthodes ou la taille du corps. Vérifier les corps de réponse et l’état de la base, pas uniquement les statuts.

La limite de requêtes peut provoquer 429 pendant une séance de vérification. Attendre le délai `Retry-After` avant de reprendre un autre scénario.

---

## Commandes utiles

Installer les dépendances :

```bash
npm ci
```

Démarrer en développement :

```bash
npm run start:dev
```

Compiler et démarrer le code compilé :

```bash
npm run build
npm run start:prod
```

Exécuter le lint :

```bash
npm run lint
```

Scripts de tests disponibles dans le projet :

```bash
npm test
npm run test:cov
npm run test:e2e
```

La présence de ces scripts ne garantit pas qu’une suite complète couvre les fonctionnalités du TP2. La vérification manuelle et la vidéo restent nécessaires.

### Avant la remise

Exécuter sur la version à remettre :

```bash
npm ci
npm run lint
npm run build
```

Ces commandes vérifient l’installation reproductible, le lint et la compilation. Elles ne remplacent pas la démonstration du comportement de l’API. Le script de lint peut modifier la mise en forme ; vérifier ensuite `git status`.

Éléments à remettre selon l’énoncé :

- Dépôt GitHub et code source.
- Lien accessible de la vidéo des fonctionnalités.
- `.env.example` sans secrets.
- README à jour.
- Documentation Swagger/OpenAPI et sa configuration de génération.
- Scénarios manuels décrits ci-dessus, ou collection Postman correspondante.
- Identification des options réalisées.
- Déclaration d’intégrité et IAGraphie demandées par le Cégep.

---

## Choix de conception

| Choix | Décision | Justification |
|---|---|---|
| Noms des ressources | `places` et `reviews` | Noms anglais, au pluriel et sans verbe d’action. |
| Versionnement | `/api/v1` | Conserve le contrat du TP1 malgré le changement de stockage. |
| URI imbriquée | `/places/:placeId/reviews` | Exprime la relation entre un endroit et ses appréciations. |
| URI indépendante | `/reviews/:id` | Permet de gérer une appréciation individuellement. |
| Création | POST et 201 | Crée une ressource et retourne son URI dans Location. |
| Consultation et modification | GET/PATCH et 200 | Retourne la représentation consultée ou modifiée. |
| Suppression | DELETE et 204 | Confirme la suppression sans corps de réponse. |
| Ressource absente | 404 | Distingue l’absence de ressource d’une entrée invalide. |
| Suppression interdite ou doublon | 409 | Signale un conflit avec l’état ou l’intégrité des données. |
| Pagination | `data` et `pagination` | Sépare les ressources des métadonnées. |
| Identifiant public | UUID dans `id` | Préserve les identifiants du TP1. |
| Sérialisation | Mappers | Masque les propriétés MongoDB internes et expose les dates en ISO 8601. |
| Erreurs | Problem Details | Fournit une représentation uniforme. |

### Référence plutôt qu’imbrication — M3

Les appréciations sont conservées séparément parce qu’elles ont leurs propres routes et peuvent être consultées, modifiées ou supprimées individuellement. Cela évite de faire croître sans limite un tableau dans chaque document d’endroit.

L’imbrication faciliterait la lecture d’un endroit avec toutes ses appréciations dans un même document. En revanche, elle conviendrait moins au cycle de vie indépendant des appréciations et à leur nombre potentiellement croissant.

Ce choix implique des opérations supplémentaires pour vérifier l’endroit parent et recalculer ses statistiques. La référence `placeId` n’est pas une clé étrangère automatiquement vérifiée par MongoDB : les services appliquent la règle d’existence du parent.

### Appui sur les notes de cours

Le projet s’appuie sur les notes de cours, avec du code adapté aux exigences de CampusRate. La configuration, les schémas, les repositories et la transformation des documents suivent les principes du [laboratoire MongoDB](https://github.com/cegepmv/420-514/blob/main/content/6-noSql-DB/laboratoire-mongodb-energy-api.md). Les protections suivent les principes des [notes de sécurité](https://github.com/cegepmv/420-514/blob/main/content/7-secure-api/2-securite-api-mongodb.md). Les choix d’implémentation ne sont pas tous reproduits mot pour mot des exemples.

---

## Limites connues

- Aucune authentification JWT ni autorisation RBAC n’est implémentée ; les routes métier sont publiques.
- La démonstration locale utilise HTTP. Un déploiement réel exige une configuration adaptée du transport, du réseau et des comptes MongoDB.
- Le MongoDB local utilisé pour les essais ne constitue pas une configuration de production sécurisée.
- Les compteurs de rate limiting utilisent le stockage local au processus ; ils ne sont pas partagés entre plusieurs instances.
- Les statistiques sont recalculées par des opérations distinctes de l’écriture de l’appréciation. Sans transaction, leur exactitude n’est pas garantie face à des écritures concurrentes ou à une interruption entre ces opérations.
- La vérification des appréciations avant suppression et la suppression de l’endroit ne sont pas atomiques ; une création concurrente reste une limite connue.
- Les appréciations d’un endroit sont retournées sans pagination ; le recalcul charge toutes ses appréciations.
- Le nom d’un endroit n’est pas unique ; l’unicité imposée concerne les identifiants.
- Swagger reste exposé dans la configuration actuelle, y compris lorsque `NODE_ENV=production`.

---

## Utilisation de l’intelligence artificielle

ChatGPT/Codex a été utilisé pour expliquer des erreurs et des mécanismes, commenter des solutions, comparer des stratégies, aider au diagnostic, proposer et adapter du code, préparer des vérifications et rédiger de la documentation.

Cette mention ne remplace pas la déclaration officielle ni ne certifie la conformité de chaque usage aux règles du cours. La déclaration IAGraphie doit décrire l’aide réellement reçue, y compris les propositions de code et de documentation. L’étudiant demeure responsable du code conservé, de sa compréhension, de son fonctionnement et de l’exactitude des informations remises.

**Déclaration d’intégrité/IAGraphie :** fournie dans le document Word inclus dans le ZIP de remise.

---

## Auteur

**Nom :** Jonathan Valadez-Riquelme

**Cours :** 420-514 — Collecte et interprétation des données

**Travail :** TP2 — CampusRate

**Session :** Automne 2026

**Dépôt GitHub :** [Riquelme04/CampusRate](https://github.com/Riquelme04/CampusRate)
