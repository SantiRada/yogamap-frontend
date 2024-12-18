import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

export function SearchEvent({setData, setHasSearch}){

    const [search, setSearchInput] = useState('');
    
    useFocusEffect(React.useCallback(() => { return () => {
        setSearchInput('');
        setHasSearch(false);
    }; }, []));

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://192.168.100.2/API_Yogamap/public/select/eventFeed.php', { search }, { headers: { 'Content-Type': 'application/json' } });
            if (response.data.success) {
                setHasSearch(true);
                if(response.data.event){
                    if(response.data.event.length > 0) { setData(response.data.event);
                    } else{ setData([]); }
                }
                else { setData([]); }
            }
          } catch (error) {
            console.log("Falló la conexión al servidor al intentar recuperar los eventos...");
        }
    }

    return(
        <View>
            <View style={style.inputBig}>
                <MaterialIcons style={style.icon} name="search" size={24} />
                <TextInput
                    style={style.inputSmall}
                    onChangeText={setSearchInput}
                    placeholderTextColor="#ffffff70"
                    placeholder="Buscar eventos"
                    value={search}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="Buscar"
                />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
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
    },
    icon: {
        position: 'absolute',
        zIndex: 5,
        top: 12,
        left: 12,
        color: '#fff',
    },
    inputSmall: {
        color: '#fff',
        backgroundColor: '#3C2C61',
        padding: 10,
        paddingLeft: (16+28),
        borderRadius: 12,
    },
});