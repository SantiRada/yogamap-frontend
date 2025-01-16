import { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { SearchBar } from './../components/SearchBar';
import { StatsProf } from './../components/StatsProf';
import { SliderEvent } from './../components/SliderEvent';
import { SliderFormaciones } from './../components/SliderFormaciones';
import { Banner } from './../components/Banner';
import { TypesOfYoga } from './../components/TypesOfYoga';

import { userData } from './../UserData';
import { profData } from './../ProfData';
import useColors from '../Colors';

export function Home({ navigation }) {
    const [dataUser, setDataUser] = useState(null);
    const [dataProf, setDataProf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('Mis Eventos'); // Estado para rastrear la pestaña seleccionada

    const fetchData = async () => {
        setLoading(true);
        try {
            const user = await userData();
            setDataUser(user);

            if (user?.idprof) {
                const prof = await profData();
                setDataProf(prof);
            } else {
                setDataProf(null);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
            <SearchBar text="Buscar profe o Tipo de Yoga" />
            {dataUser?.idprof && dataProf ? (
                <View style={styles.containProf}>
                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={selectedTab === 'Mis Eventos' ? styles.activeTab : styles.inactiveTab}
                            onPress={() => setSelectedTab('Mis Eventos')}
                        >
                            <Text style={styles.tabText}>Mis Eventos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={selectedTab === 'Mis Formaciones' ? styles.activeTab : styles.inactiveTab}
                            onPress={() => setSelectedTab('Mis Formaciones')}
                        >
                            <Text style={styles.tabText}>Mis Formaciones</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    {selectedTab === 'Mis Eventos' && <SliderEvent idUser={dataUser.id} title={true} />}
                    {selectedTab === 'Mis Formaciones' && <SliderFormaciones idProf={dataProf.id} title={true} />}

                    <StatsProf id={dataProf.id} />
                </View>
            ) : (
                <View style={{ gap: 16 }}>
                    <Banner />
                    <TypesOfYoga />
                </View>
            )}
        </ScrollView>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        backgroundColor: Colors.background,
        zIndex: 0,
    },
    iconLeft: {
        marginLeft: 16,
        color: Colors.headerIcons,
    },
    iconRight: {
        marginRight: 16,
        color: Colors.headerIcons,
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
    containProf: {
        width: '100%',
        flexGrow: 1,
        paddingBottom: 36,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.background,
    },
    activeTab: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: Colors.text,
    },
    inactiveTab: {
        flex: 1,
        padding: 12,
        alignItems: 'center',

    },
    tabText: {
        color: Colors.text,
        fontSize: 16,
        textTransform: 'capitalize',
    },
});
