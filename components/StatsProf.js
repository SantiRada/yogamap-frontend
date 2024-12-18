import { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

export function StatsProf({id}) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const SearchData = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/prof.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) { setData(response.data.prof[0]); }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar el perfil de id" + id + "..." + error);
            }
        }

        SearchData();
    }, [id]);

    return (
        <View style={styles.container}>
            <View style={styles.option}>
                <View style={styles.leftContent}>
                    <MaterialIcons name="emoji-people" size={28} style={styles.icon} />
                    <Text style={styles.optionText}>Visitas al Perfil</Text>
                </View>
                <Text style={styles.value}>{data.visitasalperfil ? data.visitasalperfil : 0}</Text>
            </View>
            <View style={styles.option}>
                <View style={styles.leftContent}>
                    <MaterialIcons name="perm-contact-calendar" size={28} style={styles.icon} />
                    <Text style={styles.optionText}>Alumnos Activos</Text>
                </View>
                <Text style={styles.value}>{data.alumns ? data.alumns : 0}</Text>
            </View>
            <View style={styles.option}>
                <View style={styles.leftContent}>
                    <MaterialIcons name="wechat" size={28} style={styles.icon} />
                    <Text style={styles.optionText}>Comunidad</Text>
                </View>
                <Text style={styles.value}>{data.community ? data.community : 0}</Text>
            </View>
            <View style={styles.option}>
                <View style={styles.leftContent}>
                    <MaterialIcons name="edit-calendar" size={28} style={styles.icon} />
                    <Text style={styles.optionText}>Disponibilidad</Text>
                </View>
                <Text style={styles.value}>{data.clients ? data.clients : 0}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    option:{
        flexBasis: '47%',
        flexGrow: 1,
        backgroundColor: '#3C2C61',
        padding: 16,
        borderRadius: 16,
        gap: 8,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: { color: '#8C5BFF' },
    optionText: {
        color: '#fff',
        fontSize: 16,
    },
    value: {
        color: '#fff',
        fontSize: 36,
        textAlign: 'right',
        fontWeight: 'bold',
    }
});
