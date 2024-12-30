import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, ScrollView, View, Pressable, Text, Alert } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';

import { InfoProf } from '../components/InfoProf';
import { SliderFormaciones } from '../components/SliderFormaciones';
import { getUserID } from '../UserData';

export function WayClass({ route }){
    const { id, horario, types } = route.params;
    const navigation = useNavigation();

    const [space, setSpace] = useState(0);

    // FUNCIONAMIENTO DEL TIPO DE SOLICITUD
    const [visibleData, setVisibleData] = useState(true);
    const handleVisibleTypeData = () => { setVisibleData(!visibleData); }

    const [typeData, setTypeData] = useState('');
    const selectTypeData = (value) => {
        setVisibleData(false);
        setTypeData(value);
        setAllHorarios([]);
        setHorarios([]);
        setTypeYoga('');
        setFormaciones('');
        setVisibleFormaciones(true);
        setVisibleHorarios(true);
        setVisibleYoga(true);
        setSpace(1);
    }
    // ------------------------------------
    // FUNCIONAMIENTO DEL TIPO DE YOGA
    const [typesArray, setTypesArray] = useState([]);
    
    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('https://yogamap.com.ar/public/select/unique/typeofyogaperprof.php', { id: id });

                if (response.data.success) { setTypesArray(response.data.types); }
                else { setTypesArray([]); console.log("Warning: ", response.data.message); }
            } catch (error) { console.log("ERROR: ", error); }
        }

        connection();
    }, [id]);

    // ------------------------------------
    const [visibleYoga, setVisibleYoga] = useState(true);
    const handleVisibleTypesYoga = () => { setVisibleYoga(!visibleYoga); }

    const [typeYoga, setTypeYoga] = useState('');
    const selectTypeOfYoga = async (value) => {
        setVisibleYoga(false);
        setTypeYoga(value);
        setHorarios([]);
        setAllHorarios([]);
        setSpace(2);
    }

    const [allHorarios, setAllHorarios] = useState([]); // Listado de horarios a mostrar

    useEffect(() => {
        if (typeYoga !== '' || horario != '') {
            const connection = async () => {
                try {
                    const response = await axios.post('https://yogamap.com.ar/public/select/horarios.php', 
                        { id, value: typeYoga, horario: horario },
                        { headers: { 'Content-Type': 'application/json' } }
                    );
    
                    if (response.data.success) {
                        if (response.data.horarios) {

                            if(horario != ''){
                                // setVisibleData(false);
                                // setVisibleHorarios(true);
                                // setSpace(3);
                            }

                            setAllHorarios(response.data.horarios);
                        } else { setAllHorarios([]); }
                    }
                } catch (error) {
                    console.log("Falló la conexión al servidor al intentar recuperar los horarios...");
                }
            };
    
            connection();
        }
    }, [typeYoga, horario]);
    // ------------------------------------
    // FUNCIONAMIENTO DEL HORARIO
    const [visibleHorarios, setVisibleHorarios] = useState(true); // Si es visible el desplegable de horarios o no
    const handleVisibleHorarios = () => { setVisibleHorarios(!visibleHorarios); }

    const [horarios, setHorarios] = useState([]);

    const selectHorarios = (value) => {
        setHorarios(prevHorarios => {
            if (prevHorarios.includes(value)) { return prevHorarios.filter(item => item !== value); }
            else { return [...prevHorarios, value]; }
        });

        setSpace(3);
    };
    
    // ------------------------------------
    const [visibleFormaciones, setVisibleFormaciones] = useState(true);
    const handleVisibleFormaciones = () => { setVisibleFormaciones(!visibleFormaciones); }
    const [formaciones, setFormaciones] = useState('');
    const selectFormaciones = async (value) => {
        setVisibleFormaciones(false);
        setFormaciones(value);
        setSpace(3);
    }

    const sendData = () => {
        console.log("Enviando información");
        Alert.alert(
            "¡Solicitud enviada!",
            "Recibirás la confirmación en la sección de notificaciones.",
            [
                {
                    text: "Continuar",
                    onPress: () => sendingData()
                }
            ]
        );
    }

    const sendingData = async () => {
        try {
            let data = {};
            let type = '';
            if(typeData === "Solicitando una Clase") { 
                data = { "typeYoga": typeYoga, "horarios": horarios }; 
                type= "clases"; 
            } else { 
                data = { "formacion": formaciones }; 
                type = "formaciones"; 
            }
    
            const idProf = id;
            const idUser = getUserID();
    
            const response = await axios.post('https://yogamap.com.ar/public/insert/notification.php',
                { idProf, idUser, type, data },
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            console.log(response);

            if (response.data.success) { 
                navigation.navigate('ShowProf', { id: id }); 
            } else { 
                console.log("Error:", response.data.message); 
            }
        } catch (error) { 
            console.log("Error al intentar guardar la solicitud:", error.response ? error.response.data : error.message); 
        }
    }
    
    const days = [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" ];

    return(
        <ScrollView style={styles.container}>
            <Text style={{color: '#fff', opacity: 0.5, fontSize: 12, marginBottom: 8, marginLeft: 16}}>Estas por contactar con</Text>
            <InfoProf size="min" id={id} />
            <View style={[styles.spaces, {marginTop: 16}]}>

                <Pressable style={styles.dropdown} onPress={handleVisibleTypeData}>
                    <Text style={styles.dropdownText}>{(typeData != "" ? typeData : "¿Qué estás buscando?")}</Text>
                    <MaterialIcons name={(visibleData ? "keyboard-arrow-up" : "keyboard-arrow-right")} size={24} color='#fff' />
                </Pressable>
                { visibleData &&
                    <View style={styles.desplegable}>
                        <Pressable style={styles.item} onPress={() => selectTypeData('Solicitando una Clase')}>
                            <Text style={styles.itemText}>Solicitar una Clase</Text>
                        </Pressable>
                        <Pressable style={styles.item} onPress={() => selectTypeData('Solicitando una Formación')}>
                            <Text style={styles.itemText}>Solicitar una Formación</Text>
                        </Pressable>
                    </View>
                }
            </View>
            { space > 0 &&
                typeData == 'Solicitando una Clase' ?
                <View style={styles.spaces}>
                    <Pressable style={styles.dropdown} onPress={handleVisibleTypesYoga}>
                        <Text style={styles.dropdownText}>{(typeYoga != "" ? ("Tipo: " + typeYoga) : "¿Qué tipo de Yoga te interesa?")}</Text>
                        <MaterialIcons name={(visibleYoga ? "keyboard-arrow-up" : "keyboard-arrow-right")} size={24} color='#fff' />
                    </Pressable>
                    {visibleYoga &&
                        <View style={styles.desplegable}>
                            { typesArray.map((item, index) => (
                                <Pressable key={(item.name + "-" + index)} style={styles.item} onPress={() => selectTypeOfYoga(item.name)}>
                                    <Text style={styles.itemText}>{item.name}</Text>
                                </Pressable>
                            ))
                            }
                        </View>
                    }
                </View> : typeData == 'Solicitando una Formación' &&
                <View>
                    <Pressable style={styles.dropdown} onPress={ handleVisibleFormaciones }>
                        <Text style={styles.dropdownText}>{(formaciones != "" ? formaciones : "¿Qué formación te interesa?")}</Text>
                        <MaterialIcons name={(visibleFormaciones ? "keyboard-arrow-up" : "keyboard-arrow-right")} size={24} color='#fff' />
                    </Pressable>
                    { visibleFormaciones && <SliderFormaciones selectFormaciones={ selectFormaciones } /> }
                </View>
            }
            { (space > 1 && typeData == 'Solicitando una Clase') &&
                <View style={styles.spaces}>
                    <Pressable style={styles.dropdown} onPress={ handleVisibleHorarios }>
                        <Text style={styles.dropdownText}>{(horarios != "" ? "Horarios Seleccionados" : "¿Qué horario te queda cómodo?")}</Text>
                        <MaterialIcons name={(visibleHorarios ? "keyboard-arrow-up" : "keyboard-arrow-right")} size={24} color='#fff' />
                    </Pressable>
                    {visibleHorarios &&
                        <View style={styles.listTimes}>
                            { allHorarios && Object.keys(allHorarios).length > 0 ? (
                                <View style={styles.contentTimes}>
                                    {
                                        allHorarios.map((item,index) => {
                                            return (
                                            <>
                                                <Text style={{paddingTop:8,color: '#fff'}}>{allHorarios[days[item.day]]}</Text>
                                                <View style={styles.dataTimes}>
                                                    <Pressable key={item.day + "/" + index} style={selected && styles.bg1} onPress={() => { selectHorarios(item.id) }}>
                                                        <Text style={styles.time}>{item.horas}</Text>
                                                    </Pressable>
                                                </View>
                                            </>
                                        )})
                                    }
                                </View>
                            ) : (
                                <Text style={{color: '#fff', textAlign:'center', paddingVertical: 16}}>No hay horarios disponibles.</Text>
                            )}
                        </View>
                    }
                </View>
            }
            { (horarios.length > 0 || formaciones.length > 0) &&
                <Pressable style={styles.btn} onPress={ sendData }>
                    <Text style={styles.textBtn}>Enviar</Text>
                </Pressable>
            }
        </ScrollView>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({  
    container: {
        width: '100%',
        padding: '4%',
        height: '100%',
        backgroundColor: '#1A122E',
    },
    dropdown: {
        borderBottomColor: '#3C2C61',
        borderBottomWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: {
        color: '#fff',
        fontSize: 18,
    },
    desplegable: {
        borderBottomColor: '#3C2C61',
        borderBottomWidth: 1,
        paddingVertical: 16,
        gap: 16,
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
        backgroundColor: '#ffffff10',
        padding: 16,
        borderRadius: 16,
    },
    day: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,
    },
    option: {
        color: '#aaa',
        fontSize: 16,
        marginRight: 24,
    },
    select: {
        color: '#fff',
    },
    dataTimes: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    time: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: '#fff',
        backgroundColor: '#ffffff20',
        borderRadius: 8,
    },
    bg1:{
        backgroundColor: '#8C5BFF',
        borderRadius:8
    },
    btn: {
        backgroundColor: '#8C5BFF',
        height: 50,
        width: '100%',
        marginBottom: 16,
        marginTop: 24,
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