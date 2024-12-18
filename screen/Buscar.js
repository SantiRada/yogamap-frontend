import { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { BuscarClases } from './../components/BuscarClases';
import { BuscarFormaciones } from './../components/BuscarFormaciones';

const Top = createMaterialTopTabNavigator();

function TopTabBuscar(){
    return(
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
            <Top.Screen name="Buscar Clases" component={BuscarClases} />
            <Top.Screen name="Buscar Formaciones" component={BuscarFormaciones} />
        </Top.Navigator>
    );
}

export function Buscar({ navigation }){

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: '#1A122E' },
            headerTintColor: '#E3D8FF',
            headerLeft: () => (
                <MaterialIcons 
                name="notifications"
                size={24}
                style={ style.iconLeft }
                onPress={() => navigation.navigate('Notificaciones')}
            />
            ),
        });
    }, [navigation]);

    return(
        <View style={style.container}>
            <TopTabBuscar />
        </View>
        
    );
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A122E',
    },
    iconLeft: {
        color: '#E3D8FF',
        marginLeft: 16,
    },
});