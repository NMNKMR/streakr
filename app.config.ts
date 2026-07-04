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
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/icons/brand-logo.png",
      backgroundImage: "./assets/icons/brand-logo.png",
      monochromeImage: "./assets/icons/brand-logo.png",
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
        icon: "./assets/icons/streakr-notify.png",
        defaultChannel: "default",
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/icons/brand-logo.png",
          imageWidth: 76,
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
