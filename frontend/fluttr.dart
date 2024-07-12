import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Video Analysis App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String transcript = '';
  double sentimentScore = 0.0;
  int fillerCount = 0;
  int grammarErrors = 0;
  List<String> suggestions = [];
  bool isLoading = false;
  TextEditingController _pathController = TextEditingController();

  Future<void> analyzeVideo(String path) async {
    setState(() {
      isLoading = true;
    });

    String url = 'http://127.0.0.1:5000/analyze-video'; // Updated URL

    try {
      final response = await http.post(
        Uri.parse(url),
        body: json.encode({"path": path}), // Pass path in the request body
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          transcript = data['transcript'];
          sentimentScore = data['sentiment_score'];
          fillerCount = data['filler_count'];
          grammarErrors = data['grammar_errors'];
          suggestions = List<String>.from(data['suggestions']);
          isLoading = false;
        });
      } else {
        setState(() {
          transcript = 'Failed to analyze video';
          isLoading = false;
        });
      }
    } catch (error) {
      setState(() {
        transcript = 'Error: $error';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    String sentimentText = '';
    if (sentimentScore >= 0.15) {
      sentimentText = 'Positive';
    } else {
      sentimentText = 'Negative';
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Video Analysis'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            TextField(
              controller: _pathController,
              decoration: InputDecoration(
                labelText: 'Enter Video Path',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                analyzeVideo(_pathController.text);
              },
              child: Text('Analyze Video'),
            ),
            SizedBox(height: 20),
            if (isLoading)
              CircularProgressIndicator()
            else
              Expanded(
                child: Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'Transcript:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(transcript),
                      SizedBox(height: 10),
                      Text(
                        'Sentiment: $sentimentText',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Filler Count: $fillerCount',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Grammar Errors: $grammarErrors',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Suggestions:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      for (String suggestion in suggestions) Text(suggestion),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
