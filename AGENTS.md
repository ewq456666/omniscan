# Repository Guidelines

## Architecture Snapshot
- **Platform & bootstrapping**: Expo SDK 54 + `expo-router`. `App.tsx` eagerly imports `@/i18n/config` and then re-exports `expo-router/entry`, so the router owns the React tree.
- **Layouts**:
  - `app/_layout.tsx` mounts `I18nextProvider`, `LocalizationProvider`, `SafeAreaProvider`, configures the root `Stack`, registers every stack screen (camera, content-detail, pending-reviews, etc.), and keeps the Expo `StatusBar` in sync with `useThemeColors`.
  - `app/(tabs)/_layout.tsx` owns the bottom tabs (Home, Search, Settings, plus the Scan interceptor that routes to `/camera`). Tabs stay UI-lite; real feature logic lives inside `screens/`.
- **Code organization**:
  - `screens/`: all feature implementations (Home, Search, PendingReviews, ContentDetail, Settings, capture flow, etc.).
  - `components/`: reusable primitives. Home-only widgets live under `components/home/`.
  - `stores/`, `theme/`, `hooks/`, `data/`, `providers/`, `i18n/`, `locales/`, and `doc/` stay single-purpose and are imported via the `@/...` alias declared in `babel.config.js` + `tsconfig.json`.

## Navigation Surface
- **Tabs (`app/(tabs)`)**:
  - `index.tsx` → `HomeScreen`
  - `search.tsx` → `SearchScreen`
  - `settings.tsx` → `SettingsScreen`
  - `capture.tsx` intercepts the Scan tab and pushes `/camera`.
- **Stack-only routes (`app/*.tsx`)**:
  - Capture flow: `camera`, `gallery`, `processing`, `results`.
  - Content management: `content-list`, `content-detail`, `content-edit`.
  - Workflow utilities: `pending-reviews` for non-synced scans.
- Each route file simply returns `<FeatureScreen />`. New screens follow the same pattern: build the screen in `screens/`, add a stub in `app/`, and register it in `app/_layout.tsx` if it is stack-based.

## Home Experience Framework
- `screens/HomeScreen.tsx` renders a modular “Bento” dashboard driven by `useMockDataStore().homeLayout` (module order + adaptive panel type).
- Modular blocks:
  - `HeroInsightCard`, `QuickActionGrid`, `ProcessingCapsule`, `RecentScansStack`, `AdaptivePanel` under `components/home/`.
- Quick actions, pending counts, and adaptive panel callbacks push directly into router destinations (`/camera`, `/processing`, `/pending-reviews`, `/content-detail?scanId=...`, etc.).
- Extending Home: add a new module component, register it in `homeLayout.order`, and keep data dependencies at the screen level so modules stay dumb UI.

## State, Data & Preferences
- `stores/useMockDataStore.ts` is the single Zustand store. Initial data is mocked via `data/mockData.ts` (scans, content, fields, tags, categories, processing steps).
- Store slices cover `preferences` (theme/system locale/auto-sync/notifications), `homeLayout`, `appStatus`, and primitive setters such as `setThemePreference`, `toggleAutoSync`, `setAdaptivePanelType`, etc.
- Access pattern: always subscribe to the narrowest slice (`useMockDataStore((state) => state.scans)`). Avoid returning new objects from selectors to prevent React 19 “getSnapshot must be cached” warnings.
- Backend integration path: replace `mockData.ts` with real loaders/actions, keep types colocated with data definitions, and extend the store with async setters.

## Localization System
- `i18n/config.ts` wires `i18next` + `initReactI18next`, loads JSON resources from `locales/en.json` and `locales/zh-TW.json`, and auto-detects the system locale via `expo-localization` (`detectSystemLanguage` + `toSupportedLanguage`).
- `providers/LocalizationProvider.tsx` watches the user’s locale preference in Zustand (`system`, `en`, `zh-TW`), syncs `i18next.changeLanguage`, and withholds rendering until i18next is ready.
- Use `useTranslation()` in every UI module; never hardcode user-facing strings. When adding copy, create a semantic key, update both locale files, and prefer interpolation (`t('home.hero.pendingSubtitle', { count })`) over string concatenation.
- When introducing a new locale:
  1. Add the JSON file under `locales/` and register it in `i18n/config.ts` `resources` + `supportedLanguages`.
  2. Extend the `LocalePreference` union + settings UI.
  3. Keep `LocalizationProvider` logic in sync.

## UI System & Theming
- Tokens live in `theme/colors.ts`, `spacing.ts`, `typography.ts`. Import them instead of hardcoding values.
- `hooks/useThemeColors.ts` merges palette tokens with the user/system preference and exposes semantic colors (`background`, `surface`, `text`, etc.) plus `isDark` for StatusBar handling.
- Shared components include `ContentCard`, `FieldCard`, `ProcessingStepItem`, `TagChip`, `SectionHeader`, etc. Prefer reusing and extending these primitives before introducing bespoke UI.
- Follow React Native `StyleSheet` conventions, keep padding/elevation consistent, and surface user actions via accessible `Pressable`/`TouchableOpacity` with labels and hints.

## Zustand Usage Best Practices
- Selectors must be stable: `useMockDataStore((state) => state.tags)` is good, destructuring the entire store is not.
- Derived data belongs in `useMemo` inside the consuming component (e.g., pending counts, processing summaries). Do not derive objects in selectors unless memoized.
- When multiple components need the same slice, create lightweight hooks (e.g., `useScans()` that just returns `state.scans`) to keep call sites consistent.

## Feature Notes
- **Home**: Modular grid with adaptive panel; “View all” on the pending panel routes to `/pending-reviews`.
- **Search**: Honors optional `tag` param (from chips/deep links). Shows the active tag chip plus a clear control.
- **Pending Reviews**: Lists every scan in `processing` or `error`, provides filter chips, relative timestamps, and routes to `/content-detail?scanId=...` on selection.
- **Content Detail**: Accepts `id` (content record) or `scanId` (raw scan). Shows extracted fields when available otherwise falls back to scan metadata + status.
- **Settings**: Edits theme/locale/auto-sync/notifications in-place using the shared components + SafeArea layout.

## Contributor Expectations
- Run `npm run typecheck` before committing; React 19 + Zustand selectors can surface warnings late in Metro if you skip this step.
- Preferred dev commands: `npm run start` (Expo), `npm run android`, `npm run ios`.
- When adding functionality:
  1. Extend the Zustand store (new slice or setter) before touching UI.
  2. Add the route stub in `app/` if navigation is required.
  3. Implement the screen under `screens/` using existing components or new reusable ones under `components/`.
  4. Update localization files for all user-facing strings.
  5. Document architectural shifts in `doc/` for future agents.
- Keep interactions accessible (`accessibilityLabel`, `accessibilityHint`, `accessibilityState`) and respect theming/localization at every layer.

## Testing & QA
- Today’s safety net is `npm run typecheck`; treat it as mandatory. Add unit tests for pure logic (selectors, helpers) as they emerge, and plan for Detox smoke coverage once flows solidify.
- When touching localization or Zustand selectors, sanity-check in both light/dark themes and both locales (`en`, `zh-TW`) to avoid regressions.
- Flag mock-data artifacts early (e.g., encoding glitches, placeholder thumbnails) so they can be replaced when wiring the backend.
