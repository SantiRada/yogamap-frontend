import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export function InfoProf({id, size}){

    const navigation = useNavigation();
    const [data, setData] = useState([]);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/unique/prof.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    if(response.data.prof) { setData(response.data.prof[0]); }
                    else { setData([]); }
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar el perfil del profe...");
            }
        };
    
        connection();
    }, [id]);

    return(
        <Pressable style={styles.stats} onPress={ () => { navigation.navigate('ShowProf', {id: data.id }) } }>
            <Image source={{ uri: 'https://yogamap.com.ar/assets/prof/' + data.icon }} style={[styles.image, ( size == "min" ? styles.size2 : styles.size1 )]} />
            <View style={styles.spaceText}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.desc}>{data.typesofyoga}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: '4%',
        marginBottom: 24,
    },
    image:{ borderRadius: 100, },
    size1: {
        width: 120,
        height: 120,
    },
    size2: {
        width: 50,
        height: 50,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    desc: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.5,
    },
});
