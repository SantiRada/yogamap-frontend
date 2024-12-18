import { StyleSheet, View, Image, Text } from 'react-native';

export function Times(){

    const countTimes = 0;

    return(
        <View style={styles.container}>
            {
                countTimes == 0 ?
                <View style={styles.voidFav}>
                    <Image source={require("./../assets/brand/times.png")} style={styles.image} />
                    <Text style={styles.voidText}>Cuando anotes clases con un profe o escuela, tus horarios de la semana aparecerán en esta sección.</Text>
                </View> :
                <View style={styles.containFav}>
                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 20, paddingVertical: 24, }}>[ Queda pendiente esta sección ]</Text>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A122E',
        flex: 1,
    },
    voidFav: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    image: {
        width: 138,
        height: 180,
        opacity: 0.6,
    },
    voidText: {
        color: '#ffffff50',
        textAlign: 'center',
        fontSize: 16,
        padding: 16,
    }
});