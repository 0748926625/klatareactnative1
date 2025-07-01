import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'USERS_DATA';
const SESSION_KEY = 'CURRENT_USER';
const STATS_KEY = 'USERS_STATS';

export default function LoginScreen({ onAuthSuccess, navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Vérifie si déjà connecté
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const user = await AsyncStorage.getItem(SESSION_KEY);
      if (user) setCurrentUser(user);
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError('Veuillez entrer un nom et un mot de passe.');
      return;
    }
    
    try {
      let users = await AsyncStorage.getItem(STORAGE_KEY);
      users = users ? JSON.parse(users) : {};
      
      if (users[username]) {
        setError('Ce nom d\'utilisateur existe déjà.');
        return;
      }
      
      // Créer le nouvel utilisateur
      users[username] = { password };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      
      // Initialiser les statistiques pour le nouvel utilisateur
      const stats = await AsyncStorage.getItem(STATS_KEY);
      const statsData = stats ? JSON.parse(stats) : {};
      
      statsData[username] = {
        username,
        totalQuestions: 0,
        correctAnswers: 0,
        successRate: 0,
        chapters: {},
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(STATS_KEY, JSON.stringify(statsData));
      await AsyncStorage.setItem(SESSION_KEY, username);
      setCurrentUser(username);
      setError('');
      if (onAuthSuccess) onAuthSuccess(username);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError('Une erreur est survenue lors de l\'inscription.');
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Veuillez entrer un nom et un mot de passe.');
      return;
    }
    
    try {
      const users = await AsyncStorage.getItem(STORAGE_KEY);
      const usersData = users ? JSON.parse(users) : {};
      
      if (!usersData[username] || usersData[username].password !== password) {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
        return;
      }
      
      // Mettre à jour la dernière connexion dans les statistiques
      const stats = await AsyncStorage.getItem(STATS_KEY);
      if (stats) {
        const statsData = JSON.parse(stats);
        if (statsData[username]) {
          statsData[username].lastActive = new Date().toISOString();
          await AsyncStorage.setItem(STATS_KEY, JSON.stringify(statsData));
        }
      }
      
      await AsyncStorage.setItem(SESSION_KEY, username);
      setCurrentUser(username);
      setError('');
      if (onAuthSuccess) onAuthSuccess(username);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError('Une erreur est survenue lors de la connexion.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      setCurrentUser(null);
      setUsername('');
      setPassword('');
      setError('');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Affichage si connecté
  if (currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.connected}>Connecté en tant que {currentUser}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.statsButton]} 
            onPress={() => navigation.navigate('Stats')}
          >
            <Text style={styles.buttonText}>Voir mes statistiques</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu d'authentification</Text>
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
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.tip}>
        {mode === 'login'
          ? "Nouveau joueur ? Saisis un nom et un mot de passe puis clique sur S'inscrire."
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
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderColor: '#999',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    width: '100%',
    maxWidth: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  loginButton: {
    backgroundColor: '#5a90f0',
    marginRight: 8,
  },
  registerButton: {
    backgroundColor: '#6c5ce7',
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  tip: {
    color: '#555',
    marginTop: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  connected: {
    fontSize: 22,
    color: '#2c3e50',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  statsButton: {
    backgroundColor: '#2ecc71',
    marginBottom: 12,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    width: '100%',
  },
});
