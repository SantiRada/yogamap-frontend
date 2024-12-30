import { StyleSheet, View, Text, Image } from 'react-native';
import useColors from '../../Colors';

export function VoidEvent({voidData}) {

    const title = voidData ? "Parece que no hay eventos de este tipo" : "Todo está demasiado tranquilo...";
    const description = voidData ? "Intenta buscar algo más general, como una ciudad" : "Se paciente y llegarán más eventos";

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return (
        <View style={styles.container}>
            <View style={styles.event}>
        <Image source={{ uri: "http://192.168.100.2/API_Yogamap/assets/firstevent.png"}} style={styles.eventImage} />
        <View style={styles.filter}></View>
        <View style={styles.spaceText}>
            <Text style={styles.eventTitle}>{title}</Text>
            <Text style={styles.eventDesc}>{description}</Text>
        </View>
    </View>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        gap: 8,
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        color: "#fff",
        fontWeight: 'bold',
    },
    event: {
        position: 'relative',
        width: '100%',
    },
    eventImage: {
        width: '100%',
        height: 210,
        borderRadius: 8,
    },
    filter: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#00000060',
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    spaceText: {
        position: 'absolute',
        bottom: 16,
        left: 16,
    },
    eventTitle: {
        color: Colors.text,
        fontSize: 18,
    },
    eventDesc: {
        color: '#ffffffac',
    },
});
