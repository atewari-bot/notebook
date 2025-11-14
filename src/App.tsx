import { useState } from 'react'
import { Shield, Database, Cloud, Zap, BookOpen, ArrowRight } from 'lucide-react'
import SSLHandshakeDiagram from './security/ssl_handshake'
import HttpVerbsDiagram from './networking/http-verbs-diagram'
import './App.css'

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeConcept, setActiveConcept] = useState<string | null>(null)

  const categories = [
    {
      id: 'networking',
      name: 'Networking',
      icon: Cloud,
      color: 'teal',
      description: 'HTTP, TCP/IP, routing and protocols',
      concepts: [
        { id: 'http_verbs', name: 'HTTP Verbs', component: HttpVerbsDiagram }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: 'blue',
      description: 'Security protocols, encryption, authentication',
      concepts: [
        { id: 'ssl_handshake', name: 'SSL/TLS Handshake', component: SSLHandshakeDiagram }
      ]
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: Database,
      color: 'green',
      description: 'Caching, databases and persistence patterns',
      concepts: []
    },
    {
      id: 'streaming',
      name: 'Streaming',
      icon: Zap,
      color: 'orange',
      description: 'Kafka, WebSockets, real-time data processing',
      concepts: []
    }
  ]

  const handleConceptClick = (conceptId: string) => {
    setActiveConcept(conceptId)
  }

  const handleBackToCategories = () => {
    // Keep the active category so the user returns to the category's concept list
    setActiveConcept(null)
  }

  const renderConcept = () => {
    const category = categories.find(cat => cat.id === activeCategory)
    const concept = category?.concepts.find(c => c.id === activeConcept)
    
    if (concept?.component) {
      const ConceptComponent = concept.component
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white shadow-sm border-b border-gray-200 p-4">
            <div className="max-w-6xl mx-auto flex items-center gap-4">
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back to Notebooks
              </button>
              <div className="text-sm text-gray-500">
                {category?.name} / {concept.name}
              </div>
            </div>
          </div>
          <div className="p-6">
            <ConceptComponent />
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Concept Coming Soon</h2>
          <p className="text-gray-500 mb-4">This concept diagram is under development.</p>
          <button
            onClick={handleBackToCategories}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    )
  }

  if (activeConcept) {
    return renderConcept()
  }

  const folderNav = categories // use all categories as nav

  const activeCategoryObj = categories.find(c => c.id === activeCategory) || null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="flex gap-8">
          {/* Left navigation column (folders from src) */}
          <aside className="hidden md:block w-64 bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notebooks</h2>
            <nav className="space-y-2">
              {folderNav.map(folder => {
                const IconComponent = folder.icon
                const isActive = activeCategory === folder.id
                return (
                  <button
                    key={folder.id}
                    onClick={() => {
                      setActiveCategory(folder.id)
                      setActiveConcept(null)
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`p-2 rounded-md bg-${folder.color}-100`}>
                      <IconComponent className={`text-${folder.color}-600`} size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{folder.name}</div>
                    </div>
                    <ArrowRight className={`text-gray-400 ${isActive ? 'rotate-90' : ''}`} size={16} />
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Main content area */}
          <main className="flex-1">
            {/* Top for small screens: nav selector */}
            <div className="md:hidden mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Notebook</label>
              <select
                value={activeCategory ?? ''}
                onChange={(e) => {
                  const v = e.target.value || null
                  setActiveCategory(v)
                  setActiveConcept(null)
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Browse Notebooks --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* If a concept is selected, render it full-screen using existing renderConcept */}
            {activeConcept ? renderConcept() : (
              // If a category is selected, show that category page; otherwise show welcome
              activeCategoryObj ? (
                <div className="min-h-screen bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{activeCategoryObj.name}</h2>
                      <p className="text-gray-600 text-sm">{activeCategoryObj.description}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => { setActiveCategory(null); setActiveConcept(null) }}
                        className="px-3 py-2 bg-gray-100 rounded text-sm"
                      >Back</button>
                    </div>
                  </div>

                  <div>
                    {activeCategoryObj.concepts.length > 0 ? (
                      <div className="space-y-3">
                        {activeCategoryObj.concepts.map(concept => (
                          <div key={concept.id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">{concept.name}</div>
                            </div>
                            <div>
                              <button
                                onClick={() => handleConceptClick(concept.id)}
                                className="px-3 py-2 bg-blue-600 text-white rounded"
                              >Open</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-600">No concepts yet for this notebook.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                    <BookOpen className="text-blue-600" size={48} />
                    Software Engineering Notebooks
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Interactive diagrams and explanations for common software engineering concepts.
                    Use the left navigation to open a notebook and explore its concepts.
                  </p>
                </div>
              )
            )}

            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Project</h3>
                <p className="text-gray-600 text-sm">
                  This is a collection of interactive React-based diagrams for software engineering concepts.
                  Each notebook contains visual explanations designed for quick review and learning.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
