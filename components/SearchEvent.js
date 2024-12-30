import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useColors from '../Colors';

import axios from 'axios';

export function SearchEvent({setData, setHasSearch}){

    const [search, setSearchInput] = useState('');

    const Colors = useColors()
    const style = DynamicStyles(Colors);
    
    useFocusEffect(React.useCallback(() => { return () => {
        setSearchInput('');
        setHasSearch(false);
    }; }, []));

    const handleSubmit = async () => {
        try {
            const response = await axios.post('https://yogamap.com.ar/public/select/eventFeed.php', { search }, { headers: { 'Content-Type': 'application/json' } });
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
                    placeholderTextColor={Colors.placeholder}
                    placeholder="Buscar eventos"
                    value={search}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="Buscar"
                />
            </View>
        </View>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    listChip: {
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        backgroundColor: Colors.inputBG,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    chipText:{
        color: Colors.text,
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
        color: Colors.text,
    },
    inputSmall: {
        color: Colors.text,
        backgroundColor: Colors.inputBG,
        padding: 10,
        paddingLeft: (16+28),
        borderRadius: 12,
    },
});