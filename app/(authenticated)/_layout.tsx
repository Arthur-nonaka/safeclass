import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';

export default function AuthenticatedLayout() {
    const { signed, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !signed) {
            router.replace('/');
        }
    }, [signed, loading]);

    if (loading) {
        return null;
    }

    if (!signed) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen
                name="parent"
                options={{
                    title: "Responsavel",
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="teacher"
                options={{
                    title: "Professores",
                    headerShown: false
                }}
            />
        </Stack>
    );
}