import "@/global.css";
import { useUser } from "@clerk/expo";
import {FlatList, Image, Text, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context';
import { styled } from "nativewind";
import images from "@/assets/constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS} from "@/assets/constants/data";
import {icons} from "@/assets/constants/icons";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpComingSubscriptionCard from "@/components/UpComingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import {useState} from "react";
import { usePostHog } from "posthog-react-native";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const { user } = useUser();
    const posthog = usePostHog();

    const handleSubscriptionCardPress = (id: string, name: string) => {
        const isExpanding = expandedSubscriptionId !== id;
        setExpandedSubscriptionId((currentId) => (currentId === id ? null : id));
        if (isExpanding) {
            posthog.capture("subscription_card_expanded", { subscription_id: id, subscription_name: name });
        } else {
            posthog.capture("subscription_card_collapsed", { subscription_id: id, subscription_name: name });
        }
    };

    const displayName =
        user?.fullName ||
        user?.firstName ||
        user?.primaryEmailAddress?.emailAddress ||
        "Subscriber";

    const secondaryIdentity =
        user?.primaryEmailAddress?.emailAddress ||
        `User ID: ${user?.id ?? "Unavailable"}`;
  return (
    <SafeAreaView className="flex-1 bg-background p-5">



            <FlatList
                ListHeaderComponent = {() =>
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image source={images.avatar} className="home-avatar" />
                                <View>
                                    <Text className="home-user-name">{displayName}</Text>
                                    <Text className="text-xs text-foreground/60">{secondaryIdentity}</Text>
                                </View>
                            </View>

                            <Image source={icons.add} className="home-add-icon" />
                        </View>
                        <View className="home-balance-card">
                            <Text className="home-balance-label">Balance</Text>
                            <View className="home-balance-row">
                                <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                                <Text className="home-balance-date">
                                    {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}
                                </Text>
                            </View>
                        </View>
                        <View className="mb-5">
                            <ListHeading title="Upcoming" />
                            <FlatList
                                data={UPCOMING_SUBSCRIPTIONS}
                                renderItem={({item}) => (<UpComingSubscriptionCard{...item} />)}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={<Text className="home-empty-state">No upcoming subscriptions</Text> }
                            />
                        </View>
                        <ListHeading title="All Subscriptions" />
                    </>
                }
                data={HOME_SUBSCRIPTIONS}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <SubscriptionCard{...item}
                                     expanded={expandedSubscriptionId === item.id}
                                     onPress={() => handleSubscriptionCardPress(item.id, item.name)}
                    />
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
                contentContainerClassName="pb-30"
            />

    </SafeAreaView >
  );
}
