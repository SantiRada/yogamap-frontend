import { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';

import axios from 'axios';

export function ListTypeOfYoga({ count, size, setTypesOfYoga }){

    const [data, setData] = useState([]);

    useEffect(() => {
        const connectionTypeOfYoga = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/TypesOfYoga.php', { count }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) { setData(response.data.types); }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los tipos de yoga...");
            }
        };
    
        connectionTypeOfYoga();
    }, [count]);

    const clickChip = (id) => {
        Alert.alert("Has cliqueado: ", "El elemento: " + id);
        if(setTypesOfYoga) { setTypesOfYoga(id); }
    }

    return(
        <View style={styles.container}>
            { data.length > 0 &&
                data.map((item, index) => (
                    <Pressable key={index} style={(size == "max" ? styles.maxChip : styles.chip)} onPress={() => clickChip(item.name)}>
                        <Text style={(size == "max" ? styles.chipMaxText : styles.chipText)}>{item.name}</Text>
                    </Pressable>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 8,
    },
    chip: {
        flexBasis: '30%',
        flexGrow: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#3C2C61',
        borderRadius: 8,
    },
    maxChip: {
        width: '100%',
        padding: 16,
        backgroundColor: '#3C2C61',
        borderRadius: 8,
    },
    chipText:{
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    chipMaxText:{
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});