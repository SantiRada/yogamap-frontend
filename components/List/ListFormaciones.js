import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, ScrollView, View, Pressable, Text, Image } from 'react-native';

import axios from 'axios';

export function ListFormaciones({ search, count, stateTypeClass }){

    const DATA = [
        {
            id: '0',
            title: "No hay formaciones disponibles",
            description: "¡Dentro de poco se estarán sumando!",
            chips: '',
            img: "http://192.168.100.2/API_Yogamap/assets/firstevent.png",
        }
    ]

    const navigation = useNavigation();
    const [data, setData] = useState(DATA);

    useEffect(() => {
        const connectionFormaciones = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/formaciones.php', { search, count, stateTypeClass }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    if(response.data.formaciones){
                        console.log("Todo bien en listFormaciones");
                        setData(response.data.formaciones);
                    }else{
                        console.log("No existen listFormaciones");
                        setData(DATA);
                    }
                }else{
                    console.log("No success listFormaciones");
                    setData(DATA);
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar las formaciones...");
            }
        };
    
        connectionFormaciones();
    }, []);

    const clicFormacion = (id) => { if(id != 0) { navigation.navigate('ShowFormacion', { id: id }); } }

    return(
        <ScrollView style={[ styles.container, {marginBottom: 64} ]}>
            {
                data.map((item, index) => (
                    <Pressable key={index} style={ styles.event } onPress={ () => { clicFormacion(item.id) } }>
                        <Image source={{ uri: item.img }} style={styles.eventImage} />
                        <View style={styles.filter}></View>
                        <View style={styles.spaceText}>
                            <Text style={styles.eventTitle}>{item.title}</Text>
                            <Text style={styles.eventDesc}>{item.description}</Text>
                        </View>
                    </Pressable>
                ))
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    event: {
        position: 'relative',
        width: '100%',
        marginRight: 8,
        marginBottom: 8,
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
        backgroundColor: '#00000060',
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