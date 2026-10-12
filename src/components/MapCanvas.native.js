import { forwardRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { colors } from '../theme/tokens';
import { DestinationMarker } from './DestinationMarker';

const MICHIGAN_REGION = {
  latitude: 44.5,
  longitude: -85.4,
  latitudeDelta: 7.2,
  longitudeDelta: 6.4,
};

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: colors.mapLand }] },
  { elementType: 'labels.text.fill', stylers: [{ color: colors.mapLabel }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: colors.cream }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: colors.mapWater }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: colors.mapRoad }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: colors.mapPark }] },
];

export const MapCanvas = forwardRef(function MapCanvas(
  { destinations, selectedDestinationId, userLocation, onSelectDestination },
  ref
) {
  return (
    <MapView
      customMapStyle={Platform.OS === 'android' ? mapStyle : undefined}
      initialRegion={MICHIGAN_REGION}
      mapPadding={{ top: 168, right: 24, bottom: 232, left: 24 }}
      mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
      ref={ref}
      showsCompass={false}
      showsMyLocationButton={false}
      showsUserLocation={Boolean(userLocation)}
      style={StyleSheet.absoluteFill}
    >
      {destinations.map((destination) => (
        <Marker
          accessibilityLabel={`${destination.name}, ${destination.region}`}
          coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
          key={destination.id}
          onPress={() => onSelectDestination(destination)}
        >
          <DestinationMarker selected={destination.id === selectedDestinationId} />
        </Marker>
      ))}
    </MapView>
  );
});
