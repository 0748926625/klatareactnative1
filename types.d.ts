import { Animated } from 'react-native';
import { Audio } from 'expo-av';

interface Question {
  question: string;
  texteOral: string;
  correct: string;
  wrongs: string[];
  imgKey?: string;
  answers?: string[];
  correctIndex?: number;
}

interface UserStats {
  scores: {
    chapitre: string;
    score: number;
    nbQuestions: number;
    noteSur20: number;
    date: string;
    temps: number;
  }[];
  erreurs: {
    chapitre: string;
    question: string;
    correct: string;
    date: string;
  }[];
  chapitresCompletes: string[];
}

interface MissedQuestion {
  question: string;
  correct: string;
  chapitre?: string;
}

interface AnimatedValue extends Animated.Value {
  _value: number;
}

interface AnswerBlock {
  id: number;
  text: string;
  isCorrect: boolean;
  isHit: boolean;
  animX: AnimatedValue;
  animY: AnimatedValue;
  duration: number;
}

interface AnswerData {
  text: string;
  isCorrect: boolean;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  animX: AnimatedValue;
  animY: AnimatedValue;
  isActive: boolean;
}

interface GameSounds {
  jumpSound: Audio.Sound | null;
  correctSound: Audio.Sound | null;
  wrongSound: Audio.Sound | null;
  runSound: Audio.Sound | null;
  laserSound: Audio.Sound | null;
}

export { 
  Question, 
  UserStats, 
  MissedQuestion, 
  AnswerBlock, 
  AnswerData,
  Projectile,
  GameSounds,
  AnimatedValue
}; 