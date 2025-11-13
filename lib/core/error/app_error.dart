enum ErrorCategory {
  network,
  processing,
  storage,
  permission,
  unknown,
}

class AppError implements Exception {
  AppError({
    required this.message,
    this.category = ErrorCategory.unknown,
    this.stackTrace,
  });

  final String message;
  final ErrorCategory category;
  final StackTrace? stackTrace;

  @override
  String toString() => 'AppError($category): $message';
}
