import { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

import { ListChat } from '../components/List/ListChat';
import { VoidChat } from '../components/Void/VoidChat';
import { getUserID, userData } from './../UserData';
import { profData } from './../ProfData';

export function Chat({ navigation }){

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: '#1A122E' },
            headerTitleStyle: { color: '#E3D8FF' },
            headerTintColor: '#E3D8FF',
            headerRight: () => (
                <MaterialIcons 
                    name="settings"
                    size={24}
                    style={ styles.iconRight }
                    onPress={() => navigation.navigate('Configuración')}
                />
            ),
            headerLeft: () => (
                <MaterialIcons 
                name="notifications"
                size={24}
                style={ styles.iconLeft }
                onPress={() => navigation.navigate('Notificaciones')}
            />
            ),
        });
    }, [navigation]);

    const [data, setData] = useState([]);
    const idUser = getUserID();

    // INFORMACIÓN COMPLETA DEL USUARIO
    const [dataUser, setDataUser] = useState([]);
    const [dataProf, setDataProf] = useState([]);
    useEffect(() => {
        const user = async () => {
            const userInfo = await userData();
            setDataUser(userInfo);

            if(userInfo.idprof){
                console.log("Set Prof Data");
                const profInfo = await profData();
                setDataProf(profInfo);
            }
        }

        user();
    }, []);

    const connection = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/chats.php', { idUser }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) {
                if (response.data.chats) { setData(response.data.chats); }
                else { setData([]); }
            }
        } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar los chats...");
        }
    };


    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('focus', () => {
            connection();
        });

        return unsubscribeFocus;
    }, [navigation]);

    const createCommunity = async () => {
        try {
            console.log("ID: ", dataProf.id);
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/insert/community.php', 
                { id: dataProf.id },
                { headers: { 'Content-Type': 'application/json' } }
            );
        
            if (response.data.success) { connection(); }
            else { console.log(response.data.message); }
        } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
        }
    }

    return(
        <View style={styles.container}>
            {
                data.length > 0 ?
                    data.map((item) => (
                        <ListChat data={item} />
                    )) :
                <>
                    <VoidChat />
                    { dataUser.idprof != null && dataProf.community == null &&
                        <Pressable style={styles.btn} onPress={ () => createCommunity() }>
                            <Text style={styles.textBtn}>Crear comunidad</Text>
                        </Pressable>
                    }
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
        padding: '4%',
        flex: 1,
        gap: 16,
    },
    iconLeft: {
        color: '#E3D8FF',
        marginLeft: 16,
    },
    iconRight: {
        color: '#E3D8FF',
        marginRight: 16,
    },
    btn: {
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        borderColor: '#8C5BFF',
        borderWidth: 4,
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
});