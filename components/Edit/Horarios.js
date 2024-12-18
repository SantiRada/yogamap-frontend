import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Pressable, Modal, TouchableOpacity, Text, TextInput, ToastAndroid, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { profData } from './../../ProfData';
import axios from 'axios';

export function Horarios({ route }){
    const { id } = route.params;
    const [horarios, setHorarios] = useState([]); // INFORMACIÓN DE LOS HORARIOS EN OBJETOS
    const [types, setTypes] = useState([]); // INFORMACIÓN DE LOS TIPOS DE YOGA DE ESTE PROFE
    const [update, setUpdate] = useState(true); // SIRVE PARA SABER SI HAY QUE ACTUALIZAR LOS HORARIOS

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/typeofyogaperprof.php', { id: id });

                if(response.data.success) { setTypes(response.data.types); }
                else { console.log("Warning: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [id]);

    useEffect(() => {
        const horariosLoad = async () => {
            try {
                const response = await axios.post("http://192.168.100.2/API_Yogamap/public/select/horarios.php", { id: id });

                if (response.data.success) {
                    ToastAndroid.show('¡Horarios Actualizados!', ToastAndroid.SHORT);
                    setHorarios(response.data.horarios);
                    setUpdate(false);
                } else { console.log("Warn: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        if(update) { horariosLoad(); }
    }, [id, update]);

    const [modal, setModal] = useState(false);
    const [day, setDay] = useState(null);

    const closeModal = () => { setModal(false); }
    const openModal = (type) => {
        setModal(true);
        setDay(type);
    }

    /* -- HORARIOS & SELECT -- */
    const [horarioInicio, setHorarioInicio] = useState('');
    const [horarioFin, setHorarioFin] = useState('');
    const [select, setSelect] = useState(''); // NOMBRE DEL TIPO DE YOGA SELECCIONADO
    const [selectID, setSelectID] = useState(null); // ID DEL TIPO DE YOGA SELECCIONADO
    const [visible, setVisible] = useState(false);
    const selectType = (index) => {
        setSelect(types[index].name);
        setSelectID(types[index].id);
        setVisible(false);
    }

    const startTimeSetter = (text) => { setHorarioInicio(formattedContentTime(text)); }
    const endTimeSetter = (text) => { setHorarioFin(formattedContentTime(text)); }

    const formattedContentTime = (input) => {
        const sanitizedInput = input.replace(/[^0-9]/g, '').slice(0, 4);
    
        let formattedTime = sanitizedInput;
        if (sanitizedInput.length >= 3) { formattedTime = `${sanitizedInput.slice(0, 2)}:${sanitizedInput.slice(2)}`; }

        return formattedTime;
    };

    const questionDeleteTime = (index) => {
        Alert.alert(
            "Confirmación necesaria",
            "Al confirmar, se eliminará el horario seleccionado.",
            [
                {
                    text: "Cancelar",
                },
                {
                    text: "Confirmar",
                    onPress: () => deleteTime(index)
                }
            ],
        );
    }
    const deleteTime = async (index) => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/delete/remove.php', { id:index, type:'horarios' });

            if(response.data.success) {
                ToastAndroid.show('¡Horario eliminado!', ToastAndroid.SHORT);
                setUpdate(true);
            } else { console.log(response.data.message); }
        } catch (error) { console.log("ERROR: ", error); }
    }

    const createTime = async () => {
        try{

            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/insert/horarios.php',
                {
                    id: id,
                    startTime: horarioInicio,
                    endTime: horarioFin,
                    day: day,
                    typeofyoga: selectID
                },
            );

            if(response.data.success){
                ToastAndroid.show('¡Horario creado con éxito!', ToastAndroid.SHORT);

                setDay(null);
                setSelect('');
                setSelectID(null);
                setHorarioFin('');
                setHorarioInicio('');
                setVisible(false);
                setModal(false);
                setUpdate(true);
            } else { console.log("Falló la carga de horarios: ", response.data.message); }
        }catch(error) { console.log("ERROR: ", error); }
    }

    const days = [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" ];

    return(
        <ScrollView style={styles.container}>
            <View style={[ styles.space, { gap: 16 } ]}>
                <Text style={styles.aclaration}>Recuerda guardar los tipos de Yoga en el paso anterior para poder modificar los horarios.</Text>
                { days.map((day, index) => (
                    <View key={day}>
                        <Pressable key={day} style={styles.optionTime} onPress={ () => openModal(index) }>
                            <Text style={styles.optionTimeText}>{day}</Text>
                            <MaterialIcons name="add" size={24} color='#fff' />
                        </Pressable>
                        <View>
                            { types && types.length > 0 &&
                                types.map((item) => (
                                    horarios.filter(times => (times.typeofyogaNAME == item.name && times.day == index)).length > 0 &&
                                    <View key={item.name + "00"} style={styles.itemTypes}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <View style={styles.listTimes}>
                                            { horarios &&
                                                horarios.filter(times => (times.typeofyogaNAME == item.name && times.day == index)).map((time) => (
                                                    <Pressable key={time.id} style={styles.times} onPress={ () => questionDeleteTime(time.id) }>
                                                        <Text style={styles.timesText}>{time.horas}</Text>
                                                        <MaterialIcons name="close" size={24} color='#ff000050' />
                                                    </Pressable>
                                                ))
                                            }
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                  ))
                }
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
                            <Text style={styles.title}>Agregar horario el <Text style={{fontWeight:'bold'}}>{days[day]}</Text></Text>
                            <View style={styles.select}>
                                <Pressable style={styles.titleSelect} onPress={ () => setVisible(!visible) }>
                                    <Text style={styles.textSelect}>{select ? select : "Tipo de Yoga"}</Text>
                                    <MaterialIcons name={!visible ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color='#fff' />
                                </Pressable>
                                { visible &&
                                    <View style={styles.listOption}>
                                    { types ?
                                        types.map((item, index) => (
                                            <Pressable key={item.name} style={styles.option} onPress={ () => selectType(index) }>
                                                <Text style={styles.textOption}>{item.name}</Text>
                                            </Pressable>
                                        )) :
                                        <Text style={[styles.aclaration, {paddingVertical: 16,fontSize:14}]}>Antes de crear horarios, debes marcar en "Datos Personales" qué Tipos de Yoga das.</Text>
                                    }
                                    </View>
                                }
                            </View>
                            <View style={styles.listInput}>
                                <View style={styles.inputSector}>
                                    <Text style={styles.timeInput}>Hora de Inicio</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="00:00"
                                        placeholderTextColor="#ffffffaa"
                                        value={horarioInicio}
                                        onChangeText={ startTimeSetter }
                                        maxLength={5}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.inputSector}>
                                    <Text style={styles.timeInput}>Hora de Fin</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="00:00"
                                        placeholderTextColor="#ffffffaa"
                                        value={horarioFin}
                                        onChangeText={ endTimeSetter }
                                        maxLength={5}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <Pressable style={[styles.btn, {marginTop: -8}]} onPress={ () => createTime() }>
                                <Text style={styles.textBtn}>Crear Horario</Text>
                            </Pressable>
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
    space: {
        paddingVertical: 16,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,
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
        fontSize: 24,
        textAlign: 'center',
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
    option: {
        backgroundColor: '#3C2C61',
        padding: 12,
    },
    textOption: {
        color: '#ffffffdd',
        fontSize: 14,
    },
    timeInput: {
        color:'#ffffff50',
    },
    listTimes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 8
    },
    itemTypes: { padding: 0 },
    name: {
        color: '#ffffff50',
        fontSize: 16,
        marginTop: 8
    },
    times: {
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    timesText: { color: '#fff' }
});