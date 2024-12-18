import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { StyleSheet, View, ScrollView, Image, Pressable, Text, TextInput, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as ImagePicker from 'expo-image-picker';

export function CreateEvent({ route }){
    const { id } = route.params;

    const navigation = useNavigation();

    const imageBase = "http://192.168.100.2/API_Yogamap/assets/firstevent.png";
    const [imageURI, setImageURI] = useState(imageBase);

    const [name, setName] = useState('');
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const [horarios, setHorarios] = useState('');
    const [ubication, setUbication] = useState('');
    const [status, setStatus] = useState('');

    const askForPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('¡Permiso denegado!', 'Necesitas conceder permiso para acceder a la galería.');
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await askForPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageURI(result.assets[0].uri);
        } else {
            console.log('Usuario canceló la selección de imagen');
        }
    };

    const verifyData = () => {
        if(name == '' || theme == '' || description == '' || horarios == '' || imageURI == imageBase){
            setStatus("Debes completar todos los datos para poder crear tu evento (excepto la ubicación).");
            return false;
        }
        else { setStatus(''); return true; }
    }

    const saveData = () => {
        const verify = verifyData();

        if(!verify) { return; }

        SaveAllData();
    }

    const SaveAllData = async () => {
        try {
            const formData = new FormData();

            formData.append('idorg', id);
            formData.append('name', name);
            formData.append('theme', theme);
            formData.append('description', description);
            formData.append('horarios', horarios);
            formData.append('ubication', ubication);
            
            if (imageURI !== imageBase) {
                const fileName = imageURI.split('/').pop();
                formData.append('image', {
                    uri: imageURI,
                    name: fileName,
                    type: 'image/jpeg',
                });
            }

            // Realiza la solicitud POST
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/insert/event.php', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            if (response.data.success) {
                Alert.alert(
                    '¡Evento Creado!',
                    'El evento ha sido creado con éxito.',
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => navigation.navigate('TabGroup'),
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Falló la creación del evento...', response.data.message);
            }
        } catch (error) {
            console.log('Falló la conexión al servidor al intentar crear el evento...', error);
        }
    };

    return(
        <ScrollView style={styles.container}>
            <Pressable style={{ position: 'relative' }} onPress={ pickImage }>
                <Image source={{ uri: imageURI }} style={styles.image} />
                <View style={imageURI !== imageBase ? styles.edit : styles.filter}>
                    <MaterialIcons style={imageURI !== imageBase ? styles.iconEdit : styles.iconFilter} name={imageURI !== imageBase ? "edit" : "add"} color='#fff' />
                </View>
            </Pressable>
            <View style={styles.content}>
                <View style={styles.titleSector}>
                    <Text style={styles.label}>Nombre del Evento</Text>
                    <TextInput
                        placeholder="Nombre del Evento"
                        placeholderTextColor="#ffffff50"
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                    />
                </View>
                <Text style={styles.label}>Temas del Evento</Text>
                <TextInput
                    placeholder="Temas del Evento"
                    placeholderTextColor="#ffffff50"
                    style={styles.input}
                    onChangeText={setTheme}
                    value={theme}
                />
                <Text style={styles.label}>Descripción del Evento</Text>
                <TextInput
                    placeholder="Descripción del evento"
                    placeholderTextColor="#ffffff50"
                    multiline={true}
                    numberOfLines={10}
                    style={styles.textarea}
                    onChangeText={setDescription}
                    value={description}
                />
                <Text style={styles.label}>Horario</Text>
                <TextInput
                    placeholder="20:30 a 21:30"
                    placeholderTextColor="#ffffff50"
                    style={styles.input}
                    onChangeText={setHorarios}
                    value={horarios}
                />
                <Text style={styles.label}>Ubicación</Text>
                <TextInput
                    placeholder="Ubicación"
                    placeholderTextColor="#ffffff50"
                    style={styles.input}
                    onChangeText={setUbication}
                    value={ubication}
                />
                { status && <Text style={styles.status}>{status}</Text> }
                <Pressable style={styles.btn} onPress={ () => saveData() }>
                    <Text style={styles.btnText}>Crear Evento</Text>
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
    filter: {
        backgroundColor: '#00000050',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    edit: {
        backgroundColor: '#00000050',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop:16,
        paddingRight:16,
    },
    iconFilter: {
        backgroundColor: '#1A122E',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 48,
    },
    iconEdit: {
        fontSize: 24,
        color: '#c80000',
        backgroundColor: '#f0a6a6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
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
    status: {
        color: '#ff0000',
        width: '100%',
        textAlign:'center',
        paddingVertical: 16,
        backgroundColor: '#ff000014',
        borderRadius: 16,
        marginBottom: 16,
    },
});