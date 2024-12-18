import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, TextInput, Pressable, Alert, FlatList, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { SearchBar } from './../components/SearchBar';
import { ListProf } from '../components/List/ListProf';
import { ListTypeOfYoga } from '../components/List/ListTypeOfYoga';
import axios from 'axios';

// const GOOGLE_MAPS_API_KEY = 'AIzaSyDkfuWwUibSaMiBj9rmYwRByeJlVlf8jQU';

export function BuscarClases() {
    // VISIBILIDAD DEL BUSCADOR
    const [stateSearch, setStateSearch] = useState(false); // SI SE DESPLIEGA EL BUSCADOR O NO
    const [stateTypeClass, setStateTypeClass] = useState(true); // SI ESTÁ SELECCIONADO PRESENCIAL U ONLINE

    // FUNCIONAMIENTO DEL BUSCADOR
    const [search, setSearch] = useState(''); // EL TEXTO EXACTO QUE SE ESCRIBIÓ
    const [typesOfYoga, setTypesOfYoga] = useState(''); // EL TIPO DE YOGA SELECCIONADO

    // FUNCIONAMIENTO DEL BUSCADOR
    const [ubication, setUbication] = useState('');

    const [data, setData] = useState([]);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/prof.php', { search, typesOfYoga, stateTypeClass }, { headers: { 'Content-Type': 'application/json' } });
        
            if (response.data.success) {
                if(response.data.profs) { setData(response.data.profs); }
                else { setData([]); }
            }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar a los profesores...");
        }
    }

    useFocusEffect(useCallback(() => {
        return () => {
            setData([]);
            setSearch('');
            setTypesOfYoga('');
            setStateSearch(false);
            setStateTypeClass(false);
        };
    }, []));

    return (
        <View style={style.container}>
            {stateSearch ? (
                <View style={style.searchComplete}>
                    <View style={style.listChip}>
                        <Pressable style={[style.chip, stateTypeClass && { backgroundColor: "#8C5BFF", }]} onPress={() => { setStateTypeClass(true); }}>
                            <Text style={style.chipText}>Presencial</Text>
                        </Pressable>
                        <Pressable style={[style.chip, !stateTypeClass && { backgroundColor: "#8C5BFF", }]} onPress={() => { setStateTypeClass(false); }}>
                            <Text style={style.chipText}>Online</Text>
                        </Pressable>
                    </View>
                    <View style={style.inputBig}>
                        <MaterialIcons style={style.icon} name="search" size={24} />
                        <TextInput
                            style={style.inputSmall}
                            placeholder="Buscar profe o Tipo de Yoga"
                            placeholderTextColor="#ffffff70"
                            onChangeText={setSearch}
                            value={search}
                            onSubmitEditing={handleSubmit}
                        />
                    </View>
                    {
                        !stateTypeClass ? null :
                            <View style={style.inputBig}>
                                <MaterialIcons style={style.icon} name="location-on" size={24} />
                                <TextInput
                                    style={style.inputSmall}
                                    placeholderTextColor="#ffffff70"
                                    placeholder="Buscar por Ubicación"
                                    onChangeText={setUbication}
                                    value={ubication}
                                />
                            </View>
                    }
                </View>
            ) : (
                <SearchBar setStateSearch={setStateSearch} text="Buscar profe o Tipo de Yoga" />
            )}
            { search.length <= 0 ?
                <View>
                    <ListTypeOfYoga count={6} setTypesOfYoga={setTypesOfYoga} />
                    <View style={style.Sugerencias}>
                        <Text style={style.title}>Sugerencias</Text>
                        <ListProf count={6} />
                    </View>
                </View> :
                <View>
                    <View style={style.Sugerencias}>
                        <Text style={style.title}>Resultados</Text>
                        {
                            data.map((item, index) => (
                                <ListProf key={index} id={item.id} />
                            ))
                        }
                    </View>
                </View>
            }
        </View>
    );
}


const style = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: '4%',
        backgroundColor: '#1A122E',
    },
    iconLeft: {
        color: '#E3D8FF',
        marginLeft: 16,
    },
    listChip: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        backgroundColor: '#3C2C61',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    chipText: {
        color: '#fff',
        fontSize: 12,
    },
    inputBig: {
        position: 'relative',
        marginTop: 8,
    },
    icon: {
        position: 'absolute',
        zIndex: 5,
        top: 10,
        left: 12,
        color: '#fff',
    },
    rightIcon: {
        position: 'absolute',
        zIndex: 5,
        top: 10,
        right: 12,
        color: '#fff',
    },
    inputSmall: {
        color: '#fff',
        fontSize: 12,
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: (16 + 28),
        borderRadius: 12,
    },
    Sugerencias: {
        marginTop: 24,
    },
    title: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
