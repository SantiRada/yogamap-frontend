import { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useColors from '../Colors';

import { InfoUser } from './../components/InfoUser';
import { Favs } from './../components/Favs';
import { Times } from './../components/Times';
import { Disponibilidad } from './../components/Disponibilidad';

import { getUserID, userData } from './../UserData';

export function Perfil({ navigation }) {

    const [userInfo, setUserInfo] = useState([]);
    const [selectedTab, setSelectedTab] = useState('Favoritos'); // Estado para la pestaña seleccionada
    const id = getUserID();

    useEffect(() => {
        const connectionUser = async () => {
            const prevUser = await userData();
            setUserInfo(prevUser);
        };

        connectionUser();
    }, []);

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    useLayoutEffect(() => {
        if (userInfo && userInfo.idprof) {
            navigation.setOptions({
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.text2 },
                headerTintColor: '#E3D8FF',
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
                        name="edit"
                        size={24}
                        style={styles.iconLeft}
                        onPress={() => navigation.navigate('EditProf', { id: userInfo.idprof })}
                    />
                ),
            });
        } else {
            navigation.setOptions({
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: Colors.text2 },
                headerTintColor: Colors.text2,
                headerRight: () => (
                    <MaterialIcons
                        name="settings"
                        size={24}
                        style={styles.iconRight}
                        onPress={() => navigation.navigate('Configuración')}
                    />
                ),
            });
        }
    }, [navigation, userInfo]);

    return (
        <View style={styles.container}>
            <InfoUser id={id} />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={selectedTab === 'Favoritos' ? styles.activeTab : styles.inactiveTab}
                    onPress={() => setSelectedTab('Favoritos')}
                >
                    <Text style={styles.tabText}>Favoritos</Text>
                </TouchableOpacity>
                {userInfo && userInfo.idprof && (
                    <TouchableOpacity
                        style={selectedTab === 'Tus Clases' ? styles.activeTab : styles.inactiveTab}
                        onPress={() => setSelectedTab('Tus Clases')}
                    >
                        <Text style={styles.tabText}>Tus Clases</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={selectedTab === 'Tus Horarios' ? styles.activeTab : styles.inactiveTab}
                    onPress={() => setSelectedTab('Tus Horarios')}
                >
                    <Text style={styles.tabText}>Tus Horarios</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            <ScrollView style={{ flexGrow: 1 }}  contentContainerStyle={{ flexGrow: 1 }}>
                {selectedTab === 'Favoritos' && <Favs />}
                {selectedTab === 'Tus Clases' && userInfo && userInfo.idprof && <Disponibilidad />}
                {selectedTab === 'Tus Horarios' && <Times />}
            </ScrollView>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: '4%',
        backgroundColor: Colors.background,
    },
    iconLeft: {
        color: Colors.headerIcons,
        marginLeft: 16,
    },
    iconRight: {
        color: Colors.headerIcons,
        marginRight: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: Colors.background,
    },
    activeTab: {
        flex: 1,
        paddingHorizontal: 4,
        justifyContent:"center",
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: Colors.text,
    },
    inactiveTab: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    tabText: {
        color: Colors.text,
        fontSize: 16,
        textTransform: 'capitalize',
    },
});
