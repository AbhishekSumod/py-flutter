import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [videoPath, setVideoPath] = useState('');
  const [transcript, setTranscript] = useState('');
  const [sentimentScore, setSentimentScore] = useState('');
  const [fillerCount, setFillerCount] = useState('');
  const [grammarErrors, setGrammarErrors] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/process', { video_path: videoPath });
      setTranscript(response.data.transcript);
      setSentimentScore(response.data.sentiment_score);
      setFillerCount(response.data.filler_count);
      setGrammarErrors(response.data.grammar_errors);
    } catch (error) {
      setErrorMessage(error.response.data.error);
    }
  };

  return (
    <div className="App">
      <h1>Speech Analysis</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="videoPath">Enter Video Path:</label><br />
        <input
          type="text"
          id="videoPath"
          value={videoPath}
          onChange={(e) => setVideoPath(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Process</button>
      </form>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {transcript && (
        <div className="output-container">
          <h2>Analysis Results</h2>
          <p><strong>Transcript:</strong> {transcript}</p>
          <p><strong>Sentiment Score:</strong> {sentimentScore}</p>
          <p><strong>Filler Count:</strong> {fillerCount}</p>
          <p><strong>Grammar Errors:</strong> {grammarErrors}</p>
        </div>
      )}
    </div>
  );
}

export default App;
