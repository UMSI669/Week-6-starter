import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } });

export default function App() {
  return <SafeAreaProvider><QueryClientProvider client={queryClient}>
    <StatusBar style="light" />
    <AppNavigator />
  </QueryClientProvider></SafeAreaProvider>;
}
