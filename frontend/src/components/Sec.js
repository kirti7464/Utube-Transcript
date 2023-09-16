import React, { useState } from 'react';
import axios from 'axios';

export const Sec = () => {
  const [transcriptionResponse, setTranscriptionResponse] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ youtubeUrl: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTranscribe = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/transcribe-audio?youtube=${formData.youtubeUrl}`);
      
      if (response.status === 200) {
        
      // Handle the response from the server
      setTranscriptionResponse(response.data);
      setError(null);
      }
    } catch (error) {
      // Handle errors from the server
      setError(error.response ? error.response.data.message : "An error occured");
      setTranscriptionResponse(null);
    }
  };

  return (
    <div>
      <p style={{ color: "white" , marginTop:"20px" }}>Enter a YouTube video link:</p>
      <p style={{ color: "white" , marginTop:"5px" }}><small >
             ( Please wait a few seconds after clicking the go button )
            </small></p>
      <div className="input-group mb-2" style={{ maxWidth: '400px' }}>
        <input
          type="text"
          className="form-control"
          name="youtubeUrl"
          placeholder="YouTube Video Link"
          value={formData.youtubeUrl}
          onChange={handleChange}
        />
        <div className="input-group-append">
          <button type="button" onClick={handleTranscribe} className="btn btn-primary">
            Go
          </button>
        </div>
        
        {transcriptionResponse && (
        <div style={{ color: "white" }}>
          <h3>Transcription Response:</h3>
          <p>{transcriptionResponse.text}</p>
        </div>
      )}
      
      </div>
      {error && (
        <div style={{ color: "white" }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
