import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, TextInput, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

import { getUserID } from './../../UserData';

export function EditPublicProfile({ route }) {
    const { type } = route.params;
    const nameContent = type == 'name' ? "Nombre de Usuario" : type == 'pass' ? "Contraseña" : "Correo Electrónico";

    const id = getUserID();

    const navigation = useNavigation();

    const [status, setStatus] = useState('');
    const [name, setName] = useState('');
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassTwo, setNewPassTwo] = useState('');

    useEffect(() => {
        const connection = async () => {
            try{
                const response = await axios.post(
                    'http://192.168.100.2/API_Yogamap/public/select/unique/users.php', { id: id },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                if(response.data.success) {
                    setName(response.data.users.name);
                    setMail(response.data.users.mail);
                }
                else { console.log("No se pudo encontrar al usuario...", response.data.message); }
            }catch(error){
                console.log("Falló la conexión para encontrar la información del usuario...", error);
            }
        }

        connection();
    }, [id]);

    const saveData = async () => {
        try{
            const formData = new FormData();

            formData.append('id', id);
            formData.append('pass', pass);

            if(type == 'name') { formData.append('name', name); }
            else if(type == 'pass') {
                formData.append('newPass', newPass);
                formData.append('newPassTwo', newPassTwo);
            }
            else if(type == 'mail'){ formData.append('mail', mail); }

            const response = await axios.post(
                'http://192.168.100.2/API_Yogamap/public/update/user.php',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if(response.data.success) { CompleteSaved(); }
            else {
                if(response.data.warn) { setStatus(response.data.warn); }
                else { console.log("No se logró modificar la info del usuario...", response.data.message); }
            }
        }catch(error){ console.log("Falló la conexión para editar el perfil público...", error); }
    }

    const CompleteSaved = () => {
        Alert.alert(
            "Perfil Editado",
            "Se ha editado con éxito tu perfil público",
            [
                {
                    text: "Aceptar",
                    onPress: () => { navigation.goBack(); }
                }
            ],
            { cancelable: false }
        )
    }

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Editar {nameContent}</Text>
            <Text style={styles.subtitle}>Para editar tu {nameContent} necesitas ingresar tu contraseña actual, esto evitará que tu información se pueda manipular por las personas incorrectas.</Text>
            <TextInput
                placeholder='Contraseña Actual'
                placeholderTextColor={'#ffffff50'}
                style={styles.input}
                onChangeText={setPass}
                value={pass}
                secureTextEntry
            />
            { type == 'name' ?
                <TextInput
                    placeholder='Nombre de Usuario'
                    placeholderTextColor={'#ffffff50'}
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                /> : type == 'pass' ?
                <View>
                    <TextInput
                        placeholder='Contraseña Nueva'
                        placeholderTextColor={'#ffffff50'}
                        style={styles.input}
                        onChangeText={setNewPass}
                        value={newPass}
                        secureTextEntry
                    />
                    <TextInput
                        placeholder='Repetir Contraseña Nueva'
                        placeholderTextColor={'#ffffff50'}
                        style={styles.input}
                        onChangeText={setNewPassTwo}
                        value={newPassTwo}
                        secureTextEntry
                    />
                </View> :
                <View>
                    <TextInput
                        placeholder='Correo Electrónico'
                        placeholderTextColor={'#ffffff50'}
                        style={styles.input}
                        onChangeText={setMail}
                        value={mail}
                    />
                </View>
            }
            { status &&
            <View style={styles.status}>
                <Text style={{color: '#ff0000', fontSize: 16, textAlign: 'center', }}>{status}</Text>
            </View>
            }
            <Pressable style={styles.btn} onPress={ () => { saveData() } }>
                <Text style={styles.btnText}>Guardar Cambios</Text>
            </Pressable>
        </View>
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
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#ffffff50',
        marginTop: 4,
        marginBottom: 24,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: 24,
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
    status:{
        padding: 16,
        width: '100%',
        borderRadius: 16,
        marginBottom: 16,
        justifyContent: 'center',
        backgroundColor: '#ff000020',
        alignItems: 'center'
    }
});