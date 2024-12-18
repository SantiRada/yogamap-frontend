import { View, StyleSheet, Image, Text } from 'react-native';

export function InfoApp(){
    const items = [ "Link de Invitación con un clic.", "Detección de comunidades activas para este perfil.", "" ];

    return(
        <View style={styles.container}>
            <Image source={require("./../../assets/brand/logo.png")} style={styles.image} />
            <Text style={styles.name}>Yogamap</Text>
            <Text style={styles.desc}>1.0.0 (Beta)</Text>
            <Text style={styles.title}>Última Actualización</Text>
            { items.map((item, index) => (
                <View key={index} style={styles.item}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.text}>{item}</Text>
                </View>
              ))
            }
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 72,
    },
    name: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    desc: {
        width: '100%',
        textAlign: 'center',
        fontSize: 16,
        color: '#ffffff50',
        paddingBottom: 24,
        borderBottomColor: '#ffffff50',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 16,
        color: '#fff',
        width: '100%',
        paddingBlock: 16,
        fontWeight: 'bold',
    },
    item: {
        width: '100%',
        paddingInline: 24,
        flexDirection: 'row',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 14,
        color: '#ffffff80',
        width: 15,
    },
    text: {
        fontSize: 14,
        color: '#ffffff80',
    }
});