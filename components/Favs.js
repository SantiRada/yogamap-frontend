import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import axios from 'axios';
import { getUserID } from './../UserData';
import { ListProf } from './List/ListProf';
import { ListEvent } from './List/ListEvent';
import { useFocusEffect } from '@react-navigation/native';

export function Favs() {
    const id = getUserID();
    const [prof, setProf] = useState([]);
    const [event, setEvent] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/favs.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
            if (response.data.success && response.data.favs) {
                const favProf = response.data.favs.favProf || '';
                const favEvent = response.data.favs.favEvent || '';

                // Procesar favoritos de profesores y eventos, asignar arreglos vacíos si no hay favoritos
                setProf(favProf ? (favProf.includes(',') ? favProf.split(',') : [favProf]) : []);
                setEvent(favEvent ? (favEvent.includes(',') ? favEvent.split(',') : [favEvent]) : []);
            } else {
                console.log("No se encontraron favoritos o respuesta fallida.");
                setProf([]);
                setEvent([]);
            }
        } catch (error) {
            console.log("Error al recuperar favoritos:", error);
            setProf([]);
            setEvent([]);
        }
    }, [id]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return (
        <View style={styles.container}>
            {prof.length === 0 && event.length === 0 ? (
                <View style={styles.voidFav}>
                    <Image source={require("./../assets/brand/fav.png")} style={styles.image} />
                    <Text style={styles.voidText}>Puedes añadir profes, escuelas, eventos y comunidades a tus favoritos para verlos en esta sección.</Text>
                </View>
            ) : (
                <View style={styles.containFav}>
                    {prof.length > 0 && (
                        <View>
                            <Text style={styles.title}>Profes Favoritos</Text>
                            {prof.map((item, index) => (
                                <ListProf key={index} id={item} idUser={id} />
                            ))}
                        </View>
                    )}
                    {event.length > 0 && (
                        <View>
                            <Text style={styles.title}>Eventos Favoritos</Text>
                            {event.map((item, index) => (
                                <ListEvent key={index} id={item} idUser={id} />
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A122E',
        flex: 1,
    },
    voidFav: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    image: {
        width: 150,
        height: 150,
        opacity: 0.75,
    },
    voidText: {
        color: '#ffffff50',
        textAlign: 'center',
        fontSize: 16,
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        marginTop: 16,
        marginBottom: 8,
    },
});
