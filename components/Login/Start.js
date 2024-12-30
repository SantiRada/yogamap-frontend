import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useColors from '../../Colors';

export function Start() {

  const navigation = useNavigation();

  useEffect(() => {
    const checkUserData = async () => {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
            navigation.replace('TabGroup');
        }
    };

    checkUserData();
}, [navigation]);

const Colors = useColors();
const styles = DynamicStyles(Colors);

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://yogamap.com.ar/assets/logo.png" }} style={styles.logo} />
      <Text style={styles.title}>YOGAmap</Text>
      <Text style={styles.subtitle}>Encontrá profes, escuelas, eventos y reuniones del mundo del yoga</Text>
      <View style={styles.buttons}>
        <Pressable style={styles.btn} onPress={ () => { navigation.navigate('Login', { type: 'users' }) } }>
            <Text style={[styles.textBtn, {color:"white"}]}>Soy Practicante</Text>
        </Pressable>
        <Pressable style={styles.btnBase} onPress={ () => { navigation.navigate('Login', { type: 'prof' }) } }>
            <Text style={styles.textBtn}>Soy Profesor/Organizador</Text>
        </Pressable>
      </View>
    </View>
  );
};

const DynamicStyles = (Colors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '24%',
    width: '100%',
    backgroundColor: Colors.background,
    paddingHorizontal: '4%',
    maxWidth: '100vw',
    maxHeight: '100vh',
    overflow: 'hidden',
  },
  logo: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    marginTop:90
  },
  title: {
      width: '100%',
      fontSize: 36,
      fontWeight: 'bold',
      textAlign: 'center',
      color: Colors.text,
      marginBottom: 8,
  },
  subtitle: {
    color: Colors.text,
    opacity: 0.5,
    textAlign: 'center',
    marginHorizontal: 44,
    marginBottom: 32,
  },
  buttons: {
    width: '100%',
    position: 'absolute',
    bottom: 32,
    left: 0,
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#8C5BFF',
    height: 60,
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBase: {
    height: 60,
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    borderColor: '#8C5BFF',
    borderWidth: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBtn: {
    textAlign: 'center',
    fontSize: 16,
    color:Colors.text
  },
  weight: { fontWeight: 'bold', }
});
  