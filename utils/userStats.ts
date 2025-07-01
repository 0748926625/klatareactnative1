import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'USERS_STATS';

export interface UserStats {
  username: string;
  totalQuestions: number;
  correctAnswers: number;
  successRate: number;
  chapters: {
    [chapterName: string]: {
      correct: number;
      total: number;
      lastAttempt: string;
    };
  };
  createdAt: string;
  lastActive: string;
}

export const initializeUserStats = async (username: string): Promise<void> => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    const statsData = stats ? JSON.parse(stats) : {};
    
    if (!statsData[username]) {
      statsData[username] = {
        username,
        totalQuestions: 0,
        correctAnswers: 0,
        successRate: 0,
        chapters: {},
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(statsData));
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des statistiques:', error);
    throw error;
  }
};

export const updateUserStats = async (
  username: string,
  chapterName: string,
  isCorrect: boolean
): Promise<void> => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    if (!stats) {
      await initializeUserStats(username);
      return updateUserStats(username, chapterName, isCorrect);
    }

    const statsData = JSON.parse(stats);
    if (!statsData[username]) {
      await initializeUserStats(username);
      return updateUserStats(username, chapterName, isCorrect);
    }

    const userStats = statsData[username];
    
    // Mettre à jour les statistiques globales
    userStats.totalQuestions += 1;
    if (isCorrect) {
      userStats.correctAnswers += 1;
    }
    userStats.successRate = Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100);
    userStats.lastActive = new Date().toISOString();

    // Mettre à jour les statistiques du chapitre
    if (!userStats.chapters[chapterName]) {
      userStats.chapters[chapterName] = {
        correct: 0,
        total: 0,
        lastAttempt: new Date().toISOString(),
      };
    }

    userStats.chapters[chapterName].total += 1;
    if (isCorrect) {
      userStats.chapters[chapterName].correct += 1;
    }
    userStats.chapters[chapterName].lastAttempt = new Date().toISOString();

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(statsData));
  } catch (error) {
    console.error('Erreur lors de la mise à jour des statistiques:', error);
    throw error;
  }
};

export const getUserStats = async (username: string): Promise<UserStats | null> => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    if (!stats) return null;
    
    const statsData = JSON.parse(stats);
    return statsData[username] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return null;
  }
};

export const getAllUsersStats = async (): Promise<{[username: string]: UserStats}> => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    return stats ? JSON.parse(stats) : {};
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les statistiques:', error);
    return {};
  }
};

export const resetUserStats = async (username: string): Promise<void> => {
  try {
    const stats = await AsyncStorage.getItem(STATS_KEY);
    if (!stats) return;
    
    const statsData = JSON.parse(stats);
    if (statsData[username]) {
      statsData[username] = {
        username,
        totalQuestions: 0,
        correctAnswers: 0,
        successRate: 0,
        chapters: {},
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(statsData));
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des statistiques:', error);
    throw error;
  }
};
