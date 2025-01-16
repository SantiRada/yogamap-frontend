import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Pressable, ScrollView, Text, ToastAndroid } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';
import useColors from '../../Colors';

import { InfoProf } from '../InfoProf';
import { PhotosProf } from '../PhotosProf';
import { SliderEvent } from '../SliderEvent';
import { TimesPerProf } from '../TimesPerProf';
import { PricesPerProf } from '../PricesPerProf';
import { SliderFormaciones } from '../SliderFormaciones';

import { FavItems } from '../FavItems';

import { getUserID } from './../../UserData';

export function ShowProf({ route }){
    const { id } = route.params;
    const [userID, setUserID] = useState(getUserID());

    const navigation = useNavigation();

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    const [data, setData] = useState([]);
    const [forms, setForms] = useState(null);
    const [prices, setPrices] = useState(null);
    const [events, setEvents] = useState(null);

    const [community, setCommunity] = useState(null);

    useEffect(() => {
        const connectionProf = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/unique/prof.php', { id }, { headers: { 'Content-Type': 'application/json' } });
            
                if (response.data.success) {
                    if(response.data.prof) { setData(response.data.prof[0]); }
                    else { setData([]); }
                }
              } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar la información del profe...");
            }
        };

        const connectionPrices = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/prices.php', { id: id });

                if (response.data.success) { setPrices(response.data.prices); }
                else { console.log("Warning: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        const connectionForms = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/formacionesperprof.php', { id: id });

                if (response.data.success) { setForms(response.data.forms); }
                else { console.log("Warning: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        const connectionEvents = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/eventFeed.php', { id: id });

                if (response.data.success) { setEvents(response.data.event); }
                else { console.log("Warning: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        const infoUser = async () => {
            const dataUser = await getUserID();
            setUserID(dataUser);
        }
    
        connectionProf();
        connectionForms();
        connectionPrices();
        connectionEvents();
        infoUser();

        return undefined;
    }, [id]);

    const solicitarAcceso = async () => {
        console.log("El usuario " + idUser + " ha solicitado acceso a la comunidad de " + data['name'] + "...");

        const title = "";
        const description = "";

        ToastAndroid.show('¡Solicitud enviada!', ToastAndroid.SHORT);

        try {
            const response = await axios.post('https://yogamap.com.ar/public/insert/notification.php',
                { idProf: id, idUser: userID, title: title, description: description }
            );
        } catch (error) { console.log("ERROR: ", error); }
    }

    const openCommunity = async () => {
        console.log("User: ", userID);
        console.log("Community: ", data);
        try {
            const response = await axios.post('https://yogamap.com.ar/public/select/communityperuser.php',
                { idUser: userID, idCom: data['community'] }
            );

            if(response.data.success) { setCommunity(response.data.community); }
            else { console.log("Warn: ", response.data.message); }
        } catch(error) { console.log("ERROR: ", error); }

        if(community){
            // YA TIENES ESTA COMUNIDAD EN TU LISTA
            navigation.navigate('ShowCommunity', { id: data['community'] });
        }else{
            // ERES NUEVO
            if(data['typecommunity'] == 1 || data['typecommunity'] == 3){
                // LA COMUNIDAD ES PRIVADA
                Alert.alert(
                    "Comunidad Privada",
                    "La comunidad de " + data['name'] + " es privada, ¿Quieres solicitar acceso?",
                    [
                        {
                            text: "Cancelar"
                        },
                        {
                            text: "Solicitar Acceso",
                            onPress: () => solicitarAcceso()
                        }
                    ]
                )
            }else{
                try {
                    const response = await axios.post('https://yogamap.com.ar/public/update/community.php',
                        { idUser: userID, idCom: data['community'] }
                    );
        
                    if(response.data.success) { navigation.navigate('ShowCommunity', { id: data['community'] }); }
                    else { console.log("Warn: ", response.data.message); }
                } catch(error) { console.log("ERROR: ", error); }
            }
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Detalles de Profe',
            headerStyle: { backgroundColor: Colors.background },
            headerTitleStyle: { color:Colors.text2 },
            headerTintColor:Colors.text2,
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 16, }}>
                    <MaterialIcons 
                        name="mark-unread-chat-alt"
                        size={24}
                        style={ styles.iconRight }
                        onPress={ () => { openCommunity() } }
                    />
                    <FavItems id={id} type="prof" />
                </View>
            ),
        });
    }, [navigation, id, data]);

    return(
        <ScrollView style={ styles.container }>
            <InfoProf size="max" id={id} />

            <Pressable style={styles.btn} onPress={ () => { navigation.navigate('WayClass', { id: id, types: data.typesofyogacomplete }) } }>
                <MaterialIcons name="calendar-today" size={16} style={ styles.icon } />
                <Text style={styles.textBtn}>Contactar</Text>
            </Pressable>

            { data && data.typesofyoga &&
                <View style={[styles.section, { borderTopColor: '#ffffff20', borderTopWidth: 16, }]}>
                    <Text style={styles.title}>Horarios Disponibles</Text>

                    <TimesPerProf all={data.typesofyogacomplete} idProf={id} />
                </View>
            }

            { data && data.img &&
                <View style={styles.section}>
                    <Text style={styles.title}>Fotos</Text>

                    <PhotosProf id={id} />
                </View>
            }

            { prices && prices.length > 0 &&
                <View style={[styles.section, { borderTopColor: '#ffffff20', borderTopWidth: 16, }]}>
                    <Text style={styles.title}>Precios</Text>

                    <PricesPerProf idProf={id} />
                </View>
            }

            { forms && forms.length > 0 &&
                <View style={styles.section}>
                    <Text style={[styles.title, { marginBottom: 4 }]}>Formaciones</Text>
                    <SliderFormaciones route={{ params: { idProf: id, title: false } }} />
                </View>
            }

            <View style={[styles.section, events && events.length <= 0 && { marginBottom: 24, borderBottomWidth: 0 }]}>
                <Text style={styles.title}>Ubicación</Text>
                { data && data.ubication ?
                    <Text>UBICACIÓN RENDERIZANDO...</Text> :
                    <Text style={{color: Colors.ligthText}}>Solo admite clases online</Text>
                }
            </View>

            { events && events.length > 0 &&
                <View style={styles.section}>
                    <Text style={[styles.title, { marginBottom: 4 }]}>Eventos</Text>
                    <SliderEvent route={{ params: { idProf: id, title: false } }} />
                </View>
            }
        </ScrollView>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        paddingTop: 16,
    },
    iconLeft: {
        marginRight: 8,
        color: Colors.headerIcons,
    },
    iconRight: {
        color: Colors.headerIcons,
    },
    icon: { color: Colors.headerIcons, },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        marginHorizontal: '4%',
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    section: {
        paddingVertical: 24,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 16,
        paddingHorizontal: '4%',
    },
    title: {
        color: Colors.text,
        fontWeight: 'bold',
        fontSize: 18,
    },
});