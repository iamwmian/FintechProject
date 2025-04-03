import * as SecureStore from "expo-secure-store";

async function set(key, object) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(object));
  } catch (error) {
    console.log("secure.set:", error);
  }
}

async function get(key) {
  try {

    const data = await SecureStore.getItemAsync(key);
    if (data !== null) {
      return JSON.parse(data); 
    }
    return null; 
  } catch (error) {
    console.log("secure.get:", error);
  }
}

async function remove(key) {
  try {
    // Remove the item from SecureStore
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("secure.remove:", error);
  }
}

async function wipe() {
  try {
    for (const key of secureStoreKeys) {
      await SecureStore.deleteItemAsync(key);
      console.log(`Deleted key: ${key}`);
    }

    console.log("All secure storage data wiped.");
  } catch (error) {
    console.log("secure.wipe:", error);
  }
}

export default { set, get, remove, wipe };
