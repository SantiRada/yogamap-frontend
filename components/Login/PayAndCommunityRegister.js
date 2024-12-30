import { StyleSheet, View, Text, Pressable } from 'react-native';
import { TitleRegister } from './TitleRegister';
import useColors from '../../Colors';

export function PayAndCommunityRegister({ reverse, advance, pay, setPay, community, setCommunity }) {
    const handlePay = (id) => {
        setPay(prevPay => {
            if (prevPay.includes(id)) {
                return prevPay.filter(item => item !== id);
            } else {
                return [...prevPay, id];
            }
        });
    }
    
    const Colors = useColors();
    const styles = DynamicStyles(Colors);
    
    return (
        <View style={styles.container}>
            <TitleRegister func={reverse} texting="Imagen y Certificado" />
            <View>
                <Text style={styles.question}>Métodos de Pago</Text>
                <Text style={styles.aclaration}>¿Qué métodos de pago aceptas?</Text>
                <View style={styles.content}>
                    <Pressable style={[styles.option, pay.includes('efectivo') && styles.bg]} onPress={() => { handlePay('efectivo') }}>
                        <Text style={styles.optionText}>Efectivo</Text>
                    </Pressable>
                    <Pressable style={[styles.option, pay.includes('transferencia') && styles.bg]} onPress={() => { handlePay('transferencia') }}>
                        <Text style={styles.optionText}>Transferencia</Text>
                    </Pressable>
                    <Pressable style={[styles.option, pay.includes('credito') && styles.bg]} onPress={() => { handlePay('credito') }}>
                        <Text style={styles.optionText}>Crédito</Text>
                    </Pressable>
                    <Pressable style={[styles.option, pay.includes('debito') && styles.bg]} onPress={() => { handlePay('debito') }}>
                        <Text style={styles.optionText}>Débito</Text>
                    </Pressable>
                </View>
                <Text style={styles.question}>¿Quieres crear una comunidad?</Text>
                <Text style={styles.aclaration}>Esto creará un chat en el que solo tú podrás escribir y todos tus alumnos serán integrantes.</Text>
                <View style={styles.content}>
                    <Pressable style={[styles.option, community === true && styles.bg]} onPress={() => { setCommunity(true) }}>
                        <Text style={styles.optionText}>¡Por Supuesto!</Text>
                    </Pressable>
                    <Pressable style={[styles.option, community === false && styles.bg]} onPress={() => { setCommunity(false) }}>
                        <Text style={styles.optionText}>No</Text>
                    </Pressable>
                </View>
                {(pay.length > 0) && 
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
    content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        marginBottom: 24,
    },
    option: {
        maxWidth: '34%',
        flexBasis: '30%',
        flexGrow: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#3C2C61',
        borderRadius: 8,
    },
    bg: { backgroundColor: '#8C5BFF', },
    optionText: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
});
