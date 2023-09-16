const axios = require ('axios');
const FormData = require('form-data');
const fs = require('fs');
const ytdl = require("ytdl-core")
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);



const spchTxt = async (req, res) => {
    try {
      let youtubeUrl= req.query.youtube
      if(!youtubeUrl){
        return res.status(400).send({status:false,message:"Please provide youtube Url"})
    }
    if(!ytdl.validateURL(youtubeUrl)){
        return res.status(400).send({status:false,message:"Please provide valid youtube Url"})
    }
        
        const outputFilePath = 'output.mp3'; // The file where the audio will be saved
        
        const transcriptOutputPath = 'transcript.txt'; // Where the transcript will be saved
        const openaiApiKey = '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'; // Replace with your OpenAI API key
        // Download audio using ytdl-core
        
        const audioStream = ytdl(youtubeUrl, { filter: 'audioonly' });
        audioStream.pipe(fs.createWriteStream(outputFilePath));
    
        audioStream.on('end', async () => {
        console.log('Audio downloaded successfully');
      
         // Create a FormData object to send the audio file
        const formData = new FormData();
        formData.append('file', fs.createReadStream(outputFilePath));
        formData.append('model', 'whisper-1');
    
        // Transcribe audio using OpenAI's Whisper API
        const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
      
        const headers = {
            'Authorization': `Bearer ${openaiApiKey}`,
            ...formData.getHeaders()
        };
        
        const response = await axios.post(apiUrl, formData, { headers });
       
        // Extract and save the transcript
        const transcript = response.data.text;
        fs.writeFileSync(transcriptOutputPath, transcript);
        
        console.log('Transcript saved:', transcriptOutputPath);
        res.status(200).send({text:transcript})
    });
    } catch (error) {
     
      res.status(500).json({ error: 'An error occurred' });
    }
  }

  module.exports={spchTxt}