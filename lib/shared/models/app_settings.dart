import 'package:flutter/material.dart';

class AppSettings {
  const AppSettings({
    this.themeMode = ThemeMode.system,
    this.enableCaching = true,
  });

  final ThemeMode themeMode;
  final bool enableCaching;

  AppSettings copyWith({
    ThemeMode? themeMode,
    bool? enableCaching,
  }) {
    return AppSettings(
      themeMode: themeMode ?? this.themeMode,
      enableCaching: enableCaching ?? this.enableCaching,
    );
  }
}

class AppSettingsNotifier extends StateNotifier<AppSettings> {
  AppSettingsNotifier() : super(const AppSettings());

  void updateThemeMode(ThemeMode mode) {
    state = state.copyWith(themeMode: mode);
  }

  void toggleCaching() {
    state = state.copyWith(enableCaching: !state.enableCaching);
  }
}
