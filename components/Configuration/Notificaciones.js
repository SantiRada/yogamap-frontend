import { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet, Vibration, Pressable, Text, Modal, ToastAndroid } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Notificaciones(){

    const navigation = useNavigation();

    /* ------------------ VIBRACIÓN ------------------ */
    const listVibrates = [ "Predeterminada", "Desactivar", "Corta", "Larga" ];
    const [showModalVibrate, setShowModalVibrate] = useState(false);
    const [optionVibrate, setOptionVibrate] = useState();

    useEffect(() => {
        const loadSettings = async () => {
          const muteSetting = await AsyncStorage.getItem('muteSetting');
          const vibrateSetting = await AsyncStorage.getItem('vibrationSetting');

          if (vibrateSetting !== null) {
            setOptionVibrate(JSON.parse(vibrateSetting));
          }

          if(muteSetting !== null){
            if(muteSetting) {
                setOptionVibrate("Desactivar");
                await AsyncStorage.setItem('vibrationSetting', JSON.stringify("Desactivar"));
            }
            setOptionMute(muteSetting);
            await AsyncStorage.setItem('muteSetting', JSON.stringify(muteSetting));
          }
        };

        loadSettings();
      }, []);

    const changeVibrate = async (option) => {
        setOptionVibrate(option);

        switch(option){
            case "Predeterminada": Vibration.vibrate(500); break;
            case "Corta": Vibration.vibrate(300); break;
            case "Larga": Vibration.vibrate(800); break;
        }

        await AsyncStorage.setItem('vibrationSetting', JSON.stringify(option));
    }

    const closeModalVibrate = () => { setShowModalVibrate(false); }
    /* ------------------ VIBRACIÓN ------------------ */

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Configurar Notificaciones',
        });
    }, [navigation]);

    return(
        <View style={styles.container}>
            <Pressable style={ styles.option } onPress={ () => setShowModalVibrate(true) }>
                <MaterialIcons name="phone-android" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Vibración</Text>
                    <Text style={ styles.subtitle }>{optionVibrate}</Text>
                </View>
            </Pressable>
            
            {/* MODAL DE VIBRACIÓN */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showModalVibrate}
                onRequestClose={closeModalVibrate}>
                <Pressable style={styles.overlay} onPress={closeModalVibrate}>
                    <View style={styles.content}>
                        
                        <View style={styles.titleModal}>
                            <Text style={styles.titleModalText}>Vibración</Text>
                            <Pressable style={styles.iconModal} onPress={() => setShowModalVibrate(false)}>
                                <MaterialIcons name='close' size={24} color='#eee' />
                            </Pressable>
                        </View>
                        { listVibrates.map((item, index) => (
                            <Pressable key={ item + '-' + index } style={styles.optionRadio} onPress={ () => changeVibrate(item) }>
                                <View style={styles.radio}>
                                    { optionVibrate == item && <View style={styles.select}></View> }
                                </View>
                                <Text style={styles.textOption}>{item}</Text>
                            </Pressable>
                          ))
                        }
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
    icon: {
        color: '#E3D8FF',
    },
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
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '75%',
        backgroundColor: '#281d46',
        padding: 32,
        borderRadius: 32,
    },
    titleModal: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleModalText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionRadio: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingBlock: 16,
    },
    radio: {
        backgroundColor: '#ffffffff',
        borderRadius: '100%',
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    select: {
        width: 12,
        height: 12,
        backgroundColor: '#281d46',
        borderRadius: '100%',
    },
    textOption: {
        color: '#ffffff70',
        fontSize: 14,
    },
});