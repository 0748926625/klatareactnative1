import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Si tu as un composant MathRenderer, décommente la ligne ci-dessous
// import MathRenderer from './MathRenderer';

export default function QuestionsFailed({ questions }) {
  if (!questions || questions.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Aucune question échouée pour le moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {questions.map((item, index) => (
        <View key={index} style={styles.row}>
          {/* <MathRenderer math={item.question} style={styles.question} /> */}
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.correct}</Text>
          <Text style={styles.count}>{item.count} fois</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { width: '100%', marginTop: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#fafafa',
  },
  question: { flex: 2, fontSize: 16, color: '#b71c1c' },
  answer: { flex: 2, fontSize: 16, color: '#388e3c' },
  count: { flex: 1, fontSize: 15, color: '#888', textAlign: 'center' },
  noDataContainer: { padding: 20 },
  noDataText: { fontStyle: 'italic', color: '#888', textAlign: 'center' },
});