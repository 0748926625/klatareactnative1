import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import QuestionsFailed from './QuestionsFailed';

export default function SuiviScreen({ stats, onBack }) {
  const [selectedChapitre, setSelectedChapitre] = useState('Tous les chapitres');
  const [section, setSection] = useState(0);

  // Récupération des chapitres disponibles
  const chapitresSet = new Set(stats.scores.map(s => s.chapitre).filter(Boolean));
  const chapitresDisponibles = ['Tous les chapitres', ...Array.from(chapitresSet)];

  // Filtrage des données basé sur le chapitre sélectionné
  const scoresFiltres = selectedChapitre === 'Tous les chapitres'
    ? stats.scores
    : stats.scores.filter(s => s.chapitre === selectedChapitre);

  const erreursFiltres = selectedChapitre === 'Tous les chapitres'
    ? stats.erreurs
    : stats.erreurs.filter(e => e.chapitre === selectedChapitre);

  // Calculs statistiques
  const totalQuestions = scoresFiltres.reduce((sum, s) => sum + (s.nbQuestions || 0), 0);
  const totalSessions = scoresFiltres.length;
  const totalScore = scoresFiltres.reduce((sum, s) => sum + (s.score || 0), 0);
  const bestScore = Math.max(...scoresFiltres.map(s => s.noteSur20 || 0), 0).toFixed(1);
  const moyenne = totalSessions > 0 
    ? (scoresFiltres.reduce((sum, s) => sum + (s.noteSur20 || 0), 0) / totalSessions).toFixed(1) 
    : 0;
  const tauxReussite = totalQuestions > 0 
    ? Math.round((totalScore / (totalQuestions * 10)) * 100) 
    : 0;

  // Préparation des données pour le graphique d'évolution
  const evolutionData = scoresFiltres.map((s, i) => ({ 
    label: `${i + 1}`, 
    value: s.noteSur20 || 0 
  }));

  // Préparation des questions échouées avec leurs fréquences
  const freq = {};
  erreursFiltres.forEach(e => {
    if (!freq[e.question]) {
      freq[e.question] = {
        question: e.question,
        correct: e.correct,
        count: 1
      };
    } else {
      freq[e.question].count++;
    }
  });
  
  const freqArr = Object.values(freq).sort((a, b) => b.count - a.count);

  const sections = ['Statistiques Générales', 'Évolution des Notes', 'Questions Échouées'];

  return (
    <View style={styles.container}>
      <View style={styles.dropdownRow}>
        <Text style={styles.dropdownLabel}>Afficher les stats pour :</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedChapitre}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedChapitre(itemValue)}
          >
            {chapitresDisponibles.map((c, i) => (
              <Picker.Item key={i} label={c} value={c} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.title}>{sections[section]}</Text>

      <ScrollView 
        style={{ flex: 1, width: '100%' }} 
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}
      >
        {section === 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.statText}>
              Sessions jouées : <Text style={styles.statValue}>{totalSessions}</Text>
            </Text>
            <Text style={styles.statText}>
              Questions répondues : <Text style={styles.statValue}>{totalQuestions}</Text>
            </Text>
            <Text style={styles.statText}>
              Taux de réussite : <Text style={styles.statValue}>{tauxReussite}%</Text>
            </Text>
            <Text style={styles.statText}>
              Note moyenne : <Text style={styles.statValue}>{moyenne} / 20</Text>
            </Text>
            <Text style={styles.statText}>
              Meilleure note : <Text style={styles.statValue}>{bestScore} / 20</Text>
            </Text>
          </View>
        )}

        {section === 1 && (
          <View style={styles.sectionBox}>
            <Text style={styles.statText}>Évolution des notes sur 20 (par session)</Text>
            <SimpleBarChart data={evolutionData} maxValue={20} />
          </View>
        )}

        {section === 2 && (
          <View style={styles.sectionBox}>
            <Text style={styles.statText}>Questions échouées et leurs corrections</Text>
            <QuestionsFailed questions={freqArr} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 16,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  dropdownLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
    paddingBottom: 5,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    width: '95%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 200,
  },
  statText: {
    fontSize: 17,
    marginBottom: 10,
    color: '#333',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#005a9c',
  }
});