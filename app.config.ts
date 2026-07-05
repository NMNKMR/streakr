import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getAppName = () => {
  if (IS_DEV) return "Streakr (Dev)";
  if (IS_PREVIEW) return "Streakr (Preview)";
  return "Streakr";
};

const getPackageName = () => {
  if (IS_DEV) return "com.namangoel.streakr.dev";
  if (IS_PREVIEW) return "com.namangoel.streakr.preview";
  return "com.namangoel.streakr";
};

const getBundleIdentifier = () => {
  if (IS_DEV) return "com.namangoel.streakr.dev";
  if (IS_PREVIEW) return "com.namangoel.streakr.preview";
  return "com.namangoel.streakr";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: "streakr",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/brand-logo.png",
  scheme: "mdcstreakr",
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: getBundleIdentifier(),
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#FFFFFF",
      foregroundImage: "./assets/icons/android-icon-foreground.png",
      backgroundImage: "./assets/icons/android-icon-background.png",
      monochromeImage: "./assets/icons/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: getPackageName(),
    googleServicesFile: "./google-services.json",
  },
  web: {
    output: "static",
    favicon: "./assets/icons/brand-logo.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-notifications",
      {
        icon: "./assets/icons/streakr-notify-small.png",
        defaultChannel: "default",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FFFFFF",
        image: "./assets/icons/android-icon-foreground.png",
        imageWidth: 200,
        dark: {
          image: "./assets/icons/android-icon-foreground.png",
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-sqlite",
    "@react-native-community/datetimepicker",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    eas: {
      projectId: "22c91122-ee2c-475b-bf24-cc2275a6b0a3",
    },
  },
  updates: {
    url: "https://u.expo.dev/22c91122-ee2c-475b-bf24-cc2275a6b0a3",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
