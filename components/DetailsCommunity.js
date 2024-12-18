import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Pressable, ScrollView, Text, Image, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';
import { getProfID } from './../ProfData';

export function DetailsCommunity({ route }){
    const idUser = getProfID() ?? null;
    const { id } = route.params;
    const navigation = useNavigation();
    const [data, setData] = useState([]);

    useEffect(() => {
        const connection = async () => {
            try{
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/chat.php', { id, }, { headers: { 'Content-Type': 'application/json' } });
        
                if (response.data.success) {
                  if(response.data.chat){ setData(response.data.chat); }
                  else { setData([]); }
                }
              } catch(error){ console.log("Falló la conexión al servidor al intentar recuperar la comunidad...", error); }
        }

        connection();
    },[id]);

  const dataIcon = data['icon'] ? ('http://192.168.100.2/API_Yogamap/assets/prof/' + data['icon']) : "http://192.168.100.2/API_Yogamap/assets/icon.png";

    useLayoutEffect(() => {
        if(data['idProf'] == idUser){
            navigation.setOptions({
                title: data['name'],
                headerStyle: { backgroundColor: '#1A122E' },
                headerTitleStyle: { color: '#E3D8FF' },
                headerTintColor: '#E3D8FF',
                headerRight: () => (
                    <MaterialIcons 
                        name="edit"
                        size={24}
                        style={ styles.iconRight }
                        onPress={ () => { navigation.navigate('EditCommunity', { data }) } }
                    />
                ),
                headerLeft: () => (
                    <MaterialIcons 
                    name="arrow-back"
                    size={24}
                    style={ styles.iconLeft }
                    onPress={() => navigation.goBack() }
                />
                ),
            });   
        }else{
            navigation.setOptions({
                title: data['name'],
                headerStyle: { backgroundColor: '#1A122E' },
                headerTitleStyle: { color: '#E3D8FF' },
                headerTintColor: '#E3D8FF',
                headerLeft: () => (
                    <MaterialIcons 
                    name="arrow-back"
                    size={24}
                    style={ styles.iconLeft }
                    onPress={() => navigation.goBack() }
                />
                ),
            });
        }
    }, [navigation, data]);

    const handleQuitCommunity = () => {
        Alert.alert(
            "Confirmación necesaria",
            "Al confirmar, saldrás de esta comunidad y solo podrás escribir si la comunidad es pública.",
            [
                {
                    text: "Cancelar",
                },
                {
                    text: "Aceptar",
                    onPress: () => { QuitCommunity() }
                }
            ]
        );
    }

    const QuitCommunity = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/update/deletecommunity.php', { id: data['id'], idUser, newcount: data['countmembers'] }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) { navigation.navigate('TabGroup'); }
            else { console.log("ERROR: ", response.data.message); }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar el chat..." + error);
        }
    }

    return(
        <ScrollView style={ styles.container }>
            <View style={styles.stats}>
                <Image source={{ uri: dataIcon }} style={styles.image} />
                <Text style={styles.name}>{data['name']}</Text>
                <Text style={styles.members}>{data['countmembers']} miembros</Text>
            </View>
            <View style={styles.description}>
                <Text style={styles.title}>Descripción de la Comunidad</Text>
                <Text style={styles.descriptionText}>{data['description']}</Text>
            </View>
            <Pressable style={ styles.option } onPress={ handleQuitCommunity }>
                <MaterialIcons name="waving-hand" size={24} style={[ styles.icon, styles.red ]} />
                <View style={ styles.textContent }>
                    <Text style={[ styles.title, styles.red ]}>Salir de la Comunidad</Text>
                </View>
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
    iconLeft: { color: '#fff', marginRight: 16, }, 
    iconRight: { color: '#fff', },
    stats: {
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    members: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.5,
    },
    description: {
        backgroundColor: '#ffffff10',
        padding: 16,
        marginTop: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#ffffff60',
    },
    icon: {
        color: '#E3D8FF',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: 70,
        borderBottomColor: '#ffffff16',
        borderBottomWidth: 1,
        marginHorizontal: 24,
    },
    title: {
        color: '#E3D8FF',
        fontSize: 16,
    },
    subtitle: {
        color: '#E3D8FF',
        opacity: 0.4,
    },
    red: { color: 'red', }
});