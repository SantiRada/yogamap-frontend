import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import useColors from '../Colors';

import axios from 'axios';

import { SearchEvent } from './../components/SearchEvent';
import { FeedEvent } from './../components/FeedEvent';
import { VoidEvent } from '../components/Void/VoidEvent';

export function Eventos({ navigation }){

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: Colors.background },
            headerTitleStyle: { color: Colors.text2 },
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
                    const response = await axios.post('https://yogamap.com.ar/public/select/eventFeed.php', 
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

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        width: '100%',
        height: '100%',
        padding: '4%',
        gap: 8,
    },
    iconLeft: {
        color: Colors.headerIcons,
        marginLeft: 16,
    },
    iconRight: {
        color: Colors.headerIcons,
        marginRight: 16,
    },
});