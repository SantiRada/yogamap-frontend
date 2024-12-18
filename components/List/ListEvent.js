import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Pressable, Text, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

import { FavItems } from './../FavItems';

export function ListEvent({ id, idUser }){
    

    const navigation = useNavigation();
    const [data, setData] = useState([]);

    useEffect(() => {
        const connectionEvent = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/event.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    setData(response.data.event);
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar el perfil de id " + id + "... en ListEvent" + error);
            }
        };
    
        connectionEvent();
    }, [id]);

    return(
        <View style={ styles.container }>
            {data.map((event, index) => (
            <Pressable key={index} style={ styles.prof } onPress={ () => { navigation.navigate('ShowEvent', { id: event.id }); } }>
                <View style={styles.containProf}>
                    <Image
                        style={styles.image}
                        source={{
                        uri: "http://192.168.100.2/API_Yogamap/assets/events/" + event.img,
                        }}
                    />
                    <View style={styles.spaceText}>
                        <Text style={ styles.name }>{event.name}</Text>
                        <Text style={ styles.types }>{event.theme}</Text>
                    </View>
                </View>
                <View style={styles.icon}>
                    <FavItems id={event.id} type="event" />
                </View>
            </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        gap: 8,
    },
    prof: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: '#3C2C61',
    },
    containProf: { flexDirection: 'row', },
    image: {
        opacity: 0.65,
        width: 70,
        height: '100%',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    spaceText: { padding: 16, },
    name: { color: '#fff', },
    types: { color: '#ffffff60', },
    icon: {
        position: 'absolute',
        top: 22,
        right: 16,
        color: '#fff',
    },
});