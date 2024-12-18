import { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

import { ListProf } from '../List/ListProf';
import { getUserID } from './../../UserData';

export function ShowFormacion({ route }){
    const { id, idProf } = route.params;
    const idUser = getUserID();

    const navigation = useNavigation();

    const [data, setData] = useState([]);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/Formaciones.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    if(response.data.formaciones) { setData(response.data.formaciones[0]); }
                    else { setData([]); console.log("Warn: ", response.data.message); }
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar la formación de id (" + id + "): " + error);
            }
        };
    
        connection();
    }, [id]);
    
    useLayoutEffect(() => {
        if (data.idprof && idProf === data.idprof) {
            navigation.setOptions({
                title: 'Detalle de Formación',
                headerRight: () => (
                    <MaterialIcons
                        name="edit"
                        size={24}
                        style={styles.iconRight}
                        onPress={() => navigation.navigate('EditFormacion', { data })}
                    />
                ),
            });
        } else {
            navigation.setOptions({
                title: 'Detalle de Formación',
                headerRight: null,
            });
        }
    }, [data, idProf, navigation]);

    return(
        <ScrollView style={styles.container}>
            <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/formaciones/" + data.img }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.titleSector}>
                    <Text style={styles.title}>{data.title}</Text>
                </View>
                { data.themes && data.themes.includes(',') ?
                    <View style={styles.listChip}>
                        { data.themes.split(',').map((chips, index) => (
                            <Pressable key={index} style={styles.chip}>
                                <Text style={styles.chipText}>{chips}</Text>
                            </Pressable>
                          ))
                        }
                    </View> :
                    <View style={styles.listChip}>
                        <Pressable style={styles.chip}>
                            <Text style={styles.chipText}>{data.themes}</Text>
                        </Pressable>
                    </View>
                }
                <Text style={styles.description}>{data.description}</Text>
                <Pressable style={[styles.btn, styles.bg1 ]} onPress={ () => { navigation.navigate('WayClass', { id: idProf, types: null }) } }>
                    <Text style={styles.btnText}>Contactar</Text>
                </Pressable>
                <Text style={styles.subtitle}>Formación creada por</Text>
                <ListProf count={1} id={data.idprof} idUser={idUser} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
        gap: 16,
    },
    icon: { color: '#fff', },
    iconRight: { color: '#fff', },
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
    titleSector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    listChip:{
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#3C2C61',
        borderRadius: 8,
    },
    chipText: { color: '#fff', },
    description: {
        color: '#fff',
        opacity: 0.5,
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    btn: {
        borderRadius: 16,
        padding: 16,
    },
    bg1: { backgroundColor: '#8C5BFF', },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle:{
        color: '#fff',
        opacity: 0.65,
        fontWeight: 'bold',
        marginTop: 16,
    },
});