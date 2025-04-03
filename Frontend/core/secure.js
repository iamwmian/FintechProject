import { Platform } from 'react-native'; 
import * as SecureStore from 'expo-secure-store'; 

// data structure to hold the keys
let secureStoreKeys = [];

const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

async function set(key, value) {
  try {
    if (!secureStoreKeys.includes(key)) {
      secureStoreKeys.push(key);
    }

    if (isMobile) {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.log("Error setting value:", error);
  }
}

async function get(key) {
  try {
    if (isMobile) {
      const data = await SecureStore.getItemAsync(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } else {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    }
  } catch (error) {
    console.log("Error getting value:", error);
  }
}

async function remove(key) {
  try {
    secureStoreKeys = secureStoreKeys.filter((storedKey) => storedKey !== key);

    if (isMobile) {
      await SecureStore.deleteItemAsync(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.log("Error removing value:", error);
  }
}

async function wipe() {
  try {
    if (isMobile) {
      for (const key of secureStoreKeys) {
        await SecureStore.deleteItemAsync(key);
        console.log(`Deleted key: ${key}`);
      }
      console.log("SecureStore wiped");
    } else {
      for (const key of secureStoreKeys) {
        localStorage.removeItem(key);
        console.log(`Deleted key: ${key}`);
      }
      console.log("localStorage wiped");
    }

    secureStoreKeys = [];
  } catch (error) {
    console.log("Error wiping storage:", error);
  }
}

export default { set, get, remove, wipe };
