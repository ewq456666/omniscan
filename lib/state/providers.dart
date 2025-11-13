import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../business_logic/services/camera_service.dart';
import '../business_logic/services/content_management_service.dart';
import '../business_logic/services/gallery_service.dart';
import '../business_logic/services/processing_service.dart';
import '../business_logic/services/results_display_service.dart';
import '../core/error/error_handler.dart';
import '../core/navigation/navigation_service.dart';
import '../presentation/controllers/camera_controller.dart';
import '../presentation/controllers/content_controller.dart';
import '../presentation/controllers/home_controller.dart';
import '../presentation/controllers/processing_controller.dart';
import '../presentation/controllers/results_controller.dart';
import '../presentation/theme/app_theme.dart';
import '../shared/models/app_settings.dart';

final navigationServiceProvider = Provider<NavigationService>((ref) {
  return NavigationService();
});

final errorHandlerProvider = Provider<ErrorHandler>((ref) {
  return ErrorHandler(ref.read);
});

final cameraServiceProvider = Provider<CameraService>((ref) {
  return CameraService(errorHandler: ref.read(errorHandlerProvider));
});

final galleryServiceProvider = Provider<GalleryService>((ref) {
  return GalleryService(errorHandler: ref.read(errorHandlerProvider));
});

final processingServiceProvider = Provider<ProcessingService>((ref) {
  return ProcessingService(errorHandler: ref.read(errorHandlerProvider));
});

final resultsDisplayServiceProvider = Provider<ResultsDisplayService>((ref) {
  return ResultsDisplayService(errorHandler: ref.read(errorHandlerProvider));
});

final contentManagementServiceProvider = Provider<ContentManagementService>((ref) {
  return ContentManagementService(errorHandler: ref.read(errorHandlerProvider));
});

final appSettingsProvider = StateNotifierProvider<AppSettingsNotifier, AppSettings>((ref) {
  return AppSettingsNotifier();
});

final homeControllerProvider = Provider<HomeController>((ref) {
  return HomeController(
    cameraService: ref.read(cameraServiceProvider),
    galleryService: ref.read(galleryServiceProvider),
    navigationService: ref.read(navigationServiceProvider),
  );
});

final cameraControllerProvider = StateNotifierProvider<CameraController, CameraViewState>((ref) {
  return CameraController(
    service: ref.read(cameraServiceProvider),
    galleryService: ref.read(galleryServiceProvider),
  );
});

final processingControllerProvider = StateNotifierProvider<ProcessingController, ProcessingViewState>((ref) {
  return ProcessingController(
    processingService: ref.read(processingServiceProvider),
  );
});

final resultsControllerProvider = StateNotifierProvider<ResultsController, ResultsViewState>((ref) {
  return ResultsController(
    service: ref.read(resultsDisplayServiceProvider),
  );
});

final contentControllerProvider = StateNotifierProvider<ContentController, ContentViewState>((ref) {
  return ContentController(
    service: ref.read(contentManagementServiceProvider),
  );
});

final themeProvider = Provider<AppTheme>((ref) {
  return AppTheme();
});
