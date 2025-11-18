import { useState } from 'react';
import { Server, Monitor, Wifi, CheckCircle, XCircle } from 'lucide-react';

const UpgradeProtocolWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showWebSocket, setShowWebSocket] = useState(false);
  const [showHTTP2, setShowHTTP2] = useState(false);

  const steps = [
    {
      title: "Initial HTTP Request",
      description: "Client sends HTTP/1.1 request with Upgrade header",
      code: `GET /chat HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13`,
      color: "bg-blue-100 border-blue-300"
    },
    {
      title: "Server Processing",
      description: "Server validates the upgrade request and checks protocol support",
      code: `// Server checks:
- Protocol support
- Authentication
- Resource availability
- Upgrade headers validity`,
      color: "bg-purple-100 border-purple-300"
    },
    {
      title: "101 Switching Protocols",
      description: "Server accepts upgrade and sends confirmation",
      code: `HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=`,
      color: "bg-green-100 border-green-300"
    },
    {
      title: "Protocol Upgraded",
      description: "Connection now uses the new protocol (e.g., WebSocket)",
      code: `// Connection upgraded!
// Now using WebSocket protocol
// Bidirectional communication enabled
// HTTP/1.1 no longer used on this connection`,
      color: "bg-yellow-100 border-yellow-300"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          HTTP Upgrade Protocol Workflow
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          The HTTP Upgrade mechanism allows a client and server to switch from HTTP/1.1 
          to a different protocol using the same underlying TCP connection.
        </p>
      </div>

      {/* Interactive Workflow Diagram */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Interactive Workflow</h2>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col items-center">
            <Monitor className="w-16 h-16 text-blue-500 mb-2" />
            <span className="font-semibold">Client</span>
          </div>
          <Wifi className="w-12 h-12 text-gray-400" />
          <div className="flex flex-col items-center">
            <Server className="w-16 h-16 text-purple-500 mb-2" />
            <span className="font-semibold">Server</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                activeStep === index ? step.color : 'bg-gray-50 border-gray-200'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  activeStep === index ? 'bg-white' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{step.description}</p>
                  {activeStep === index && (
                    <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
                      {step.code}
                    </pre>
                  )}
                </div>
                {activeStep === index && (
                  <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-600 ml-4" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Common Use Cases */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Upgrade Protocols</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* WebSocket */}
          <div className="border-2 border-blue-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-3">WebSocket</h3>
            <p className="text-gray-700 mb-4">
              Full-duplex communication channel over a single TCP connection. 
              Perfect for real-time applications.
            </p>
            <button
              onClick={() => setShowWebSocket(!showWebSocket)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {showWebSocket ? 'Hide' : 'Show'} Example
            </button>
            {showWebSocket && (
              <pre className="mt-4 bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`// Client JavaScript
const ws = new WebSocket('ws://example.com/chat');

ws.onopen = () => {
  console.log('Connected');
  ws.send('Hello Server!');
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};`}
              </pre>
            )}
          </div>

          {/* HTTP/2 */}
          <div className="border-2 border-purple-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-purple-700 mb-3">HTTP/2</h3>
            <p className="text-gray-700 mb-4">
              Binary protocol with multiplexing, server push, and header compression. 
              Improves performance.
            </p>
            <button
              onClick={() => setShowHTTP2(!showHTTP2)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              {showHTTP2 ? 'Hide' : 'Show'} Example
            </button>
            {showHTTP2 && (
              <pre className="mt-4 bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`GET / HTTP/1.1
Host: example.com
Connection: Upgrade, HTTP2-Settings
Upgrade: h2c
HTTP2-Settings: <base64-encoded-settings>

// Server Response
HTTP/1.1 101 Switching Protocols
Connection: Upgrade
Upgrade: h2c`}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Points to Remember</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800">Single TCP Connection</h4>
              <p className="text-gray-600">The upgrade happens on the same connection - no need to establish a new one</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800">Hop-by-Hop Header</h4>
              <p className="text-gray-600">The Upgrade header is hop-by-hop, not end-to-end (applies only to immediate connection)</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800">Optional for Server</h4>
              <p className="text-gray-600">Server can decline upgrade and continue with HTTP/1.1 (responds with 200 OK instead of 101)</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800">Status Code 101</h4>
              <p className="text-gray-600">Success is indicated by "101 Switching Protocols" response</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <XCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800">Not for HTTPS with Proxies</h4>
              <p className="text-gray-600">Upgrade mechanism doesn't work well through proxies with HTTPS; use direct connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeProtocolWorkflow;