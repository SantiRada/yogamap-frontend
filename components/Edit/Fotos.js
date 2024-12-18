import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Text, Image, Alert, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

export function Fotos({ route }) {
    const { id } = route.params;

    const [loadingImages, setLoadingImages] = useState([]); // LAS IMAGENES CARGADAS PERO SIN ACTUALIZAR EN DATABASE
    const [allImages, setAllImages] = useState([]); // TODAS LAS IMAGENES DEL USUARIO CARGADAS

    const [status, setStatus] = useState(false); // SIRVE PARA SABER SI DEBE GUARDAR O YA GUARDÓ


    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/images.php', { id: id });

                if (response.data.success) {
                    if(response.data.images){ setAllImages(response.data.images); }
                    else { console.log("Se encontraron las imágenes pero está vacio"); }
                }
                else { console.log("Warn: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [id]);

    const askForPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitas conceder permiso para acceder a la galería.');
            return false;
        }
        return true;
    };

    const loadImages = async () => {
        const hasPermission = await askForPermissions();
        if (!hasPermission) return;

        let selecting = true;

        while (selecting) {
            try {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.75,
                });

                if (!result.canceled && result.assets && result.assets.length > 0) {
                    setStatus(true);
                    setLoadingImages((currentImages) => [...currentImages, result.assets[0].uri]);
                    setAllImages((currentImages) => [...currentImages, result.assets[0].uri]);
                } else {
                    selecting = false;  // Salir del bucle si el usuario cancela la selección
                }
            } catch (error) {
                console.error("Error al cargar imagen:", error);
                Alert.alert("Error", "Ocurrió un problema al cargar la imagen.");
                selecting = false;
            }
        }
    };

    const questionDeleteImage = (index) => {
        Alert.alert(
            "Confirmación Necesaria",
            "Si aceptas, esta imagen se eliminará de tu perfil público.",
            [ { text: "Cancelar" }, { text: "Aceptar", onPress: () => deleteImage(index) } ]
        )
    }

    const deleteOfDatabase = async (element) => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/delete/image.php', { id: id, img: element });

            if (response.data.success) { ToastAndroid.show('Imagen eliminada con éxito.', ToastAndroid.SHORT); }
            else { console.log("Warn: ", response.data.message); }
        } catch (error) { console.log("ERROR: ", error); }
    }

    const deleteImage = (element) => {

        if(loadingImages.includes(element)){
            const newLoading = loadingImages.filter(item => item !== element);
            setLoadingImages(newLoading);

            const newAll = allImages.filter(item => item !== element);
            setAllImages(newAll);
        } else {
            deleteOfDatabase(element);
            
            const newAll = allImages.filter(item => item !== element);
            setAllImages(newAll);
        }
        
        ToastAndroid.show('Imagen eliminada con éxito.', ToastAndroid.SHORT);
    };

    const saveImage = async () => {
        try {
            const formData = new FormData();
            formData.append('id', id);
   
            allImages.forEach((image, index) => {
                const fileName = image.split('/').pop();
                formData.append(`image-${index + 1}`, {
                    uri: image,
                    name: fileName,
                    type: 'image/jpeg',
                });
            });
   
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/insert/fotos.php', 
                formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 }
            );
   
            if (response.data.success) {
                setStatus(false);
                ToastAndroid.show('¡Imágenes cargadas con éxito!', ToastAndroid.SHORT);
            } else {
                console.log("ERROR:", response.data.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Hubo un problema al subir las imágenes.");
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Pressable style={styles.input} onPress={loadImages}>
                <Text style={styles.inputText}>Seleccionar imágenes</Text>
                <MaterialIcons name="attach-file" size={24} style={styles.icon} />
            </Pressable>
            <View style={[styles.toast, (allImages.length > 6 && styles.toastRed), (allImages.length == 6 && styles.toastOrange)]}>
                <Text style={styles.textToast}>{allImages.length}/6</Text>
            </View>

            <View style={styles.listImage}>
                {allImages.map((img, index) => (
                    <Pressable key={index} style={styles.btnImage} onPress={ () => questionDeleteImage(img) }>
                        <Image source={{ uri: img }} style={styles.img} />
                    </Pressable>
                ))}
            </View>

            { allImages.length > 0 && allImages.length <= 6 && status ?
                <Pressable style={styles.btn} onPress={ () =>  saveImage() }>
                    <Text style={styles.textBtn}>Guardar Cambios</Text>
                </Pressable> :
                <View style={styles.btnNot}>
                    <Text style={styles.textBtn}>Guardar Cambios</Text>
                </View>
            }
            { status &&
                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <Text style={styles.aclarationRed}>¡Hay cambios sin guardar!</Text>
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
    input: {
        backgroundColor: '#3C2C61',
        width: '100%',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    inputText: { color: '#ffffff50' },
    icon: {
        color: '#8C5BFF',
        position: 'absolute',
        top: '46%',
        right: 16,
    },
    listImage: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    btnImage: {
        width: 140,
        height: 78,
        marginBottom: 8,
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        marginVertical: 16,
    },
    btnNot: {
        backgroundColor: '#3C2C61',
        opacity: 0.5,
        borderRadius: 16,
        padding: 16,
        marginVertical: 16,
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    toast: {
        alignSelf: 'flex-end',
        backgroundColor: '#42d56b',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    toastOrange: { backgroundColor: '#d8a646' },
    toastRed: { backgroundColor: '#d54242' },
    textToast: { fontSize: 12 },
    aclarationRed: {
        fontSize: 14,
        color: '#ff000090',
        textAlign: 'center',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#ff000020',
    }
});
