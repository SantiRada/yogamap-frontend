import { useLayoutEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, TextInput, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export function EditProf({route}){
    const { id } = route.params;

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Editando Perfil Público',
            headerStyle: { backgroundColor: '#1A122E' },
            headerTitleStyle: { color: '#E3D8FF' },
            headerTintColor: '#E3D8FF',
        });
    }, [navigation]);

    return(
        <ScrollView style={styles.container}>
            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('DatosPersonales', { id: id }); } }>
                <MaterialIcons name="person" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Datos personales</Text>
                    <Text style={ styles.subtitle }>Información de tu cuenta y características</Text>
                </View>
            </Pressable>
            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Horarios', { id: id }); } }>
                <MaterialIcons name="calendar-today" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Horarios</Text>
                    <Text style={ styles.subtitle }>Horarios disponibles para cada día y tipo de yoga</Text>
                </View>
            </Pressable>
            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Fotos', { id: id }); } }>
                <MaterialIcons name="image" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Fotos</Text>
                    <Text style={ styles.subtitle }>Muestra tu establecimiento y cómo se dan las clases</Text>
                </View>
            </Pressable>
            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Precios', { id: id }); } }>
                <MaterialIcons name="attach-money" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Precios</Text>
                    <Text style={ styles.subtitle }>Muestra tus precios a los futuros practicantes</Text>
                </View>
            </Pressable>
            <Pressable style={ styles.option } onPress={ () => { navigation.navigate('Ubicacion', { id: id }); } }>
                <MaterialIcons name="location-pin" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Ubicación</Text>
                    <Text style={ styles.subtitle }>Muestra tus establecimientos y anuncia tus clases virtuales</Text>
                </View>
            </Pressable>
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
    icon: {
        color: '#E3D8FF',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        height: 65,
        borderBottomColor: '#ffffff16',
        borderBottomWidth: 1,
    },
    title: {
        color: '#E3D8FF',
        fontSize: 14,
    },
    subtitle: {
        color: '#E3D8FF',
        opacity: 0.4,
        fontSize: 12,
    },
});