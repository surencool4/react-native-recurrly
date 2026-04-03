<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the OWCAPP subscription tracking app. Here's what was done:

- **Package installation**: `posthog-react-native`, `react-native-svg`, `expo-file-system`, `expo-application`, `expo-device`, `expo-localization` installed as dependencies.
- **Environment variables**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added to `.env` and injected at build time via `app.config.js` extras.
- **`app.config.js`**: `app.json` was converted to `app.config.js` to support dynamic env var injection. PostHog token and host are read from `process.env` and exposed via `Constants.expoConfig.extra`.
- **`src/config/posthog.ts`** (new): Singleton PostHog client configured via `expo-constants`. Gracefully disabled if token is not set.
- **`app/_layout.tsx`**: Wrapped the app with `PostHogProvider`. Added manual screen tracking via `usePathname` + `useEffect`. Added `PostHogClerkSync` — an inner component that calls `posthog.identify(user.id)` when Clerk reports a signed-in user, and `posthog.reset()` on sign-out.
- **`app/(tabs)/index.tsx`**: Tracks `subscription_card_expanded` and `subscription_card_collapsed` with `subscription_id` and `subscription_name` properties.
- **`app/(tabs)/settings.tsx`**: Tracks `user_signed_out` before calling Clerk's `signOut()`.
- **`app/subscriptions/[id].tsx`**: Tracks `subscription_details_viewed` with `subscription_id` on mount.
- **`app/index.native.tsx`**: Tracks `dashboard_opened` when user navigates to the tab dashboard, `manage_profile_pressed` when opening the profile modal, and `user_signed_out` on the native sign-out button.

| Event | Description | File |
|---|---|---|
| `subscription_card_expanded` | User expands a subscription card to see details | `app/(tabs)/index.tsx` |
| `subscription_card_collapsed` | User collapses a previously expanded subscription card | `app/(tabs)/index.tsx` |
| `subscription_details_viewed` | User opens the subscription details screen | `app/subscriptions/[id].tsx` |
| `dashboard_opened` | User taps 'Open Dashboard' from the native welcome screen | `app/index.native.tsx` |
| `user_signed_out` | User signs out (tracked in both settings and native screen) | `app/(tabs)/settings.tsx`, `app/index.native.tsx` |
| `manage_profile_pressed` | User opens the profile management modal | `app/index.native.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/362078/dashboard/1427311
- **Subscription Engagement Funnel** (dashboard → card expanded → details viewed): https://us.posthog.com/project/362078/insights/KOiMKiyK
- **Daily Active Users (App Opens)**: https://us.posthog.com/project/362078/insights/34EqPHwD
- **Subscription Card Engagement vs Details Viewed**: https://us.posthog.com/project/362078/insights/kPGv2Gwn
- **Sign-out Rate (Churn Signal)**: https://us.posthog.com/project/362078/insights/KYvWavBN
- **Dashboard Opened**: https://us.posthog.com/project/362078/insights/BERqpXe4

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
