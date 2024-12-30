import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useColors from '../../Colors';

export function Onboarding(){

    const navigation = useNavigation();

    const [space, setSpace] = useState(0);

    const prevSection = () => {
        const num = space - 1;
        setSpace(num);
    }

    const nextSection = () => {
        const num = space + 1;
        setSpace(num);
    }

    const Colors = useColors();
    const styles = DynamicStyles(Colors);

    return(
        <View style={styles.container}>
            {
                space == 0 ?
                <View style={styles.space}>
                    <Image source={{ uri: "https://yogamap.com.ar/assets/error404.png" }} style={styles.image} />
                    <Text style={styles.title}>Primera Pantalla</Text>
                    <Text style={styles.description}>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum...</Text>
                    <View style={styles.doubleButton}>
                        <Pressable style={[ styles.btn, { backgroundColor: Colors.ligthText } ]} onPress={ () => { navigation.navigate('TabGroup') } }>
                            <Text style={styles.textBtn}>Omitir</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, { backgroundColor: '#8C5BFF' } ]} onPress={ nextSection }>
                            <Text style={styles.textBtn}>Continuar</Text>
                        </Pressable>
                    </View>
                </View> :
                space == 1 ? 
                <View style={styles.space}>
                    <MaterialIcons name="arrow-back" size={24} color='#fff' style={styles.iconAbs} onPress={ prevSection } />
                    <Image source={{ uri: "https://yogamap.com.ar/assets/error404.png" }} style={styles.image} />
                    <Text style={styles.title}>Segunda Pantalla</Text>
                    <Text style={styles.description}>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum...</Text>
                    <View style={styles.doubleButton}>
                        <Pressable style={[ styles.btn, { backgroundColor: Colors.ligthText } ]} onPress={ () => { navigation.navigate('TabGroup') } }>
                            <Text style={styles.textBtn}>Omitir</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, { backgroundColor: '#8C5BFF' } ]} onPress={ nextSection }>
                            <Text style={styles.textBtn}>Continuar</Text>
                        </Pressable>
                    </View>
                </View> :
                <View style={styles.space}>
                    <MaterialIcons name="arrow-back" size={24} color='#fff' style={styles.iconAbs} onPress={ prevSection } />
                    <Image source={{ uri: "https://yogamap.com.ar/assets/error404.png" }} style={styles.image} />
                    <Text style={styles.title}>Tercera Pantalla</Text>
                    <Text style={styles.description}>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum...</Text>
                    <View style={styles.doubleButton}>
                        <Pressable style={[ styles.btn, { backgroundColor: Colors.ligthText } ]} onPress={ () => { navigation.navigate('TabGroup') } }>
                            <Text style={styles.textBtn}>Omitir</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, { backgroundColor: '#8C5BFF' } ]} onPress={ () => { navigation.navigate('TabGroup') } }>
                            <Text style={styles.textBtn}>Continuar</Text>
                        </Pressable>
                    </View>
                </View>
            }
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    iconAbs: {
        position: 'absolute',
        top: 32,
        left: 8,
    },
    container: {
        width: '100%',
        padding: '4%',
        height: '100%',
        backgroundColor: Colors.background,
        gap: 16,
    },
    space: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: (32+12),
    },
    title: {
        color: Colors.text,
        fontSize: 26,
        fontWeight: 'bold',
        marginHorizontal: 16,
        textAlign: 'center',
    },
    description: {
        color: Colors.text,
        opacity: 0.5,
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 32,
        marginTop: 16,
        marginBottom: 32,
    },
    doubleButton: {
        width: '100%',
        flexDirection: 'row',
        gap: 16,
        position: 'absolute',
        bottom: 64,
    },
    btn: {
        width: '48%',
        padding: 16,
        borderRadius: 16,
    },
    textBtn: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
});