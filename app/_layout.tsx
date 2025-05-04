import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider } from "./context/AuthContext";
import LocalisationContextProvider from "./locales/localisationContext";

export default function RootLayout() {
  return (
    <LocalisationContextProvider>
    <AuthProvider>
      <Stack screenOptions={{headerShown: false}} />
      <Toast/>
    </AuthProvider>
    </LocalisationContextProvider>
  )
}
