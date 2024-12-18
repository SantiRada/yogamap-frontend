import { StyleSheet, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Banner(){

    const navigation = useNavigation();

    return(
        <Pressable style={styles.container} onPress={ () => { navigation.navigate('Buscar') } }>
            <Text style={styles.title}>Titulo del Banner</Text>
            <Text style={styles.subtitle}>Descripción del banner...</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({  
    container: {
        width: '108%',
        marginLeft: '-4%',
        aspectRatio: '16 / 7',
        backgroundColor: '#8C5BFF',
        gap: 8,
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
    },
    subtitle: {
        color: '#fff',
        opacity: 0.75,
        fontSize: 14,
    }
});