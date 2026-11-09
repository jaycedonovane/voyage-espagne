// Contenu éditorial du site : les étapes du voyage et leurs groupes de photos.
// "de" et "a" sont les numéros d'origine des photos (1 à 102, ordre chronologique).
// Les photos supprimées n'existent plus dans js/photos.js : elles sont simplement sautées.
// Pour modifier un titre ou un texte, il suffit de changer les chaînes ci-dessous.

const JOURS = [
  {
    id: "jour1",
    nav: "Jour 1",
    mois: "NOV", jour: "05",
    date: "Jeudi 5 novembre 2026",
    titre: "Arrivée à Barcelone",
    texte: "Premiers pas dans Barcelone : les rues du centre, les grands immeubles à balcons, le panorama sur toute la ville depuis les hauteurs et, en fin de journée, l'Arc de Triomphe.",
    groupes: [
      { id: "rues-bcn",  titre: "Dans les rues",           de: 9,  a: 16 },
      { id: "vues-bcn",  titre: "Vues sur la ville",       de: 17, a: 24 },
      { id: "arc",       titre: "L'Arc de Triomphe",       de: 25, a: 27 }
    ]
  },
  {
    id: "jour2",
    nav: "Jour 2",
    mois: "NOV", jour: "06",
    date: "Vendredi 6 novembre 2026",
    titre: "Lloret de Mar",
    texte: "Départ à l'aube dans une ville encore endormie : avenues bordées de palmiers, place de la mairie pavoisée, ruelles peintes. Puis la plage de sable doré, les criques, les pins au-dessus de la Méditerranée et le château perché sur les rochers.",
    groupes: [
      { id: "lloret-rues",  titre: "Les rues au lever du jour", de: 28, a: 43 },
      { id: "lloret-plage", titre: "La plage et les criques",   de: 44, a: 60 },
      { id: "lloret-hotel", titre: "À l'hôtel",                 de: 61, a: 62 }
    ]
  },
  {
    id: "jour3",
    nav: "Jour 3",
    mois: "NOV", jour: "07",
    date: "Samedi 7 novembre 2026",
    titre: "Hôtel, détente et bonne table",
    texte: "Une journée plus calme autour de l'hôtel : la boutique, le jardin et la vue sur le terrain de sport. Le soir, un restaurant dont les murs et le plafond sont couverts de messages écrits par les clients, avec boissons fraîches et grillades.",
    groupes: [
      { id: "hotel",       titre: "Autour de l'hôtel",        de: 63, a: 70 },
      { id: "restaurant",  titre: "Le restaurant aux murs écrits", de: 71, a: 76 }
    ]
  },
  {
    id: "jour4",
    nav: "Jour 4",
    mois: "NOV", jour: "08",
    date: "Dimanche 8 novembre 2026",
    titre: "Tex-Mex et grillades",
    texte: "Dîner tex-mex dans un décor coloré aux crânes mexicains, passage par l'appartement, puis grand repas dans une salle à nappes blanches : côtes de bœuf et légumes grillés.",
    groupes: [
      { id: "panxos",      titre: "Le tex-mex",      de: 77, a: 85 },
      { id: "appartement", titre: "L'appartement",   de: 86, a: 87 },
      { id: "grillades",   titre: "Les grillades",   de: 88, a: 93 }
    ]
  },
  {
    id: "nuit",
    nav: "La nuit",
    mois: "NOV", jour: "09",
    date: "Nuit du 8 au 9 novembre 2026",
    titre: "Barcelone la nuit",
    texte: "Vers minuit, dernière balade dans les ruelles du quartier gothique, jusqu'à la place Sant Jaume et ses grands bâtiments éclairés.",
    groupes: [
      { id: "nuit-bcn", titre: "Le quartier gothique de nuit", de: 94, a: 102 }
    ]
  }
];

// Les coups de cœur, dans l'ordre d'affichage (le premier est affiché en grand).
// "n" = numéro d'origine de la photo.
const FAVORIS = [
  { n: 45, titre: "Un matin de rêve sur la plage" },
  { n: 49, titre: "Le château sur son rocher" },
  { n: 51, titre: "Les vagues contre les rochers" },
  { n: 46, titre: "Vue sur la baie" },
  { n: 60, titre: "Le chemin dans la nature" },
  { n: 81, titre: "Ambiance de bar" }
];

// Nuage de mots-clés : "poids" de 1 (petit) à 5 (gros), "cible" = id d'un jour ou d'un groupe.
const TAGS = [
  { label: "La Clave",     cible: "clave",          poids: 5 },
  { label: "Salsa",        cible: "clave",          poids: 4 },
  { label: "Barcelone",    cible: "jour1",          poids: 5 },
  { label: "Lloret de Mar", cible: "jour2",         poids: 5 },
  { label: "Coups de cœur", cible: "coups-de-coeur", poids: 4 },
  { label: "Plage",        cible: "lloret-plage",   poids: 4 },
  { label: "Nuit",         cible: "nuit",           poids: 4 },
  { label: "Panorama",     cible: "vues-bcn",       poids: 3 },
  { label: "Ruelles",      cible: "lloret-rues",    poids: 3 },
  { label: "Tex-Mex",      cible: "panxos",         poids: 3 },
  { label: "Resto",        cible: "restaurant",     poids: 2 },
  { label: "Hôtel",        cible: "hotel",          poids: 2 },
  { label: "Grillades",    cible: "grillades",      poids: 2 },
  { label: "Arc de Triomphe", cible: "arc",         poids: 1 }
];
