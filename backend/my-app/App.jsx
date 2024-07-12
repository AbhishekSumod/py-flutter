import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [sentimentScore, setSentimentScore] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [grammarErrors, setGrammarErrors] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to Flask backend
      await axios.post('http://localhost:5000/upload', formData);

      // Transcribe audio and retrieve results from Flask backend
      const response = await axios.post('http://localhost:5000/transcribe');
      const data = response.data;

      setTranscription(data.transcript);
      setSentimentScore(data.sentiment_score);
      setFillerCount(data.filler_count);
      setGrammarErrors(data.grammar_errors);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error uploading file or transcribing audio');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Speech Transcription</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Transcribe</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {transcription && (
        <div>
          <h2>Transcription:</h2>
          <p>{transcription}</p>
          <p>Sentiment Score: {sentimentScore}</p>
          <p>Filler Count: {fillerCount}</p>
          <p>Grammar Errors: {grammarErrors}</p>
        </div>
      )}
    </div>
  );
}

export default App;
