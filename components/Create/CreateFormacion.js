import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useColors from '../../Colors';

import { StyleSheet, View, ScrollView, Image, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as ImagePicker from 'expo-image-picker';

export function CreateFormacion({ route }){
    const { id } = route.params;

    const navigation = useNavigation();

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    const imageBase = "https://yogamap.com.ar/assets/firstformacion.png";
    const [imageURI, setImageURI] = useState(imageBase);

    const [name, setName] = useState('');
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
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
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImageURI(result.assets[0].uri);
        } else {
            console.log('Usuario canceló la selección de imagen');
        }
    };

    const verifyData = () => {
        if(name == '' || theme == '' || description == '' || imageURI == imageBase){
            setStatus("Debes completar todos los datos para poder crear tu formación.");
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

            formData.append('id', id);
            formData.append('title', name);
            formData.append('description', description);
            formData.append('chips', theme);
            
            if (imageURI !== imageBase) {
                const fileName = imageURI.split('/').pop();
                formData.append('image', {
                    uri: imageURI,
                    name: fileName,
                    type: 'image/jpeg',
                });
            }

            console.log("FormData: ", formData);

            // Realiza la solicitud POST
            const response = await axios.post('https://yogamap.com.ar/public/insert/formacion.php', 
                formData, { headers: { 'Content-Type': 'multipart/form-data' } }
            );
    
            if (response.data.success) {
                Alert.alert(
                    '¡Formación Creada!',
                    'La formación ha sido creada con éxito.',
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => navigation.navigate('TabGroup'),
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Falló la creación de la formación: ', response.data.message);
            }
        } catch (error) {
            console.log('Falló la conexión al servidor al intentar crear la formación: ', error);
        }
    };

    return(
        <ScrollView style={styles.container}>
            <TouchableOpacity style={{ position: 'relative', marginBottom:20 }} onPress={ pickImage }>
                <Image source={{ uri: imageURI }} style={styles.image} />
                <View style={imageURI !== imageBase ? styles.edit : styles.filter}>
                    <MaterialIcons style={imageURI !== imageBase ? styles.iconEdit : styles.iconFilter} name={imageURI !== imageBase ? "edit" : "add"} color='#fff' />
                </View>
            </TouchableOpacity>
            <View style={styles.content}>
                <View style={styles.titleSector}>
                    <Text style={styles.label}>Nombre de la Formación</Text>
                    <TextInput
                        placeholder="Nombre de la Formación"
                        placeholderTextColor={Colors.placeholder}
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                    />
                </View>
                <Text style={styles.label}>Temas de la Formación</Text>
                <TextInput
                    placeholder="Hatha Yoga, Acroyoga, Aromaterapia..."
                    placeholderTextColor={Colors.placeholder}
                    style={styles.input}
                    onChangeText={setTheme}
                    value={theme}
                />
                <Text style={styles.label}>Descripción de la Formación</Text>
                <TextInput
                    placeholder="Descripción de la Formación"
                    placeholderTextColor={Colors.placeholder}
                    multiline={true}
                    numberOfLines={12}
                    style={styles.textarea}
                    onChangeText={setDescription}
                    value={description}
                />
                { status && <Text style={styles.status}>{status}</Text> }
                <TouchableOpacity style={styles.btn} onPress={ () => saveData() }>
                    <Text style={styles.btnText}>Crear Formación</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        gap: 16,
    },
    icon: { color: Colors.headerIcons, },
    iconRight: {
        color: Colors.headerIcon,
    },
    image:{
        width: '100%',
        height: 220,
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
        backgroundColor: Colors.inputBG,
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
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.inputBG,
        padding: 8,
        paddingLeft: 24,
        color: Colors.text,
        borderRadius: 8,
        marginBottom: 16,
    },
    textarea: {
        backgroundColor: Colors.inputBG,
        padding: 16,
        textAlignVertical: 'top',
        color: Colors.text,
        borderRadius: 8,
        marginBottom: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 24,
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