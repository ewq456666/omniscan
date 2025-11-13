class ScanItem {
  const ScanItem({
    required this.id,
    required this.filePath,
    required this.createdAt,
    this.status = ScanStatus.pending,
  });

  final String id;
  final String filePath;
  final DateTime createdAt;
  final ScanStatus status;

  ScanItem copyWith({
    String? id,
    String? filePath,
    DateTime? createdAt,
    ScanStatus? status,
  }) {
    return ScanItem(
      id: id ?? this.id,
      filePath: filePath ?? this.filePath,
      createdAt: createdAt ?? this.createdAt,
      status: status ?? this.status,
    );
  }
}

enum ScanStatus {
  pending,
  processing,
  completed,
  failed,
}
