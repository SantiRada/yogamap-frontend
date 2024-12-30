import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import useColors from '../../Colors';

export function VoidChat(){

    const navigation = useNavigation();
    const Colors = useColors()
    const styles = DynamicStyles(Colors);

    return(
        <View style={ styles.container }>
            <Text style={styles.text}>Únete a una comunidad para poder chatear desde esta sección</Text>
            <TouchableOpacity style={styles.btn} onPress={ () => { navigation.navigate("Buscar") } }>
                <Text style={styles.textBtn}>Buscar Comunidad</Text>
            </TouchableOpacity>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    text: {
        textAlign: 'center',
        color: Colors.placeholder,
        fontSize: 18,
        marginBottom: 32,
    },
    btn: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: '#8C5BFF',
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
});