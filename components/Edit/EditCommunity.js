import { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, Text, TextInput, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

export function EditCommunity({ route }){
    const { data } = route.params;

    const descriptions = [
        "Una comunidad pública puede ser una buena opción para crecer y que cualquier usuario de Yogamap, pueda formar parte de tu espacio.",
        "Una comunidad privada es un grupo selecto, si alguien desea entrar a tu espacio deberás aceptar una solicitud primero.",
        "Una comunidad pública de sólo lectura permitirá que muchos usuarios lleguen a tu espacio pero solo tú podrás escribir.",
        "Una comunidad privada de sólo lectura puede ser útil para mantener el orden, ya que los integrados son aceptados manualmente y sólo puedes escribir tú.",
    ];

    const navigation = useNavigation();

    const [name, setName] = useState(data['name']);
    const [description, setDescription] = useState(data['description']);
    const [type, setType] = useState(data['type']);

    const [visibilityTypes, setVisibilityTypes] = useState(true);
    const handleVisibility = () => { setVisibilityTypes(!visibilityTypes) }
    const iconName = visibilityTypes ? "keyboard-arrow-up" : "keyboard-arrow-right";

    const saveData = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/update/chat.php', { id: data['id'], name, description, type }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) { navigation.goBack(); }
            else { console.log("ERROR: ", response.data.message); }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar editar la comunidad...", error);
        }
    }

    const handleQuitCommunity = () => {
        Alert.alert(
            "Confirmación necesaria",
            "Al confirmar, eliminarás esta comunidad para siempre.",
            [
                { text: "Cancelar", },
                { text: "Aceptar", onPress: () => QuitCommunity }
            ]
        );
    }
    const QuitCommunity = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/delete/remove.php', { id: data['id'], type: 'chats' }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) { navigation.navigate('TabGroup'); }
            else { console.log("ERROR: ", response.data.message); }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar el chat..." + error);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Editando Comunidad',
            headerStyle: { backgroundColor: '#1A122E' },
            headerTitleStyle: { color: '#E3D8FF' },
            headerTintColor: '#E3D8FF',
            headerRight: () => (
                <MaterialIcons 
                    name="delete"
                    size={24}
                    style={ styles.iconRight }
                    onPress={ () => { handleQuitCommunity() } }
                />
            ),
        });
    }, [navigation]);

    return(
        <ScrollView style={ styles.container }>
            <View style={styles.stats}>
                <View style={{ width: '100%', paddingHorizontal: 16 }}>
                    <Text style={styles.title}>Nombre de la Comunidad</Text>
                    <TextInput
                        style={styles.name}
                        placeholderTextColor='#ffffff50'
                        onChangeText={setName}
                        value={name}
                        placeholder="Nombre de la Comunidad"
                    />
                </View>
            </View>
            <View style={styles.description}>
                <Text style={styles.title}>Descripción de la Comunidad</Text>
                <TextInput
                    multiline={true}
                    numberOfLines={8}
                    style={styles.descriptionText}
                    placeholder="Descripción de la Comunidad"
                    placeholderTextColor='#ffffff50'
                    onChangeText={setDescription}
                    value={description}
                />
            </View>
            <Pressable style={styles.desplegable} onPress={ handleVisibility }>
                <Text style={styles.title}>Tipo de Comunidad</Text>
                <MaterialIcons name={iconName} size={24} color='#fff' />
            </Pressable>
            { visibilityTypes &&
                <View style={styles.list}>
                    <Pressable style={[styles.option, type == 0 && styles.selected]} onPress={ () => { setType(0); } }>
                        <Text style={styles.optionText}>Público</Text>
                    </Pressable>
                    <Pressable style={[styles.option, type == 1 && styles.selected]} onPress={ () => { setType(1); } }>
                        <Text style={styles.optionText}>Privado</Text>
                    </Pressable>
                    <Pressable style={[styles.option, type == 2 && styles.selected]} onPress={ () => { setType(2); } }>
                        <Text style={styles.optionText}>Público Solo Lectura</Text>
                    </Pressable>
                    <Pressable style={[styles.option, type == 3 && styles.selected]} onPress={ () => { setType(3); } }>
                        <Text style={styles.optionText}>Privado Solo Lectura</Text>
                    </Pressable>

                    <Text style={styles.aclaration}>{descriptions[type]}</Text>
                </View>
            }
            <Pressable style={styles.btn} onPress={ () => { saveData() } }>
                <Text style={styles.textBtn}>Guardar Cambios</Text>
            </Pressable>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
    },
    iconRight: { color: '#fff', },
    name: {
        color: '#fff',
        marginBottom: 4,
        borderRadius: 8,
        backgroundColor: '#3C2C61',
        width: '100%',
        padding: 8,
        paddingLeft: 24,
        marginTop: 8,
    },
    description: {
        marginTop: 8,
        width: '92%',
        marginHorizontal: 16,
    },
    descriptionText: {
        fontSize: 14,
        backgroundColor: '#3C2C61',
        textAlignVertical: 'top',
        borderRadius: 8,
        padding: 16,
        color: '#fff',
        width: '100%',
        marginTop: 8,
    },
    title: {
        color: '#E3D8FF',
        fontSize: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    desplegable: {
        flexDirection:'row',
        width:'92%',
        alignItems:'center',
        justifyContent:'space-between',
        padding:16,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff20',
        marginHorizontal: '4%',
        marginBottom: 16,
    },
    list: {
        width: '100%',
        paddingHorizontal: '4%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    option: {
        backgroundColor: '#3C2C61',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    selected: { backgroundColor: '#8C5BFF', },
    optionText: { color: '#fff', },
    aclaration: {
        textAlign: 'center',
        color: '#ffffff50',
        width: '100%',
        paddingHorizontal: 24,
        paddingVertical: 16,
    }
});