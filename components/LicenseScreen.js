import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getDeviceFingerprint, validateLicense, saveLicenseKey } from '../utils/licensing';

const LicenseScreen = ({ onLicenseValidated }) => {
  const [fingerprint, setFingerprint] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await getDeviceFingerprint();
      setFingerprint(fp);
      setLoading(false);
    };
    loadFingerprint();
  }, []);

  const handleValidate = async () => {
    setLoading(true);
    setMessage('');
    const isValid = await validateLicense(licenseKey);
    if (isValid) {
      await saveLicenseKey(licenseKey);
      setMessage('Licence validée avec succès !');
      setTimeout(() => onLicenseValidated(), 1500);
    } else {
      setMessage('Clé de licence invalide. Veuillez réessayer.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.messageText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activation de la Licence</Text>
      <Text style={styles.description}>Votre période d'essai est terminée ou aucune licence valide n'a été trouvée.</Text>
      <Text style={styles.description}>Pour continuer à utiliser l'application, veuillez fournir le code ci-dessous à votre fournisseur pour obtenir une clé de licence :</Text>
      
      <View style={styles.fingerprintContainer}>
        <Text style={styles.fingerprintLabel}>Code de votre appareil :</Text>
        <Text style={styles.fingerprintText}>{fingerprint}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Entrez votre clé de licence ici"
        value={licenseKey}
        onChangeText={setLicenseKey}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleValidate}>
        <Text style={styles.buttonText}>Valider la Licence</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.messageText}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  fingerprintContainer: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
  },
  fingerprintLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  fingerprintText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LicenseScreen;
