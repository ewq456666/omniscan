import 'dart:typed_data';

import 'file_manager_service.dart';

abstract class StorageRepository {
  Future<String> saveImage(Uint8List bytes);
  Future<void> delete(String path);
}

class StorageRepositoryImpl implements StorageRepository {
  StorageRepositoryImpl({FileManagerService? fileManager})
      : _fileManager = fileManager ?? FileManagerService();

  final FileManagerService _fileManager;

  @override
  Future<String> saveImage(Uint8List bytes) async {
    final file = await _fileManager.saveFile(
      'scan_${DateTime.now().millisecondsSinceEpoch}.jpg',
      bytes,
    );
    return file.path;
  }

  @override
  Future<void> delete(String path) => _fileManager.deleteFile(path);
}
