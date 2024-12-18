import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';

import { SearchEvent } from './../components/SearchEvent';
import { FeedEvent } from './../components/FeedEvent';
import { VoidEvent } from '../components/Void/VoidEvent';

export function Eventos({ navigation }){

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
    const [hasSearch, setHasSearch] = useState(false);

    const id = -1;
    const count = 10;

    // REVISION DEL FOCUS EN LA SECCIÓN DE EVENTOS
    useFocusEffect(
        useCallback(() => {
            const connectionEvent = async () => {
                try {
                    const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/eventFeed.php', 
                        { id, count },
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                
                    if (response.data.success) {
                        setData(response.data.event);
                    }
                } catch (error) {
                    console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
                }
            };

            if (!hasSearch) {
                connectionEvent();
            }
        }, [id, count, hasSearch])
    );

    return(
        <ScrollView style={styles.container}>
            <SearchEvent setData={setData} setHasSearch={setHasSearch} />
            {
                hasSearch ?
                    <FeedEvent dataEvent={data} /> :
                data.length > 0 ?
                    <FeedEvent dataEvent={data} /> :
                    <VoidEvent voidData={false} />
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A122E',
        width: '100%',
        height: '100%',
        padding: '4%',
        gap: 8,
    },
    iconLeft: {
        color: '#E3D8FF',
        marginLeft: 16,
    },
    iconRight: {
        color: '#E3D8FF',
        marginRight: 16,
    },
});