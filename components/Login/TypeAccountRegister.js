import { StyleSheet, View, Text, Pressable } from 'react-native';
import { TitleRegister } from './TitleRegister';
import useColors from '../../Colors';

export function TypeAccountRegister({ advance, typeAccount, setTypeAccount }) {

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return (
        <View style={styles.container}>
            <TitleRegister />
            <View>
                <Text style={styles.question}>¿Qué tipo de cuenta deseas crear?</Text>
                <Text style={styles.aclaration}>Las cuentas de escuela pueden tener más de una ubicación.</Text>
                <View style={styles.content}>
                    <Pressable style={[styles.button, typeAccount == "Escuela / Organización" && styles.bg]} onPress={() => setTypeAccount('Escuela / Organización')}>
                        <Text style={styles.text}>Escuela / Organización</Text>
                    </Pressable>
                    <Pressable style={[styles.button, typeAccount == "Profesor Individual" && styles.bg]} onPress={() => setTypeAccount('Profesor Individual')}>
                        <Text style={styles.text}>Profesor Individual</Text>
                    </Pressable>
                    <Pressable style={[styles.button, typeAccount == "Organizador de Eventos" && styles.bg]} onPress={() => setTypeAccount('Organizador de Eventos')}>
                        <Text style={styles.text}>Organizador de Eventos</Text>
                    </Pressable>
                </View>
                {typeAccount && 
                    <Pressable style={styles.btn} onPress={advance}>
                        <Text style={styles.textBtn}>Continuar</Text>
                    </Pressable>
                }
            </View>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.background,
    },
    question: {
        fontSize: 18,
        color: Colors.text,
    },
    aclaration: {
        fontSize: 14,
        opacity: 0.5,
        color: Colors.text,
    },
    content: {
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#3C2C61',
        padding: 16,
        borderRadius: 8,
        marginVertical: 5,
    },
    bg: { backgroundColor: '#8C5BFF' },
    text: {
        color: '#fff',
        textAlign: 'center',
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
});
