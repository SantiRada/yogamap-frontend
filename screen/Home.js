import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { SearchBar } from './../components/SearchBar';

import { StatsProf } from './../components/StatsProf';
import { SliderEvent } from './../components/SliderEvent';
import { SliderFormaciones } from './../components/SliderFormaciones';

import { Banner } from './../components/Banner';
import { TypesOfYoga } from './../components/TypesOfYoga';

import { userData } from './../UserData';
import { profData } from './../ProfData';

import axios from 'axios';

import { ListNotification } from '../components/List/ListNotification';
import { useNavigation } from '@react-navigation/native';

const Top = createMaterialTopTabNavigator();

export function Home({ navigation }) {

    const navi = useNavigation();
    
    const [dataUser, setDataUser] = useState(null);
    const [dataProf, setDataProf] = useState(null);
    const [loading, setLoading] = useState(true);

    // Función para cargar datos del usuario y, si es necesario, los del profesor
    const fetchData = async () => {
        setLoading(true); // Indicamos que empieza a cargar
        try {
            const user = await userData();
            setDataUser(user);

            if (user?.idprof) {
                const prof = await profData();
                setDataProf(prof);
            } else {
                setDataProf(null); // Limpia los datos del profesor si no es profesor
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false); // Terminamos de cargar
    };

    // Ejecutamos fetchData cada vez que se monta el componente o cuando dataUser cambia
    useEffect(() => {
        fetchData();
    }, []);

    // Configurar el header de navegación
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Inicio',
            headerRight: () => (
                <MaterialIcons
                    name="settings"
                    size={24}
                    style={styles.iconRight}
                    onPress={() => navigation.navigate('Configuración')}
                />
            ),
            headerLeft: () => (
                <MaterialIcons
                    name="notifications"
                    size={24}
                    style={styles.iconLeft}
                    onPress={() => navigation.navigate('Notificaciones')}
                />
            ),
        });
    }, [navigation]);

    // Si está cargando, mostramos el indicador de carga
    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    // Renderizado condicional dependiendo si es profesor o no
    return (
        <View style={styles.container}>
            <SearchBar text="Buscar profe o Tipo de Yoga" />
            {dataUser?.idprof && dataProf ? (
                <View style={styles.containProf}>
                    <Top.Navigator
                        screenOptions={{
                            tabBarStyle: {
                                backgroundColor: '#1A122E',
                                elevation: 0,
                                shadowOpacity: 0,
                            },
                            tabBarLabelStyle: {
                                textTransform: 'capitalize',
                                fontSize: 16,
                            },
                            tabBarIndicatorStyle: {
                                height: 4,
                                borderRadius: 8,
                                backgroundColor: '#3C2C61',
                            },
                            tabBarActiveTintColor: '#fff',
                            tabBarInactiveTintColor: '#ccc',
                        }}
                    >
                        <Top.Screen name="Mis Eventos" component={SliderEvent} initialParams={{ idUser: dataUser.id, title: true }} />
                        <Top.Screen name="Mis Formaciones" component={SliderFormaciones} initialParams={{ idProf: dataProf.id, title:true }} />
                    </Top.Navigator>
                    <StatsProf id={dataProf.id} />
                </View>
            ) : (
                <View style={{ gap: 16 }}>
                    
                    {/* <Pressable onPress={() => navi.navigate('Onboarding')}><Text>On</Text></Pressable> */}
                    <Banner />
                    <TypesOfYoga />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        height: '100%',
        backgroundColor: '#1A122E',
    },
    iconLeft: {
        marginLeft: 16,
        color: '#E3D8FF',
    },
    iconRight: {
        marginRight: 16,
        color: '#E3D8FF',
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    containProf: {
        width: '100%',
        flex: 1,
    }
});
