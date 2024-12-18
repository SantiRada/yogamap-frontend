import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Pressable, Text } from 'react-native';

export function VoidChat(){

    const navigation = useNavigation();

    return(
        <View style={ styles.container }>
            <Text style={styles.text}>Únete a una comunidad para poder chatear desde esta sección</Text>
            <Pressable style={styles.btn} onPress={ () => { navigation.navigate("Buscar") } }>
                <Text style={styles.textBtn}>Buscar Comunidad</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    text: {
        textAlign: 'center',
        color: '#ffffff50',
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