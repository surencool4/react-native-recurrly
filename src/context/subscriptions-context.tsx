import { HOME_SUBSCRIPTIONS } from "@/assets/constants/data";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | undefined>(
  undefined
);

interface SubscriptionsProviderProps {
  children: ReactNode;
}

export function SubscriptionsProvider({
  children,
}: SubscriptionsProviderProps) {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  const value = useMemo(
    () => ({
      subscriptions,
      addSubscription: (subscription: Subscription) => {
        setSubscriptions((currentSubscriptions) => [
          subscription,
          ...currentSubscriptions,
        ]);
      },
    }),
    [subscriptions]
  );

  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);

  if (!context) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
  }

  return context;
}
