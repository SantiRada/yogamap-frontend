import { useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import useColors from '../Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { BuscarClases } from './../components/BuscarClases';
import { BuscarFormaciones } from './../components/BuscarFormaciones';

const Top = createMaterialTopTabNavigator();

function TopTabBuscar(){

    const Colors = useColors();

    return(
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
            }}
        >
            <Top.Screen name="Buscar Clases" component={BuscarClases} />
            <Top.Screen name="Buscar Formaciones" component={BuscarFormaciones} />
        </Top.Navigator>
    );
}

export function Buscar({ navigation }){

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: '#E3D8FF',
            headerLeft: () => (
                <MaterialIcons 
                name="notifications"
                size={24}
                style={ styles.iconLeft }
                onPress={() => navigation.navigate('Notificaciones')}
            />
            ),
        });
    }, [navigation]);

    return(
        <View style={styles.container}>
            <TopTabBuscar />
        </View>
        
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
    },
    iconLeft: {
        color: Colors.headerIcons,
        marginLeft: 16,
    },
});