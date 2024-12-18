import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Pressable, Text } from 'react-native';

export function ListChat({ data }) {
    const [timeFormatted, setTimeFormatted] = useState('');
    const [viewed, setViewed] = useState(true);
    const navigation = useNavigation();

    // Función para convertir 'H:i' a objeto Date
    const toDate = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    };

    useEffect(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        setTimeFormatted(`${hours}:${minutes}`);

        const fetchLastTime = async () => {
            const storedTime = await AsyncStorage.getItem('time-' + data.id);

            if (storedTime) {
                const timeToLastMessage = toDate(data.lastTime);
                const timeToLastView = toDate(storedTime);

                if (timeToLastMessage > timeToLastView) { setViewed(false); }
                else { setViewed(true); }
            }
        };

        fetchLastTime();
    }, [data]);

    const clicChat = async (id) => {
        await AsyncStorage.setItem('time-' + id, timeFormatted);
        navigation.navigate('ShowCommunity', { id });
    };

    const dataIcon = data.icon ? ('http://192.168.100.2/API_Yogamap/assets/prof/' + data.icon) : 'http://192.168.100.2/API_Yogamap/assets/icon.png';

    return (
        <ScrollView style={styles.listChat}>
            <View>
                <Pressable style={styles.chat} onPress={() => { clicChat(data.id); }}>
                    <Image source={{ uri: dataIcon }} style={styles.imagenChat} />
                    <View style={styles.contentChat}>
                        <View style={styles.topContent}>
                            <Text style={styles.name}>{data.name}</Text>
                            { !viewed && <View style={styles.newMessage}></View> }
                        </View>
                        <View style={styles.bottomContent}>
                            <Text style={styles.message}>{data.lastMessage}</Text>
                            <Text style={styles.times}>{data.lastTime}</Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    listChat: { gap: 8 },
    chat: {
        paddingVertical: 8,
        flexDirection: 'row',
        width: '100%',
    },
    imagenChat: {
        width: 50,
        height: 50,
        marginRight: 16,
    },
    contentChat: {
        width: '80%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    topContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: { color: '#fff' },
    newMessage: {
        backgroundColor: '#fff',
        borderRadius: 100,
        width: 10,
        height: 10,
    },
    bottomContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    message: { color: '#ffffff50' },
    times: { color: '#ffffff50' },
});
