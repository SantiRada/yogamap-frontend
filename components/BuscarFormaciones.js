import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { SearchBar } from './../components/SearchBar';
import { ListFormaciones } from '../components/List/ListFormaciones';

export function BuscarFormaciones(){

    const [stateTypeClass, setStateTypeClass] = useState(true); // SIRVE PARA SABER SI ES BUSQUEDA PRESENCIAL U ONLINE
    const [stateSearch, setStateSearch] = useState(false); // SIRVE PARA SABER SI ESTÁS BUSCANDO O NO (Mostrar el buscador desplegado o no)
    const [searchData, setSearchData] = useState(''); // TEXTO QUE SE BUSCA
    const [hasSearch, setHasSearch] = useState(false);

    useFocusEffect( React.useCallback(() => {
        return () => {
            setSearchData('');
            setHasSearch(false);
            setStateSearch(false);
        };
    }, []) );

    const handleSubmit = () => { setHasSearch(true); }

    return(
        <View style={style.container}>
            {stateSearch ? (
                <View style={style.searchComplete}>
                    <View style={style.listChip}>
                        <Pressable style={[style.chip, stateTypeClass && { backgroundColor: "#8C5BFF", }]} onPress={ () => { setStateTypeClass(true); } }>
                            <Text style={style.chipText}>Presencial</Text>
                        </Pressable>
                        <Pressable style={[style.chip, !stateTypeClass && { backgroundColor: "#8C5BFF", }]} onPress={ () => { setStateTypeClass(false); } }>
                            <Text style={style.chipText}>Online</Text>
                        </Pressable>
                    </View>
                    <View style={style.inputBig}>
                        <MaterialIcons style={style.icon} name="search" size={24} />
                        <TextInput
                            style={style.inputSmall}
                            onChangeText={setSearchData}
                            placeholderTextColor="#ffffff70"
                            placeholder="Buscar profe o Tipo de Yoga"
                            onSubmitEditing={handleSubmit}
                            value={searchData}
                        />
                    </View>
                </View>
            ) : (
                <SearchBar setStateSearch={setStateSearch} text="Buscar Formaciones" />
            ) }
            { !hasSearch ?
                <View style={style.Sugerencias}>
                    <Text style={style.title}>Sugerencias</Text>
                    <ListFormaciones count={6} />
                </View> :
                <View style={style.Sugerencias}>
                    <Text style={style.title}>Resultados</Text>
                    <ListFormaciones search={searchData} stateTypeClass={stateTypeClass} />
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
    chipText:{
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
    inputSmall: {
        color: '#fff',
        fontSize: 12,
        backgroundColor: '#3C2C61',
        padding: 8,
        paddingLeft: (16+28),
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