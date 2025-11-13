import 'dart:convert';

import 'package:sqflite/sqflite.dart';

import '../database/app_database.dart';
import '../../shared/models/extracted_data.dart';

abstract class ProcessingRepository {
  Future<void> saveProcessingJob(String scanId, String jobId);
  Future<void> saveResult(ExtractedData data);
  Future<ExtractedData?> fetchResult(String scanId);
}

class ProcessingRepositoryImpl implements ProcessingRepository {
  @override
  Future<void> saveProcessingJob(String scanId, String jobId) async {
    final db = await AppDatabase.instance.database;
    await db.insert(
      'processing_jobs',
      {'scan_id': scanId, 'job_id': jobId},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<void> saveResult(ExtractedData data) async {
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

  @override
  Future<ExtractedData?> fetchResult(String scanId) async {
    final db = await AppDatabase.instance.database;
    final rows = await db.query(
      'extracted_data',
      where: 'scan_id = ?',
      whereArgs: [scanId],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    final row = rows.first;
    return ExtractedData(
      scanId: row['scan_id'] as String,
      fields: json.decode(row['payload'] as String) as Map<String, dynamic>,
      summary: row['summary'] as String?,
    );
  }
}
