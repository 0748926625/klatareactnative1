import { Animated } from 'react-native';
import { Question, AnswerBlock, AnswerData, AnimatedValue, Projectile } from '../../types';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const createAnswerBlocks = (currentQuestion: Question): AnswerBlock[] => {
  const answers: AnswerData[] = [
    { text: currentQuestion.correct, isCorrect: true },
    ...currentQuestion.wrongs.map(wrong => ({ text: wrong, isCorrect: false }))
  ];
  
  const shuffledAnswers = shuffleArray(answers);
  
  return shuffledAnswers.map((answer, index) => ({
    id: index,
    text: answer.text,
    isCorrect: answer.isCorrect,
    isHit: false,
    animX: new Animated.Value(0) as AnimatedValue,
    animY: new Animated.Value(0) as AnimatedValue,
    duration: Math.random() * 2000 + 3000,
  }));
};

export const createProjectile = (
  startX: number,
  startY: number,
  targetX: number,
  targetY: number
): Projectile => {
  return {
    id: Date.now(),
    x: startX,
    y: startY,
    targetX,
    targetY,
    animX: new Animated.Value(startX) as AnimatedValue,
    animY: new Animated.Value(startY) as AnimatedValue,
    isActive: true,
  };
};

export const checkCollision = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  threshold: number = 50
): boolean => {
  const distance = Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
  );
  return distance < threshold;
}; 