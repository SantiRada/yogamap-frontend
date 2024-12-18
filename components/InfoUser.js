import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import axios from 'axios';

export function InfoUser({id}){

    const [data, setData] = useState([]);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/users.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    if(response.data.users) { setData(response.data.users); }
                    else { setData([]); }
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar el perfil del usuario...");
            }
        };
    
        connection();
    }, [id]);

    const dataIcon = (data.icon != null ? ('http://192.168.100.2/API_Yogamap/assets/prof/' + data.icon) : "http://192.168.100.2/API_Yogamap/assets/icon.png");

    return(
        <View style={ styles.stats }>
            <View style={styles.statsSector}>
                <Image source={{ uri: dataIcon }} style={ styles.image } />
                <View style={styles.textSector}>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.mail}>{data.mail}</Text>
                </View>
            </View>
            <Pressable style={styles.btn}>
                <Text style={styles.textBtn}>Quiz Yogamap</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    stats: {
        gap: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff30',
    },
    statsSector: {
        flexDirection: 'row',
        gap: 16,
    },
    textSector: {
        gap: 4,
        justifyContent: 'center',
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 100,
    },
    name: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    mail: {
        color: '#ffffff50',
        fontSize: 14,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
});