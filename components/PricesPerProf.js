import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export function PricesPerProf({ idProf }){

    const navigation = useNavigation();

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = (index) => {
        if(index == isVisible) { setIsVisible(null); }
        else { setIsVisible(index); }
    }

    const [types, setTypes] = useState([]); // TIPOS DE YOGA DEL PROFE
    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http:192.168.100.2/API_Yogamap/public/select/unique/typeofyogaperprof.php', { id: idProf });

                if (response.data.success) { setTypes(response.data.types); }
                else { console.log('Warning: ', response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [idProf]);

    const [prices, setPrices] = useState([]);
    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/prices.php', { id: idProf });

                if (response.data.success) { setPrices(response.data.prices); }
                else { console.log("Warn: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [idProf]);

    return(
        <View>
            { types && types.map((item, index) => {
                const iconArrow = (isVisible == index) ? "keyboard-arrow-up" : "keyboard-arrow-right";

                return (
                    <View>
                        <Pressable style={ styles.times } onPress={ () => toggleVisibility(index) }>
                            <View style={styles.leftContent}>
                                <MaterialIcons name="help" size={24} style={ styles.icon } />
                                <Text style={styles.name}>{item.name}</Text>
                            </View>
                            <MaterialIcons name={iconArrow} size={24} style={ styles.icon } />
                        </Pressable>
                        <View style={styles.listPrices}>
                            { isVisible == index && prices.filter(price => price.typeofyogaNAME == item.name).map((price, idx) => {
                                let count;

                                switch(price.count){
                                    case 1: count = "1 día"; break;
                                    case 2: count = "2 días"; break;
                                    case 3: count = "3 días"; break;
                                    case 4: count = "Libre"; break;
                                }
                                return (
                                    <View key={idx + price.id} style={styles.priceSector}>
                                            <Text style={[styles.time, { opacity: 0.5 }]}>{count}</Text>
                                        <Pressable style={styles.btn} onPress={ () => navigation.navigate('WayClass', { id: idProf, types: price.typeofyoga }) }>
                                            <Text style={styles.time}>${price.price}</Text>
                                        </Pressable>
                                    </View>
                                )})
                            }
                        </View>
                    </View>
                )
              })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    times: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,
    },
    icon: { color: '#fff', },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    name: {
        fontSize: 16,
        color: '#fff',
    },
    priceSector: {
        paddingVertical: 8,
        gap: 4,
    },
    btn: {
        backgroundColor: '#ffffff20',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexGrow: 1,
        flexBasis: 100,
        maxWidth: 115,
    },
    time: { color: '#fff' },
    listPrices: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    }
});