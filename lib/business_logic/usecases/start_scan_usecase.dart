import '../services/camera_service.dart';
import '../services/gallery_service.dart';

class StartScanUseCase {
  StartScanUseCase({
    required this.cameraService,
    required this.galleryService,
  });

  final CameraService cameraService;
  final GalleryService galleryService;

  Future<void> fromCamera() => cameraService.capturePhoto();

  Future<void> fromGallery() => galleryService.selectImage();
}
