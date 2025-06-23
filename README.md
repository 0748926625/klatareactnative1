# MarioLikeGame

MarioLikeGame est un mini-jeu éducatif en 2D développé avec React Native (Expo). Le joueur contrôle une boule qui doit toucher des blocs-réponses animés à l'écran pour répondre à des questions de mathématiques. Le jeu s'inspire des mécaniques de plateforme (type Mario) et propose une expérience interactive et ludique.

## Fonctionnalités principales
- **Contrôle du personnage** : Déplacement horizontal et saut de la boule via l'écran tactile.
- **Questions de mathématiques** : Une question s'affiche en haut, avec plusieurs réponses animées sous forme de blocs.
- **Détection de collision** : Lorsque la boule touche un bloc, la réponse est validée (bonne ou mauvaise) et un feedback s'affiche.
- **Score et progression** : Le score augmente à chaque bonne réponse, passage automatique à la question suivante.
- **Animations** : Blocs-réponses animés, boule animée, gestion du sol.
- **Orientation paysage** : L'application force le mode paysage pour une meilleure expérience de jeu.

## Technologies utilisées
- **React Native** (Expo)
- **TypeScript**
- **expo-screen-orientation** (pour l'orientation paysage)
- **Animated API** de React Native (pour les animations)

## Structure du code
- `App.tsx` : Composant principal, logique du jeu, gestion des questions, collisions, animations et score.
- `assets/` : Images et icônes du jeu.
- `package.json` : Dépendances et scripts du projet.

## Lancer le jeu
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer l'application :
   ```bash
   npm start
   ```
   ou
   ```bash
   expo start
   ```
3. Ouvrir sur un simulateur ou un appareil physique (Android/iOS/Web).

---

Amusez-vous bien avec MarioLikeGame ! "# klatareactnative1"  
