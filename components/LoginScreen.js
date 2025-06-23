import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USERS_DATA';
const SESSION_KEY = 'CURRENT_USER';

export default function LoginScreen({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Vérifie si déjà connecté
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const user = await AsyncStorage.getItem(SESSION_KEY);
    if (user) setCurrentUser(user);
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Veuillez entrer un nom et un mot de passe.');
      return;
    }
    let users = await AsyncStorage.getItem(STORAGE_KEY);
    users = users ? JSON.parse(users) : {};
    if (users[username]) {
      setError('Ce nom d’utilisateur existe déjà.');
      return;
    }
    users[username] = { password, scores: [], erreurs: [] };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    setError('');
    if (onAuthSuccess) onAuthSuccess(username);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Veuillez entrer un nom et un mot de passe.');
      return;
    }
    let users = await AsyncStorage.getItem(STORAGE_KEY);
    users = users ? JSON.parse(users) : {};
    if (!users[username] || users[username].password !== password) {
      setError('Nom d’utilisateur ou mot de passe incorrect.');
      return;
    }
    await AsyncStorage.setItem(SESSION_KEY, username);
    setCurrentUser(username);
    setError('');
    if (onAuthSuccess) onAuthSuccess(username);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  // Affichage si connecté
  if (currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.connected}>Connecté en tant que {currentUser}</Text>
        <Button title="Déconnexion" onPress={handleLogout} />
        {/* Ici, tu peux mettre le bouton pour aller vers le choix de chapitre */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu d’authentification</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S’inscrire</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tip}>
        {mode === 'login'
          ? "Nouveau joueur ? Saisis un nom et un mot de passe puis clique sur S’inscrire."
          : "Déjà inscrit ? Utilise tes identifiants et clique sur Se connecter."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    width: 250,
    height: 44,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#5a90f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  tip: {
    color: '#555',
    marginTop: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  connected: {
    fontSize: 20,
    color: 'green',
    marginBottom: 18,
    fontWeight: 'bold',
  },
});