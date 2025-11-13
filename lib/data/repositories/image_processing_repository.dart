import '../../shared/utils/api_response.dart';
import '../api/api_client.dart';

abstract class ImageProcessingRepository {
  Future<String> uploadImage(String filePath);
  Future<String> submitProcessing(String uploadToken);
  Future<Map<String, dynamic>> checkStatus(String jobId);
  Future<Map<String, dynamic>> getResult(String jobId);
}

class ImageProcessingRepositoryImpl implements ImageProcessingRepository {
  ImageProcessingRepositoryImpl({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient();

  final ApiClient _apiClient;

  @override
  Future<String> uploadImage(String filePath) async {
    final response = await _apiClient.post('/images/upload', body: {'filePath': filePath});
    return response.data['token'] as String;
  }

  @override
  Future<String> submitProcessing(String uploadToken) async {
    final response = await _apiClient.post('/images/process', body: {'token': uploadToken});
    return response.data['jobId'] as String;
  }

  @override
  Future<Map<String, dynamic>> checkStatus(String jobId) async {
    final response = await _apiClient.get('/images/status/$jobId');
    return response.data;
  }

  @override
  Future<Map<String, dynamic>> getResult(String jobId) async {
    final response = await _apiClient.get('/images/result/$jobId');
    return response.data;
  }
}
