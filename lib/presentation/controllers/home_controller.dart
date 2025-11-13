import '../../business_logic/services/camera_service.dart';
import '../../business_logic/services/gallery_service.dart';
import '../../core/navigation/navigation_service.dart';

class HomeController {
  HomeController({
    required this.cameraService,
    required this.galleryService,
    required this.navigationService,
  });

  final CameraService cameraService;
  final GalleryService galleryService;
  final NavigationService navigationService;

  Future<void> startCameraFlow() async {
    await cameraService.capturePhoto();
    // Navigation handled by UI for now.
  }

  Future<void> startGalleryFlow() async {
    await galleryService.selectImage();
  }
}
