import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
// Si tu veux du LaTeX, décommente la ligne suivante et installe react-native-math-view
// import MathView from 'react-native-math-view';

export default function QuestionCard({ questionData, onAnswer }) {
  if (!questionData) return null;
  const { question, correct, wrongs, imgPath } = questionData;
  // Mélange les réponses à chaque affichage
  const allAnswers = React.useMemo(() => [correct, ...wrongs].sort(() => Math.random() - 0.5), [questionData]);

  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12, margin: 10, elevation: 3 }}>
      {/* Affichage de la question */}
      {/* <MathView math={question} /> */}
      <Text style={{ fontSize: 20, marginBottom: 10 }}>{question}</Text>
      {imgPath && (
        <Image source={require(`./${imgPath}`)} style={{ width: 120, height: 80, marginBottom: 10, resizeMode: 'contain' }} />
      )}
      {/* Affichage des réponses */}
      {allAnswers.map((ans, idx) => (
        <TouchableOpacity
          key={idx}
          style={{ backgroundColor: '#eee', padding: 12, borderRadius: 8, marginVertical: 4 }}
          onPress={() => onAnswer(ans)}
        >
          {/* <MathView math={ans} /> */}
          <Text style={{ fontSize: 18 }}>{ans}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
} 