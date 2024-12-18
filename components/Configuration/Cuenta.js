import { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Alert, Modal } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { getUserID } from './../../UserData';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiAxios } from './../../AxiosAPI';


export function Cuenta(){
    const navigation = useNavigation();

    const [showModal, setShowModal] = useState(false);
    const id = getUserID();

    const removeAccount = async () => {
        try{
            const response = await apiAxios.post( "delete/remove.php", {
                type: 'users',
                id: id
            });

            if(response.data.success){
                Alert.alert(
                    "Tu cuenta ha sido eliminada",
                    "Nos entristece que te vayas, pero seguro volveremos a verte, ¡Namaste!",
                    [
                        {
                            text: "Continuar",
                            onPress: () => backToStart()
                        }
                    ],
                    { cancelable: false }
                );
            }else { console.log("Falló el intento de eliminación de cuenta...", response.data.message); }
        } catch(error){
            console.error("Falló la conexión al querer eliminar la cuenta...", error);
        }
    }

    const backToStart = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('profData');
        
            navigation.navigate('Start');
        
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setLoginStatus('Error al cerrar sesión. Intenta de nuevo más tarde.');
          }
  
          return undefined;
    }

    const closeModal = () => { setShowModal(false); }

    return(
            <View style={styles.container}>
                <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Editar Perfil Público', { type: 'name' }) } }>
                    <MaterialIcons name="person" size={24} style={ styles.icon } />
                    <View style={ styles.textContent }>
                        <Text style={ styles.title }>Cambiar nombre de usuario</Text>
                    </View>
                </Pressable>

                <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Editar Perfil Público', { type: 'mail' }) } }>
                    <MaterialIcons name="alternate-email" size={24} style={ styles.icon } />
                    <View style={ styles.textContent }>
                        <Text style={ styles.title }>Cambiar correo electrónico</Text>
                    </View>
                </Pressable>
                
                <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Editar Perfil Público', { type: 'pass' }) } }>
                    <MaterialIcons name="lock" size={24} style={ styles.icon } />
                    <View style={ styles.textContent }>
                        <Text style={ styles.title }>Cambiar contraseña</Text>
                    </View>
                </Pressable>
                
                <Pressable style={ styles.option } onPress={ () => { setShowModal(true); } }>
                    <MaterialIcons name="waving-hand" size={24} style={[ styles.icon, styles.red ]} />
                    <View style={ styles.textContent }>
                        <Text style={[ styles.title, styles.red ]}>Eliminar cuenta</Text>
                    </View>
                </Pressable>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={closeModal}>
                    <Pressable style={styles.overlay} onPress={closeModal}>
                        <View style={styles.content}>
                            <Pressable style={{paddingTop:8,alignSelf: 'flex-end'}} onPress={() => setModalVisible(false)}>
                                <MaterialIcons name='close' size={24} color='#eee' />
                            </Pressable>
                            <Text style={styles.titleModal}>Eliminar Cuenta</Text>
                            <Text style={styles.subtitleModal}>Estas a punto de eliminar tu cuenta. Si eliminas tu cuenta se eliminaran todos los datos de forma permanente. ¿Estás seguro?</Text>
                            <View style={styles.listButtons}>
                                <Pressable onPress={ () => removeAccount() } style={styles.confirm}>
                                    <Text style={styles.textConfirm}>Eliminar</Text>
                                </Pressable>
                                <Pressable onPress={ () => { setShowModal(false); } } style={styles.cancel}>
                                    <Text style={styles.textCancel}>Cancelar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        paddingTop: 0,
        height: '100%',
        backgroundColor: '#1A122E',
    },
    iconLeft: {
        color: '#E3D8FF',
        marginRight: 8,
    },
    icon: { color: '#E3D8FF', },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: 70,
        borderBottomColor: '#ffffff16',
        borderBottomWidth: 1,
    },
    title: {
        color: '#E3D8FF',
        fontSize: 16,
    },
    subtitle: {
        color: '#E3D8FF',
        opacity: 0.4,
    },
    red: { color: 'red', },
    overlay: {
        backgroundColor: '#000000aa',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#281d46',
        paddingTop: 16,
        padding: 32,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        elevation: 5,
    },
    titleModal: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitleModal: {
        color: '#ffffff50',
        fontSize: 14,
    },
    listButtons: {
        gap: 8,
        marginTop: 24,
    },
    confirm: {
        backgroundColor: '#ff000020',
        height: 50,
        width: '100%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancel: {
        height: 50,
        width: '100%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textConfirm: {
        color: '#ff0000',
        textAlign: 'center',
        fontSize: 16,
    },
    textCancel: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});