import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useColors from '../../Colors';

import { StyleSheet, View, ScrollView, Image, Text, TextInput, Alert, TouchableOpacity, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import * as ImagePicker from 'expo-image-picker';

export function CreateEvent({ route }){
    const { id } = route.params;

    const Colors = useColors();
    const styles = DynamicStyles(Colors)
    const navigation = useNavigation();

    const [location, setLocation] = useState(
        {
          description: "Playa El Morro, Anzoátegui, Venezuela",
          place_id: "playa_el_morro_anzoategui",
          geometry: {
            location: {
              lat: 10.191726, // Coordenada aproximada de Playa El Morro
              lng: -64.681238,
            },
          },
        }
      );
      

    const [suggestions, setSuggestions] = useState([]); 

    const imageBase = "https://yogamap.com.ar/assets/firstevent.png";
    const [imageURI, setImageURI] = useState(imageBase);

    const [name, setName] = useState('');
    const [theme, setTheme] = useState('');
    const [description, setDescription] = useState('');
    const [horarios, setHorarios] = useState('');
    const [ubication, setUbication] = useState('');
    const [status, setStatus] = useState('');

    const askForPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('¡Permiso denegado!', 'Necesitas conceder permiso para acceder a la galería.');
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await askForPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const fileName = imageURI.split('/').pop();
            console.log(fileName)
            setImageURI(result.assets[0].uri);
        } else {
            console.log('Usuario canceló la selección de imagen');
        }
    };

    const verifyData = () => {
        if(name == '' || theme == '' || description == '' || horarios == '' || imageURI == imageBase){
            setStatus("Debes completar todos los datos para poder crear tu evento (excepto la ubicación).");
            return false;
        }
        else { setStatus(''); return true; }
    }

    const saveData = () => {
        const verify = verifyData();

        if(!verify) { return; }

        SaveAllData();
    }

    const SaveAllData = async () => {
        try {
            const formData = new FormData();

            formData.append('idorg', id);
            formData.append('name', name);
            formData.append('theme', theme);
            formData.append('description', description);
            formData.append('horarios', horarios);
            formData.append('ubication', JSON.stringify(location));
            
            if (imageURI !== imageBase) {
                const fileName = imageURI.split('/').pop();
                formData.append('image', {
                    uri: imageURI,
                    name: fileName,
                    type: 'image/jpeg',
                });
            }

            // Realiza la solicitud POST
            const response = await axios.post('https://yogamap.com.ar/public/insert/event.php', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            if (response.data.success) {
                Alert.alert(
                    '¡Evento Creado!',
                    'El evento ha sido creado con éxito.',
                    [
                        {
                            text: 'Aceptar',
                            onPress: () => navigation.navigate('TabGroup'),
                        },
                    ],
                    { cancelable: false }
                );
            } else {
                console.log('Falló la creación del evento...', response.data.message);
            }
        } catch (error) {
            console.log('Falló la conexión al servidor al intentar crear el evento...', error);
        }
    };

     const googleAPIKey = "AIzaSyDkfuWwUibSaMiBj9rmYwRByeJlVlf8jQU"

      const fetchSuggestions = async (query) => {
        if (!query) {
          setSuggestions([]); // Si el input está vacío, no mostramos sugerencias
          return;
        }
    
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${googleAPIKey}&language=es`
          );
          console.log(response.data)
          if (response.data.status === 'OK') {
            setSuggestions(response.data.predictions); // Guardamos las sugerencias obtenidas
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Hubo un problema al obtener las sugerencias.');
        }
      };
    
      // Función para seleccionar una ubicación y obtener las coordenadas
      const selectLocation = async (placeId) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${googleAPIKey}`
          );
    
          const location = response.data.result.geometry.location;
          const { lat, lng } = location;
    
          // Almacenamos la ubicación seleccionada en el contexto
          setLocation({
            latitude: lat,
            longitude: lng,
            address: response.data.result.formatted_address,
          });
    
          // Navegamos a la pantalla del mapa
          navigation.navigate('MapScreen');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Hubo un problema al obtener los detalles de la ubicación.');
        }
      };

    return(
        <ScrollView style={styles.container}>
            <TouchableOpacity style={{ position: 'relative', marginBottom:20 }} onPress={ pickImage }>
                <Image source={{ uri: imageURI }} style={styles.image} />
                <View style={imageURI !== imageBase ? styles.edit : styles.filter}>
                    <MaterialIcons style={imageURI !== imageBase ? styles.iconEdit : styles.iconFilter} name={imageURI !== imageBase ? "edit" : "add"} color='#fff' />
                </View>
            </TouchableOpacity>
            <View style={styles.content}>
                <View style={styles.titleSector}>
                    <Text style={styles.label}>Nombre del Evento</Text>
                    <TextInput
                        placeholder="Nombre del Evento"
                        placeholderTextColor={Colors.placeholder}
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                    />
                </View>
                <Text style={styles.label}>Temas del Evento</Text>
                <TextInput
                    placeholder="Temas del Evento"
                    placeholderTextColor={Colors.placeholder}
                    style={styles.input}
                    onChangeText={setTheme}
                    value={theme}
                />
                <Text style={styles.label}>Descripción del Evento</Text>
                <TextInput
                    placeholder="Descripción del evento"
                    placeholderTextColor={Colors.placeholder}
                    multiline={true}
                    numberOfLines={10}
                    style={styles.textarea}
                    onChangeText={setDescription}
                    value={description}
                />
                <Text style={styles.label}>Horario</Text>
                <TextInput
                    placeholder="20:30 a 21:30"
                    placeholderTextColor={Colors.placeholder}
                    style={styles.input}
                    onChangeText={setHorarios}
                    value={horarios}
                />
                <Text style={styles.label}>Ubicación</Text>
                <TextInput
                    placeholder="Ubicación"
                    placeholderTextColor={Colors.placeholder}
                    style={styles.input}
                    onChangeText={(text) => {
                        setUbication(text);
                        fetchSuggestions(text); // Obtener sugerencias cuando el texto cambia
                      }}
                    value={ubication}
                />
                {suggestions.length > 0 ? (
                      <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.place_id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.suggestionItem}
                            onPress={() => selectLocation(item.place_id)}
                          >
                            <Text style={styles.suggestionText}>{item.description}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    ):(
                        <>
                        {ubication.length > 0 && (
                            <View style={{backgroundColor:"#00000005", paddingHorizontal:10, paddingVertical:5}} >
                              <Text style={styles.suggestionText}>no se encontro ninguna sugerencia</Text>
                            </View>
                        )}
                        </>
                    )}
                { status && <Text style={styles.status}>{status}</Text> }
                <TouchableOpacity style={styles.btn} onPress={ () => saveData() }>
                    <Text style={styles.btnText}>Crear Evento</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const DynamicStyles = (Colors) => StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.background,
        gap: 16,
    },
    suggestionItem: {
        backgroundColor:"#00000005",
        paddingHorizontal:10,
        paddingVertical:5,
        borderBottomColor:Colors.placeholder
    },
    suggestionText: {
        color:Colors.text
    },
    icon: { color: Colors.headerIcons, },
    iconRight: {
        color: Colors.headerIcons,
    },
    image:{
        width: '100%',
        height: 220,
    },
    filter: {
        backgroundColor: '#00000050',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    edit: {
        backgroundColor: '#00000050',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop:16,
        paddingRight:16,
    },
    iconFilter: {
        backgroundColor: Colors.inputBG,
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        fontSize: 48,
    },
    iconEdit: {
        fontSize: 24,
        color: '#c80000',
        backgroundColor: '#f0a6a6',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    content: {
        paddingHorizontal: 16,
    },
    label: {
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.inputBG,
        padding: 8,
        paddingLeft: 24,
        color: Colors.text,
        borderRadius: 8,
        marginBottom: 16,
    },
    textarea: {
        backgroundColor: Colors.inputBG,
        padding: 16,
        textAlignVertical: 'top',
        color: Colors.text,
        borderRadius: 8,
        marginBottom: 16,
    },
    btn: {
        backgroundColor: '#8C5BFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        color: '#ff0000',
        width: '100%',
        textAlign:'center',
        paddingVertical: 16,
        backgroundColor: '#ff000014',
        borderRadius: 16,
        marginBottom: 16,
    },
});