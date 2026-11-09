# Espagne 2026 - Carnet de voyage

Site de voyage en HTML, CSS et JavaScript, sans framework, dans un style "carnet scrapbook" fun (polaroids scotchés, post-it, autocollants, ticker)
avec visionneuse plein écran façon Lightbox.
75 photos, du 5 au 9 novembre 2026 (27 photos ecartees, leurs originaux restent dans `_sources`).

## Fonctionnement des photos

- Un clic ou un toucher sur une miniature la fait grandir en plein écran, avec une pluie de confettis.
- Les confettis ne partent qu'à l'ouverture : pas quand on passe d'une photo à l'autre, mais de nouveau si on ferme puis qu'on rouvre une photo.
- Photo suivante / précédente : flèches à l'écran, touches ← → ↑ ↓ (aussi PageHaut / PageBas, Début / Fin), ou glissement du doigt. Échap ferme.

## Musique

Un écran d'accueil propose "Entrer avec la musique" ou "Entrer sans le son" (les navigateurs interdisent le son automatique : il faut un clic). La musique démarre en fondu, reste discrète (volume 22 %) et se coupe ou se relance avec le bouton rond en bas à droite. Elle se met en pause quand l'onglet passe en arrière-plan.
Liste de lecture en boucle : `assets/audio/musique-accueil.mp3` d'abord (la nouvelle musique), puis `assets/audio/musique-espagne.mp3` (liste `PISTES` dans `js/main.js`).
Quand on lance une vidéo, la musique de fond se met en pause toute seule et reprend quand la vidéo s'arrête.

## Festival La Clave (à la une)

La section tout en haut de la page (`#clave` dans `index.html`) présente le festival La Clave de Lloret de Mar et 3 vidéos (`assets/video/clave-1/2/3.mp4`, converties en H.264 pour tous les navigateurs, avec une image d'aperçu `-poster.jpg`). Les vidéos d'origine restent dans `_sources/videos-originales/`.
Slogan : "Toi et moi, nous partons vers la lune !"

## Mobile first

Le CSS part du petit écran (dès 280 px, Z Fold fermé inclus) et ajoute la mise en page large à partir de 700 px et 860 px (deux colonnes : Z Fold ouvert, tablette, ordinateur).
Prévu pour les encoches et la Dynamic Island (`viewport-fit=cover` et zones sûres), la rotation et le dépliage de l'écran (la photo se redimensionne toute seule).
Les effets de survol ne s'appliquent qu'avec une souris, et `prefers-reduced-motion` coupe les animations et les confettis.

## Coups de coeur et en-tete

Les 6 coups de coeur sont listes dans FAVORIS (js/jours.js) : le premier s'affiche en grand, tous portent une etoile dans les galeries. L'image d'en-tete est la photo 31 (css/style.css, ligne #entete).

## Ouvrir le site

Double-clic sur `index.html`. Aucun serveur nécessaire.

## Structure

- `index.html` : la page
- `css/style.css` : tout le style
- `js/main.js` : construit la page, le menu, le nuage de mots-clés et la visionneuse
- `js/jours.js` : **les textes** (titres, descriptions, groupes de photos, mots-clés) : c'est ici qu'on corrige
- `js/photos.js` : liste des 75 photos (générée)
- `assets/img/full/` : photos web (1800 px)
- `assets/img/thumb/` : miniatures (520 px)
- `assets/img/medium/` : versions 900 px des 6 coups de coeur
- `assets/video/` : les 3 vidéos du festival et leurs images d'aperçu
- `assets/audio/` : les 2 musiques d'ambiance
- `assets/fonts/` : polices Fredoka, Permanent Marker et Caveat (licence OFL, hébergées dans le projet)
- `_sources/originaux/` : photos d'origine 4000x3000 rangées par jour (restent sur le PC, ignorées par Git)
- `_sources/apercu/` : planche de vignettes de contrôle (ignorée par Git)

## Modifier le contenu

Dans `js/jours.js`, chaque jour a un `titre`, un `texte` et des `groupes`.
`de` et `a` sont les numéros de photos (numéros d'origine 1 à 102 ; les photos supprimées sont sautées) : changer ces nombres suffit pour déplacer des photos d'un groupe à un autre.

## Photos

Les versions publiées n'ont plus aucune métadonnée (pas de position GPS, pas d'identifiant d'appareil).
