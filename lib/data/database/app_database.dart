import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

class AppDatabase {
  AppDatabase._();

  static final AppDatabase instance = AppDatabase._();
  Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _openDatabase();
    return _database!;
  }

  Future<Database> _openDatabase() async {
    final directory = await getApplicationDocumentsDirectory();
    final path = p.join(directory.path, 'omniscan.db');
    return openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE scan_items (
            id TEXT PRIMARY KEY,
            file_path TEXT,
            created_at TEXT,
            status TEXT
          );
        ''');
        await db.execute('''
          CREATE TABLE extracted_data (
            scan_id TEXT PRIMARY KEY,
            payload TEXT,
            summary TEXT
          );
        ''');
        await db.execute('''
          CREATE TABLE processing_jobs (
            scan_id TEXT PRIMARY KEY,
            job_id TEXT
          );
        ''');
      },
    );
  }
}
