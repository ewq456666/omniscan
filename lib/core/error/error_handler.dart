import 'app_error.dart';

typedef Reader = T Function<T>(T Function());

typedef ErrorReporter = void Function(AppError error);

typedef RecoveryAction = Future<void> Function();

class ErrorHandler {
  ErrorHandler(this.read, {ErrorReporter? reporter}) : _reporter = reporter;

  final Reader read;
  final ErrorReporter? _reporter;

  Future<T> guard<T>(Future<T> Function() operation, {RecoveryAction? onRecover}) async {
    try {
      return await operation();
    } on AppError catch (error) {
      _report(error);
      if (onRecover != null) {
        await onRecover();
      }
      rethrow;
    } catch (error, stackTrace) {
      final appError = AppError(message: error.toString(), stackTrace: stackTrace);
      _report(appError);
      if (onRecover != null) {
        await onRecover();
      }
      throw appError;
    }
  }

  void _report(AppError error) {
    _reporter?.call(error);
  }
}
