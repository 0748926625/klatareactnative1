import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

// ... (Base de données de questions et constantes inchangées)
const questionsData = [
  { question: '(a + b)² = ?', answers: ['a²+2ab+b²', 'a²-2ab+b²', 'a²+b²', 'a²-b²'], correctIndex: 0 },
  { question: 'Aire d\'un disque de rayon r ?', answers: ['2πr', 'πr²', 'πd', '2πd'], correctIndex: 1 },
  { question: '(a - b)(a + b) = ?', answers: ['a²+b²', 'a²-b²', 'a²-2ab+b²', 'a²+2ab-b²'], correctIndex: 1 },
];
const PLAYER_RADIUS = 30;
const RECT_WIDTH = 120;
const RECT_HEIGHT = 40;
const CONTROL_HEIGHT = 120;
const PLAYER_STEP = 40;
const JUMP_DURATION = 350;
const GROUND_HEIGHT = 40;

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function App() {
  const [screen, setScreen] = useState(Dimensions.get('window'));
  const [groundY, setGroundY] = useState(screen.height - GROUND_HEIGHT - 60);

  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answerBlocks, setAnswerBlocks] = useState([]);

  const [playerX, setPlayerX] = useState(screen.width / 2 - PLAYER_RADIUS);
  const playerY = useRef(new Animated.Value(groundY)).current;
  const [isJumping, setIsJumping] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(true);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreen(window);
      setGroundY(window.height - GROUND_HEIGHT - 60);
    });
    return () => subscription.remove();
  }, []);

  const jumpTargetY = (screen.height * 0.5) - 120;

  useEffect(() => {
    if (screen.width === 0) return;

    setIsRoundActive(true);
    setFeedback('');
    const question = questionsData[currentQuestionIndex];

    const shuffledAnswers = shuffleArray(
      question.answers.map((answer, index) => ({
        text: answer,
        isCorrect: index === question.correctIndex,
      }))
    );
    
    // --- MODIFICATION 3 : Hauteurs verticales aléatoires pour les blocs ---
    const possibleHeights = [screen.height * 0.4, screen.height * 0.55, screen.height * 0.7];

    const newBlocks = shuffledAnswers.map((answerData, index) => {
      const randomY = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];
      const horizontalAnimation = new Animated.Value(screen.width + index * (RECT_WIDTH + 150)); // Un peu plus d'espace
      
      return {
        id: index,
        text: answerData.text,
        isCorrect: answerData.isCorrect,
        isHit: false,
        animX: horizontalAnimation,
        animY: new Animated.Value(randomY), // Utilise la hauteur aléatoire
        animationRef: Animated.loop(
          Animated.timing(horizontalAnimation, {
            toValue: -RECT_WIDTH,
            // --- MODIFICATION 3 : Vitesse plus lente (durée plus longue) ---
            duration: 12000, 
            useNativeDriver: false,
          })
        ),
      };
    });

    setAnswerBlocks(newBlocks);

    newBlocks.forEach((block, index) => {
      // Décalage de départ conservé
      setTimeout(() => {
        if (block.animationRef) block.animationRef.start();
      }, index * 1500); // Léger espacement supplémentaire pour compenser la lenteur
    });

    return () => {
        newBlocks.forEach(b => b.animationRef?.stop());
    }
  }, [currentQuestionIndex, screen.width]);

  useEffect(() => {
    // ... (boucle de jeu inchangée)
    if (!isRoundActive) return;
    const gameLoop = setInterval(() => {
      const playerCurrentX = playerX;
      const playerCurrentY = (playerY as any)._value;
      answerBlocks.forEach((block) => {
        if (block.isHit) return;
        const rectCurrentX = (block.animX as any)._value;
        const rectCurrentY = (block.animY as any)._value;
        const playerBox = { left: playerCurrentX, right: playerCurrentX + PLAYER_RADIUS * 2, top: playerCurrentY, bottom: playerCurrentY + PLAYER_RADIUS * 2 };
        const rectBox = { left: rectCurrentX, right: rectCurrentX + RECT_WIDTH, top: rectCurrentY, bottom: rectCurrentY + RECT_HEIGHT };
        const hasCollision = playerBox.right > rectBox.left && playerBox.left < rectBox.right && playerBox.bottom > rectBox.top && playerBox.top < rectBox.bottom;
        if (hasCollision) {
          handleAnswerCollision(block);
        }
      });
    }, 16);
    return () => clearInterval(gameLoop);
  }, [playerX, answerBlocks, isRoundActive]);


  const handleAnswerCollision = (hitBlock) => {
    setIsRoundActive(false);
    hitBlock.isHit = true;

    answerBlocks.forEach(b => b.animationRef.stop());
    
    if (isJumping) {
      playerY.stopAnimation();
      Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false }).start(() => setIsJumping(false));
    }
    
    if (hitBlock.isCorrect) {
      setScore(s => s + 10);
      setFeedback('Correct !');
    } else {
      setFeedback('Faux !');
    }

    // --- MODIFICATION 1 : Faire tomber TOUS les autres blocs aussi ---
    answerBlocks.forEach(b => {
      Animated.timing(b.animY, {
          toValue: screen.height + RECT_HEIGHT,
          duration: 800,
          useNativeDriver: false
      }).start();
    });

    // --- MODIFICATION 1 : Passer à la question suivante beaucoup plus vite ---
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questionsData.length);
    }, 1500); // 1.5 seconde de pause au lieu de 3
  };

  // ... (fonctions de contrôle jump, handleTapOrSwipe, panResponder inchangées)
  const jump = () => { if (isJumping || !isRoundActive) return; setIsJumping(true); Animated.timing(playerY, { toValue: jumpTargetY, duration: JUMP_DURATION, useNativeDriver: false, }).start(({ finished }) => { if (finished) { Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false, }).start(() => setIsJumping(false)); } }); };
  let touchStartX = 0; let touchStartY = 0; let touchStartTime = 0;
  const handleTapOrSwipe = (evt, gestureState) => { if (!isRoundActive) return; const { locationX, locationY } = evt.nativeEvent; const playerCenterX = playerX + PLAYER_RADIUS; const dx = gestureState.moveX - touchStartX; const dy = gestureState.moveY - touchStartY; const dt = Date.now() - touchStartTime; if (Math.abs(dy) > 40 && dy < -20 && Math.abs(dx) < 60 && dt < 500) { jump(); return; } if (locationY > screen.height - CONTROL_HEIGHT) { if (locationX > playerCenterX) { setPlayerX(x => Math.min(x + PLAYER_STEP, screen.width - PLAYER_RADIUS * 2)); } else if (locationX < playerCenterX) { setPlayerX(x => Math.max(x - PLAYER_STEP, 0)); } } };
  const panResponder = useRef( PanResponder.create({ onStartShouldSetPanResponder: () => true, onPanResponderGrant: (evt, gestureState) => { touchStartX = gestureState.x0; touchStartY = gestureState.y0; touchStartTime = Date.now(); }, onPanResponderRelease: (evt, gestureState) => { handleTapOrSwipe(evt, gestureState); }, }) ).current;

  return (
    <View style={[styles.container, { width: screen.width, height: screen.height }]} {...panResponder.panHandlers}>
      {/* --- MODIFICATION 2 : Nouvelle structure de l'UI --- */}
      <View style={styles.uiContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{questionsData[currentQuestionIndex].question}</Text>
            <Text style={[styles.feedbackText, { color: feedback.startsWith('Correct') ? '#4CAF50' : '#F44336'}]}>{feedback}</Text>
        </View>
        <View style={{width: 80}} /> {/* Espace vide pour équilibrer le flexbox */}
      </View>
      
      {answerBlocks.map((block) => (
        <Animated.View
          key={block.id}
          style={[
            styles.rect,
            {
              left: block.animX,
              top: block.animY,
              backgroundColor: block.isHit ? (block.isCorrect ? '#4CAF50' : '#F44336') : '#ff7043',
            },
          ]}
        >
          <Text style={styles.rectText}>{block.text}</Text>
        </Animated.View>
      ))}
      
      <Animated.View style={[ styles.player, { left: playerX, top: playerY }]} />
      <View style={[styles.ground, { width: screen.width, height: GROUND_HEIGHT, bottom: 0 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7fa' },
  // --- MODIFICATION 2 : Nouveaux styles pour l'UI ---
  uiContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row', // Aligne les éléments horizontalement
    justifyContent: 'space-between', // Pousse le score à gauche et le reste au centre/droite
    alignItems: 'center',
    zIndex: 10,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    width: 80, // Largeur fixe pour le score
  },
  questionContainer: {
    flex: 1, // Prend l'espace restant au milieu
    alignItems: 'center', // Centre la question et le feedback
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: 'bold',
    minHeight: 30, // Empêche le layout de sauter quand le feedback apparaît/disparaît
  },
  // --- (Fin des nouveaux styles) ---
  player: { position: 'absolute', width: PLAYER_RADIUS * 2, height: PLAYER_RADIUS * 2, borderRadius: PLAYER_RADIUS, backgroundColor: '#1976d2', borderWidth: 3, borderColor: '#fff' },
  rect: { position: 'absolute', width: RECT_WIDTH, height: RECT_HEIGHT, backgroundColor: '#ff7043', borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
  rectText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  ground: { position: 'absolute', left: 0, backgroundColor: '#388e3c', borderTopLeftRadius: 12, borderTopRightRadius: 12, zIndex: 1 },
});
