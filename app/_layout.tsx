import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login", headerShown: false}}></Stack.Screen>
      <Stack.Screen name="parent" options={{ title: "Responsavel", headerShown: false}}></Stack.Screen>
      <Stack.Screen name="teacher" options={{ title: "Professores", headerShown: false}}></Stack.Screen>
    </Stack>
  )
    
    
}
