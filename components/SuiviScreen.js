import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MathRenderer from '../MathRenderer'; // Assurez-vous que le chemin est correct !

// Graphique simple en barres horizontales (SVG non requis)
function SimpleBarChart({ data, maxValue }) {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>Aucune donnée pour afficher le graphique.</Text>;
  }
  return (
    <View style={{ marginTop: 16, width: '100%' }}>
      {data.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ width: 40, fontWeight: 'bold', color: '#1976d2' }}>{`Sess. ${item.label}`}</Text>
          <View style={{ flex: 1, height: 18, backgroundColor: '#e3e3e3', borderRadius: 8, marginHorizontal: 8 }}>
            <View style={{ width: `${(item.value / maxValue) * 100}%`, height: '100%', backgroundColor: '#1976d2', borderRadius: 8 }} />
          </View>
          <Text style={{ width: 40, textAlign: 'right', color: '#333' }}>{item.value.toFixed(1)}</Text>
        </View>
      ))}
    </View>
  );
}

export default function SuiviScreen({ stats, onBack }) {
  const [section, setSection] = useState(0);

  // NOUVEAU : État pour le chapitre sélectionné
  const [selectedChapitre, setSelectedChapitre] = useState('Tous les chapitres');

  if (!stats || !stats.scores) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement ou aucune statistique disponible...</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // NOUVEAU : On génère la liste des chapitres uniques à partir des données
  const chapitresSet = new Set([
    ...stats.scores.map(s => s.chapitre).filter(Boolean),
    ...stats.erreurs.map(e => e.chapitre).filter(Boolean)
  ]);
  const chapitresDisponibles = ['Tous les chapitres', ...Array.from(chapitresSet)];

  const sections = ['Statistiques Générales', 'Évolution des Notes', 'Questions Échouées'];

  // NOUVEAU : Filtrage des données basé sur le chapitre sélectionné
  const scoresFiltres = selectedChapitre === 'Tous les chapitres'
    ? stats.scores
    : stats.scores.filter(s => s.chapitre === selectedChapitre);
  const erreursFiltres = selectedChapitre === 'Tous les chapitres'
    ? stats.erreurs
    : stats.erreurs.filter(e => e.chapitre === selectedChapitre);

  // Calculs basés sur les données FILTRÉES
  const totalQuestions = scoresFiltres.reduce((sum, s) => sum + (s.nbQuestions || 0), 0);
  const totalSessions = scoresFiltres.length;
  const totalScore = scoresFiltres.reduce((sum, s) => sum + (s.score || 0), 0);
  const bestScore = Math.max(...scoresFiltres.map(s => s.noteSur20 || 0), 0).toFixed(1);
  const moyenne = totalSessions > 0 ? (scoresFiltres.reduce((sum, s) => sum + (s.noteSur20 || 0), 0) / totalSessions).toFixed(1) : 0;
  const tauxReussite = totalQuestions > 0 ? Math.round((totalScore / (totalQuestions * 10)) * 100) : 0;
  const tempsTotal = scoresFiltres.reduce((sum, s) => sum + (s.temps || 0), 0);
  const evolutionData = scoresFiltres.map((s, i) => ({ label: `${i + 1}`, value: s.noteSur20 || 0 }));

  // Fréquence des questions échouées (basé sur les erreurs filtrées)
  const freq = {};
  erreursFiltres.forEach(e => {
    freq[e.question] = (freq[e.question] || 0) + 1;
  });
  const freqArr = Object.entries(freq).map(([q, n]) => ({ question: q, count: n })).sort((a, b) => b.count - a.count);

  return (
    <View style={styles.container}>
      {/* NOUVEAU : Liste déroulante pour sélectionner le chapitre */}
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

      <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}>
        {section === 0 && (
          <View style={styles.sectionBox}>
            <Text style={styles.statText}>Sessions jouées : <Text style={styles.statValue}>{totalSessions}</Text></Text>
            <Text style={styles.statText}>Questions répondues : <Text style={styles.statValue}>{totalQuestions}</Text></Text>
            <Text style={styles.statText}>Taux de réussite : <Text style={styles.statValue}>{tauxReussite}%</Text></Text>
            <Text style={styles.statText}>Note moyenne : <Text style={styles.statValue}>{moyenne} / 20</Text></Text>
            <Text style={styles.statText}>Meilleure note : <Text style={styles.statValue}>{bestScore} / 20</Text></Text>
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
            <Text style={styles.statText}>Fréquence des questions échouées</Text>
            {freqArr.length === 0 ? (
              <Text style={styles.noDataText}>🎉 Aucune erreur enregistrée pour ce chapitre !</Text>
            ) : (
              freqArr.map((item, i) => (
                <View key={i} style={styles.errorRow}>
                  <View style={{flex: 1, marginRight: 8}}>
                    <MathRenderer math={item.question} fontSize={12} color="#c62828" />
                  </View>
                  <Text style={styles.errorCount}>{item.count} fois</Text>
                </View>
              ))
            )}
            {/* Vous pouvez ajouter les boutons de remédiation ici plus tard */}
          </View>
        )}
      </ScrollView>

      {/* Barre de navigation en bas */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginLeft: 'auto'}}>
          {section > 0 && (
            <TouchableOpacity style={styles.navButton} onPress={() => setSection(s => s - 1)}>
              <Text style={styles.navButtonText}>← Précédent</Text>
            </TouchableOpacity>
          )}
          {section < 2 && (
            <TouchableOpacity style={styles.navButton} onPress={() => setSection(s => s + 1)}>
              <Text style={styles.navButtonText}>Suivant →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
    alignItems: 'center',
    padding: 10,
    paddingTop: 20,
  },
  dropdownRow: {
    width: '95%',
    marginBottom: 15,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
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
  },
  noDataText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  errorCount: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  navButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 2,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#757575',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});