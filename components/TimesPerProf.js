import { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export function TimesPerProf({ idProf }) {
    const navigation = useNavigation();

    const [data, setData] = useState([]); // Listado de tipos de yoga
    const [allHorarios, setAllHorarios] = useState([]); // Listado de horarios TOTALES

    const [typeOfYoga, setTypeOfYoga] = useState(''); // Tipo de yoga seleccionado
    const [visibleHorarios, setVisibleHorarios] = useState(-1); // Visibilidad de los horarios

    const toggleVisibility = (value, index) => {
        setTypeOfYoga(value);

        if(index == visibleHorarios) { setVisibleHorarios(-1); }
        else { setVisibleHorarios(index); }
    };

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/unique/typeofyogaperprof.php', { id: idProf }, { headers: { 'Content-Type': 'application/json' } });
                if (response.data.success) {
                    if (response.data.types) {
                        setData(response.data.types);
                    } else {
                        setData([]);
                        console.log("Warning: ", response.data.message);
                    }
                } else {
                    console.log("Error: ", response.data.message);
                }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los tipos de yoga del profe...", error);
            }
        };
        connection();
    }, [idProf]);

    useEffect(() => {
        const connection = async () => {
            try {
                const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/horarios.php', {
                    id: idProf,
                    value: typeOfYoga
                }, { headers: { 'Content-Type': 'application/json' } });

                if (response.data.success) {
                    if (response.data.horarios) {
                        let tunnel = {};

                        response.data.horarios.map((item) => {
                            if (!tunnel[item.typeofyogaNAME]) { tunnel[item.typeofyogaNAME] = []; }

                            tunnel[item.typeofyogaNAME].push({
                                id: item.id,
                                day: item.day,
                                horas: item.horas,
                            });
                        });

                        setAllHorarios(tunnel);
                    } else {
                        setAllHorarios([]);
                        console.log("Warn: ", response.data.message);
                    }
                } else {
                    console.log("Error: ", response.data);
                    setAllHorarios([]);
                }
            } catch (error) {
                console.log("Falló la conexión al servidor al intentar recuperar los horarios...", error);
            }
        };

        connection();
    }, [idProf]);

    const days = [ "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" ];

    return (
        <View>
            <View style={styles.listTimes}>
                {data && data.map((item, index) => {
                    const iconArrow = visibleHorarios == index ? "keyboard-arrow-up" : "keyboard-arrow-right";
                    return (
                        <View key={index}>
                            <Pressable style={styles.times} onPress={() => toggleVisibility(item.name, index)}>
                                <Text style={styles.name}>{item.name}</Text>
                                <MaterialIcons name={iconArrow} size={24} color='#fff' />
                            </Pressable>
                            { visibleHorarios == index && (
                                <View style={styles.contentTimes}>
                                    { allHorarios[item.name] ? allHorarios[item.name].map((arrayItem, indice) => (
                                        <View key={indice + days[arrayItem['day']]}>
                                            <Text style={{ paddingTop: 8, color: '#fff' }}>{days[arrayItem['day']]}</Text>
                                            <View style={styles.dataTimes}>
                                                <Pressable style={styles.option} onPress={ () => navigation.navigate('WayClass', { id: idProf, horario: arrayItem['id'] }) }>
                                                    <Text style={styles.time}>{arrayItem['horas']}</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                      )) :
                                      <View style={styles.aclarationSection}>
                                        <Text style={styles.aclaration}>No hay horarios disponibles para este tipo de yoga actualmente.</Text>
                                      </View>
                                    }
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
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
        width: '100%',
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
    hiddenContent: {
        paddingVertical: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        borderBottomColor: '#ffffff20',
        borderBottomWidth: 1,
    },
    daySection: {
        marginBottom: 16,
    },
    dayTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    timeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
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
    time: {
        color: '#fff',
    },
    dataTimes: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: '#fff',
        backgroundColor: '#ffffff20',
        borderRadius: 8,
    },
    aclaration: {
        color: '#ffffff50',
        textAlign: 'center',
        paddingHorizontal: 32,
        paddingVertical: 8
    }
});
