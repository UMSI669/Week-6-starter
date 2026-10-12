import { Linking, Platform } from 'react-native';

export async function openDestinationInMaps(destination) {
  const coordinates = `${destination.latitude},${destination.longitude}`;
  const encodedName = encodeURIComponent(destination.name);
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?ll=${coordinates}&q=${encodedName}`
      : `https://www.google.com/maps/search/?api=1&query=${coordinates}`;

  // TODO(student): Explain why HTTPS map links provide a safer fallback than custom URL schemes.
  await Linking.openURL(url);
}
