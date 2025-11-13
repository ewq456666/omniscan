import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../business_logic/services/camera_service.dart';
import '../../business_logic/services/gallery_service.dart';
import '../../shared/models/scan_item.dart';

class CameraViewState {
  const CameraViewState({
    this.currentItem,
    this.isProcessing = false,
  });

  final ScanItem? currentItem;
  final bool isProcessing;

  CameraViewState copyWith({
    ScanItem? currentItem,
    bool? isProcessing,
  }) {
    return CameraViewState(
      currentItem: currentItem ?? this.currentItem,
      isProcessing: isProcessing ?? this.isProcessing,
    );
  }
}

class CameraController extends StateNotifier<CameraViewState> {
  CameraController({
    required this.service,
    required this.galleryService,
  }) : super(const CameraViewState()) {
    service.onPhotoCaptured.listen((event) {
      state = state.copyWith(currentItem: event.item, isProcessing: false);
    });
    galleryService.onImageSelected.listen((event) {
      state = state.copyWith(currentItem: event.item, isProcessing: false);
    });
  }

  final CameraService service;
  final GalleryService galleryService;

  Future<void> capturePhoto() async {
    state = state.copyWith(isProcessing: true);
    await service.capturePhoto();
  }

  Future<void> selectFromGallery() async {
    state = state.copyWith(isProcessing: true);
    await galleryService.selectImage();
  }
}
