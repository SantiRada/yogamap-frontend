import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Pressable, Text, Image } from 'react-native';

import axios from 'axios';
// import { getUserID } from './../../UserData';
import { FavItems } from './../FavItems';

export function ListProf({ count, id }){

    const navigation = useNavigation();
    const [data, setData] = useState([]);
    // const idUser = getUserID();

    useEffect(() => {
        const connectionProfs = async () => {
            if(id) {
                try {
                    const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/prof.php', { id }, { headers: { 'Content-Type': 'application/json' } });
                
                    if (response.data.success) { setData(response.data.prof); }
                    else { console.log("Falló la carga del profe...", response.data.message); }
                  } catch (error) { console.log("Falló la conexión al servidor al intentar recuperar el perfil de id " + id + "..." + error); }
            } else {
                try {
                    const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/prof.php', { count }, { headers: { 'Content-Type': 'application/json' } });
                
                    if (response.data.success) {
                        if(response.data.prof) { setData(response.data.prof); }
                        else { setData([]); }
                    }
                  } catch (error) {
                    console.log("Falló la conexión al servidor al intentar recuperar los perfiles..." + error);
                }
            }
        };
    
        connectionProfs();
        return undefined;
    }, [id, count]);

    return(
        <View style={ styles.container }>
            {data.map((prof) => (
            <Pressable key={prof.id} style={ styles.prof } onPress={ () => { navigation.navigate('ShowProf', {id: prof.id }); } }>
                <View style={styles.containProf}>
                    <Image
                        style={styles.image}
                        source={{
                        uri: prof.icon ? ('http://192.168.100.2/API_Yogamap/assets/prof/' + prof.icon) : "http://192.168.100.2/API_Yogamap/assets/icon.png",
                        }}
                    />
                    <View style={styles.spaceText}>
                        <Text style={ styles.name }>{prof.name}</Text>
                        <Text style={ styles.types }>{prof.typesofyoga && prof.typesofyoga}</Text>
                    </View>
                </View>
                <View style={styles.icon}>
                    <FavItems id={prof.id} type="prof" />
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
        width: 70,
        height: 70,
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