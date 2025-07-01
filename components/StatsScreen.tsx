import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USERS_STATS';

export default function StatsScreen({ navigation }) {
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const user = await AsyncStorage.getItem('CURRENT_USER');
        if (!user) {
          navigation.navigate('Login');
          return;
        }
        
        const userStats = await AsyncStorage.getItem(STORAGE_KEY);
        const statsData = userStats ? JSON.parse(userStats)[user] : null;
        setStats(statsData);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [navigation]);

  const getSuccessRate = (chapter) => {
    if (!stats?.chapters?.[chapter]) return 0;
    const { correct, total } = stats.chapters[chapter];
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text>Aucune statistique disponible.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Statistiques de {stats.username}</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Résumé global</Text>
        <View style={styles.statRow}>
          <Text>Questions répondues :</Text>
          <Text style={styles.statValue}>{stats.totalQuestions || 0}</Text>
        </View>
        <View style={styles.statRow}>
          <Text>Taux de réussite global :</Text>
          <Text style={styles.statValue}>{stats.successRate || 0}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text>Chapitres commencés :</Text>
          <Text style={styles.statValue}>{stats.chapters ? Object.keys(stats.chapters).length : 0}</Text>
        </View>
      </View>

      {stats.chapters && Object.keys(stats.chapters).length > 0 && (
        <View style={styles.chapterSection}>
          <Text style={styles.sectionTitle}>Détails par chapitre</Text>
          {Object.entries(stats.chapters).map(([chapter, data]) => (
            <View key={chapter} style={styles.chapterCard}>
              <Text style={styles.chapterTitle}>{chapter}</Text>
              <View style={styles.statRow}>
                <Text>Réussite :</Text>
                <Text style={styles.statValue}>{getSuccessRate(chapter)}%</Text>
              </View>
              <View style={styles.statRow}>
                <Text>Réponses correctes :</Text>
                <Text style={styles.statValue}>{data.correct || 0} / {data.total || 0}</Text>
              </View>
              <View style={styles.statRow}>
                <Text>Dernière tentative :</Text>
                <Text style={styles.statValue}>
                  {new Date(data.lastAttempt || 0).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  chapterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  chapterCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chapterTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  backButton: {
    backgroundColor: '#5a90f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
