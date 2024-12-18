import { StyleSheet, View, Text, Pressable } from 'react-native';
import { TitleRegister } from './TitleRegister';

export function TypeAccountRegister({ advance, typeAccount, setTypeAccount }) {
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

const styles = StyleSheet.create({
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
