import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import { TitleRegister } from './TitleRegister';
import useColors from '../../Colors';

export function UbicationRegister({ reverse, advance, ubication, setUbication }) {
    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return (
        <View style={styles.container}>
            <TitleRegister func={reverse} texting="Métodos de Pago y Comunidad" />
            <View>
                <Text style={styles.question}>Selecciona Ubicación</Text>
                <Text style={styles.aclaration}>De contar con más de un establecimiento, seleccionarlos separados por comas.</Text>
                <View style={styles.content}>
                    <TextInput
                        placeholder="Agregar Ubicación"
                        placeholderTextColor="#ffffff50"
                        style={styles.input}
                        onChangeText={setUbication}
                        value={ubication}
                    />
                </View>
                <Text style={{ color: '#aaa', textAlign: 'center', paddingTop: 40, paddingHorizontal: 48 }}>
                    Si no dictas clases presenciales, deja este campo vacío.
                </Text>
                <Pressable style={styles.btn} onPress={advance}>
                    <Text style={styles.textBtn}>Continuar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#1A122E',
    },
    question: {
        fontSize: 18,
        color: '#fff',
    },
    aclaration: {
        fontSize: 14,
        opacity: 0.5,
        color: '#fff',
    },
    btn: {
        backgroundColor: '#8C5BFF',
        height: 50,
        width: '100%',
        marginTop: 24,
        marginBottom: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textBtn: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#3C2C61',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        color: '#fff',
    },
});
