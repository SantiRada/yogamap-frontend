import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import axios from 'axios';
import { TitleRegister } from './TitleRegister';

export function TypeYogaAndClientRegister({ reverse, advance, typeYoga, setTypeYoga, typeAlumn, setTypeAlumn }) {
    const [data, setData] = useState([]);
    const count = 10;

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/TypesOfYoga.php', { count }, { headers: { 'Content-Type': 'application/json' } });
                if (response.data.success) {
                    if (response.data.types) {
                        setData(response.data.types);
                    } else {
                        setData([]);
                    }
                }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los tipos de yoga...");
            }
        };
        connection();
    }, []);

    const handleTypeYoga = (id) => {
        setTypeYoga(prevYoga => {
            if (prevYoga.includes(id)) {
                return prevYoga.filter(item => item !== id);
            } else {
                return [...prevYoga, id];
            }
        });
    }

    const handleTypeAlumn = (id) => {
        setTypeAlumn(prevAlumn => {
            if (prevAlumn.includes(id)) {
                return prevAlumn.filter(item => item !== id);
            } else {
                return [...prevAlumn, id];
            }
        });
    }

    return (
        <View style={styles.container}>
            <TitleRegister func={reverse} texting="Tipo de Cuenta" />
            <View>
                <Text style={styles.question}>Selecciona los tipos de Yoga</Text>
                <Text style={styles.aclaration}>Puedes seleccionar más de una opción.</Text>
                <View style={styles.content}>
                    {data && 
                        data.map((item, index) => {
                            const selected = typeYoga.includes(item.id) ? true : false;
                            return (
                                <Pressable key={`yoga-${index}`} style={[styles.option, selected && styles.bg]} onPress={() => { handleTypeYoga(item.id) }}>
                                    <Text style={styles.optionText}>{item.name}</Text>
                                </Pressable>
                            );
                        })
                    }
                </View>
                <Text style={styles.question}>Selecciona tipos de practicantes</Text>
                <Text style={styles.aclaration}>Puedes seleccionar más de una opción.</Text>
                <View style={styles.content}>
                    <Pressable key="alumn-ninos" style={[styles.option, {flexBasis: '48%',maxWidth:'49%'}, typeAlumn.includes('Niños') && styles.bg]} onPress={() => { handleTypeAlumn('Niños') }}>
                        <Text style={styles.optionText}>Niños</Text>
                    </Pressable>
                    <Pressable key="alumn-adultos" style={[styles.option, {flexBasis: '48%',maxWidth:'49%'}, typeAlumn.includes('Adultos') && styles.bg]} onPress={() => { handleTypeAlumn('Adultos') }}>
                        <Text style={styles.optionText}>Adultos</Text>
                    </Pressable>
                    <Pressable key="alumn-mayores" style={[styles.option, {flexBasis: '48%',maxWidth:'49%'}, typeAlumn.includes('Adultos Mayores') && styles.bg]} onPress={() => { handleTypeAlumn('Adultos Mayores') }}>
                        <Text style={styles.optionText}>Adultos Mayores</Text>
                    </Pressable>
                </View>
                {(typeYoga.length > 0 && typeAlumn.length > 0) && 
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
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 8,
        marginBottom: 16,
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
