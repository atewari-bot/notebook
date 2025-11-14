import React, { useState } from 'react';
import { FileEdit, Trash2, Eye, Upload, RefreshCw, Search } from 'lucide-react';

type VerbKey = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

interface VerbDef {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  description: string;
  idempotent: boolean;
  safe: boolean;
  cacheable: boolean;
  useCase: string;
  example: string;
  bodyAllowed: boolean;
  notes: string;
}

const HttpVerbsDiagram = () => {
  const [selectedVerb, setSelectedVerb] = useState<VerbKey>('GET');

  const verbs: Record<VerbKey, VerbDef> = {
    GET: {
      icon: Eye,
      color: 'bg-blue-500',
      description: 'Retrieve data from the server',
      idempotent: true,
      safe: true,
      cacheable: true,
      useCase: 'Fetching user profiles, loading product lists, reading articles',
      example: 'GET /api/users/123',
      bodyAllowed: false,
      notes: 'Should not modify server state. Multiple identical requests should return the same result.'
    },
    POST: {
      icon: Upload,
      color: 'bg-green-500',
      description: 'Create new resources or submit data',
      idempotent: false,
      safe: false,
      cacheable: false,
      useCase: 'Creating new users, submitting forms, uploading files',
      example: 'POST /api/users',
      bodyAllowed: true,
      notes: 'Each request creates a new resource. Calling twice creates two resources.'
    },
    PUT: {
      icon: FileEdit,
      color: 'bg-yellow-500',
      description: 'Replace entire resource or create if not exists',
      idempotent: true,
      safe: false,
      cacheable: false,
      useCase: 'Completely updating a user profile, replacing a document',
      example: 'PUT /api/users/123',
      bodyAllowed: true,
      notes: 'Replaces the entire resource. Multiple identical requests have the same effect as one.'
    },
    PATCH: {
      icon: RefreshCw,
      color: 'bg-orange-500',
      description: 'Partially update a resource',
      idempotent: true,
      safe: false,
      cacheable: false,
      useCase: 'Updating only email field, changing a status',
      example: 'PATCH /api/users/123',
      bodyAllowed: true,
      notes: 'Modifies only specified fields. Generally idempotent but depends on implementation.'
    },
    DELETE: {
      icon: Trash2,
      color: 'bg-red-500',
      description: 'Remove a resource from the server',
      idempotent: true,
      safe: false,
      cacheable: false,
      useCase: 'Deleting a user account, removing a post',
      example: 'DELETE /api/users/123',
      bodyAllowed: false,
      notes: 'Deletes a resource. Multiple requests result in the same state (resource gone).'
    },
    HEAD: {
      icon: Search,
      color: 'bg-purple-500',
      description: 'Same as GET but without response body',
      idempotent: true,
      safe: true,
      cacheable: true,
      useCase: 'Checking if a resource exists, getting metadata',
      example: 'HEAD /api/users/123',
      bodyAllowed: false,
      notes: 'Useful for checking resource existence or getting headers without downloading content.'
    }
  };

  const selectedData = verbs[selectedVerb as VerbKey];
  const Icon = selectedData.icon;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">HTTP Verbs Guide</h1>
      <p className="text-center text-gray-600 mb-8">Click on any verb to learn more</p>

      {/* Verb Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {(Object.keys(verbs) as VerbKey[]).map((verb) => {
          const VerbIcon = verbs[verb].icon;
          return (
            <button
              key={verb}
              onClick={() => setSelectedVerb(verb)}
              className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                selectedVerb === verb
                  ? `${verbs[verb].color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <VerbIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">{verb}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Verb Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`${selectedData.color} p-4 rounded-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{selectedVerb}</h2>
            <p className="text-gray-600">{selectedData.description}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 mb-4 text-lg">Properties & Characteristics</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">Idempotent:</span>
                <span className={`font-bold ${selectedData.idempotent ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedData.idempotent ? 'Yes ✓' : 'No ✗'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {selectedData.idempotent 
                  ? 'Multiple identical requests produce the same result. Safe to retry without side effects.'
                  : 'Each request may have different effects. Retrying could create duplicates or unwanted changes.'}
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">Safe:</span>
                <span className={`font-bold ${selectedData.safe ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedData.safe ? 'Yes ✓' : 'No ✗'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {selectedData.safe 
                  ? 'Read-only operation. Does not modify server state or resources. Can be called without worry.'
                  : 'Modifies server state. Creates, updates, or deletes resources. Use with intention.'}
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">Cacheable:</span>
                <span className={`font-bold ${selectedData.cacheable ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedData.cacheable ? 'Yes ✓' : 'No ✗'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {selectedData.cacheable 
                  ? 'Response can be stored and reused. Improves performance by reducing server requests.'
                  : 'Response should not be cached. Each request needs fresh data from the server.'}
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">Request Body:</span>
                <span className={`font-bold ${selectedData.bodyAllowed ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedData.bodyAllowed ? 'Allowed ✓' : 'Not Typical ✗'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {selectedData.bodyAllowed 
                  ? 'Can include data in request body. Used to send resource data to the server.'
                  : 'Typically no request body. Data passed via URL parameters or headers if needed.'}
              </p>
            </div>

            <div className="border-l-4 border-indigo-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-700">Success Status:</span>
                <span className="font-bold text-indigo-600">
                  {selectedVerb === 'GET' && '200 OK'}
                  {selectedVerb === 'POST' && '201 Created'}
                  {selectedVerb === 'PUT' && '200 OK / 204 No Content'}
                  {selectedVerb === 'PATCH' && '200 OK / 204 No Content'}
                  {selectedVerb === 'DELETE' && '200 OK / 204 No Content'}
                  {selectedVerb === 'HEAD' && '200 OK'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {selectedVerb === 'GET' && 'Returns 200 with the requested resource in response body.'}
                {selectedVerb === 'POST' && 'Returns 201 with Location header pointing to new resource.'}
                {selectedVerb === 'PUT' && 'Returns 200 with updated resource or 204 if no content returned.'}
                {selectedVerb === 'PATCH' && 'Returns 200 with modified resource or 204 if no content returned.'}
                {selectedVerb === 'DELETE' && 'Returns 200 with status or 204 if resource successfully deleted.'}
                {selectedVerb === 'HEAD' && 'Returns 200 with headers only, no response body.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Real-World Scenarios</h3>
            <p className="text-sm text-gray-600">{selectedData.useCase}</p>
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Example Request</h3>
            <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs mb-2">
              {selectedData.example}
              {selectedData.bodyAllowed && (
                <>
                  <br/><span className="text-gray-500">Content-Type: application/json</span>
                  <br/><br/><span className="text-yellow-300">
                    {selectedVerb === 'POST' && '{ "name": "John Doe", "email": "john@example.com" }'}
                    {selectedVerb === 'PUT' && '{ "name": "John Doe", "email": "john@example.com", "age": 30 }'}
                    {selectedVerb === 'PATCH' && '{ "email": "newemail@example.com" }'}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {selectedVerb === 'GET' && 'Query params can be added: ?page=1&limit=10'}
              {selectedVerb === 'POST' && 'Full resource data in request body'}
              {selectedVerb === 'PUT' && 'Complete resource replacement data'}
              {selectedVerb === 'PATCH' && 'Only fields to update in request body'}
              {selectedVerb === 'DELETE' && 'No body needed, just the resource ID in URL'}
              {selectedVerb === 'HEAD' && 'Same as GET but returns no body'}
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note: </span>
            {selectedData.notes}
          </p>
        </div>
      </div>

      {/* Idempotency Explanation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Understanding Idempotency</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-700 mb-2">Idempotent (GET, PUT, PATCH, DELETE, HEAD)</h4>
            <p className="text-sm text-gray-600 mb-2">
              Making the same request multiple times has the same effect as making it once. The server state doesn't change after the first request.
            </p>
            <div className="bg-green-50 p-3 rounded text-xs font-mono">
              DELETE /users/123<br/>
              DELETE /users/123<br/>
              DELETE /users/123<br/>
              <span className="text-green-700">→ User 123 is deleted (same result)</span>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-red-700 mb-2">Non-Idempotent (POST)</h4>
            <p className="text-sm text-gray-600 mb-2">
              Each request has a different effect. Multiple identical requests create multiple resources or trigger multiple actions.
            </p>
            <div className="bg-red-50 p-3 rounded text-xs font-mono">
              POST /users {"{"}"name":"John"{"}"}<br/>
              POST /users {"{"}"name":"John"{"}"}<br/>
              POST /users {"{"}"name":"John"{"}"}<br/>
              <span className="text-red-700">→ Creates 3 separate users</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Quick Decision Guide</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Reading data?</strong> → Use GET</li>
            <li>• <strong>Creating something new?</strong> → Use POST</li>
            <li>• <strong>Replacing entire resource?</strong> → Use PUT</li>
            <li>• <strong>Updating part of a resource?</strong> → Use PATCH</li>
            <li>• <strong>Removing a resource?</strong> → Use DELETE</li>
            <li>• <strong>Checking if resource exists?</strong> → Use HEAD</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HttpVerbsDiagram;