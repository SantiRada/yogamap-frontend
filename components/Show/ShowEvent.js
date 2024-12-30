import { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useColors from '../../Colors';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

import { ListProf } from '../List/ListProf';
import { getUserID } from './../../UserData';

import { FavItems } from './../FavItems';

export function ShowEvent({ route }){
    const { id, idProf } = route.params;
    const idUser = getUserID();

    const navigation = useNavigation();

    const [data, setData] = useState([]);
    const [countAssist, setCountAssit] = useState(0);

    // FUNCIONAMIENTO DE LA ASISTENCIA
    const [asistire, setAsistire] = useState(false);
    const handleAsistencia = () => {
        setAsistire(!asistire);

        changeAssist();
    }

    const changeAssist = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/asistencia.php', { id, idUser }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) { console.log("Asistencia marcada para el usuario: " + idUser); }
            else { console.log("Falló el marcador de asistencia para el usuario: " + response.data.message); }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar el eventos de id" + id + "..." + error);
        }
    }

    useEffect(() => {
        const connectionEvent = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/event.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    setData(response.data.event[0]);

                    if (response.data.event[0].asistencia && response.data.event[0].asistencia.length > 0) {
                        if(response.data.event[0].asistencia.includes(idUser.toString())) { setAsistire(true); }

                        if(response.data.event[0].asistencia.includes(',')){
                            const countCommas = (str) => str.split(',').length;
                            const commaCount = countCommas(data.asistencia);
                            setCountAssit(commaCount);
                        } else { setCountAssit(1); }
                    } else { setCountAssit(0); }
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar el eventos de id" + id + "..." + error);
            }
        };
    
        connectionEvent();
    }, [id, idUser, countAssist]);
    
    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    useLayoutEffect(() => {
        if (data.idorg && idProf === data.idorg) {
            navigation.setOptions({
                title: 'Eventos',
                headerRight: () => (
                    <MaterialIcons
                        name="edit"
                        size={24}
                        style={styles.iconRight}
                        onPress={() => navigation.navigate('EditEvent', { data })}
                    />
                ),
            });
        } else {
            navigation.setOptions({
                title: 'Eventos',
                headerRight: () => ( <FavItems id={id} type="event" /> ),
            });
        }
    }, [data, idProf, navigation, id]);

    return(
        <ScrollView style={styles.container}>
            <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/events/" + data.img }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{data.name}</Text>
                <View style={styles.listChip}>
                    {(data.theme || "").split(',').map((theme, index) => (
                        <Pressable key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{theme}</Text>
                        </Pressable>
                    ))}
                </View>
                <Text style={styles.description}>{data.description}</Text>
                <Text style={styles.title}>Ubicación y Horarios</Text>
                <View style={styles.listChip}>
                    <Text style={[styles.chip, { color: Colors.text, } ]}>{data.horarios}</Text>
                    <Text style={[styles.chip, { color: Colors.text, } ]}>{data.ubication}</Text>
                </View>
                { (idProf != null && idProf == data.idorg) ? 
                    (
                        <View style={[styles.btn, styles.bg2]}>
                            <Text style={styles.btnText}>{countAssist} Asistencias marcadas</Text>
                        </View>
                    ) : (
                        <Pressable style={[styles.btn, (asistire ? styles.bg2 : styles.bg1) ]} onPress={ () => { handleAsistencia() } }>
                            <Text style={styles.btnText}>{asistire ? "Quitar Asistencia" : "¡Asistiré!"}</Text>
                        </Pressable>
                    )
                }
                <Text style={styles.subtitle}>Evento creado por</Text>
                <ListProf count={1} id={data.idorg} idUser={idUser} />

            </View>
        </ScrollView>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        gap: 16,
    },
    icon: { color: Colors.text, },
    iconRight: { color: Colors.text, },
    image:{
        width: '100%',
        height: 220,
        marginBottom: 16,
    },
    content:{
        padding: '4%',
        paddingTop: 0,
        gap: 8,
        marginBottom: 24,
    },
    title: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: 'bold',
    },
    listChip:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.inputBG,
        borderRadius: 8,
    },
    chipText: { color: Colors.text, },
    description: {
        color: Colors.text,
        opacity: 0.5,
        fontSize: 14,
        lineHeight: 20,
    },
    btn: {
        borderRadius: 16,
        padding: 16,
    },
    bg1: { backgroundColor: '#8C5BFF', },
    bg2: { backgroundColor: '#3C2C61', },
    btnText: {
        textAlign: 'center',
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle:{
        color: Colors.text,
        opacity: 0.65,
        fontWeight: 'bold',
        marginTop: 16,
    },
});