import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TextInput, Text, Pressable, TouchableOpacity } from 'react-native';
import useColors from '../../Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TitleRegister } from './TitleRegister';

export function Login({route}) {
  const {type} = route.params;

  const  navigation = useNavigation();
  const [loginStatus, setLoginStatus] = useState('');

  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://yogamap.com.ar/public/select/login.php', {
        mail,
        pass,
        type,
      }, { headers: { 'Content-Type': 'application/json' } });
  
      if (response.data.success) {
        if(response.data.prof) { await AsyncStorage.setItem('profData', JSON.stringify(response.data.prof)); }

        const dataUser = JSON.stringify(response.data.user);
        await AsyncStorage.setItem('userData', dataUser);

        setLoginStatus('');
        setMail('');
        setPass('');

        navigation.navigate('TabGroup');

      } else { setLoginStatus('Los datos ingresados no corresponden a ningún usuario o son incorrectos.'); 
        console.log(response.data)
      }
    } catch (error) { 
      setLoginStatus('Falló la conexión al servidor, intentalo de nuevo más tarde');
      console.error(error)
    }
  };

  const Colors = useColors();
  const styles = DynamicStyles(Colors);

  return (
    <View style={styles.container}>
      <TitleRegister texting="Tipo de Cuenta" link="Start" />
      <TextInput
        style={[styles.input, loginStatus && { borderWidth: 1, borderColor: 'red', } ]}
          placeholder="Correo electrónico"
          placeholderTextColor={Colors.placeholder}
          value={mail}
          onChangeText={setMail}
      />
      <TextInput
        style={[styles.input, loginStatus ? { borderWidth: 1, borderColor: 'red', marginBottom: 28 } : {marginBottom: 40 } ]}
          placeholder="Contraseña"
          placeholderTextColor={Colors.placeholder}
          value={pass}
          onChangeText={setPass}
          secureTextEntry
      />
      {
        loginStatus != '' && 
          <View style={{padding: 16, width: '100%', borderRadius: 16, marginBottom: 16, marginTop: -16, justifyContent: 'center', backgroundColor: '#ffffff10', alignItems: 'center'}}>
            <Text style={{color: Colors.text, fontSize: 16, textAlign: 'center', }}>{loginStatus}</Text>
          </View>
      }
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={[styles.textBtn, styles.weight ]}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnBase}>
        <Text style={[styles.textBtn, {color:Colors.text}]}>Iniciar Sesión con </Text>
        <AntDesign name="google" size={24} color={Colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnBase} onPress={ () => { navigation.navigate('Register', { type:type }) } }>
        <Text style={[styles.textBtn, {color:Colors.text}]}>¿No tienes cuenta? <Text style={styles.weight}>Registrarse</Text></Text>
      </TouchableOpacity>
    </View>
  );
};


const DynamicStyles = (Colors) => StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.background,
    paddingHorizontal: '4%',
  },
  logo: {
    alignSelf: 'center',
    width: 75,
    height: 75,
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
  input: {
    backgroundColor: Colors.inputBG,
    width: '100%',
    padding: 12,
    color: Colors.text,
    borderRadius: 8,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#8C5BFF',
    height: 50,
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBase: {
    height: 50,
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
    color: "white",
    textAlign: 'center',
    fontSize: 16,
  },
  weight: { fontWeight: 'bold', }
});
  