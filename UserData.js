import AsyncStorage from '@react-native-async-storage/async-storage';

let userID = null;
let userName = null;
export const setUserID = (id) => { userID = id; };
export const setUserName = (name) => { userName = name; };

export const userData = async () => {
  try {
    const userDataString = await AsyncStorage.getItem('userData');

    if (userDataString !== null) {
      const userData = JSON.parse(userDataString);
      setUserID(userData.id);
      setUserName(userData.name);

      return userData;
    } else { return null; }
  } catch (error) {
    console.error("Error al recuperar los datos de AsyncStorage:", error);
    return null;
  }
}

export const getUserID = () => { return userID; };
export const getUserName = () => { return userName; };