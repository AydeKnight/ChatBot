import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = handleStop;
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
  };

  const handleStop = () => {
    if (audioChunks.current.length === 0) {
      console.error('No audio data recorded.');
      return; // Prevent further execution if there's no audio data
    }
    
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
    audioChunks.current = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioURL(audioUrl);
    sendAudioToBackend(audioBlob);
  };
  

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav'); // Match the key to the backend
  
    // Log FormData entries
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1] instanceof Blob ? 'Blob' : pair[1]}`);
    }
  
    try {
      const response = await axios.post('http://localhost:3005/transcribe', formData);
      setTranscription(response.data.text);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error transcribing audio:', error.response?.data || error.message);
      setError('Error transcribing audio. Please try again.');
    }
  };
  

  return (
    <div className="voice-recorder">
      <h1>Voice Recorder</h1>
      <button onClick={() => setIsRecording(!isRecording)} className={isRecording ? 'stop-btn' : 'record-btn'}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioURL && <audio controls src={audioURL} className="audio-player" />}
      {transcription && <p className="transcription">Transcription: {transcription}</p>}
      {error && <p className="error">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default VoiceRecorder;
