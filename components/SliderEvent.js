import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, FlatList, Pressable, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProfID } from '../ProfData';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { apiAxios } from './../AxiosAPI';

export function SliderEvent({ route }) {

    const { idUser, title } = route.params;
    
    const idProf = getProfID() ?? null;
    const navigation = useNavigation();

    const DATA = [
        {
            id: '0',
            title: 'Crea tu siguiente evento',
            description: '¡Es hora de reunir a la comunidad!',
            image: "../firstevent.png",
        },
    ];

    const [data, setData] = useState(DATA);

    useFocusEffect(
        useCallback(() => {
            const connectionEvent = async () => {
                try {
                    const response = await apiAxios.post('/select/eventFeed.php', {
                        id: idProf,
                    });
                
                    if (response.data.success) {
                        if (response.data.success) {
                            if(idUser != ''){
                                if(title) { setData(() => [...response.data.event, ...DATA]); }
                                else { setData(response.data.event); }
                            }
                            else { setData(response.data.event); }
                        }
                    }
                } catch (error) {
                    console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
                }
            };
        
            connectionEvent();
        }, [idProf]),
    );

    const renderItem = ({ item }) => (
        <Pressable onPress={ () => { item.id == 0 ? navigation.navigate('CreateEvent', { id: idProf }) : navigation.navigate('ShowEvent', {id: item.id, idProf: idProf, idUser: idUser}) } } style={styles.event}>
            <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/events/" + item.image }} style={styles.eventImage} />
            <View style={styles.filter}></View>
            <View style={styles.spaceText}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDesc}>{item.id == 0 ? item.description : item.themes}</Text>
            </View>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            { title &&
                <View style={styles.titleContent}>
                    <Text style={styles.title}>Mis Eventos</Text>
                    <MaterialIcons name="add" size={24} color="#fff" onPress={ () => navigation.navigate('CreateEvent', { id:idProf }) } />
                </View>
            }
            <View style={styles.listEvent}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={350}
                    decelerationRate="fast"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        backgroundColor: '#1A122E',
        width: '100%',
        flex: 1,
    },
    titleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 4,
    },
    title: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    event: {
        position: 'relative',
        width: 350,
        marginRight: 8,
    },
    eventImage: {
        width: '100%',
        height: 210,
        borderRadius: 8,
    },
    filter: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000080',
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    spaceText: {
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    eventTitle: {
        color: '#fff',
        fontSize: 18,
    },
    eventDesc: {
        color: '#ffffffac',
    },
});
