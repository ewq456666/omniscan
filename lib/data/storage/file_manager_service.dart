import 'dart:io';

import 'package:path_provider/path_provider.dart';

class FileManagerService {
  Future<File> saveFile(String name, List<int> bytes) async {
    final directory = await getApplicationDocumentsDirectory();
    final file = File('${directory.path}/$name');
    return file.writeAsBytes(bytes, flush: true);
  }

  Future<void> deleteFile(String path) async {
    final file = File(path);
    if (await file.exists()) {
      await file.delete();
    }
  }
}
