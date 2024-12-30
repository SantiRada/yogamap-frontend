import { View, StyleSheet, Text, Pressable, Alert, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useColors from '../Colors';

export function Configuration(){

    const navigation = useNavigation();

    const closeSession = async () => {
        try {
          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('profData');
      
          navigation.navigate('Start');
      
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          setLoginStatus('Error al cerrar sesión. Intenta de nuevo más tarde.');
        }

        return undefined;
    };

    const askLogOut = () => {
        Alert.alert(
            "Confirmación Necesaria",
            "¿Estás segura o seguro de que quieres cerrar sesión?",
            [
                {
                    text: "Cancelar",
                },
                {
                    text: "Confirmar",
                    onPress: () => { closeSession() },
                }
            ]
        );
    }

    const copyToClipboard = () => {
        Clipboard.setStringAsync("http://yogamap.com.ar");
        ToastAndroid.show('¡Link de Invitación, copiado!', ToastAndroid.SHORT);
      }

    const Colors = useColors();
    const styles = DynamicStyles(Colors);


    return (
        <View style={styles.container}>
            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Cuenta'); } }>
                <MaterialIcons name="person" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Cuenta</Text>
                    <Text style={ styles.subtitle }>Información de tu cuenta y preferencias</Text>
                </View>
            </Pressable>

            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('NotificacionesConfig'); } }>
                <MaterialIcons name="notifications" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Notificaciones</Text>
                    <Text style={ styles.subtitle }>Tonos de mensajes, comunidades y alertas</Text>
                </View>
            </Pressable>

            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Ayuda'); } }>
                <MaterialIcons name="help" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Ayuda</Text>
                    <Text style={ styles.subtitle }>Centro de ayuda y contacto</Text>
                </View>
            </Pressable>

            <Pressable style={ styles.option } onPress={ () => copyToClipboard() }>
                <MaterialIcons name="people" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Invitar amigos</Text>
                    <Text style={ styles.subtitle }>Copiar link de invitación</Text>
                </View>
            </Pressable>

            <Pressable style={ styles.option } onPress={ askLogOut }>
                <MaterialIcons name="waving-hand" size={24} style={[ styles.icon, styles.red ]} />
                <View style={ styles.textContent }>
                    <Text style={[ styles.title, styles.red ]}>Cerrar Sesión</Text>
                </View>
            </Pressable>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        paddingTop: 0,
        height: '100%',
        backgroundColor: Colors.background,
    },
    iconLeft: {
        color: Colors.headerIcons,
        marginRight: 8,
    },
    icon: {
        color: Colors.headerIcons,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: 65,
        borderBottomColor: Colors.placeholder,
        borderBottomWidth: 1,
    },
    title: {
        color: Colors.text,
        fontSize: 14,
    },
    subtitle: {
        color: Colors.text,
        opacity: 0.4,
        fontSize: 12,
    },
    red: { color: 'red', }
});