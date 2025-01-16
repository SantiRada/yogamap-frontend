import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, FlatList, Pressable, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProfID } from '../ProfData';
import useColors from '../Colors';
import { userData } from './../UserData';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { apiAxios } from './../AxiosAPI';

export function SliderEvent({ idUser, title }) {

    
    const idProf = getProfID() ?? null;
    const navigation = useNavigation();
    const [dataUser, setDataUser] = useState()

    const fetchData = async () => {
         try {
             const user = await userData();
             console.log(user)
             setDataUser(user);

         } catch (error) {
             console.error("Error fetching data", error);
         }
};
    useEffect(() => {
        fetchData();
    }, []);

    const DATA = [
        {
            id: '0',
            title: 'Crea tu siguiente evento',
            description: '¡Es hora de reunir a la comunidad!',
            image: "../firstevent.png",
        },
    ];

    const [data, setData] = useState(DATA);

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

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
                    console.log(error);
                }
            };
        
            connectionEvent();
        }, [idProf]),
    );

    const RenderItem = ({ item }) => (
        <Pressable key={item.id} onPress={ () => { item.id == 0 ? navigation.navigate('CreateEvent', { id: idProf }) : navigation.navigate('ShowEvent', {id: item.id, idProf: idProf, idUser: idUser}) } } style={styles.event}>
            <Image source={{ uri: "https://yogamap.com.ar/assets/events/" + item.image }} style={styles.eventImage} />
            <View style={styles.filter}></View>
        {console.log(item)}

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
