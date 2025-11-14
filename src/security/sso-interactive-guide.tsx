import { useState } from 'react';
import { Shield, Users, Key, CheckCircle, ArrowRight, Server, Lock, Unlock, Globe, Building } from 'lucide-react';

type ProtocolKey = 'SAML' | 'OAuth' | 'OIDC';

const SSOGuide = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolKey>('SAML');

  const steps = [
    {
      id: 0,
      title: "User Attempts Access",
      description: "User tries to access Application B (Service Provider)",
      details: "The user clicks login on Application B. Since they're not authenticated, the app needs to verify their identity.",
      actors: ["User", "Application B"],
      icon: Users,
      color: "bg-blue-500"
    },
    {
      id: 1,
      title: "Redirect to SSO Provider",
      description: "Application B redirects to Identity Provider (IdP)",
      details: "Application B doesn't handle authentication itself. It redirects the user to a centralized Identity Provider (like Okta, Azure AD, Google) with an authentication request.",
      actors: ["Application B", "Identity Provider"],
      icon: ArrowRight,
      color: "bg-purple-500"
    },
    {
      id: 2,
      title: "SSO Login Page",
      description: "User sees the centralized login page",
      details: "The Identity Provider shows its login page. If the user is already logged in (has an active session), this step might be skipped automatically.",
      actors: ["User", "Identity Provider"],
      icon: Lock,
      color: "bg-orange-500"
    },
    {
      id: 3,
      title: "Authentication",
      description: "User enters credentials (or uses existing session)",
      details: "User provides username/password, or uses MFA, or the IdP recognizes an existing valid session cookie. The IdP verifies the credentials.",
      actors: ["User", "Identity Provider"],
      icon: Key,
      color: "bg-yellow-500"
    },
    {
      id: 4,
      title: "Token Generation",
      description: "IdP creates authentication token/assertion",
      details: "After successful authentication, the IdP generates a secure token (SAML assertion, JWT, etc.) containing user information and signs it cryptographically.",
      actors: ["Identity Provider"],
      icon: Shield,
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "Token Delivery",
      description: "User is redirected back with the token",
      details: "The IdP redirects the user back to Application B, including the signed token. This happens via browser redirect with the token in the URL or POST data.",
      actors: ["Identity Provider", "User", "Application B"],
      icon: ArrowRight,
      color: "bg-teal-500"
    },
    {
      id: 6,
      title: "Token Validation",
      description: "Application B validates the token",
      details: "Application B receives the token and validates its signature using the IdP's public key, checks expiration, and extracts user information.",
      actors: ["Application B", "Identity Provider"],
      icon: CheckCircle,
      color: "bg-indigo-500"
    },
    {
      id: 7,
      title: "Access Granted",
      description: "User successfully accesses Application B",
      details: "With a valid token, Application B creates a session for the user and grants access. The user is now logged in without Application B ever seeing their password.",
      actors: ["User", "Application B"],
      icon: Unlock,
      color: "bg-green-600"
    }
  ];

  const protocols: Record<ProtocolKey, {
    name: string;
    fullName: string;
    description: string;
    pros: string[];
    cons: string[];
    tokenFormat: string;
    bestFor: string;
    example: string;
  }> = {
    SAML: {
      name: "SAML 2.0",
      fullName: "Security Assertion Markup Language",
      description: "XML-based protocol widely used in enterprise environments",
      pros: [
        "Mature and well-established standard",
        "Strong enterprise adoption",
        "Detailed assertions with attributes",
        "Works well with legacy systems"
      ],
      cons: [
        "Verbose XML format",
        "Complex to implement",
        "Not ideal for mobile apps",
        "Larger payload size"
      ],
      tokenFormat: "XML-based SAML Assertion",
      bestFor: "Enterprise B2B applications, internal company apps",
      example: `<saml:Assertion>
  <saml:Subject>
    <saml:NameID>user@company.com</saml:NameID>
  </saml:Subject>
  <saml:AttributeStatement>
    <saml:Attribute Name="email">
      <saml:AttributeValue>user@company.com</saml:AttributeValue>
    </saml:Attribute>
  </saml:AttributeStatement>
</saml:Assertion>`
    },
    OAuth: {
      name: "OAuth 2.0",
      fullName: "Open Authorization 2.0",
      description: "Authorization framework for delegated access",
      pros: [
        "Designed for authorization",
        "Great for third-party access",
        "Flexible and extensible",
        "Works well with APIs"
      ],
      cons: [
        "Not authentication by itself",
        "Requires additional layer for auth",
        "Multiple flows can be confusing",
        "Security depends on implementation"
      ],
      tokenFormat: "Access Token (opaque or JWT)",
      bestFor: "API access, third-party integrations, mobile apps",
      example: `{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx...",
  "scope": "read write"
}`
    },
    OIDC: {
      name: "OpenID Connect",
      fullName: "OpenID Connect (OIDC)",
      description: "Identity layer built on top of OAuth 2.0",
      pros: [
        "Modern and lightweight",
        "JSON-based (easy to parse)",
        "Built for web and mobile",
        "Combines auth and authorization"
      ],
      cons: [
        "Relatively newer than SAML",
        "Requires OAuth 2.0 knowledge",
        "Less enterprise adoption (growing)",
        "Multiple token types to manage"
      ],
      tokenFormat: "ID Token (JWT) + Access Token",
      bestFor: "Modern web apps, mobile apps, consumer applications",
      example: `{
  "id_token": "eyJhbGciOiJSUzI1NiIs...",
  "access_token": "SlAV32hkKG",
  "token_type": "Bearer",
  "expires_in": 3600
}

// Decoded ID Token:
{
  "sub": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1516239022
}`
    }
  };

  const benefits = [
    { icon: Key, title: "Single Set of Credentials", desc: "Users remember one password for all applications" },
    { icon: Shield, title: "Enhanced Security", desc: "Centralized authentication with MFA and monitoring" },
    { icon: Users, title: "Better User Experience", desc: "Seamless access across multiple applications" },
    { icon: Server, title: "Simplified Management", desc: "IT manages access from one central location" },
    { icon: Lock, title: "Reduced Password Fatigue", desc: "No more password resets for each application" },
    { icon: Globe, title: "Compliance", desc: "Easier to enforce security policies and audit access" }
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">How Single Sign-On (SSO) Works</h1>
        <p className="text-gray-600">Step-by-step interactive guide to understanding SSO authentication</p>
      </div>

      {/* What is SSO */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">What is SSO?</h2>
        </div>
        <p className="text-gray-700 mb-4">
          <strong>Single Sign-On (SSO)</strong> is an authentication method that allows users to access multiple applications 
          with one set of login credentials. Instead of maintaining separate usernames and passwords for each application, 
          users authenticate once with a centralized Identity Provider (IdP), which then provides secure access tokens to 
          various applications.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>Real-world example:</strong> When you log into Google, you automatically get access to Gmail, YouTube, 
            Google Drive, and other Google services without logging in separately to each one.
          </p>
        </div>
      </div>

      {/* Step-by-Step Flow */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">SSO Authentication Flow</h2>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    index === activeStep
                      ? 'bg-blue-600 text-white scale-110 shadow-lg'
                      : index < activeStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index + 1}
                </button>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${index < activeStep ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Details */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`${currentStep.color} p-4 rounded-lg`}>
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Step {activeStep + 1}: {currentStep.title}
              </h3>
              <p className="text-gray-600 font-medium mb-2">{currentStep.description}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{currentStep.details}</p>
            </div>
          </div>

          <div className="bg-white rounded p-4 mt-4">
            <p className="text-sm text-gray-600 mb-2"><strong>Actors Involved:</strong></p>
            <div className="flex gap-2 flex-wrap">
              {currentStep.actors.map((actor, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
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
                : 'bg-blue-600 text-white hover:bg-blue-700'
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
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* SSO Protocols */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Common SSO Protocols</h2>
        
        {/* Protocol Tabs */}
        <div className="flex gap-4 mb-6">
          {(Object.keys(protocols) as ProtocolKey[]).map((protocol) => (
            <button
              key={protocol}
              onClick={() => setSelectedProtocol(protocol)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedProtocol === protocol
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {protocols[protocol].name}
            </button>
          ))}
        </div>

        {/* Protocol Details */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {protocols[selectedProtocol].fullName}
            </h3>
            <p className="text-gray-600">{protocols[selectedProtocol].description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">Advantages</h4>
              <ul className="space-y-2">
                {protocols[selectedProtocol].pros.map((pro, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-3">Considerations</h4>
              <ul className="space-y-2">
                {protocols[selectedProtocol].cons.map((con, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start">
                    <span className="text-red-600 mr-2">⚠</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Token Format</h4>
              <p className="text-sm text-gray-600 mb-2">{protocols[selectedProtocol].tokenFormat}</p>
              <h4 className="font-semibold text-gray-800 mb-2 mt-4">Best For</h4>
              <p className="text-sm text-gray-600">{protocols[selectedProtocol].bestFor}</p>
            </div>

            <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
              <p className="text-xs text-gray-400 mb-2">Example Response:</p>
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {protocols[selectedProtocol].example}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Benefits of SSO</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, i) => {
            const BenefitIcon = benefit.icon;
            return (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                <BenefitIcon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SSOGuide;