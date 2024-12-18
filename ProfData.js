import AsyncStorage from '@react-native-async-storage/async-storage';

let profID = null;
let typeAccount = null;
export const setProfID = (id) => { profID = id; };
export const setTypeAccount = (type) => { typeAccount = type; };

export const profData = async () => {
  try {
    const profDataString = await AsyncStorage.getItem('profData');

    if (profDataString !== null) {
      const profData = JSON.parse(profDataString);

      setTypeAccount(profData.typeaccount);
      setProfID(profData.id);
      
      return profData;
    } else { return null; }
  } catch (error) {
    console.error("Error al recuperar los datos de AsyncStorage:", error);
    return null;
  }
}

export const getProfID = () => { return profID; };
export const getTypeAccount = () => { return typeAccount; };