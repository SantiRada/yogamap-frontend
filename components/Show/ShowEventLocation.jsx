import { StyleSheet, View } from 'react-native'
import React from 'react'
import MapView, {Marker} from 'react-native-maps';

export const ShowEventLocation = ({ location }) => {

  console.log(location.geometry.location)
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

  return (
    <View style={styles.mapContainer}>
      <MapView
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: location.geometry.location.lat,
          longitude: location.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
      >
        <Marker
            coordinate={{ latitude: location.geometry.location.lat, longitude: location.geometry.location.lng }}
            title={location.address}
          />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%', // Puedes ajustar este valor según el tamaño que desees
    height: 200,  // Ajusta la altura según tus necesidades
    borderRadius: 10, // Para bordes redondeados si es necesario
    overflow: 'hidden', // Para evitar que el mapa sobresalga fuera del contenedor
  },
  map: {
    flex: 1,
  },
});
