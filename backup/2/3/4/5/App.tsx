import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, TouchableOpacity, ImageBackground, Image, Easing } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import bgsta from './assets/backgrounds/bgsta.png';
import sky1 from './assets/backgrounds/sky1.png';
import zadiSprite from './assets/sprites/zadi.png';
import { Audio } from 'expo-av';

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

// --- Sprite sheet animation constants ---
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;
const TOTAL_SPRITE_FRAMES = 13;
const IDLE_FRAME_INDEX = 0;
const RUN_RIGHT_START_INDEX = 1;
const RUN_RIGHT_FRAME_COUNT = 6;
const RUN_LEFT_START_INDEX = 7;
const RUN_LEFT_FRAME_COUNT = 6;
const ANIMATION_SPEED = 80; // ms

const BLOCK_SPEED = 40; // pixels par seconde (réduit de 60% par rapport à 100)

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
  const [groundY, setGroundY] = useState(screen.height - GROUND_HEIGHT - PLAYER_RADIUS * 2);
  const [playerX, setPlayerX] = useState(screen.width / 2 - PLAYER_RADIUS);
  const playerY = useRef(new Animated.Value(screen.height - GROUND_HEIGHT - PLAYER_RADIUS * 2)).current;

  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answerBlocks, setAnswerBlocks] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [moveDirection, setMoveDirection] = useState(null); // 'left', 'right', or null
  const [skyOffset, setSkyOffset] = useState(0);
  const [frameIndex, setFrameIndex] = useState(IDLE_FRAME_INDEX);
  const prevDirection = useRef('idle');
  const animationIntervalRef = useRef(null);
  const jumpSound = useRef(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const runSound = useRef(null);

  const jumpTargetY = (screen.height * 0.5) - 120;

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreen(window);
      const newGroundY = window.height - GROUND_HEIGHT - PLAYER_RADIUS * 2;
      setGroundY(newGroundY);
      playerY.setValue(newGroundY); // Synchronise la position du joueur avec le sol
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

    let lastY = null;
    const newBlocks = shuffledAnswers.map((answerData, index) => {
      let randomY;
      do {
        randomY = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];
      } while (randomY === lastY && possibleHeights.length > 1);
      lastY = randomY;
      const startX = screen.width + index * (RECT_WIDTH + 150);
      const distance = startX + RECT_WIDTH;
      const duration = (distance / BLOCK_SPEED) * 1000;
      const horizontalAnimation = new Animated.Value(startX);
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
            duration: duration,
            useNativeDriver: false,
            easing: Easing.linear,
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
    const interval = setInterval(() => {
      if (moveDirection === 'left') {
        setPlayerX(x => Math.max(x - 10, 0));
      } else if (moveDirection === 'right') {
        setPlayerX(x => Math.min(x + 10, screen.width - PLAYER_RADIUS * 2));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [moveDirection, screen.width]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSkyOffset(offset => {
        let next = offset - 1;
        if (next <= -screen.width) next = 0;
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [screen.width]);

  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    // Gère le changement de direction
    if (moveDirection !== prevDirection.current) {
      if (moveDirection === 'right') {
        setFrameIndex(RUN_RIGHT_START_INDEX);
      } else if (moveDirection === 'left') {
        setFrameIndex(RUN_LEFT_START_INDEX);
      } else {
        setFrameIndex(IDLE_FRAME_INDEX);
      }
      prevDirection.current = moveDirection;
    } else if (moveDirection === 'idle' && frameIndex !== IDLE_FRAME_INDEX) {
      setFrameIndex(IDLE_FRAME_INDEX);
    }
    // Lance l'animation si on bouge
    if (moveDirection === 'right' || moveDirection === 'left') {
      animationIntervalRef.current = setInterval(() => {
        setFrameIndex(prev => {
          if (moveDirection === 'right') {
            const next = (prev - RUN_RIGHT_START_INDEX + 1) % RUN_RIGHT_FRAME_COUNT;
            return RUN_RIGHT_START_INDEX + next;
          }
          if (moveDirection === 'left') {
            const next = (prev - RUN_LEFT_START_INDEX + 1) % RUN_LEFT_FRAME_COUNT;
            return RUN_LEFT_START_INDEX + next;
          }
          return IDLE_FRAME_INDEX;
        });
      }, ANIMATION_SPEED);
    }
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    };
  }, [moveDirection]);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const [jump, correct, wrong, run] = await Promise.all([
          Audio.Sound.createAsync(require('./assets/audio/jumpSound.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/correctSound.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/wrongSound.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/run.mp3')),
        ]);
        jumpSound.current = jump.sound;
        correctSound.current = correct.sound;
        wrongSound.current = wrong.sound;
        runSound.current = run.sound;
      } catch (error) {
        console.error('Erreur de chargement des sons:', error);
      }
    };
    loadSounds();
    return () => {
      jumpSound.current?.unloadAsync();
      correctSound.current?.unloadAsync();
      wrongSound.current?.unloadAsync();
      runSound.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (moveDirection === 'left' || moveDirection === 'right') {
      runSound.current?.setIsLoopingAsync(true);
      runSound.current?.replayAsync();
    } else {
      runSound.current?.stopAsync();
    }
  }, [moveDirection]);

  const handleAnswerCollision = (hitBlock) => {
    setIsRoundActive(false);
    hitBlock.isHit = true;
    answerBlocks.forEach(b => b.animationRef.stop());
    if (isJumping) {
      playerY.stopAnimation();
      Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false }).start(() => setIsJumping(false));
    }
    answerBlocks.forEach(b => {
      Animated.timing(b.animY, {
        toValue: screen.height + RECT_HEIGHT,
        duration: 800,
        useNativeDriver: false
      }).start();
    });
    if (hitBlock.isCorrect) {
      correctSound.current?.replayAsync();
      setScore(s => s + 10);
      setFeedback('Correct !');
    } else {
      wrongSound.current?.replayAsync();
      setFeedback('Faux !');
    }
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questionsData.length);
    }, 1500);
  };

  const jump = () => {
    if (isJumping || !isRoundActive) return;
    setIsJumping(true);
    jumpSound.current?.replayAsync();
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
        if (gestureState.x0 > playerCenterX) {
          setMoveDirection('right');
        } else {
          setMoveDirection('left');
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const x = gestureState.moveX;
        const playerCenterX = playerX + PLAYER_RADIUS;
        if (x > playerCenterX + 4) {
          setMoveDirection('right');
        } else if (x < playerCenterX - 4) {
          setMoveDirection('left');
        } else {
          setMoveDirection(null);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        handleTapOrSwipe(evt, gestureState);
        setMoveDirection(null);
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Animated.Image
        source={sky1}
        style={{
          position: 'absolute',
          width: screen.width,
          height: screen.height,
          left: skyOffset,
          top: 0,
          zIndex: 0,
        }}
        resizeMode="cover"
      />
      <Animated.Image
        source={sky1}
        style={{
          position: 'absolute',
          width: screen.width,
          height: screen.height,
          left: skyOffset + screen.width,
          top: 0,
          zIndex: 0,
        }}
        resizeMode="cover"
      />
      <ImageBackground
        source={bgsta}
        style={{
          position: 'absolute',
          width: screen.width * 1.08,
          height: screen.height,
          left: 0,
          top: 0,
        }}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.uiContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{questionsData[currentQuestionIndex].question}</Text>
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

          <Animated.View
            style={{
              position: 'absolute',
              left: playerX,
              top: playerY,
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              overflow: 'hidden',
              zIndex: 10,
            }}
          >
            <Image
              source={zadiSprite}
              style={{
                width: FRAME_WIDTH * TOTAL_SPRITE_FRAMES,
                height: FRAME_HEIGHT,
                transform: [{ translateX: -frameIndex * FRAME_WIDTH }],
              }}
              resizeMode="stretch"
            />
          </Animated.View>
          <View style={[styles.ground, { width: screen.width, height: GROUND_HEIGHT, bottom: 0 }]} />
          <View style={styles.controlsContainer} pointerEvents="box-none">
            <TouchableOpacity
              style={[styles.controlButton, styles.leftButton]}
              onPressIn={() => setMoveDirection('left')}
              onPressOut={() => setMoveDirection(null)}
            >
              <Text style={styles.controlButtonText}>{'◀'}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={[styles.controlButton, styles.jumpButton]}
                onPress={jump}
              >
                {/* Pas de texte ni d'icône */}
              </TouchableOpacity>
              <View style={{ width: 16 }} />
              <TouchableOpacity
                style={[styles.controlButton, styles.rightButton]}
                onPressIn={() => setMoveDirection('right')}
                onPressOut={() => setMoveDirection(null)}
              >
                <Text style={styles.controlButtonText}>{'▶'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    zIndex: 20,
  },
  controlButton: {
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    borderWidth: 2,
    borderColor: '#1976d2',
    opacity: 0.4,
  },
  controlButtonText: {
    fontSize: 32,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  leftButton: {
    alignSelf: 'flex-start',
  },
  jumpButton: {
    backgroundColor: '#FFD600',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  rightButton: {
    alignSelf: 'flex-end',
  },
});
