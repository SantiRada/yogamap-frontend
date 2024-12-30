import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Pressable, ScrollView, Text, Image, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useColors from '../Colors';

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
                const response = await axios.post('https://yogamap.com.ar/public/select/unique/chat.php', { id, }, { headers: { 'Content-Type': 'application/json' } });
        
                if (response.data.success) {
                  if(response.data.chat){ setData(response.data.chat); }
                  else { setData([]); }
                }
              } catch(error){ console.log("Falló la conexión al servidor al intentar recuperar la comunidad...", error); }
        }

        connection();
    },[id]);

  const dataIcon = data['icon'] ? ('https://yogamap.com.ar/assets/prof/' + data['icon']) : "https://yogamap.com.ar/assets/icon.png";

    const Colors = useColors()
    const styles = DynamicStyles(Colors);

    useLayoutEffect(() => {
        if(data['idProf'] == idUser){
            navigation.setOptions({
                title: data['name'],
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.text2 },
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
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.text2 },
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
            const response = await axios.post('https://yogamap.com.ar/public/update/deletecommunity.php', { id: data['id'], idUser, newcount: data['countmembers'] }, { headers: { 'Content-Type': 'application/json' } });
        
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

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        paddingTop:20
    },
    iconLeft: { color: Colors.headerIcons, marginRight: 16, }, 
    iconRight: { color: Colors.headerIcons, },
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
        color: Colors.text,
        marginBottom: 4,
    },
    members: {
        fontSize: 16,
        color:Colors.text,
        opacity: 0.5,
    },
    description: {
        backgroundColor: Colors.superLigthText,
        padding: 16,
        marginTop: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: Colors.ligthText,
    },
    icon: {
        color: Colors.headerIcons,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: 70,
        borderBottomColor: Colors.placeholder,
        borderBottomWidth: 1,
        marginHorizontal: 24,
    },
    title: {
        color: Colors.text2,
        fontSize: 16,
    },
    subtitle: {
        color: Colors.text2,
        opacity: 0.4,
    },
    red: { color: 'red', }
});