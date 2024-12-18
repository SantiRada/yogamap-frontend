import { View, StyleSheet, Pressable, Text, Linking, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export function Ayuda(){

    const navigation = useNavigation();

    const openTyC = async () => {
        const url = 'https://yogamap.com.ar/tyc.php';
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede abrir el enlace: ' + url);
        }
    }

    return(
        <View style={styles.container}>
            <Pressable style={ styles.option } onPress={ () => openTyC() }>
                <MaterialIcons name="attach-file" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Términos y condiciones</Text>
                </View>
            </Pressable>

            <Pressable style={ styles.option } onPress={ () => navigation.navigate("InfoApp") }>
                <MaterialIcons name="help" size={24} style={ styles.icon } />
                <View style={ styles.textContent }>
                    <Text style={ styles.title }>Info. de la aplicación</Text>
                </View>
            </Pressable>
        </View>
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
    iconLeft: {
        color: '#E3D8FF',
        marginRight: 8,
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