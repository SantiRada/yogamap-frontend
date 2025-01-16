import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { getProfID } from './../ProfData';

export const Map = () => {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState(null); // La data puede ser null antes de cargarla
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [modalVisible, setModalVisible] = useState(false); // Control del modal
  const navigation = useNavigation();

  const idProf = getProfID() ?? null;

  const customMapStyle = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.business",
      elementType: "geometry",
      stylers: [{ visibility: "off" }],
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permiso de ubicación denegado');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  const id = -1;
  const count = 10;

  useEffect(() => {
    async function fetch() {
      try {
        const response = await axios.post(
          'https://yogamap.com.ar/public/select/eventFeed.php',
          { id, count },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.event) {
          setData(response.data.event);
        }
      } catch (error) {
        console.log(
          "Falló la conexión al servidor al intentar recuperar los eventos..."
        );
        console.log(error);
      }
    }
    fetch();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distancia en metros
  };

  const handleMarkerPress = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  if (!location || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 40, left: 25, zIndex: 20 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={{ width: 28 }}>
            <AntDesign name="arrowleft" size={28} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {data.map((item, index) => {
          const si = index + 1 === data.length;
          const ubication = si ? {} : JSON.parse(item?.ubication);


          if (!si) {
            const distance = calculateDistance(
              location.latitude,
              location.longitude,
              ubication?.geometry?.location.lat,
              ubication?.geometry?.location.lng
            );
            console.log(item.idProf)

            //if (distance < 10000) {
              return (
                <>
                  <Marker
                      key={item.id}
                      coordinate={{
                        latitude: ubication.geometry.location.lat,
                        longitude: ubication.geometry.location.lng,
                      }}
                      title={item.title}
                      onPress={()=>navigation.navigate('ShowEvent', {id: item.id, idProf: idProf})}
                    />
                
                </>

              
              );
            }
          //}

          return null;
        })}
      </MapView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 45,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  markerContainer: {
    alignItems: "center",
  },
  markerText: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    padding: 3,
    borderRadius: 5,
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});