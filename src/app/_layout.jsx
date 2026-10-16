import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";

const queryClient = new QueryClient();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
  "CaslonAntique-Bold": require("../../assets/fonts/CaslonAntique-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#FFFFFF",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#121212" },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
        <Stack.Screen name="my-builds" options={{ title: "My Builds", headerTitle: "" }} />
        <Stack.Screen name="create-build" options={{ title: "Create Build", headerTitle: "" }} />
        <Stack.Screen name="explore" options={{ title: "Explore" }} />
      </Stack>
    </QueryClientProvider>
  );
}

