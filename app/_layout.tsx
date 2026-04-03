import "@/global.css";
import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { PostHogProvider } from "posthog-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { posthog } from "@/src/config/posthog";
import { colors } from "@/assets/constants/theme";

SplashScreen.preventAutoHideAsync();

const publishableKey =
  (Constants.expoConfig?.extra?.clerkPublishableKey as string | undefined) ??
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function MissingConfigScreen() {
  return (
    <SafeAreaView style={styles.centered}>
      <View style={styles.card}>
        <Text style={styles.title}>Missing Clerk configuration</Text>
        <Text style={styles.body}>
          Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` to your local `.env` file and restart Expo.
        </Text>
        <Text style={styles.caption}>
          Analytics stays optional, but Clerk auth cannot start without a publishable key.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Syncs Clerk user identity to PostHog whenever auth state changes
function PostHogClerkSync() {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      posthog.identify(user.id, {
        $set_once: {
          first_seen_at: new Date().toISOString(),
        },
      });
    } else if (!isSignedIn) {
      posthog.reset();
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}

export default function RootLayout() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Manual screen tracking for Expo Router
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!publishableKey) {
    return (
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ["testID"],
        }}
      >
        <MissingConfigScreen />
      </PostHogProvider>
    );
  }

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <PostHogClerkSync />
        <Slot />
      </ClerkProvider>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 10,
  },
  title: {
    color: colors.foreground,
    fontFamily: "sans-bold",
    fontSize: 22,
  },
  body: {
    color: colors.foreground,
    fontFamily: "sans-medium",
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    color: colors.mutedForeground ?? colors.foreground,
    fontFamily: "sans-regular",
    fontSize: 13,
    lineHeight: 20,
  },
});
