import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Image, Text, Pressable } from 'react-native';
import axios from 'axios';
import { getUserID } from './../../UserData';

export function ListNotification({ type }) {
    const [data, setData] = useState([]);
    const idUser = getUserID();

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/notification.php', { idUser, type }, { headers: { 'Content-Type': 'application/json' } });
                if (response.data.success) { setData(response.data.notifications); }
                else { console.log("Ha fallado el searching de Notificaciones: ", response.data.message); }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar las notificaciones:", error);
            }
        };
        connection();
    }, [type]);

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            { data.length > 0 ? data.map((item, index) => (
                <Pressable key={index} style={[styles.notif, item.viewed == 0 && {backgroundColor: '#ffffff10'}]} onPress={() => { navigation.navigate('ShowNotification', { data: item }); }}>
                    <View style={styles.leftContent}>
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <Text style={[styles.title, item.viewed == 0 && {fontWeight: 'bold'}]}>{item.title}</Text>
                    </View>
                </Pressable>
                )) : <Text style={styles.centerText}>No tienes notificaciones pendientes.</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
    },
    notif: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: '4%',
        borderBottomColor: '#ffffff15',
        borderBottomWidth: 1,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    image: {
        width: 60,
        height: 60,
    },
    title: {
        color: '#fff',
        fontSize: 16,
    },
    iconButton: {
        padding: 4,
    },
    icon: {
        color: '#fff',
    },
    centerText: {
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 24,
        marginHorizontal: 56,
        color: '#ffffff70',
    },
});
