import { useState } from 'react';
import { Mic, FileAudio, Database, CheckCircle, Server, Upload, Zap, Code, Package, FileText, Settings } from 'lucide-react';

type ExampleKey = 'basic' | 'advanced' | 'nodejs' | 'python';

const MultipartVoiceGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedExample, setSelectedExample] = useState<ExampleKey>('basic');

  const steps = [
    {
      id: 0,
      title: "User Records Voice",
      description: "User speaks a query or command",
      details: "The user activates the microphone and speaks a query like 'What's the weather today?' or 'Schedule a meeting for 3 PM'. The audio is captured by the client application (mobile app, web browser, smart device).",
      technical: "Audio is typically captured as WAV, MP3, OGG, or other audio formats. Recording happens at a specific sample rate (e.g., 16kHz, 44.1kHz).",
      actors: ["User", "Client App"],
      icon: Mic,
      color: "bg-red-500"
    },
    {
      id: 1,
      title: "Prepare Request Data",
      description: "Client prepares both audio file and metadata",
      details: "The client needs to send multiple pieces of data: the audio file (binary data) and additional information like user ID, language preference, audio format, timestamp, and context. This is where multipart comes in - it allows sending different types of data in a single request.",
      technical: "Metadata is typically JSON. Audio is binary. You can't just concatenate them - multipart/form-data solves this by creating boundaries between different parts.",
      actors: ["Client App"],
      icon: Package,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Create Multipart Request",
      description: "Build multipart/form-data request with boundaries",
      details: "The client constructs a multipart request with a unique boundary string. Each part (audio file, metadata) is separated by this boundary. Each part has its own headers specifying content type and name.",
      technical: "Boundary is a random string like '----WebKitFormBoundary7MA4YWxkTrZu0gW'. Content-Type header becomes 'multipart/form-data; boundary=...'",
      actors: ["Client App"],
      icon: Code,
      color: "bg-purple-500"
    },
    {
      id: 3,
      title: "Send HTTP Request",
      description: "POST request sent to voice processing API",
      details: "The multipart request is sent via HTTP POST to the server endpoint. The entire payload includes the boundary-separated parts containing the audio file and all metadata in a single HTTP request.",
      technical: "Usually sent to endpoints like /api/voice/query or /api/speech/recognize. Method must be POST or PUT. Content-Length header includes total size of all parts.",
      actors: ["Client App", "API Server"],
      icon: Upload,
      color: "bg-green-500"
    },
    {
      id: 4,
      title: "Server Parses Request",
      description: "Server extracts and separates different parts",
      details: "The server's multipart parser reads the boundary markers and separates the request into individual parts. It extracts the audio file (binary data) and the metadata (JSON) into separate variables for processing.",
      technical: "Most frameworks (Express.js with multer, Django, Flask) have built-in multipart parsers. They handle boundary detection and part extraction automatically.",
      actors: ["API Server"],
      icon: Settings,
      color: "bg-yellow-500"
    },
    {
      id: 5,
      title: "Process Audio File",
      description: "Audio sent to speech recognition service",
      details: "The extracted audio file is sent to a speech-to-text (STT) service like Google Speech API, AWS Transcribe, Azure Speech, or Whisper. The audio is transcribed into text.",
      technical: "Audio may be converted to required format. Some services need specific sample rates. The STT service returns transcribed text with confidence scores.",
      actors: ["API Server", "STT Service"],
      icon: FileAudio,
      color: "bg-orange-500"
    },
    {
      id: 6,
      title: "Process Metadata",
      description: "Use metadata for context and personalization",
      details: "The server uses the metadata to provide context: user preferences for language, previous conversation history, user location, or device information. This helps improve accuracy and personalize the response.",
      technical: "Metadata might include: userId, sessionId, locale, timezone, deviceType, previousContext. Used for user identification, localization, and contextual understanding.",
      actors: ["API Server", "Database"],
      icon: Database,
      color: "bg-teal-500"
    },
    {
      id: 7,
      title: "Generate Response",
      description: "Process the transcribed text and return results",
      details: "With the transcribed text and metadata, the server processes the query (using NLP, AI models, or business logic) and generates an appropriate response. The response is sent back to the client.",
      technical: "Response typically includes: transcribed text, intent recognition, processed result, confidence scores. May trigger additional actions based on the query.",
      actors: ["API Server", "Client App"],
      icon: CheckCircle,
      color: "bg-green-600"
    }
  ];

  const examples: Record<ExampleKey, {
    title: string;
    description: string;
    code: string;
    wireFormat: string;
  }> = {
    basic: {
      title: "Basic Voice Query",
      description: "Simple voice query with audio and metadata",
      code: `// JavaScript Example - Basic Voice Query
const formData = new FormData();

// Add audio file
const audioBlob = new Blob([audioData], { type: 'audio/wav' });
formData.append('audio', audioBlob, 'voice-query.wav');

// Add metadata as JSON
formData.append('userId', 'user123');
formData.append('language', 'en-US');
formData.append('timestamp', new Date().toISOString());

// Send request
const response = await fetch('/api/voice/query', {
  method: 'POST',
  body: formData
  // Content-Type header automatically set by browser
});

const result = await response.json();
console.log('Transcribed:', result.transcript);`,
      wireFormat: `POST /api/voice/query HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; boundary=----Boundary1234

------Boundary1234
Content-Disposition: form-data; name="audio"; filename="voice-query.wav"
Content-Type: audio/wav

[Binary audio data here]
------Boundary1234
Content-Disposition: form-data; name="userId"

user123
------Boundary1234
Content-Disposition: form-data; name="language"

en-US
------Boundary1234
Content-Disposition: form-data; name="timestamp"

2024-11-14T10:30:00Z
------Boundary1234--`
    },
    advanced: {
      title: "Advanced with JSON Metadata",
      description: "Complex metadata as JSON object",
      code: `// JavaScript Example - Advanced with JSON Metadata
const formData = new FormData();

// Add audio file
const audioBlob = new Blob([audioData], { type: 'audio/mp3' });
formData.append('audio', audioBlob, 'query.mp3');

// Add complex metadata as JSON
const metadata = {
  user: {
    id: 'user123',
    locale: 'en-US',
    timezone: 'America/New_York'
  },
  context: {
    previousQuery: 'What time is it?',
    sessionId: 'sess_abc123',
    deviceType: 'mobile'
  },
  settings: {
    language: 'en-US',
    useEnhancedModel: true,
    profanityFilter: true
  }
};

formData.append('metadata', JSON.stringify(metadata));

// Send request
const response = await fetch('/api/voice/query', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': 'Bearer token123'
  }
});`,
      wireFormat: `POST /api/voice/query HTTP/1.1
Host: api.example.com
Content-Type: multipart/form-data; boundary=----Boundary5678
Authorization: Bearer token123

------Boundary5678
Content-Disposition: form-data; name="audio"; filename="query.mp3"
Content-Type: audio/mp3

[Binary MP3 audio data]
------Boundary5678
Content-Disposition: form-data; name="metadata"
Content-Type: application/json

{
  "user": {
    "id": "user123",
    "locale": "en-US",
    "timezone": "America/New_York"
  },
  "context": {
    "previousQuery": "What time is it?",
    "sessionId": "sess_abc123",
    "deviceType": "mobile"
  },
  "settings": {
    "language": "en-US",
    "useEnhancedModel": true,
    "profanityFilter": true
  }
}
------Boundary5678--`
    },
    nodejs: {
      title: "Node.js Server (Express + Multer)",
      description: "Server-side parsing of multipart request",
      code: `// Node.js Express Server Example
const express = require('express');
const multer = require('multer');
const app = express();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Voice query endpoint
app.post('/api/voice/query', 
  upload.single('audio'), 
  async (req, res) => {
    try {
      // Get audio file
      const audioBuffer = req.file.buffer;
      const audioFormat = req.file.mimetype; // e.g., 'audio/wav'
      
      // Get metadata from form fields
      const userId = req.body.userId;
      const language = req.body.language;
      
      // Parse JSON metadata if sent as string
      const metadata = req.body.metadata 
        ? JSON.parse(req.body.metadata) 
        : {};
      
      console.log('Received audio:', req.file.originalname);
      console.log('Audio size:', audioBuffer.length, 'bytes');
      console.log('Metadata:', metadata);
      
      // Send to speech-to-text service
      const transcript = await speechToText(audioBuffer, language);
      
      // Process the query
      const result = await processQuery(transcript, metadata);
      
      res.json({
        success: true,
        transcript: transcript,
        result: result
      });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});`,
      wireFormat: `// Server receives and parses:

1. Headers:
   - Content-Type: multipart/form-data; boundary=...
   - Content-Length: total bytes

2. Body (parsed by multer):
   - req.file.buffer: Binary audio data
   - req.file.originalname: "voice-query.wav"
   - req.file.mimetype: "audio/wav"
   - req.body.userId: "user123"
   - req.body.metadata: "{ ... }" (JSON string)

3. Processing:
   - Audio extracted from buffer
   - Metadata parsed from form fields
   - Sent to STT service
   - Response generated`
    },
    python: {
      title: "Python Server (Flask)",
      description: "Python implementation with Flask",
      code: `# Python Flask Server Example
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/api/voice/query', methods=['POST'])
def voice_query():
    try:
        # Get audio file from multipart request
        audio_file = request.files.get('audio')
        if not audio_file:
            return jsonify({'error': 'No audio file provided'}), 400
        
        # Read audio data
        audio_data = audio_file.read()
        audio_filename = audio_file.filename
        audio_type = audio_file.content_type
        
        print(f"Received audio: {audio_filename}")
        print(f"Audio type: {audio_type}")
        print(f"Audio size: {len(audio_data)} bytes")
        
        # Get metadata from form fields
        user_id = request.form.get('userId')
        language = request.form.get('language', 'en-US')
        
        # Parse JSON metadata if present
        metadata = {}
        if 'metadata' in request.form:
            metadata = json.loads(request.form.get('metadata'))
        
        print(f"User ID: {user_id}")
        print(f"Language: {language}")
        print(f"Metadata: {metadata}")
        
        # Send to speech-to-text service
        transcript = speech_to_text(audio_data, language)
        
        # Process the query
        result = process_query(transcript, metadata)
        
        return jsonify({
            'success': True,
            'transcript': transcript,
            'result': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)`,
      wireFormat: `# Flask automatically parses multipart data:

# Access audio file:
request.files['audio']          # FileStorage object
request.files['audio'].read()   # Binary data
request.files['audio'].filename # Original filename

# Access form fields:
request.form['userId']     # "user123"
request.form['language']   # "en-US"
request.form['metadata']   # JSON string

# File properties:
.filename      # Original name
.content_type  # MIME type
.content_length # Size in bytes
.stream        # File stream`
    }
  };

  const keyComponents = [
    {
      icon: FileAudio,
      title: "Audio File",
      desc: "Binary audio data (WAV, MP3, OGG, etc.)",
      details: "Typical formats: audio/wav, audio/mp3, audio/ogg. Size usually 100KB-5MB for voice queries."
    },
    {
      icon: FileText,
      title: "Metadata",
      desc: "Additional context and configuration",
      details: "User info, language settings, session data, device info, timestamps, previous context."
    },
    {
      icon: Code,
      title: "Boundary String",
      desc: "Separator between different parts",
      details: "Random string like '----WebKitFormBoundary'. Must not appear in the data. Browser/client generates it."
    },
    {
      icon: Settings,
      title: "Part Headers",
      desc: "Metadata for each part",
      details: "Content-Disposition (name, filename), Content-Type (MIME type), Content-Transfer-Encoding."
    }
  ];

  const whyMultipart = [
    {
      icon: Package,
      title: "Mixed Content Types",
      reason: "Send binary audio + text/JSON metadata in one request",
      alternative: "Alternative: Make 2 requests (upload audio, then send metadata with audio ID) - slower and more complex"
    },
    {
      icon: Zap,
      title: "Efficiency",
      reason: "Single HTTP request instead of multiple round trips",
      alternative: "Base64 encoding audio in JSON wastes ~33% bandwidth and requires encoding/decoding overhead"
    },
    {
      icon: Server,
      title: "Server Simplicity",
      reason: "Built-in parsers in all major frameworks",
      alternative: "Custom binary protocols require complex parsing logic and are harder to debug"
    },
    {
      icon: CheckCircle,
      title: "Standard Protocol",
      reason: "Well-established HTTP standard (RFC 7578)",
      alternative: "Custom formats lack tooling support and interoperability"
    }
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;
  const currentExample = examples[selectedExample];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-purple-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Multipart Requests for Voice Queries</h1>
        <p className="text-gray-600">Complete guide to sending audio files with metadata in a single HTTP request</p>
      </div>

      {/* What is Multipart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">What is Multipart/Form-Data?</h2>
        </div>
        <p className="text-gray-700 mb-4">
          <strong>Multipart/form-data</strong> is an HTTP content type that allows sending multiple pieces of data with 
          different types (binary files, text, JSON) in a single HTTP request. For voice queries, this means you can send 
          the audio file (binary) along with metadata (JSON/text) together, rather than making separate requests.
        </p>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>Real-world example:</strong> When you use voice search in Google or ask Siri a question, your device 
            sends both the audio recording and information about your language, location, and device in one multipart request.
          </p>
        </div>
      </div>

      {/* Why Multipart for Voice */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Use Multipart for Voice Queries?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {whyMultipart.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100">
                <div className="flex items-start gap-3 mb-3">
                  <Icon className="w-7 h-7 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">{item.reason}</p>
                    <p className="text-xs text-gray-600 italic bg-white bg-opacity-60 p-2 rounded">
                      {item.alternative}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Components */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Components of Multipart Request</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyComponents.map((comp, i) => {
            const Icon = comp.icon;
            return (
              <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">{comp.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{comp.desc}</p>
                <p className="text-xs text-gray-500">{comp.details}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Flow */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works: Step-by-Step</h2>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    index === activeStep
                      ? 'bg-purple-600 text-white scale-110 shadow-lg'
                      : index < activeStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 ${index < activeStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Details */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`${currentStep.color} p-4 rounded-lg`}>
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Step {activeStep + 1}: {currentStep.title}
              </h3>
              <p className="text-gray-600 font-medium mb-2">{currentStep.description}</p>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">{currentStep.details}</p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-xs text-gray-700">
                  <strong>Technical Detail:</strong> {currentStep.technical}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded p-4 mt-4">
            <p className="text-sm text-gray-600 mb-2"><strong>Actors Involved:</strong></p>
            <div className="flex gap-2 flex-wrap">
              {currentStep.actors.map((actor, i) => (
                <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {actor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeStep === steps.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Code Examples & Wire Format</h2>
        
        {/* Example Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(Object.keys(examples) as ExampleKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedExample(key)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                selectedExample === key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {examples[key].title}
            </button>
          ))}
        </div>

        {/* Example Details */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {currentExample.title}
            </h3>
            <p className="text-gray-600">{currentExample.description}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Implementation Code</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre">
                  {currentExample.code}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Wire Format / Parsed Data</h4>
              <div className="bg-gray-900 text-cyan-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre">
                  {currentExample.wireFormat}
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Important:</strong> The boundary string must be unique and not appear anywhere in the actual data. 
              Most HTTP clients (fetch, axios, requests) handle boundary generation and formatting automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipartVoiceGuide;