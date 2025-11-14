import { useState } from 'react';
import { Lock, Key, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const SSLHandshakeDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: 1,
      name: "Client Hello",
      client: "Supported TLS versions\nCipher suites\nClient Random",
      server: "",
      description: "The client (your browser) initiates the connection by sending a 'Client Hello' message. This includes: (1) Which TLS/SSL versions it supports (e.g., TLS 1.2, TLS 1.3), (2) A list of cipher suites it can use for encryption (e.g., RSA, AES, etc.), (3) A random string of bytes called 'Client Random' that will be used later to generate session keys, and (4) Optional extensions like supported domains (SNI). Think of this as the client saying: 'Hi, here's what I'm capable of - let's talk securely!'"
    },
    {
      num: 2,
      name: "Server Hello",
      client: "",
      server: "Selected TLS version\nChosen cipher suite\nServer Random\nSession ID",
      description: "The server responds with a 'Server Hello' message choosing the parameters for this connection. It selects: (1) The highest TLS version both client and server support, (2) One cipher suite from the client's list that the server also supports, (3) Its own random string called 'Server Random', and (4) A Session ID for potentially resuming this session later without a full handshake. The server is essentially saying: 'Great! From your list, let's use these specific settings.'"
    },
    {
      num: 3,
      name: "Certificate",
      client: "",
      server: "SSL Certificate\n(contains Public Key)",
      description: "The server sends its SSL/TLS certificate to prove its identity. This certificate contains: (1) The server's public key (used for encryption), (2) The domain name(s) it's valid for, (3) The issuing Certificate Authority (CA) - a trusted third party like DigiCert or Let's Encrypt, (4) Validity dates (not expired?), and (5) A digital signature from the CA. This is like showing your passport to prove you are who you claim to be."
    },
    {
      num: 4,
      name: "Server Hello Done",
      client: "",
      server: "Finished with setup",
      description: "The server sends a simple 'Server Hello Done' message to signal it has finished its part of the negotiation and is now waiting for the client to respond. No additional data is sent - it's just a signal that says 'Your turn!' This marks the end of the server's initial setup phase."
    },
    {
      num: 5,
      name: "Certificate Verify",
      client: "✓ Valid certificate?\n✓ Trusted CA?\n✓ Domain match?\n✓ Not expired?",
      server: "",
      description: "The client now performs critical security checks on the server's certificate: (1) Is it issued by a trusted Certificate Authority? The client checks against its list of trusted CAs, (2) Does the domain in the certificate match the domain you're visiting? (3) Is the certificate still valid (not expired)? (4) Has it been revoked? The client may check Certificate Revocation Lists (CRL) or use OCSP. If ANY check fails, the browser shows a security warning. This prevents man-in-the-middle attacks."
    },
    {
      num: 6,
      name: "Client Key Exchange",
      client: "Pre-Master Secret\n(encrypted with\nServer's Public Key)",
      server: "",
      description: "This is the critical step for establishing encryption! The client generates a new random string called the 'Pre-Master Secret' (typically 48 bytes). Then it encrypts this Pre-Master Secret using the server's public key (from the certificate) and sends it to the server. This is secure because: (1) Only the server has the matching private key to decrypt it, (2) Even if someone intercepts this encrypted message, they can't read it without the private key. This is asymmetric encryption in action - public key encrypts, private key decrypts."
    },
    {
      num: 7,
      name: "Generate Session Keys",
      client: "Master Secret =\nf(Pre-Master Secret,\nClient Random,\nServer Random)",
      server: "Master Secret =\nf(Pre-Master Secret,\nClient Random,\nServer Random)",
      description: "Now both client and server independently generate the same symmetric session keys. They use: (1) The Pre-Master Secret (which both now have - client created it, server decrypted it), (2) The Client Random (from step 1), (3) The Server Random (from step 2). They run these through a pseudorandom function (PRF) to create the 'Master Secret', then derive multiple session keys from it: encryption key, decryption key, MAC key, etc. Crucially, these session keys NEVER travel over the network! Both sides compute them locally, ensuring they match. This is now symmetric encryption - same key for both encrypt and decrypt, which is much faster than asymmetric."
    },
    {
      num: 8,
      name: "Client Finished",
      client: "🔒 Encrypted with\nSession Key",
      server: "",
      description: "The client sends a 'Finished' message that is encrypted with the newly generated session key. This message contains: (1) A hash of all handshake messages exchanged so far, (2) Encrypted using the symmetric session key. This serves two purposes: (1) It proves the client successfully derived the correct session keys, and (2) It verifies that no handshake messages were tampered with during transmission. If the server can decrypt and verify this message, it knows the handshake was secure."
    },
    {
      num: 9,
      name: "Server Finished",
      client: "",
      server: "🔒 Encrypted with\nSession Key",
      description: "The server responds with its own 'Finished' message, also encrypted with the session key. Like the client's message, it contains a hash of all handshake messages. When the client successfully decrypts and verifies this, both sides have confirmed: (1) They both have the same session keys, (2) No one tampered with the handshake, (3) They're ready for secure communication. The handshake is now complete!"
    },
    {
      num: 10,
      name: "Secure Connection",
      client: "🔒 Encrypted Data",
      server: "🔒 Encrypted Data",
      description: "Success! A secure, encrypted connection is now established. All subsequent data (your passwords, credit card info, messages, etc.) is encrypted using the fast symmetric session keys. Key points: (1) The session keys are temporary and unique to this connection, (2) If someone recorded the entire handshake, they still can't decrypt the traffic without the server's private key, (3) With Perfect Forward Secrecy (PFS), even compromising the server's private key later won't decrypt this session, (4) The entire handshake typically takes just 100-200 milliseconds. You can now browse securely!"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Shield className="text-blue-600" size={36} />
            SSL/TLS Handshake Process
          </h1>
          <p className="text-gray-600">Step-by-step secure connection establishment</p>
        </div>

        {/* Step Navigation */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex gap-2 flex-wrap justify-center">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeStep === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {step.num}
              </button>
            ))}
          </div>
        </div>

        {/* Main Diagram */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-6">
          <div className="grid grid-cols-3 gap-8 items-start">
            {/* Client Side */}
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-lg p-4 mb-4 shadow-lg">
                <h3 className="font-bold text-lg mb-2">Client</h3>
                <p className="text-sm">(Browser)</p>
              </div>
              {steps[activeStep].client && (
                <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-300 animate-fadeIn">
                  <pre className="text-xs text-left whitespace-pre-wrap font-mono text-gray-700">
                    {steps[activeStep].client}
                  </pre>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-4 mb-4 shadow-lg">
                <ArrowRight size={32} className={steps[activeStep].client ? '' : 'rotate-180'} />
              </div>
              <div className="text-center bg-white rounded-lg p-3 shadow-md border-2 border-purple-300">
                <div className="font-bold text-purple-700 mb-1">Step {steps[activeStep].num}</div>
                <div className="font-semibold text-gray-800 text-sm">{steps[activeStep].name}</div>
              </div>
            </div>

            {/* Server Side */}
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-lg p-4 mb-4 shadow-lg">
                <h3 className="font-bold text-lg mb-2">Server</h3>
                <p className="text-sm">(Web Server)</p>
              </div>
              {steps[activeStep].server && (
                <div className="bg-white rounded-lg p-4 shadow-md border-2 border-purple-300 animate-fadeIn">
                  <pre className="text-xs text-left whitespace-pre-wrap font-mono text-gray-700">
                    {steps[activeStep].server}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-gray-800 mb-2">What's Happening:</h4>
              <p className="text-gray-700">{steps[activeStep].description}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            ← Previous
          </button>
          
          <span className="text-gray-600 font-medium">
            Step {activeStep + 1} of {steps.length}
          </span>
          
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Key Concepts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="text-blue-600" size={20} />
              <h4 className="font-bold text-gray-800">Asymmetric Encryption</h4>
            </div>
            <p className="text-sm text-gray-700">Used during handshake for secure key exchange (Public/Private keys)</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Key className="text-green-600" size={20} />
              <h4 className="font-bold text-gray-800">Symmetric Encryption</h4>
            </div>
            <p className="text-sm text-gray-700">Used for actual data transfer (Session keys - fast & efficient)</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-purple-600" size={20} />
              <h4 className="font-bold text-gray-800">Certificate Authority</h4>
            </div>
            <p className="text-sm text-gray-700">Trusted third party that validates server's identity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSLHandshakeDiagram;