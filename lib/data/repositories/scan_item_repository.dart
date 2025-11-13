import 'dart:convert';

import 'package:sqflite/sqflite.dart';

import '../database/app_database.dart';
import '../storage/file_manager_service.dart';
import '../../shared/models/extracted_data.dart';
import '../../shared/models/scan_item.dart';

abstract class ScanItemRepository {
  Future<void> saveScanItem(ScanItem item);
  Future<List<ScanItem>> fetchRecentScans();
  Future<void> deleteScan(String id);
  Future<void> saveExtractedData(ExtractedData data);
}

class ScanItemRepositoryImpl implements ScanItemRepository {
  ScanItemRepositoryImpl({FileManagerService? fileManager})
      : _fileManager = fileManager ?? FileManagerService();

  final FileManagerService _fileManager;

  @override
  Future<void> saveScanItem(ScanItem item) async {
    final db = await AppDatabase.instance.database;
    await db.insert(
      'scan_items',
      {
        'id': item.id,
        'file_path': item.filePath,
        'created_at': item.createdAt.toIso8601String(),
        'status': item.status.name,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<List<ScanItem>> fetchRecentScans() async {
    final db = await AppDatabase.instance.database;
    final rows = await db.query(
      'scan_items',
      orderBy: 'created_at DESC',
      limit: 20,
    );
    return rows
        .map(
          (row) => ScanItem(
            id: row['id'] as String,
            filePath: row['file_path'] as String,
            createdAt: DateTime.parse(row['created_at'] as String),
            status: ScanStatus.values.byName(row['status'] as String),
          ),
        )
        .toList();
  }

  @override
  Future<void> deleteScan(String id) async {
    final db = await AppDatabase.instance.database;
    final rows = await db.query(
      'scan_items',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );
    if (rows.isNotEmpty) {
      final filePath = rows.first['file_path'] as String;
      await _fileManager.deleteFile(filePath);
    }
    await db.delete('scan_items', where: 'id = ?', whereArgs: [id]);
    await db.delete('extracted_data', where: 'scan_id = ?', whereArgs: [id]);
  }

  @override
  Future<void> saveExtractedData(ExtractedData data) async {
    final db = await AppDatabase.instance.database;
    await db.insert(
      'extracted_data',
      {
        'scan_id': data.scanId,
        'payload': json.encode(data.fields),
        'summary': data.summary,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }
}
