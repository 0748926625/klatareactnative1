import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { getUserData } from '../utils/userStats'; // Nous allons devoir déplacer cette fonction

const SCREEN_WIDTH = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#00008B',
  backgroundGradientTo: '#00008B',
  decimalPlaces: 1, 
  color: (opacity = 1) => `rgba(0, 82, 151, ${opacity})`, // Une couleur de ligne par défaut
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#005a9c',
  },
};

const ProfileScreen = ({ userName, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getUserData(userName);
      setUserData(data);
      if (data?.history?.length > 0) {
        const chapters = [...new Set(data.history.map(item => item.chapter))];
        setSelectedChapter(chapters[0]);
      }
      setLoading(false);
    };
    loadData();
  }, [userName]);

  if (loading) {
    return <View style={styles.profileContainer}><ActivityIndicator size="large" color="#005a9c" /></View>;
  }

  if (!userData || !userData.history || userData.history.length === 0) {
    return (
      <View style={styles.profileContainer}>
        <Text style={styles.profileTitle}>Profil de {userName}</Text>
        <Text style={styles.messageText}>Aucune partie enregistrée pour le moment.</Text>
        <TouchableOpacity style={styles.profileButton} onPress={onBack}><Text style={styles.profileButtonText}>Retour</Text></TouchableOpacity>
      </View>
    );
  }

  const chapters = [...new Set(userData.history.map(item => item.chapter))];
  
  const filteredHistory = userData.history
    .filter(item => item.chapter === selectedChapter)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = {
    labels: filteredHistory.map(item => new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })),
    datasets: [{
      data: filteredHistory.map(item => item.grade || 0),
    }]
  };
  
  const chartSegments = [];
  if (chartData.datasets[0].data.length > 1) {
    for (let i = 0; i < chartData.datasets[0].data.length -1; i++) {
        chartSegments.push({
            startIndex: i,
            endIndex: i + 1,
            color: chartData.datasets[0].data[i+1] < 10 ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 128, 0, 0.7)'
        })
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.profileContainer}>
      <Text style={styles.profileTitle}>Profil de {userName}</Text>
      <Text style={styles.pickerLabel}>Choisissez un chapitre pour voir vos progrès :</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedChapter}
          onValueChange={(itemValue) => setSelectedChapter(itemValue)}
          style={styles.picker}
        >
          {chapters.map(chap => <Picker.Item key={chap} label={chap} value={chap} />)}
        </Picker>
      </View>

      {filteredHistory.length > 0 ? (
        <LineChart
          data={chartData}
          width={SCREEN_WIDTH - 40}
          height={250}
          yAxisLabel=""
          yAxisSuffix="/20"
          yAxisInterval={1}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          segments={chartSegments}
          getDotColor={(dataPoint) => dataPoint < 10 ? 'red' : 'green'}
          fromZero={true}
        />
      ) : (
        <Text style={styles.messageText}>Aucune donnée pour ce chapitre.</Text>
      )}

      <TouchableOpacity style={styles.profileButton} onPress={onBack}>
        <Text style={styles.profileButtonText}>Retour au menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005a9c',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#37474f',
    alignSelf: 'flex-start',
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  profileButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  }
});

export default ProfileScreen; 