import { useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, ScrollView, Text, Image, Alert, Pressable } from 'react-native';
import axios from 'axios';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function ShowNotification({route}){

    const { data } = route.params;

    const navigation = useNavigation();

    useEffect(() => {
        if(data.viewed != 1){
            const connection = async () => {
                try{
                    const response = await axios.post('http://192.168.100.2/API_Yogamap/public/update/viewed.php', { id: data.id }, { headers: { 'Content-Type': 'application/json' } });
                    
                    if (response.data.success) { console.log("Viewed change"); }
                    else { console.log("NOT CHANGED VIEWED"); }
                }catch(error){
                    console.log("Falló la conexión al servidor al cambie la visualización de una notificación...", error);
                }
            }
            
            connection();
        }
    }, []);

    const showAlert = () => {
        Alert.alert(
            "Confirmas eliminarla",
            "¿Estás seguro que quieres eliminar esta notificación? Se perderá para siempre.",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancelando"),
                },
                {
                    text: "Aceptar",
                    onPress: () => console.log("OK Pressed")
                }
            ]
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Detalles de Notificación',
            headerStyle: { backgroundColor: '#1A122E' },
            headerTitleStyle: { color: '#E3D8FF' },
            headerTintColor: '#E3D8FF',
            headerRight: () => (
                <MaterialIcons 
                    name="delete"
                    size={24}
                    style={ styles.iconRight }
                    onPress={ () => { showAlert() } }
                />
            ),
        });
    }, [navigation]);

    const confirmNotification = () => {
        console.log("Confirmar Solicitud");
    }

    const handleConfirm = () => {
        Alert.alert(
            "Confirmación Necesaria",
            "Al confirmar la solicitud, el practicante recibirá una notificación de aviso.",
            [
                {
                    text: "Volver",
                },
                {
                    text: "Confirmar",
                    onPress: () => { confirmNotification(); }
                }
            ]
        );
    };
    const handleCancel = () => {
        Alert.alert(
            "Confirmación Necesaria",
            "Si cancelas la solicitud, el practicante recibirá una notificación de aviso.",
            [
                {
                    text: "Volver",
                },
                {
                    text: "Cancelar Solicitud",
                    onPress: () => { confirmNotification(); }
                }
            ]
        );
    };

    const renderContent = () => {
        const lines = data.content.split('\n');
        return lines.map((line, index) => {
            const buttonMatch = line.match(/\[(.*?)\]/);
            if (buttonMatch) {
                const buttonText = buttonMatch[1];
                const lineWithoutButton = line.replace(buttonMatch[0], '');

                return (
                    <View key={index}>
                        <Text style={styles.text}>{lineWithoutButton}</Text>
                        {buttonText === 'CONFIRMAR' && (
                            <Pressable style={styles.btn} onPress={handleConfirm}>
                                <Text style={styles.textBtn}>Confirmar Solicitud</Text>
                            </Pressable>
                        )}
                        {buttonText === 'CANCELAR' && (
                            <Pressable style={styles.btnZero} onPress={handleCancel}>
                                <Text style={styles.textBtn}>Cancelar Solicitud</Text>
                            </Pressable>
                        )}
                    </View>
                );
            } else {
                if (line.trim() === "") { return <Text key={index} style={styles.emptyLine}>.</Text>; }
                if (line.startsWith("¡Felicidades")) { return <Text key={index} style={styles.title}>{line}</Text>; }
                
                const colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    const beforeColon = line.substring(0, colonIndex + 1);
                    const afterColon = line.substring(colonIndex + 1).trim();
                    return (
                        <Text key={index} style={styles.text}>
                            {beforeColon}
                            <Text style={styles.afterText}> {afterColon}</Text>
                        </Text>
                    );
                }

                return <Text key={index} style={styles.text}>{line}</Text>;
            }
        });
    };

    return(
        <ScrollView style={styles.container}>
            <View style={styles.content}>
            {renderContent()}
            <Text style={styles.italicText}>¡Gracias por tu atención!</Text>
            </View>
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
    iconRight: {
        marginRight: 16,
        color: '#E3D8FF',
    },
    content: { paddingVertical: 16, },
    title: {
        color: '#fff',
        opacity: 0.85,
        lineHeight: 28,
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        color: '#fff',
        opacity: 0.85,
        lineHeight: 24,
        fontSize: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 8,
        padding: 16,
        marginBottom: -12,
        marginTop: -24,
    },
    btnZero: {
        borderWidth: 3,
        borderColor: '#3C2C61',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    textBtn: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
        lineHeight: 28,
    },
    italicText: {
        fontStyle: 'italic',
        color: '#fff',
        fontSize: 16,
        marginTop: 8,
    },
    emptyLine: {
        lineHeight: 16,
        color: '#ffffff00',
    },
    afterText: {
        fontWeight: 'bold',
        color: '#bca0ff',
        fontSize: 16,
        lineHeight: 28,
    }
});