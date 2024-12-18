import { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

import { profData } from './../../ProfData';

export function Ubicacion({ route }){
    const { id } = route.params;

    const [data, setData] = useState([]);

    useEffect(() => {
        const connectionUser = async () => {
            const dataUser = await profData();

            setData(dataUser);
        }

        connectionUser();
    }, [id]);

    return(
        <ScrollView style={styles.container}>
            <Pressable style={styles.option} onPress={handleUbicacion}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <MaterialIcons name="location-on" size={24} color="#fff" />
                    <Text style={styles.textOpcion}>Ubicación</Text>
                </View>
                <MaterialIcons name={ubicacionVisible ? "keyboard-arrow-up" : "keyboard-arrow-right"} size={24} color="#fff" />
            </Pressable>
            { ubicacionVisible &&
                <View style={styles.space}>
                    <Text style={styles.label}>Buscar ubicación</Text>
                    <TextInput placeholderTextColor="#ffffff50" placeholder="Ubicación en Maps" style={styles.input} />
                </View>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        paddingTop: 0,
        height: '100%',
        backgroundColor: '#1A122E',
    },
});