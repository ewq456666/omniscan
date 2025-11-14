# Repository Guidelines

## App Architecture Overview
OmniScan is an Expo SDK 54 React Native app that boots through `App.tsx → expo-router/entry`. The `app/` directory is the routing surface: files map 1:1 to screens, while `_layout.tsx` files compose navigators and providers. The root layout wires the `SafeAreaProvider`, Expo `Stack`, and app-wide status bar; the `(tabs)` group layout encapsulates the bottom tab navigator so leaf routes stay presentation-only.

## Routing & Screen Organization
- `app/(tabs)/index.tsx`, `search.tsx`, and `settings.tsx` host the main dashboard, search, and settings tabs.
- Leaf stack routes such as `app/camera.tsx`, `app/content-detail.tsx`, and `app/results.tsx` render feature screens without embedding navigation logic.
- Visual and business behavior for each screen lives under `screens/`, imported into the matching route file. This separation keeps Expo Router concerns (navigation) distinct from UI composition.

## State & Data Flow
- `stores/useMockDataStore.ts` is the single Zustand store. It hydrates mock scans, content, tags, and processing steps from `data/mockData.ts` and exposes tiny mutators (`toggleFavoriteTag`).
- Screens subscribe to slices of that store plus utility hooks (e.g., `useThemeColors`). No Redux or context layers exist—prefer adding selectors/actions to the Zustand store when new state is required.
- Async/real backends have not been integrated yet; swap `mockData.ts` for actual queries when needed and keep domain types alongside their data definitions.

## UI System & Theming
- Shared visual primitives live in `components/` (cards, badges, chips). Each component consumes palette tokens rather than hard-coded colors.
- `theme/colors.ts`, `spacing.ts`, and `typography.ts` define the design tokens. `hooks/useThemeColors.ts` adapts light/dark palettes and should be the entry point for color usage.
- Keep layout spacing consistent by importing from `theme/spacing`. When enhancing components, extend the existing StyleSheet blocks to preserve consistent padding, elevation, and border radii.

## Contributor Expectations
- File aliases (`@/...`) are declared in `tsconfig.json` and `babel.config.js`; use them instead of relative paths.
- This repository targets native builds only. Focus on `npm run start`, `npm run android`, and `npm run ios`; type safety is enforced through `npm run typecheck`.
- When adding new features, favor the existing structure: route stub in `app/`, screen implementation in `screens/`, shared UI in `components/`, state additions in the Zustand store, and any new tokens in `theme/`. Keep documentation for architectural decisions under `doc/` so future agents understand module boundaries.
