import { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, Pressable, Text, TextInput, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';

import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';

export function EditEvent({route}){
    const { data } = route.params;
    const navigation = useNavigation();
    const [status, setStatus] = useState('');

    const [imageURI, setImageURI] = useState("http://192.168.100.2/API_Yogamap/assets/events/" + data.img);
    const [name, setName] = useState(data.name);
    const [theme, setTheme] = useState(data.theme);
    const [description, setDescription] = useState(data.description);
    const [horarios, setHorarios] = useState(data.horarios);
    const [ubication, setUbication] = useState(data.ubication);

    const deleteEvent = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/delete/remove.php', { id: data.id, type:'events' }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) {
                Alert.alert(
                    'Evento Finalizado',
                    "El evento ha sido eliminado con éxito.",
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => navigation.navigate('TabGroup'),
                        },
                    ],
                    { cancelable: false }
                );
            } else { console.log("Falló la eliminación del evento...", response.data.message); }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
        }
    }
    const questionDelete = () => {
        Alert.alert(
            "Confirmación necesaria",
            "¿Estás seguro que quieres eliminar este evento? Se perderá para siempre.",
            [
                {
                    text: "Cancelar",
                },
                {
                    text: "Confirmar",
                    onPress: () => deleteEvent()
                }
            ]
        );
    }

    const saveData = async () => {
        try {
            const formData = new FormData();
    
            // Agrega los datos del evento al FormData
            formData.append('id', data.id);
            formData.append('name', name);
            formData.append('theme', theme);
            formData.append('description', description);
            formData.append('horarios', horarios);
            formData.append('ubication', ubication);
    
            // Agrega la imagen solo si fue cambiada
            if (imageURI !== `http://192.168.100.2/API_Yogamap/assets/events/${data.img}`) {
                const fileName = imageURI.split('/').pop();
                formData.append('image', {
                    uri: imageURI,
                    name: fileName,
                    type: 'image/jpeg', // Cambia el tipo si es png u otro formato
                });
            }
    
            const response = await axios.post(
                'http://192.168.100.2/API_Yogamap/public/update/event.php',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            if (response.data.success) {
                Alert.alert(
                    '¡Evento Actualizado!',
                    'El evento ha sido actualizado con éxito.',
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => navigation.navigate('TabGroup'),
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Falló la actualización del evento...', response.data.message);
            }
        } catch (error) {
            console.log('Falló la conexión al servidor al intentar actualizar los eventos...', error);
        }
    };

    const clicSaveData = () => {
        if(name && theme && description && horarios && ubication){
            setStatus('');
            saveData();
        } else { setStatus("Todos los datos son obligatorios."); }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Editando Evento',
            headerRight: () => (
                <MaterialIcons 
                    name="delete"
                    size={24}
                    style={ styles.iconRight }
                    onPress={ questionDelete }
                />
            ),
        });
    }, [navigation]);

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
            console.log("URI: ", imageURI);
        } else {
            console.log('Usuario canceló la selección de imagen');
        }
    };

    return(
        <ScrollView style={styles.container}>
            <Pressable style={{ position: 'relative' }} onPress={ pickImage }>
                <Image source={{ uri: imageURI }} style={styles.image} />
                <View style={styles.filter}>
                    <MaterialIcons style={styles.iconFilter} name="add" size={48} color='#fff' />
                </View>
                { (imageURI != ("http://192.168.100.2/API_Yogamap/assets/events/" + data.img) || name != data.name || theme != data.theme || description != data.description || horarios != data.horarios || ubication != data.ubication) &&
                    <Text style={styles.notSave}>Cambios sin Guardar</Text>
                }
            </Pressable>
            <View style={styles.content}>
                <View style={styles.titleSector}>
                    <Text style={styles.label}>Nombre del Evento</Text>
                    <TextInput
                        placeholder="Nombre del Evento"
                        placeholderTextColor="#ffffff50"
                        style={styles.input}
                        onChangeText={(text) => {
                            console.log("Nombre actualizado a:", text);
                            setName(text);
                        }}
                        value={name}
                    />
                </View>
                <Text style={styles.label}>Temas del Evento</Text>
                <TextInput
                    placeholder="Temas del Evento"
                    placeholderTextColor="#ffffff50"
                    style={styles.input}
                    onChangeText={(text) => setTheme(text)}
                    value={theme}
                />
                <Text style={styles.label}>Descripción del Evento</Text>
                <TextInput
                    placeholder="Descripción del evento"
                    placeholderTextColor="#ffffff50"
                    multiline={true}
                    numberOfLines={10}
                    style={styles.textarea}
                    onChangeText={(text) => setDescription(text)}
                    value={description}
                />
                <Text style={styles.label}>Horario</Text>
                <TextInput
                    placeholder="20:30 a 21:30"
                    placeholderTextColor="#ffffff50"
                    style={styles.input}
                    onChangeText={(text) => setHorarios(text)}
                    value={horarios}
                />
                <Text style={styles.label}>Ubicación</Text>
                <TextInput
                    placeholder="Ubicación"
                    placeholderTextColor="#ffffff50"
                    style={styles.input}
                    onChangeText={(text) => setUbication(text)}
                    value={ubication}
                />
                { status &&
                    <Text style={styles.status}>{status}</Text>
                }
                <Pressable style={styles.btn} onPress={clicSaveData}>
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
    iconFilter: {
        backgroundColor: '#1A122E',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    notSave: {
        color: '#c80000',
        fontWeight: 'bold',
        position: 'absolute',
        top: 8,
        left: '30%',
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