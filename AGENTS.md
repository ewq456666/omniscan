# Repository Guidelines

## Architecture Snapshot
- **Platform & bootstrapping**: Expo SDK 54 + expo-router. `App.tsx` simply re-exports `expo-router/entry`. The router drives navigation; every file in `app/` maps to a route and renders a thin wrapper that imports the actual screen from `screens/`.
- **Layouts**:
  - `app/_layout.tsx` mounts `SafeAreaProvider`, configures the root `Stack`, registers every leaf route (camera, content-detail, pending-reviews, etc.), and syncs the Expo `StatusBar` with the active theme.
  - `app/(tabs)/_layout.tsx` owns the bottom tab navigator. Tabs are kept minimal (Home, Search, Settings, plus the “Scan” placeholder that re-routes to `/camera`) so real UI and business logic stay inside `screens/`.
- **Code organization**:
  - `screens/` contains all presentation + business logic per feature (Home, Search, PendingReviews, ContentDetail, Settings, etc.).
  - `components/` exposes reusable primitives. Global primitives live at the top level; complex home-only widgets (Hero cards, adaptive panel, etc.) sit under `components/home/`.
  - `stores/`, `theme/`, `hooks/`, `data/`, and `doc/` are single-purpose and imported via the `@/...` alias defined in `babel.config.js` and `tsconfig.json`.

## Navigation Surface
- **Tabs (`app/(tabs)`)**:
  - `index.tsx` → `HomeScreen`
  - `search.tsx` → `SearchScreen`
  - `settings.tsx` → `SettingsScreen`
  - `capture.tsx` intercepts the Scan tab and pushes `/camera`.
- **Stack-only routes (`app/*.tsx`)**:
  - Capture flow: `camera`, `gallery`, `processing`, `results`.
  - Content management: `content-list`, `content-detail`, `content-edit`.
  - New workflow: `pending-reviews` (lists all non-synced scans).
- Every route file simply returns `<FeatureScreen />`. Add future screens the same way: create the screen under `screens/`, add a stub in `app/`, and register it inside `app/_layout.tsx` if it is stack-based.

## Home Experience Framework
- `screens/HomeScreen.tsx` renders a modular “Bento” dashboard. Module order and the adaptive panel type come from `useMockDataStore().homeLayout`.
- Modular components live under `components/home/`:
  - `HeroInsightCard` (AI-style CTA), `QuickActionGrid`, `ProcessingCapsule`, `RecentScansStack`, `AdaptivePanel`.
- Quick actions, pending counts, and adaptive panel callbacks push into router destinations (`/camera`, `/processing`, `/pending-reviews`, `/content-detail?scanId=...`, etc.).
- When extending Home, add a new module component, register it in `homeLayout.order`, and keep data dependencies inside the screen (don’t couple modules directly to the store).

## State, Data & Preferences
- `stores/useMockDataStore.ts` is the single Zustand store. Initial data loads from `data/mockData.ts` (scans, content, extracted fields, tags, categories, processing steps).
- Store responsibilities:
  - `preferences`: theme (system/light/dark), auto-sync, notifications.
  - `homeLayout`: module ordering + adaptive panel choice.
  - `appStatus`: sync state and pending uploads count.
  - Primitive setters like `setThemePreference`, `toggleAutoSync`, `setHomeModulesOrder`, etc.
- Access pattern: subscribe to the smallest slice possible per screen/hook to avoid “getSnapshot must be cached” warnings. Use `useMockDataStore((state) => state.scans)` rather than returning new objects.
- Backend integration path: replace `mockData.ts` and extend the store with async loaders/actions; keep types colocated with each data definition.

## UI System & Theming
- Tokens: `theme/colors.ts`, `spacing.ts`, `typography.ts`. Do not hardcode values; import from these modules.
- `hooks/useThemeColors.ts` merges palette tokens + user preference + system scheme. Use it for any style referencing theme colors and to determine correct StatusBar style.
- Shared components:
  - `components/ContentCard`, `FieldCard`, `ProcessingStepItem`, `TagChip`, `SectionHeader`, etc.
  - New home widgets live under `components/home/`. Reuse them wherever possible before writing new bespoke UI.
- Follow React Native StyleSheet conventions, keep padding/elevation consistent, and surface user actions via accessible `Pressable`/`TouchableOpacity` with labels/hints.

## Feature Notes
- **Home**: Modular grid; uses Zustand layout metadata and exposes navigation hooks. Pending panel “View all” opens `/pending-reviews`.
- **Search**: Honors optional `tag` param (e.g., tapping Suggested tags). Shows active tag chip + clear control.
- **Pending Reviews**: `screens/PendingReviewsScreen.tsx` lists non-synced scans with filter chips. Selecting an item routes to `/content-detail?scanId=...`.
- **Content Detail**: Accepts `id` (content record) or `scanId` (raw scan). Shows extracted fields when available; otherwise displays scan metadata and status.
- **Settings**: Edits preferences in-place (theme, auto-sync, notifications) and uses SafeArea + Section headers.

## Contributor Expectations
- Use `npm run typecheck` before committing; Metro warnings often come from unstable selectors—keep store usage minimal.
- Preferred dev commands: `npm run start` (Expo), `npm run android`, `npm run ios`.
- When adding functionality:
  1. Create/extend Zustand slices for any new state.
  2. Add route stub in `app/`.
  3. Build the screen in `screens/` and reuse existing components or add new reusable ones under `components/`.
  4. Document architectural decisions in `doc/` if they affect future agents (e.g., new module framework, backend contracts).
- Maintain accessible interactions (labels, hints, `accessibilityState`) and respect the theming system. Keep commit history clean and reference this file when orienting new contributors.
