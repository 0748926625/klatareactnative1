import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'GAME_USERS';

export default function UserSelectScreen({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  // Charger les utilisateurs au démarrage
  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const savedUsers = await AsyncStorage.getItem(USERS_KEY);
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) {
      setError('Veuillez entrer un nom.');
      return;
    }
    if (users.includes(name)) {
      setError('Ce nom existe déjà.');
      return;
    }
    if (users.length >= 3) {
      Alert.alert(
        "Limite atteinte",
        "Le nombre maximum de joueurs (3) a été atteint.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const newUsers = [...users, name];
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
      setUsers(newUsers);
      setNewName('');
      setError('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un utilisateur:', error);
      setError('Erreur lors de l\'enregistrement.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Qui utilise l'application ?</Text>
      <Text style={styles.subtitle}>{users.length}/3 joueurs</Text>
      
      <FlatList
        data={users}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userButton} 
            onPress={() => onSelectUser(item)}
          >
            <Text style={styles.userButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      
      {users.length < 3 && (
        <View style={styles.addContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ajouter un joueur"
            value={newName}
            onChangeText={setNewName}
            autoCapitalize="words"
            maxLength={20}
          />
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Text style={styles.note}>
        Note : Maximum 3 joueurs autorisés.{'\n'}
        Les profils sont permanents pour un meilleur suivi.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  list: {
    width: '100%',
    maxHeight: '50%',
  },
  listContent: {
    alignItems: 'center',
  },
  userButton: {
    backgroundColor: '#5a90f0',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
    elevation: 2,
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
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    width: 180,
    height: 44,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#43a047',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  error: {
    color: '#d32f2f',
    marginTop: 12,
    fontWeight: 'bold',
  },
  note: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
    lineHeight: 20,
  },
}); 