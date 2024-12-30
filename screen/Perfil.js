import { useLayoutEffect, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useColors from '../Colors'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { InfoUser } from './../components/InfoUser';
import { Favs } from './../components/Favs';
import { Times } from './../components/Times';
import { Disponibilidad } from './../components/Disponibilidad';

import { getUserID, userData } from './../UserData';

const Top = createMaterialTopTabNavigator();

export function Perfil({ navigation }){

    const [userInfo, setUserInfo] = useState([]);
    const id = getUserID();

    useEffect(() => {
        const connectionUser = async () => {
            const prevUser = await userData();
            setUserInfo(prevUser);
        }

        connectionUser();
    }, []);

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    useLayoutEffect(() => {
        // Configurar opciones de navegación según la existencia de idprof en userInfo
        if (userInfo && userInfo.idprof) {
            navigation.setOptions({
                headerStyle: { backgroundColor: Colors.background },
                headerTitleStyle: { color: '#E3D8FF' },
                headerTintColor: '#E3D8FF',
                headerRight: () => (
                    <MaterialIcons 
                        name="settings"
                        size={24}
                        style={ styles.iconRight }
                        onPress={() => navigation.navigate('Configuración')}
                    />
                ),
                headerLeft: () => (
                    <MaterialIcons 
                        name="edit"
                        size={24}
                        style={ styles.iconLeft }
                        onPress={() => navigation.navigate('EditProf', { id: userInfo.idprof }) }
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
                        style={ styles.iconRight }
                        onPress={() => navigation.navigate('Configuración')}
                    />
                ),
            });
        }
    }, [navigation, userInfo]);



    return(
        <View style={styles.container}>
            <InfoUser id={id} />

            <Top.Navigator
                screenOptions={{

                    tabBarStyle: {
                        backgroundColor: Colors.background,
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
                    tabBarActiveTintColor: Colors.text,
                    tabBarInactiveTintColor: Colors.placeholder,
                    tabBarItemStyle:{ width: 130, },
                    tabBarScrollEnabled: true,
                }}
            >
                <Top.Screen name="Favoritos" component={Favs} />
                { userInfo && userInfo.idprof && <Top.Screen name="Tus Clases" component={Disponibilidad} /> }
                <Top.Screen name="Tus Horarios" component={Times} />
            </Top.Navigator>
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
});