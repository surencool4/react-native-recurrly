import React, { useState } from 'react'
import {FlatList, Text, TextInput, View} from 'react-native'
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import { styled } from "nativewind";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/src/context/subscriptions-context";
const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [query, setQuery] = useState('');
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const { subscriptions } = useSubscriptions();

    const normalizedQuery = query.trim().toLowerCase();
    const filteredSubscriptions = subscriptions.filter((subscription) => {
        if (!normalizedQuery) {
            return true;
        }

        return [
            subscription.name,
            subscription.category,
            subscription.plan,
            subscription.billing,
            subscription.status,
        ]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });

    const handleSubscriptionCardPress = (id: string) => {
        setExpandedSubscriptionId((currentId) => (currentId === id ? null : id));
    };

    return (
        <SafeAreaView className="sub-screen">
            <FlatList
                data={filteredSubscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => handleSubscriptionCardPress(item.id)}
                    />
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View className="sub-header-block">
                        <View className="sub-heading-row">
                            <Text className="sub-screen-title">Subscriptions</Text>
                            <Text className="sub-screen-count">
                                {filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? 'result' : 'results'}
                            </Text>
                        </View>
                        <Text className="sub-screen-copy">
                            Search by name, category, plan, billing cycle, or status.
                        </Text>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search subscriptions"
                            placeholderTextColor="rgba(0, 0, 0, 0.45)"
                            className="sub-search-input"
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                        />
                    </View>
                }
                ListEmptyComponent={
                    <View className="sub-empty-wrap">
                        <Text className="sub-empty-title">No subscriptions found</Text>
                        <Text className="sub-empty-copy">Try a different search term.</Text>
                    </View>
                }
                contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    )
}
export default Subscriptions
