import { View, StyleSheet, Pressable, Text, Linking, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import useColors from '../../Colors';

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

    const Colors = useColors()
    const styles = DynamicStyles(Colors)

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

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        paddingTop: 0,
        height: '100%',
        backgroundColor: Colors.background,
    },
    iconLeft: {
        color: Colors.headerIcons,
        marginRight: 8,
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