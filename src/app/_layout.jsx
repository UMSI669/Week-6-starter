import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingView } from '../components/ui';
import { persistor, store } from '../store';
import { colors } from '../theme/tokens';

export default function RootLayout() {
  return <SafeAreaProvider><Provider store={store}>
    <PersistGate persistor={persistor} loading={<LoadingView message="Loading saved locations…" />}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    </PersistGate>
  </Provider></SafeAreaProvider>;
}
