import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../components/AuthContext";

function RootLayoutNav() {
  const { signed, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (signed) {
      } else {
        router.replace("/");
      }
    }
  }, [signed, loading]);

  if (loading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="(authenticated)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}