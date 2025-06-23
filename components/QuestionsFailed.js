import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
//import MathRenderer from './MathRenderer'; // Assurez-vous d'avoir ce composant pour le rendu des formules mathématiques

export default function QuestionsFailed({ questions }) {
  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Aucune question échouée pour le moment.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {questions.map((item, index) => (
        <View key={index} style={styles.questionCard}>
          <View style={styles.questionSection}>
            <Text style={styles.questionLabel}>Question échouée {index + 1}:</Text>
            <View style={styles.contentBox}>
              <MathRenderer math={item.question} style={styles.questionText} />
              <Text style={styles.attemptsText}>Échouée {item.count} fois</Text>
            </View>
          </View>

          <View style={styles.answerSection}>
            <Text style={styles.answerLabel}>Bonne réponse :</Text>
            <View style={styles.contentBox}>
              <MathRenderer math={item.correct} style={styles.answerText} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  questionSection: {
    marginBottom: 15,
  },
  answerSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  contentBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  questionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  answerText: {
    fontSize: 15,
    color: '#2E7D32',
  },
  attemptsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});