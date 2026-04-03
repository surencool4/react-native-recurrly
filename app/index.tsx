import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/assets/constants/theme";

export default function WebEntryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Web Unsupported</Text>
        <Text style={styles.title}>Native Clerk UI requires a dev build</Text>
        <Text style={styles.body}>
          This app is configured to use Clerk native components. Run it on iOS or Android with
          `npx expo run:ios` or `npx expo run:android`.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 12,
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
  },
  body: {
    color: colors.mutedForeground,
    fontFamily: "sans-regular",
    fontSize: 15,
    lineHeight: 22,
  },
});
