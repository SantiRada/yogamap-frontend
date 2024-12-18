import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, Text, Image, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { profData } from '../../ProfData';

export function DatosPersonales() {
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [icon, setIcon] = useState(null);
    const [typesOfYoga, setTypesOfYoga] = useState([]);
    const [typesAlumn, setTypesAlumn] = useState([]);
    const [allTypesOfYoga, setAllTypesOfYoga] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const connectionUser = async () => {
            const dataUser = await profData();
            setData(dataUser);
            setName(dataUser.name);
            setMail(dataUser.mail);
            if (dataUser.typesofyoga) {
                const typesYoga = dataUser.typesofyoga.split(',');
                setTypesOfYoga(typesYoga);
            } else {
                setTypesOfYoga([]);
            }
            setTypesAlumn(dataUser.typealumn || '');
        };
        connectionUser();
    }, []);

    useEffect(() => {
        const connectionTypes = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/TypesOfYoga.php', 
                    { count: 10 },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if (response.data.success) {
                    setAllTypesOfYoga(response.data.types || []);
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
            }
        };
        connectionTypes();
    }, []);

    const selectTypeOfYoga = useCallback((type) => {
        setTypesOfYoga((prev) => prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]);
    }, []);

    const selectAlumn = useCallback((type) => {
        setTypesAlumn((prev) => prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]);
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setIcon({
                uri: result.assets[0].uri,
                type: result.assets[0].type,
                name: result.assets[0].fileName,
            });
        } else {
            console.log('El usuario canceló la selección de imagen');
        }
    };

    const saveData = async () => {
        if (!name || !mail) {
            ToastAndroid.show('Por favor, completa todos los campos', ToastAndroid.LONG);
            return;
        }

        setLoading(true); // Iniciar el estado de carga

        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('name', name);
        formData.append('mail', mail);
        formData.append('typesofyoga', typesOfYoga.join(','));
        formData.append('typesalumn', typesAlumn.join(','));
        
        if (icon) { formData.append('icon', icon.uri); }

        try {
            const response = await axios.post(
                'http://192.168.100.2/API_Yogamap/public/update/prof/datospersonales.php', 
                formData,
            );

            if (response.data.success) {
                ToastAndroid.show('¡Datos Personales Actualizados!', ToastAndroid.LONG);
            } else {
                console.error(response.data.message);
                ToastAndroid.show('Error al guardar los cambios', ToastAndroid.LONG);
            }
        } catch (error) {
            console.error("Falló el guardado de Datos Personales...", error);
            ToastAndroid.show('Falló la conexión al servidor', ToastAndroid.LONG);
        } finally {
            setLoading(false); // Terminar el estado de carga
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Nombre de la Escuela/Profe</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Correo electrónico</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setMail}
                    value={mail}
                />
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Imagen del Perfil</Text>
                {icon ? (
                    <View style={styles.content}>
                        <Pressable onPress={pickImage} style={styles.input}>
                            <Text style={styles.textInput}>Imagen Seleccionada</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <MaterialIcons name='check' size={24} color='#22c74f' />
                                <MaterialIcons name='edit' size={24} color='#8C5BFF' />
                            </View>
                        </Pressable>
                        <View style={{ justifyContent: 'center' }}>
                            <Image source={{ uri: icon.uri }} style={styles.imgPreview} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.content}>
                        <Pressable onPress={pickImage} style={styles.input}>
                            <Text style={styles.textInput}>Seleccionar Imagen</Text>
                            <MaterialIcons name='attach-file' size={24} color='#8C5BFF' />
                        </Pressable>
                    </View>
                )}
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Tipos de Yoga</Text>
                <View style={styles.listChip}>
                    {allTypesOfYoga && allTypesOfYoga.map((item) => {
                        let select = typesOfYoga.includes(item.id);
                        return (
                            <Pressable key={item.id} style={[styles.chip, select && styles.select]} onPress={() => selectTypeOfYoga(item.id)}>
                                <Text style={styles.chipText}>{item.name}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Tipos de Alumnos</Text>
                <View style={styles.listChip}>
                    <Pressable style={[styles.chip, typesAlumn.includes("Niños") && styles.select]} onPress={() => selectAlumn("Niños")}>
                        <Text style={styles.chipText}>Niños</Text>
                    </Pressable>
                    <Pressable style={[styles.chip, typesAlumn.includes("Adultos") && styles.select]} onPress={() => selectAlumn("Adultos")}>
                        <Text style={styles.chipText}>Adultos</Text>
                    </Pressable>
                    <Pressable style={[styles.chip, typesAlumn.includes("Adultos Mayores") && styles.select]} onPress={() => selectAlumn("Adultos Mayores")}>
                        <Text style={styles.chipText}>Adultos Mayores</Text>
                    </Pressable>
                </View>
            </View>

            <Pressable style={styles.btn} onPress={saveData} disabled={loading}>
                <Text style={styles.textBtn}>{loading ? 'Guardando...' : 'Guardar Cambios'}</Text>
            </Pressable>
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
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: 24,
        color: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: { color: '#ffffff50' },
    listChip: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imgPreview: {
        width: 150,
        height: 150,
        borderWidth: 4,
        borderColor: '#8c5bff',
        borderRadius: 16,
    },
    chip: {
        color: '#fff',
        backgroundColor: '#3C2C61',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexShrink: 0,
        flexGrow: 1,
        maxWidth: 150,
    },
    chipText: {
        color: '#fff',
        textAlign: 'center',
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        marginTop: 24,
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    select: { backgroundColor: '#8C5BFF' },
});