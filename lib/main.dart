import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'presentation/pages/home_page.dart';
import 'state/providers.dart';

void main() {
  runApp(const ProviderScope(child: OmniScanApp()));
}

class OmniScanApp extends ConsumerWidget {
  const OmniScanApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(themeProvider);
    return MaterialApp(
      title: 'OmniScan',
      theme: theme.lightTheme,
      darkTheme: theme.darkTheme,
      themeMode: ref.watch(appSettingsProvider).themeMode,
      navigatorKey: ref.watch(navigationServiceProvider).navigatorKey,
      home: const HomePage(),
    );
  }
}
