import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function UserNameScreen({ onNameSet }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleValidate = () => {
    if (!name.trim()) {
      setError('Veuillez entrer votre nom.');
      return;
    }
    setError('');
    onNameSet(name.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue !</Text>
      <Text style={styles.subtitle}>Entrez votre nom pour commencer :</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre nom"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleValidate}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    width: 240,
    height: 44,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#5a90f0',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontWeight: 'bold',
  },
}); 