import '../../core/error/app_error.dart';

class ApiResponse<T> {
  ApiResponse({required this.data, required this.metadata});

  final T data;
  final Map<String, dynamic> metadata;

  static ApiResponse<T> fromJson<T>(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic> json) parser,
  ) {
    return ApiResponse(
      data: parser(json['data'] as Map<String, dynamic>),
      metadata: json['meta'] as Map<String, dynamic>? ?? const {},
    );
  }
}

class ApiError extends AppError {
  ApiError({required super.message, super.category = ErrorCategory.network});
}
