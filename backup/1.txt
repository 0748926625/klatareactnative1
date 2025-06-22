import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

const questionsData = [
  { question: '(a + b)² = ?', answers: ['a²+2ab+b²', 'a²-2ab+b²', 'a²+b²', 'a²-b²'], correctIndex: 0 },
  { question: 'Aire d\'un disque de rayon r ?', answers: ['2πr', 'πr²', 'πd', '2πd'], correctIndex: 1 },
  { question: '(a - b)(a + b) = ?', answers: ['a²+b²', 'a²-b²', 'a²-2ab+b²', 'a²+2ab-b²'], correctIndex: 1 },
];

const PLAYER_RADIUS = 30;
const RECT_WIDTH = 120;
const RECT_HEIGHT = 40;
const CONTROL_HEIGHT = 120;
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
  const [playerX, setPlayerX] = useState(screen.width / 2 - PLAYER_RADIUS);
  const playerY = useRef(new Animated.Value(groundY)).current;

  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answerBlocks, setAnswerBlocks] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [moveDirection, setMoveDirection] = useState(null); // 'left', 'right', or null

  const jumpTargetY = (screen.height * 0.5) - 120;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreen(window);
      setGroundY(window.height - GROUND_HEIGHT - 60);
    });
    return () => subscription.remove();
  }, []);

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

    const possibleHeights = [screen.height * 0.4, screen.height * 0.55, screen.height * 0.7];

    const newBlocks = shuffledAnswers.map((answerData, index) => {
      const randomY = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];
      const horizontalAnimation = new Animated.Value(screen.width + index * (RECT_WIDTH + 150));

      return {
        id: index,
        text: answerData.text,
        isCorrect: answerData.isCorrect,
        isHit: false,
        animX: horizontalAnimation,
        animY: new Animated.Value(randomY),
        animationRef: Animated.loop(
          Animated.timing(horizontalAnimation, {
            toValue: -RECT_WIDTH,
            duration: 12000,
            useNativeDriver: false,
          })
        ),
      };
    });

    setAnswerBlocks(newBlocks);

    newBlocks.forEach((block, index) => {
      setTimeout(() => block.animationRef?.start(), index * 1500);
    });

    return () => newBlocks.forEach(b => b.animationRef?.stop());
  }, [currentQuestionIndex, screen.width]);

  useEffect(() => {
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

  useEffect(() => {
    if (!isRoundActive) return;
    const interval = setInterval(() => {
      if (moveDirection === 'left') {
        setPlayerX(x => Math.max(x - 5, 0));
      } else if (moveDirection === 'right') {
        setPlayerX(x => Math.min(x + 5, screen.width - PLAYER_RADIUS * 2));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [moveDirection, isRoundActive, screen.width]);

  const handleAnswerCollision = (hitBlock) => {
    setIsRoundActive(false);
    hitBlock.isHit = true;

    answerBlocks.forEach(b => b.animationRef.stop());

    if (isJumping) {
      playerY.stopAnimation();
      Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false }).start(() => setIsJumping(false));
    }

    setFeedback(hitBlock.isCorrect ? 'Correct !' : 'Faux !');
    if (hitBlock.isCorrect) setScore(s => s + 10);

    answerBlocks.forEach(b => {
      Animated.timing(b.animY, {
        toValue: screen.height + RECT_HEIGHT,
        duration: 800,
        useNativeDriver: false
      }).start();
    });

    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questionsData.length);
    }, 1500);
  };

  const jump = () => {
    if (isJumping || !isRoundActive) return;
    setIsJumping(true);
    Animated.timing(playerY, { toValue: jumpTargetY, duration: JUMP_DURATION, useNativeDriver: false }).start(({ finished }) => {
      if (finished) {
        Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false }).start(() => setIsJumping(false));
      }
    });
  };

  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;

  const handleTapOrSwipe = (evt, gestureState) => {
    if (!isRoundActive) return;
    const dx = gestureState.moveX - touchStartX;
    const dy = gestureState.moveY - touchStartY;
    const dt = Date.now() - touchStartTime;

    if (Math.abs(dy) > 40 && dy < -20 && Math.abs(dx) < 60 && dt < 500) {
      jump();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        touchStartX = gestureState.x0;
        touchStartY = gestureState.y0;
        touchStartTime = Date.now();

        const playerCenterX = playerX + PLAYER_RADIUS;
        if (gestureState.y0 > screen.height - CONTROL_HEIGHT) {
          if (gestureState.x0 > playerCenterX) {
            setMoveDirection('right');
          } else {
            setMoveDirection('left');
          }
        }
      },
      onPanResponderMove: () => {},
      onPanResponderRelease: (evt, gestureState) => {
        handleTapOrSwipe(evt, gestureState);
        setMoveDirection(null);
      },
    })
  ).current;

  return (
    <View style={[styles.container, { width: screen.width, height: screen.height }]} {...panResponder.panHandlers}>
      <View style={styles.uiContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questionsData[currentQuestionIndex].question}</Text>
          <Text style={[styles.feedbackText, { color: feedback.startsWith('Correct') ? '#4CAF50' : '#F44336' }]}>{feedback}</Text>
        </View>
        <View style={{ width: 80 }} />
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

      <Animated.View style={[styles.player, { left: playerX, top: playerY }]} />
      <View style={[styles.ground, { width: screen.width, height: GROUND_HEIGHT, bottom: 0 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7fa' },
  uiContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796b',
    width: 80,
  },
  questionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: 'bold',
    minHeight: 30,
  },
  player: {
    position: 'absolute',
    width: PLAYER_RADIUS * 2,
    height: PLAYER_RADIUS * 2,
    borderRadius: PLAYER_RADIUS,
    backgroundColor: '#1976d2',
    borderWidth: 3,
    borderColor: '#fff'
  },
  rect: {
    position: 'absolute',
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
    backgroundColor: '#ff7043',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  rectText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  ground: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#388e3c',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    zIndex: 1,
  },
});
