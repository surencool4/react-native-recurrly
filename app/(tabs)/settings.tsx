import { useClerk, useUser } from "@clerk/expo";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import { styled } from "nativewind";
import { colors } from "@/assets/constants/theme";
import { usePostHog } from "posthog-react-native";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    const posthog = usePostHog();

    const handleSignOut = async () => {
        posthog.capture("user_signed_out");
        await posthog.flush();
        await signOut();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Signed in as</Text>
                <Text style={styles.value}>
                    {user?.primaryEmailAddress?.emailAddress ?? user?.id ?? "Unknown user"}
                </Text>
            </View>

            <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Sign out</Text>
            </Pressable>
        </SafeAreaView>
    )
}
export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        gap: 16,
    },
    title: {
        color: colors.foreground,
        fontFamily: "sans-extrabold",
        fontSize: 28,
        marginTop: 16,
    },
    card: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 20,
        borderWidth: 1,
        gap: 8,
        padding: 16,
    },
    label: {
        color: colors.mutedForeground,
        fontFamily: "sans-medium",
        fontSize: 13,
        textTransform: "uppercase",
    },
    value: {
        color: colors.foreground,
        fontFamily: "sans-semibold",
        fontSize: 16,
    },
    button: {
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 16,
        minHeight: 52,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    buttonPressed: {
        opacity: 0.75,
    },
    buttonText: {
        color: "#ffffff",
        fontFamily: "sans-bold",
        fontSize: 16,
    },
});
