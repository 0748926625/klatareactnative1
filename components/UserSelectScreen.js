import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';

export default function UserSelectScreen({ users, onSelectUser, onAddUser }) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) {
      setError('Veuillez entrer un nom.');
      return;
    }
    if (users.includes(name)) {
      setError('Ce nom existe déjà.');
      return;
    }
    setError('');
    onAddUser(name);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qui utilise l'application ?</Text>
      <FlatList
        data={users}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userButton} onPress={() => onSelectUser(item)}>
            <Text style={styles.userButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={{ width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      />
      {users.length < 3 && (
        <View style={styles.addContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ajouter un nom"
            value={newName}
            onChangeText={setNewName}
            autoCapitalize="words"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  userButton: {
    backgroundColor: '#5a90f0',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 180,
    alignItems: 'center',
  },
  userButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  input: {
    width: 140,
    height: 44,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#43a047',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginTop: 12,
    fontWeight: 'bold',
  },
}); 