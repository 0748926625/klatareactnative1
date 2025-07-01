import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

const TRIAL_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const LICENSE_KEY = 'app_license_key';
const TRIAL_START_DATE_KEY = 'trial_start_date';

// Function to generate a unique device fingerprint
export async function getDeviceFingerprint() {
  let fingerprint = '';

  // 1️⃣ Try to get a unique identifier that is available on the current SDK/platform
  const resolveInstallationId = async () => {
    // Newer SDKs (> 49) removed getInstallationIdAsync. Handle accordingly.
    try {
      if (typeof Application.getInstallationIdAsync === 'function') {
        // Older SDKs (< 49)
        return await Application.getInstallationIdAsync();
      }

      // Android specific id (synchronous)
      if (Platform.OS === 'android' && typeof Application.getAndroidId === 'function') {
        return Application.getAndroidId();
      }

      // iOS specific id (async)
      if (Platform.OS === 'ios' && typeof Application.getIosIdForVendorAsync === 'function') {
        return await Application.getIosIdForVendorAsync();
      }
    } catch (e) {
      console.warn('Unable to obtain installation/device id using Application API:', e);
    }

    // 2️⃣ Generate and persist our own id as a final fallback
    const FALLBACK_KEY = 'generated_installation_id';
    let storedId = await SecureStore.getItemAsync(FALLBACK_KEY);
    if (!storedId) {
      storedId = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Date.now()}-${Math.random()}`
      );
      await SecureStore.setItemAsync(FALLBACK_KEY, storedId);
    }
    return storedId;
  };

  try {
    const installationId = await resolveInstallationId();
    const deviceName = Device.deviceName || 'unknown_device';
    const osName = Device.osName || 'unknown_os';
    const osVersion = Device.osVersion || 'unknown_os_version';
    const manufacturer = Device.manufacturer || 'unknown_manufacturer';

    // Combine multiple identifiers for a more unique fingerprint
    const rawFingerprint = `${installationId}-${deviceName}-${osName}-${osVersion}-${manufacturer}`;

    // Hash the raw fingerprint to make it more compact and consistent
    fingerprint = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawFingerprint
    );
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    // As a last resort, just return a stored/generated installation id
    fingerprint = await resolveInstallationId();
  }

  return fingerprint;
}

// Function to generate a license key based on the fingerprint (for your use)
// This is a placeholder. You would implement your actual secret transformation here.
export async function generateLicenseKey(fingerprint) {
  // IMPORTANT: This is a very basic example. For real applications,
  // you'd use a more robust cryptographic method, possibly involving a server-side component.
  // The key should be derived from the fingerprint in a way that's hard to reverse engineer
  // and unique to the fingerprint.
  const secretSalt = "YOUR_SUPER_SECRET_SALT_HERE"; // CHANGE THIS TO A REAL, COMPLEX SECRET
  const combinedString = `${fingerprint}-${secretSalt}`;
  const licenseKey = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    combinedString
  );
  return licenseKey;
}

// Function to check trial status
export async function checkTrialStatus() {
  let trialStartDate = await SecureStore.getItemAsync(TRIAL_START_DATE_KEY);

  if (!trialStartDate) {
    trialStartDate = Date.now().toString();
    await SecureStore.setItemAsync(TRIAL_START_DATE_KEY, trialStartDate);
    return { trialActive: true, timeLeft: TRIAL_DURATION_MS };
  }

  const elapsed = Date.now() - parseInt(trialStartDate, 10);
  const timeLeft = TRIAL_DURATION_MS - elapsed;

  if (timeLeft <= 0) {
    return { trialActive: false, timeLeft: 0 };
  } else {
    return { trialActive: true, timeLeft: timeLeft };
  }
}

// Function to save the license key
export async function saveLicenseKey(key) {
  await SecureStore.setItemAsync(LICENSE_KEY, key);
}

// Function to get the saved license key
export async function getSavedLicenseKey() {
  return await SecureStore.getItemAsync(LICENSE_KEY);
}

// Function to validate the entered license key
export async function validateLicense(enteredKey) {
  const fingerprint = await getDeviceFingerprint();
  const expectedKey = await generateLicenseKey(fingerprint); // Generate the key as you would for the user

  return enteredKey === expectedKey;
}
