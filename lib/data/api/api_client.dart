import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../core/error/app_error.dart';
import '../../shared/utils/api_response.dart';

class ApiClient {
  ApiClient({
    http.Client? httpClient,
    this.baseUrl = 'https://api.example.com',
    this.defaultHeaders = const {},
  }) : _httpClient = httpClient ?? http.Client();

  final http.Client _httpClient;
  final String baseUrl;
  final Map<String, String> defaultHeaders;

  Future<ApiResponse<Map<String, dynamic>>> get(
    String path, {
    Map<String, String>? headers,
  }) async {
    final response = await _httpClient.get(
      Uri.parse('$baseUrl$path'),
      headers: {...defaultHeaders, ...?headers},
    );
    return _handleResponse(response);
  }

  Future<ApiResponse<Map<String, dynamic>>> post(
    String path, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    final response = await _httpClient.post(
      Uri.parse('$baseUrl$path'),
      headers: {...defaultHeaders, ...?headers},
      body: body,
    );
    return _handleResponse(response);
  }

  ApiResponse<Map<String, dynamic>> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      final payload = json.decode(response.body) as Map<String, dynamic>;
      final data = (payload['data'] as Map<String, dynamic>? ?? payload);
      final meta = payload['meta'] as Map<String, dynamic>? ?? const {};
      return ApiResponse(data: data, metadata: meta);
    }

    throw ApiError(
      message: 'Request failed with status: ${response.statusCode}',
    );
  }
}
