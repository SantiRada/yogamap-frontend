import { useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, Text, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useNavigation } from '@react-navigation/native';

export function EditTypeOfYoga(){

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Editando Tipo de Yoga',
            headerRight: () => (
                <MaterialIcons 
                    name="delete"
                    size={24}
                    style={ styles.iconRight }
                />
            ),
        });
    }, [navigation]);

    return(
        <ScrollView style={styles.container}>
            <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/firstevent.png" }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.titleSector}>
                    <Text style={styles.label}>Nombre del Tipo de Yoga</Text>
                    <TextInput placeholder="Nombre del Evento" placeholderTextColor="#ffffff50" style={styles.input} value="Hatha Yoga" />
                </View>
                <Text style={styles.label}>Primer Desplegable</Text>
                <TextInput placeholder="Primer Desplegable" placeholderTextColor="#ffffff50" style={styles.textarea} numberOfLines={10} multiline={true} value="Lorem ipsum..." />
                <Text style={styles.label}>Segundo Desplegable</Text>
                <TextInput placeholder="Segundo Desplegable" placeholderTextColor="#ffffff50" style={styles.textarea} numberOfLines={10} multiline={true} value="Lorem ipsum..." />
                <Text style={styles.label}>Descripción del Tipo de Yoga</Text>
                <TextInput
                    placeholder="Descripción del evento"
                    placeholderTextColor="#ffffff50"
                    multiline={true}
                    numberOfLines={10}
                    style={styles.textarea}
                    value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                    culpa qui officia deserunt mollit anim id est laborum." />
                <Pressable style={styles.btn}>
                    <Text style={styles.btnText}>Guardar Cambios</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
        gap: 16,
    },
    icon: { color: '#fff', },
    iconRight: {
        color: '#fff',
    },
    image:{
        width: '100%',
        height: 220,
        marginBottom: 16,
    },
    content: {
        paddingHorizontal: 16,
    },
    label: {
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: 24,
        color: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    textarea: {
        backgroundColor: '#3C2C61',
        padding: 16,
        textAlignVertical: 'top',
        color: '#fff',
        borderRadius: 8,
        marginBottom: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});