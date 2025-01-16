import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, FlatList, Pressable, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useColors from '../Colors';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { apiAxios } from './../AxiosAPI';

export function SliderFormaciones({ idProf, title }) {

    const navigation = useNavigation();

    const DATA = [
        {
            id: '0',
            title: 'Crea tu siguiente formación',
            description: '¡Es hora de educar a la comunidad!',
            img: "../firstformacion.png",
        },
    ];

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    const [data, setData] = useState(DATA);

    useFocusEffect(
        useCallback(() => {
            const connection = async () => {
                try {
                    const response = await apiAxios.post('select/formacionesperprof.php', { id: idProf });
                
                    if (response.data.success) {
                        if(response.data.formaciones) {
                            if(title) { setData(() => [...response.data.formaciones, ...DATA]); }
                            else { setData(response.data.formaciones); }
                        }
                        else { setData([]); console.log("Message: ", response.data.message); }
                    }
                  } catch (error) {
                    console.log("Falló la conexión al servidor al intentar recuperar las formaciones..." + error);
                }
            };
        
            connection();
        }, [idProf]),
    );

    const RenderItem = ({ item }) => (
        <Pressable onPress={ () => { item.id == 0 ? navigation.navigate('CreateFormacion', { id: idProf }) : navigation.navigate('ShowFormacion', { id: item.id, idProf: idProf }); } } style={styles.event}>
            <Image source={{ uri: 'https://yogamap.com.ar/assets/formaciones/' + item.img }} style={styles.eventImage} />
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
                    <Text style={styles.title}>Mis Formaciones</Text>
                
                    <MaterialIcons name="add" size={24} color="#fff" onPress={ () => navigation.navigate('CreateFormacion', { id:idProf }) } />
                </View>
            }
            <View style={styles.listEvent}>
                {data.map((item) => (
                    <RenderItem item={item}/>
                ))}
            </View>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        gap: 8,
        backgroundColor: Colors.background,
        width: '100%',
        flex: 1,
    },
    titleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8,
        paddingTop: 8,
    },
    title: {
        fontSize: 18,
        color: Colors.text,
        fontWeight: 'bold',
    },

    event: {
        marginBottom:20,
        borderRadius:15,
        overflow: 'hidden',
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
