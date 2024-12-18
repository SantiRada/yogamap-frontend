import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TextInput, Text, Pressable, Image } from 'react-native';

import AntDesign from '@expo/vector-icons/AntDesign';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TitleRegister } from './TitleRegister';

export function Register({route}) {
  const { type } = route.params;

  const [mail, setMail] = useState('');
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [twoPass, setTwoPass] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.100.2/API_Yogamap/public/insert/register.php', {
        mail,
        name,
        pass,
        twoPass,
        type,
      }, { headers: { 'Content-Type': 'application/json', } });

      if (response.data.success) {
          setMail('');
          setName('');
          setPass('');
          setTwoPass('');
          setRegisterStatus('');

          if(response.data.prof) { await AsyncStorage.setItem('profData', JSON.stringify(response.data.prof)); }
          
          await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));

          if(type == "prof") { navigation.navigate('RegisterProf', { id: response.data.prof.id }); }
          else { navigation.navigate('TabGroup'); }
      } else { setRegisterStatus(response.data.message); }
    } catch (error) { console.error(error); }
  };

  return (
    <View style={styles.container}>
      <TitleRegister texting="Tipo de Cuenta" link="Start" />
      {
        registerStatus != '' && 
          <View style={{padding: 16, width: '100%', borderRadius: 16, marginBottom: 16, marginTop: -16, justifyContent: 'center', backgroundColor: '#ffffff10', alignItems: 'center'}}>
            <Text style={{color: '#fff', fontSize: 16, textAlign: 'center', }}>{registerStatus}</Text>
          </View>
      }
      <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ffffff50"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
      />
      <TextInput
          style={styles.input}
          placeholder="Nombre de Usuario"
          placeholderTextColor="#ffffff50"
          value={name}
          onChangeText={setName}
          keyboardType="name"
      />
      <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ffffff50"
          value={pass}
          onChangeText={setPass}
          secureTextEntry
      />
      <TextInput
          style={styles.input}
          placeholder="Repetir Contraseña"
          placeholderTextColor="#ffffff50"
          value={twoPass}
          onChangeText={setTwoPass}
          secureTextEntry
      />
      <Pressable style={styles.btn} onPress={handleRegister}>
        <Text style={[styles.textBtn, styles.weight ]}>Registrarse</Text>
      </Pressable>
      <Pressable style={styles.btnBase}>
        <Text style={styles.textBtn}>Registrarse con </Text>
        <AntDesign name="google" size={24} color="#fff" />
      </Pressable>
      <Pressable style={styles.btnBase} onPress={ () => { navigation.navigate('Login', {type:type}) } }>
        <Text style={styles.textBtn}>¿Ya tienes cuenta? <Text style={styles.weight}>Iniciar Sesión</Text></Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1A122E',
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
      color: '#fff',
      marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    opacity: 0.5,
    textAlign: 'center',
    marginHorizontal: 44,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#3C2C61',
    width: '100%',
    padding: 12,
    color: '#fff',
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
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  weight: { fontWeight: 'bold', }
});