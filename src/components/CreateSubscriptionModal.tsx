import "@/global.css";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { icons } from "@/assets/constants/icons";

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const FREQUENCY_OPTIONS = ["Monthly", "Yearly"] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  Entertainment: "#ffd6a5",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#c7f0d8",
  Cloud: "#c8e7ff",
  Music: "#d9c2ff",
  Other: "#d9d4c7",
};

type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number];
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const defaultCategory: CategoryOption = "Entertainment";
const defaultFrequency: FrequencyOption = "Monthly";

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<FrequencyOption>(defaultFrequency);
  const [category, setCategory] = useState<CategoryOption>(defaultCategory);
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  const parsedPrice = useMemo(() => Number.parseFloat(price), [price]);
  const isPriceValid = Number.isFinite(parsedPrice) && parsedPrice > 0;
  const isFormValid = name.trim().length > 0 && isPriceValid;

  useEffect(() => {
    if (visible) return;
    setName("");
    setPrice("");
    setFrequency(defaultFrequency);
    setCategory(defaultCategory);
    setNameError("");
    setPriceError("");
  }, [visible]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const nextNameError = trimmedName ? "" : "Name is required.";
    const nextPriceError = isPriceValid ? "" : "Enter a valid positive price.";

    setNameError(nextNameError);
    setPriceError(nextPriceError);

    if (nextNameError || nextPriceError) {
      return;
    }

    const startDate = dayjs();
    const renewalDate =
      frequency === "Yearly" ? startDate.add(1, "year") : startDate.add(1, "month");

    onCreate({
      id: `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${startDate.valueOf()}`,
      name: trimmedName,
      price: parsedPrice,
      frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category],
      currency: "USD",
      plan: `${frequency} Plan`,
    });

    setName("");
    setPrice("");
    setFrequency(defaultFrequency);
    setCategory(defaultCategory);
    setNameError("");
    setPriceError("");
    handleClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <Pressable className="modal-overlay" onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end"
        >
          <Pressable className="modal-container" onPress={() => {}}>
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerClassName="modal-body pb-8"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    if (nameError && value.trim()) {
                      setNameError("");
                    }
                  }}
                  placeholder="Spotify"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  className={clsx("auth-input", nameError && "auth-input-error")}
                />
                {nameError ? <Text className="auth-error">{nameError}</Text> : null}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={(value) => {
                    setPrice(value.replace(",", "."));
                    if (priceError) {
                      setPriceError("");
                    }
                  }}
                  keyboardType="decimal-pad"
                  placeholder="9.99"
                  placeholderTextColor="rgba(0, 0, 0, 0.45)"
                  className={clsx("auth-input", priceError && "auth-input-error")}
                />
                {priceError ? <Text className="auth-error">{priceError}</Text> : null}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {FREQUENCY_OPTIONS.map((option) => {
                    const active = frequency === option;
                    return (
                      <Pressable
                        key={option}
                        className={clsx("picker-option", active && "picker-option-active")}
                        onPress={() => setFrequency(option)}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            active && "picker-option-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORY_OPTIONS.map((option) => {
                    const active = category === option;
                    return (
                      <Pressable
                        key={option}
                        className={clsx("category-chip", active && "category-chip-active")}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            active && "category-chip-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                className={clsx("auth-button", !isFormValid && "auth-button-disabled")}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default CreateSubscriptionModal;
