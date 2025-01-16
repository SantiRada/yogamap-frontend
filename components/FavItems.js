import { useState, useCallback } from 'react';
import { Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useColors from '../Colors';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import axios from 'axios';

import { getUserID } from './../UserData';

export function FavItems({ id, type }){

    const idUser = getUserID();

    const [fav, setFav] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.post('https://yogamap.com.ar/public/select/unique/favQuery.php', {
                        id,
                        idUser,
                        type
                    }, { headers: { 'Content-Type': 'application/json' } });
                
                    if (response.data.success) { setFav(response.data.fav); }
                  } catch (error) {
                    console.log("Falló la conexión al servidor al intentar recuperar el " + type + " de id" + id + "..." + error);
                }
            };
    
            fetchData();
        }, [id, idUser]),
    );

    const handleFav = async () => {
        setFav(!fav);

        try {
          const response = await axios.post('https://yogamap.com.ar/public/update/fav.php', {
            id,
            idUser,
            type,
          }, { headers: { 'Content-Type': 'application/json' } });
      
            if (response.status === 200 && response.data.success) { console.log("Favorito modificado con éxito."); }
            else { console.log('Error en la respuesta del servidor:', response.data.message); }

        } catch (error) { console.log('Error en la conexión al servidor:', error); }
    };

    const iconName = fav ? "star" : "star-border";
    const Colors = useColors()

    return(
        <Pressable onPress={ () => { handleFav(); } }>
            <MaterialIcons name={iconName} size={24} color={Colors.text} />
        </Pressable>
    );
}