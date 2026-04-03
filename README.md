# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Read Me First. (Used Third Party)

- Expo & EAS
  - Handle Development & Deployment
- Clerk
  - Handle Auth & Billing
- PostHog
  - Handle Analytics & Experimentation
- CodeRabbit
  - Handle Code Qualit y
- Nativewind
  - Styling

# Build Commands

## Starting Point

- npx create-expo-app@latest --template default@sdk-54 ./
- npm run reset-project
- npx expo start

## Nativewind
- npx expo install nativewind@preview react-native-css react-native-reanimated react-native-safe-area-context
- npx expo install --dev tailwindcss @tailwindcss/postcss postcss
- npx expo customize metro.config.js

https://www.nativewind.dev/v5/getting-started/installation

### Note: create files according nativewind docx.

- If not styled works delete package-lock.json and npm install again and npx expo start --clear
- rm -rf node_modules package-lock.json
# Single line (Skip manual)

- npx rn-new@next --nativewind

### Styles
- npm i clsx
- npm i react-native-safe-area-context
- npm install dayjs

## Open Simulator
- open -a Simulator

## PostHug
- npx -y @posthog/wizard@latest
- npx expo install posthog-react-native expo-file-system expo-application expo-device expo-localization  ## Expo

## Subscription Page Prompt
```
Implement a searchable subscriptions list using the existing subscription card component and the dummy data from constants. on the subscription screen.
```

## Create Subscription
```
Study the entire codebase, paying close attention to the existing design system in global.css (especially the modal-, picker-, category-, and auth- component classes), the existing components in src/components/, the constants in src/constants/data.ts and src/constants/icons.ts, and the home screen at src/app/(tabs)/index.tsx.
Create a src/components/CreateSubscriptionModal.tsx component that:
Is a React Native <Modal> that slides up from the bottom with a transparent overlay
Has a header with "New Subscription" title and a close button
Has four form fields:
Name: TextInput (use auth-input class)
Price: TextInput with keyboardType="decimal-pad" (use auth-input class)
Frequency: Two toggle buttons for Monthly/Yearly (use picker-option / picker-option-active classes)
Category: Chip selection from these options: Entertainment, AI Tools, Developer Tools, Design, Productivity, Cloud, Music, Other (use category-chip / category-chip-active classes)
Has a submit button (use auth-button / auth-button-disabled classes) that validates name is not empty and price is a positive number
On submit: creates a subscription object with id, name, price, frequency, category, status ("active"), startDate, renewalDate (calculated from frequency), icon (use icons.wallet), billing (same as frequency), and a color based on category
Uses KeyboardAvoidingView for iOS
Resets form and closes modal after successful creation
Then hook it up to the home screen:
The "+" icon (icons.add) in the home header should open this modal when tapped (wrap in a Pressable)
When a subscription is created, add it to the beginning of the subscriptions list on the home screen
The new subscription should immediately appear in both the "All Subscriptions" FlatList and the home screen state
Use clsx for conditional class toggling (already installed). Use dayjs for date calculations (already installed). Match the visual style of the existing auth screens. Do NOT install any new packages.
Make sure the newly created subscription also shows on the subscriptions screen.
```


## Deploy (EAS) https://expo.dev
- npm install -g eas-cli
- eas login
- eas whoami #Verify
- eas build:configure
- eas build --platform ios --profile production
- eas build --platform android --profile production
Or,
- eas build --platform all --profile production

**Note: before build make sure**
- rm -rf node_modules package-lock.json
- npm install