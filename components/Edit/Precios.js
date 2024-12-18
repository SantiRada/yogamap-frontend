import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, TextInput, Text, Modal, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import axios from 'axios';

export function Precios({ route }){
    const { id } = route.params;

    const [types, setTypes] = useState(null);

    useEffect(() => {
        const connection = async () => {
            try{
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/typeofyogaperprof.php', { id: id });

                if(response.data.success) { setTypes(response.data.types); }
                else { console.log("Warn: ", response.data.message); }
            }catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [id]);

    const [prices, setPrices] = useState(null);
    const [update, setUpdate] = useState(true);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/prices.php', { id: id });

                if(response.data.success) {
                    setPrices(response.data.prices);
                    setUpdate(false);
                }
                else { console.log("Warning: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        if(update) { connection(); }
    }, [id, update]);

    const [modal, setModal] = useState(false);
    const [visible, setVisible] = useState(false);

    const closeModal = () => { setModal(false); }
    const openModal = () => { setModal(true); }

    const [selectType, setSelectType] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [count, setCount] = useState(1);

    const selectTypeOfYoga = (index) => {
        setSelectType(types[index]);
        openModal();
        setVisible(false);
    }

    const setNewPriceInput = (text) => {
        const newText = text.includes('$') ? text.replace('$', '') : text;

        setNewPrice(newText);
    }

    const savePrice = async () => {
        try {
            const response = await axios.post("http://192.168.100.2/API_Yogamap/public/insert/prices.php",
                {
                    id: id,
                    typeofyoga: selectType.id,
                    price: newPrice,
                    count: count,
                },
            );

            if(response.data.success) {
                ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
                closeModal();
                setCount(1);
                setNewPrice('');
                setSelectType(null);
                setVisible(false);
                setUpdate(true);
            } else { console.log("Warning New: ", response.data.message); }
        } catch (error) { console.log("ERROR: ", error); }
    }

    const questionDeletePrice = (index) => {
        Alert.alert(
            "Confirmación necesaria",
            "Al confirmar, se eliminará el precio seleccionado.",
            [
                {
                    text: "Cancelar",
                },
                {
                    text: "Confirmar",
                    onPress: () => deletePrice(index)
                }
            ],
        );
    }
    const deletePrice = async (index) => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/delete/remove.php', { id:index, type:'prices' });

            if(response.data.success) {
                ToastAndroid.show('¡Horario eliminado!', ToastAndroid.SHORT);
                setUpdate(true);
            } else { console.log(response.data.message); }
        } catch (error) { console.log("ERROR: ", error); }
    }

    return(
        <ScrollView style={styles.container}>
            <View style={styles.space}>
                <Text style={styles.aclaration}>Recuerda que solo puedes crear precios de tipos de yoga que hayas guardado previamente.</Text>
                <View style={styles.listPrices}>
                    { types && types.map((item, index) => (
                        <View>
                            <Pressable key={item.id} style={styles.optionTime} onPress={ () => selectTypeOfYoga(index)}>
                                <Text style={styles.optionTimeText}>{item.name}</Text>
                                <MaterialIcons name='add' size={24} color='#fff' />
                            </Pressable>
                            <View style={styles.listTogglesPrice}>
                                { prices && prices.filter(price => price.typeofyogaNAME == item.name).length > 0 &&
                                  prices.filter(price => price.typeofyogaNAME == item.name).map((price) => {
                                    let text;
                                    switch(price.count){
                                        case 1: text = "1 día: $" + price.price; break;
                                        case 2: text = "2 días: $" + price.price; break;
                                        case 3: text = "3 días: $" + price.price; break;
                                        case 4: text = "Libre: $" + price.price; break;
                                    }
                                    return (
                                        <Pressable style={styles.priceToggle} onPress={ () => questionDeletePrice(price.id) }>
                                            <Text style={styles.priceToggleText}>{text}</Text>
                                            <MaterialIcons name='close' size={18} color='#ff0000' />
                                        </Pressable>
                                  )})
                                }
                            </View>
                        </View>
                      ))
                    }
                </View>
            </View>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
                onRequestClose={() => {
                setModal(!modal);
                }}>
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.overlay} onPress={ () => closeModal() } />
                    <View style={styles.bottomSheet}>
                        <Pressable style={{paddingRight:8,paddingTop:8,alignSelf: 'flex-end'}} onPress={ () => closeModal() }>
                            <MaterialIcons name='close' size={24} color='#eee' />
                        </Pressable>
                        <View style={styles.content}>
                            <Text style={styles.title}>Agregar precios</Text>
                            <View style={styles.select}>
                                <Pressable style={styles.titleSelect} onPress={ () => setVisible(!visible) }>
                                    <Text style={styles.textSelect}>{selectType ? selectType.name : "Tipo de Yoga"}</Text>
                                    <MaterialIcons name={!visible ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color='#fff' />
                                </Pressable>
                                { visible &&
                                    <View style={styles.listOption}>
                                    { types &&
                                        types.map((item, index) => (
                                            <Pressable key={item.name} style={styles.option} onPress={ () => selectTypeOfYoga(index) }>
                                                <Text style={styles.textOption}>{item.name}</Text>
                                            </Pressable>
                                        ))
                                    }
                                    </View>
                                }
                            </View>
                            <View style={styles.listToggle}>
                                <Pressable style={[styles.toggle, count == 1 && {backgroundColor: '#8C5BFF'}]} onPress={ () => setCount(1) }>
                                    <Text style={[styles.toggleText, count == 1 ? {color: '#fff'} : {color: '#ffffff70'}]}>1 día</Text>
                                </Pressable>
                                <Pressable style={[styles.toggle, count == 2 && {backgroundColor: '#8C5BFF'}]} onPress={ () => setCount(2) }>
                                    <Text style={[styles.toggleText, count == 2 ? {color: '#fff'} : {color: '#ffffff70'}]}>2 días</Text>
                                </Pressable>
                                <Pressable style={[styles.toggle, count == 3 && {backgroundColor: '#8C5BFF'}]} onPress={ () => setCount(3) }>
                                    <Text style={[styles.toggleText, count == 3 ? {color: '#fff'} : {color: '#ffffff70'}]}>3 días</Text>
                                </Pressable>
                                <Pressable style={[styles.toggle, count == 4 && {backgroundColor: '#8C5BFF'}]} onPress={ () => setCount(4) }>
                                    <Text style={[styles.toggleText, count == 4 ? {color: '#fff'} : {color: '#ffffff70'}]}>Libre</Text>
                                </Pressable>
                            </View>
                            <View style={styles.listInput}>
                                <View style={styles.inputSector}>
                                    <TextInput
                                        style={styles.input}
                                        value={"$" + newPrice}
                                        placeholder="Precio"
                                        placeholderTextColor="#ffffffaa"
                                        onChangeText={ (text) => setNewPriceInput(text) }
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            { selectType && count && newPrice ?
                                <Pressable style={[styles.btn, {marginTop: -8}]} onPress={ () => savePrice() }>
                                    <Text style={styles.textBtn}>Crear Precio</Text>
                                </Pressable> :
                                <Pressable style={[styles.btn, {marginTop: -8, opacity: 0.35}]}>
                                    <Text style={styles.textBtn}>Crear Precio</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: '4%',
        paddingTop: 0,
        height: '100%',
        backgroundColor: '#1A122E',
    },
    aclaration: {
        color: '#fff',
        opacity: 0.5,
        fontSize: 12,
        textAlign: 'center',
        marginHorizontal: 32,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
    },
    textBtn: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    space: {
        paddingVertical: 16,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,
    },
    listPrices: {
        gap: 8,
        marginTop: 16,
    },
    optionTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#3C2C61',
        padding: 12,
    },
    optionTimeText: {
        color: '#fff',
        fontSize: 16,
    },
    listToggle: {
        flexDirection: 'row',
        gap: 8,
        width: '100%',
        marginBottom: 8,
    },
    toggle: {
        paddingVertical: 12,
        flexGrow: 1,
        flexShrink: 1,
        borderBottomColor: '#ffffff30',
        borderBottomWidth: 1,
        borderRadius: 12
    },
    toggleText: { textAlign: 'center' },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#00000050',
    },
    bottomSheet: {
        backgroundColor: '#281d46',
        padding: 16,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        elevation: 5,
        minHeight: '75%',
    },
    title: {
        color: '#fff',
        fontSize: 18,
    },
    listInput: {
        flexDirection: 'row',
        gap: 8,
    },
    inputSector: {
        width: '100%',
        flexShrink: 1,
        gap: 4,
    },
    input: {
        backgroundColor: '#3C2C61',
        width: '100%',
        flexShrink: 1,
        padding: 12,
        color: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 16,
    },
    option: {
        backgroundColor: '#3C2C61',
        padding: 12,
    },
    textOption: {
        color: '#ffffffdd',
        fontSize: 14,
    },
    content: { gap: 8 },
    select: { width: '100%' },
    titleSelect: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#3C2C61',
        padding: 12,
    },
    textSelect: {
        color: '#fff',
        fontSize: 16,
    },
    listTogglesPrice: {
        flexDirection: 'row',
        marginTop: 8,
        flexWrap: 'wrap',
    },
    priceToggle: {
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    priceToggleText: { color: '#fff' }
});