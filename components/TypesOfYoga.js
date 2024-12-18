import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';

export function TypesOfYoga(){

    const [data, setData] = useState([]);

    const count = 10;
    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/TypesOfYoga.php', { count }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    if(response.data.types) { setData(response.data.types); }
                    else { setData([]); }
                }else { console.log("No se encontraron registros de tipos de yoga...", response.data.message); }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
            }
        };
    
        connection();
    }, []);

    const navigation = useNavigation();

    return(
        <>
            <Text style={{color:'#fff',fontSize:18,fontWeight:'bold',paddingTop:8,}}>Tipos de Yoga</Text>
            <View style={styles.container}>
                { data && 
                    data.map((item, index) => (
                        <Pressable key={index} style={styles.option} onPress={ () => { navigation.navigate('ShowTypeOfYoga', { id: item.id }) }}>
                            <MaterialIcons name="help" size={24} color='#fff' />
                            <Text style={styles.text}>{item.name}</Text>
                        </Pressable>
                    ))
                }
            </View>
        </>
    );
}

const styles = StyleSheet.create({  
    container: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    option: {
        width: '48%',
        maxWidth: '49%',
        flexGrow: 1,
        backgroundColor: '#3C2C61',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 8,
    },
    icon: { color: '#8C5BFF' },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});