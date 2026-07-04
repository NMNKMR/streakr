# Streakr

A mobile habit tracker that helps you build consistent routines through streaks, flexible scheduling, timed sessions, and reminders — all stored locally on your device.

**Repository:** [github.com/NMNKMR/streakr](https://github.com/NMNKMR/streakr)

---

## Demo Video

[Watch the demo](https://youtu.be/REPLACE_WITH_YOUR_VIDEO_ID) *(replace this link with your uploaded demo)*

---

## Screenshots

| Today | Habits | Quick Action |
|:-----:|:------:|:------------:|
| ![Today screen](./assets/screenshots/today.png) | ![Habits screen](./assets/screenshots/habits.png) | ![Quick Action screen](./assets/screenshots/quick-action.png) |

| Settings | New Habit | Notifications |
|:--------:|:---------:|:-------------:|
| ![Settings](./assets/screenshots/settings.png) | ![New habit form](./assets/screenshots/new-habit.png) | ![Push notification](./assets/screenshots/notification.png) |

> Add PNG screenshots under `assets/screenshots/` with the filenames above, or update the paths in this table.

---

## About

**Streakr** is built with React Native and Expo SDK 55. Users create habits (name, emoji, schedule), log progress from the **Today** tab or via notification taps, and track **streaks** — consecutive days where every scheduled occurrence is completed.

The app is **offline-first**: habit data lives in SQLite. No backend is required for core features. Push notifications use Expo Push + Firebase Cloud Messaging (Android) for remote delivery and testing.

**Primary target:** Android · **Also supports:** iOS via the same codebase · **Builds:** EAS (development, preview, production)

---

## Features

| Feature | Description |
|--------|-------------|
| **Recurrence** | Daily, weekly (selected weekdays), interval (every N minutes in a time window) |
| **Multi-occurrence** | Multiple reminders per day; all must be done for the streak to count |
| **Timed sessions** | Optional duration (e.g. 30 min); start/stop from Today or Quick Action |
| **Streaks** | Computed from completion history; shown on cards and detail screens |
| **Local reminders** | On-device scheduling via `expo-notifications`; auto-reschedule on edit |
| **Push notifications** | Expo push token in Settings; test at [expo.dev/notifications](https://expo.dev/notifications) |
| **Deep linking** | Taps open **Quick Action** (`/habit/[id]`) to log, start, or finish — not the edit form |
| **Themes** | Light, dark, system — persisted with AsyncStorage |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.83, **Expo SDK 55** |
| Language | TypeScript |
| Navigation | Expo Router (file-based, stack + tabs) |
| Async state | TanStack Query v5 |
| Client UI state | Zustand |
| Database | expo-sqlite |
| Settings | AsyncStorage |
| Dates | date-fns |
| Notifications | expo-notifications (local + Expo Push Token) |
| Push (Android) | Firebase Cloud Messaging via EAS credentials |
| UI | expo-linear-gradient, expo-blur, @gorhom/bottom-sheet, expo-haptics |
| Fonts | Syne (headings), Inter (body) |
| Build / OTA | EAS Build, EAS Update |

---

## Architecture

Strict **layered architecture** — UI never calls SQLite or notification APIs directly.

```
Screens & components  →  hooks  →  lib (storage, streak logic, notifications)
```

| Path | Role |
|------|------|
| `src/app/` | Routes: Today, Habits, Settings, New/Edit habit, Quick Action |
| `src/components/` | Habit cards, forms, glass UI, bottom sheets |
| `src/hooks/` | TanStack Query hooks (CRUD, sessions, permissions, push) |
| `src/lib/habits/` | Types, SQLite, streak/occurrence logic, display helpers |
| `src/lib/notifications/` | Channel setup, local scheduling, push registration |
| `src/providers/` | Theme and Query providers |
| `src/store/` | Zustand UI state (form dirty flag, modals) |

**Streak rule:** A day counts only when **every** expected occurrence for that date is completed.

---

## Project Structure

```
src/
  app/
    (tabs)/index.tsx       # Today
    (tabs)/habits.tsx      # All habits
    (tabs)/settings.tsx    # Theme, permissions, push token
    habit/[id].tsx         # Quick Action (notification deep link)
    new.tsx                # Create habit
    edit/[id].tsx          # Edit habit
  components/habits/       # Cards, HabitForm, HabitActionContent
  components/ui/           # GlassCard, GradientButton, GlassBottomSheet
  hooks/                   # use-habits, use-permission, use-push-notifications, …
  lib/habits/              # storage.ts, streak.ts, types.ts, display.ts
  lib/notifications/       # setup, schedule, push, permissions
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm i -g eas-cli`)
- Physical Android device for notification testing (Expo Go does **not** support push on SDK 55)

### Install & run dev server

```bash
npm install
npx expo start
```

Connect your **EAS development build** (not Expo Go) to the dev server.

### Development build (required for notifications)

```bash
eas build --profile development --platform android
```

Install the APK, allow notifications, then check **Settings → Push Token**.

### Push test payload

Send from [expo.dev/notifications](https://expo.dev/notifications):

```json
{
  "to": "ExponentPushToken[YOUR_TOKEN]",
  "title": "Time for your habit",
  "body": "Tap to log it.",
  "data": {
    "screen": "/habit",
    "habitId": "YOUR_HABIT_ID"
  }
}
```

---

## Build Variants

| Profile | App name | Android package |
|---------|----------|-----------------|
| `development` | Streakr (Dev) | `com.namangoel.streakr.dev` |
| `preview` | Streakr (Preview) | `com.namangoel.streakr.preview` |
| `production` | Streakr | `com.namangoel.streakr` |

Firebase `google-services.json` and FCM v1 keys are configured per variant in EAS for push.

---

## App Icons & Assets

| Asset | Path | Used for |
|-------|------|----------|
| App / adaptive icon | `assets/icons/brand-logo.png` | Launcher icon (Android adaptive foreground/background) |
| Notification icon | `assets/icons/streakr-notify.png` | Status bar (Android; white silhouette on transparent) |
| Splash | `assets/icons/brand-logo.png` | Splash screen (`expo-splash-screen` plugin) |
| iOS icon | `assets/expo.icon` | iOS home screen (separate from `brand-logo.png`) |

**Icon changes require a new native EAS build** — they are not applied by `eas update` or Metro hot reload.

---

## What This Project Demonstrates

- Production-style React Native architecture with clear separation of concerns
- Offline-first SQLite persistence
- Non-trivial domain logic (multi-occurrence streaks, interval scheduling)
- Local and remote notifications with deep linking
- Polished mobile UI (Streakr Aura design system)
- EAS Build workflow with Firebase FCM for Android push

---

## License

Private — Mobile Dev Cohort submission.
