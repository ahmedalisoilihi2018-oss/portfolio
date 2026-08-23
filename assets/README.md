# Dossier `assets/`

Ce dossier contient les médias du portfolio.

## Logo

| Fichier | Utilisation | Statut |
|---|---|---|
| `logo-soradev.jpg` | Logo affiché dans l'en-tête (`<img id="brand-logo">`) | ✅ Présent |
| `ahmed-soilihi.jpg` | Photo d'Ahmed Ali SOILIHI, en haut à gauche du site (`.header-identity__photo`) | ✅ Présent — recadrée en carré (portrait + épaules) et compressée depuis `SOILIHI.jpg` (320×320px, ~23 Ko) |

Si ce fichier est absent ou ne se charge pas, le site affiche automatiquement
un repli textuel stylé (« SORA-DEV CONSULTING ») grâce à `js/script.js`
(section 1 — repli du logo). Aucune action requise si vous ne changez rien.

## Captures Power BI des études de cas

Toutes les captures fournies ont été retraitées avant intégration
(redimensionnement à 1400px de large, compression JPEG qualité 82 pour rester
sous ~250 Ko chacune) puis habillées dans `index.html` par un composant
« cadre dashboard » (`.dashboard-frame` dans `css/style.css`) qui ajoute une
barre de titre façon fenêtre d'application, pour un rendu homogène quelle que
soit la mise en page d'origine de la capture.

| Fichier utilisé | Étude de cas | Contenu |
|---|---|---|
| `projet-1-dashboard-1.jpg` | 01 — Réduction du taux d'avoirs | Vue d'ensemble : montants avoirs/factures par année |
| `projet-1-dashboard-2.jpg` | 01 — Réduction du taux d'avoirs | Détail du montant des avoirs par motif |
| `projet-2-dashboard-1.jpg` | 02 — Audit Data Quality | Nombre d'avoirs par motif (15 catégories) |
| `projet-3-dashboard-1.jpg` | 03 — Dashboard de pilotage | Écran de recherche multicritère |
| `projet-4-dashboard-1.jpg` | 04 — Écarts commandes/factures | Répartition du reste à facturer par statut |
| `projet-4-dashboard-2.jpg` | 04 — Écarts commandes/factures | Table de détail par commande |
| `projet-5-dashboard-1.jpg` | 05 — Traçabilité animale | Indicateurs de synthèse et délais de notification |

### ⚠️ Point de vigilance traité — `projet-3-dashboard-1.jpg`

La capture source fournie (`Pilotage_qualite_facturation1.jpg`) affichait en
clair, dans la colonne « Client » de la table de détail, une raison sociale
réelle et identifiable (répétée sur toutes les lignes visibles). Conformément
au principe de confidentialité énoncé dans votre cahier des charges
(« les données nominatives sont anonymisées ou généralisées avant toute
publication »), cette colonne a été **masquée par un bandeau opaque** avant
intégration (fichier `projet-3-dashboard-1.jpg` dans ce dossier). Le fichier
d'origine, non retouché, n'a pas été copié dans `assets/` — il reste
uniquement à la racine du projet si vous souhaitez le vérifier ou produire
vous-même un nouvel export propre (idéalement en filtrant/masquant la colonne
directement dans Power BI avant capture, pour un rendu plus net que le
bandeau appliqué ici).

**Recommandation :** vérifiez les 4 autres captures avant toute mise en ligne
publique — seuls des codes clients génériques (ex. `ML0101`, `1140002001`)
ont été repérés ailleurs, mais un contrôle visuel de votre part reste
préférable avant publication.

### Remplacer une capture

Pour mettre à jour une capture, déposez le nouveau fichier ici sous le même
nom (ou mettez à jour le chemin `src` correspondant dans `index.html`) —
respectez si possible une largeur ≥ 1400px et compressez l'export avant
dépôt (poids cible < 300 Ko).

## Image de partage LinkedIn / réseaux sociaux (optionnelle)

| Fichier attendu | Utilisation |
|---|---|
| `og-image.jpg` | Vignette affichée lors du partage du lien sur LinkedIn (1200×630px) |

Une fois le fichier ajouté, décommentez la balise `<meta property="og:image" ...>`
dans le `<head>` de `index.html`.
