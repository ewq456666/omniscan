import '../../core/error/error_handler.dart';
import '../../data/repositories/processing_repository.dart';
import '../../shared/models/extracted_data.dart';

class ResultsDisplayService {
  ResultsDisplayService({
    required this.errorHandler,
    ProcessingRepository? repository,
  }) : _repository = repository ?? ProcessingRepositoryImpl();

  final ErrorHandler errorHandler;
  final ProcessingRepository _repository;

  Future<ExtractedData?> fetchResult(String scanId) {
    return errorHandler.guard(() => _repository.fetchResult(scanId));
  }
}
