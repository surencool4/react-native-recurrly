import { useAuth, useClerk, useUser, useUserProfileModal } from "@clerk/expo";
import { AuthView, UserButton } from "@clerk/expo/native";
import { useRouter } from "expo-router";
import React from "react";
import { usePostHog } from "posthog-react-native";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/assets/constants/theme";

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const { user } = useUser();
  const { signOut } = useClerk();
  const { presentUserProfile } = useUserProfileModal();
  const router = useRouter();
  const posthog = usePostHog();

  const handleOpenDashboard = () => {
    posthog.capture("dashboard_opened");
    router.push("/(tabs)");
  };

  const handleManageProfile = () => {
    posthog.capture("manage_profile_pressed");
    presentUserProfile();
  };

  const handleSignOut = () => {
    posthog.capture("user_signed_out");
    signOut();
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return <AuthView mode="signInOrUp" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Clerk Native</Text>
          <Text style={styles.title}>Welcome</Text>
        </View>
        <View style={styles.userButtonFrame}>
          <UserButton />
        </View>
      </View>

      <View style={styles.profileCard}>
        {user?.imageUrl ? <Image source={{ uri: user.imageUrl }} style={styles.avatar} /> : null}
        <View style={styles.profileCopy}>
          <Text style={styles.name}>
            {user?.fullName || user?.firstName || user?.username || "Authenticated user"}
          </Text>
          <Text style={styles.email}>
            {user?.primaryEmailAddress?.emailAddress ?? user?.id ?? "No email available"}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleOpenDashboard}>
        <Text style={styles.primaryButtonText}>Open Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleManageProfile}>
        <Text style={styles.secondaryButtonText}>Manage Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tertiaryButton} onPress={handleSignOut}>
        <Text style={styles.tertiaryButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 40,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 28,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.accent,
    fontFamily: "sans-semibold",
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  title: {
    color: colors.foreground,
    fontFamily: "sans-extrabold",
    fontSize: 30,
    marginTop: 4,
  },
  userButtonFrame: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileCopy: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.foreground,
    fontFamily: "sans-semibold",
    fontSize: 18,
  },
  email: {
    color: colors.mutedForeground,
    fontFamily: "sans-regular",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontFamily: "sans-bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#fff",
    fontFamily: "sans-bold",
    fontSize: 16,
  },
  tertiaryButton: {
    backgroundColor: "#666666",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  tertiaryButtonText: {
    color: "#fff",
    fontFamily: "sans-bold",
    fontSize: 16,
  },
});
