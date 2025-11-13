import { useState } from 'react'
import { Shield, Database, Cloud, Zap, BookOpen, ArrowRight } from 'lucide-react'
import SSLHandshakeDiagram from './security/ssl_handshake'
import './App.css'

function App() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeConcept, setActiveConcept] = useState<string | null>(null)

  const categories = [
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
      id: 'cache',
      name: 'Caching',
      icon: Database,
      color: 'green',
      description: 'Caching strategies, CDN, Redis, Memcached',
      concepts: []
    },
    {
      id: 'cloud',
      name: 'Cloud',
      icon: Cloud,
      color: 'purple',
      description: 'AWS, Azure, GCP, microservices, containers',
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

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId)
    setActiveConcept(null)
  }

  const handleConceptClick = (conceptId: string) => {
    setActiveConcept(conceptId)
  }

  const handleBackToCategories = () => {
    setActiveConcept(null)
    setActiveCategory(null)
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
                ← Back to Categories
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-blue-600" size={48} />
            Software Engineering Notebooks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive diagrams and explanations for common software engineering concepts.
            Click on a category to explore visual guides for quick review and learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = activeCategory === category.id
            
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div
                  className={`p-6 cursor-pointer transition-colors ${
                    isActive ? `bg-${category.color}-50 border-l-4 border-${category.color}-500` : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`p-3 rounded-lg bg-${category.color}-100`}>
                      <IconComponent className={`text-${category.color}-600`} size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                    </div>
                    <ArrowRight 
                      className={`ml-auto text-gray-400 transition-transform ${isActive ? 'rotate-90' : ''}`} 
                      size={20} 
                    />
                  </div>
                </div>
                
                {isActive && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-200 pt-4">
                      {category.concepts.length > 0 ? (
                        <div className="space-y-2">
                          {category.concepts.map((concept) => (
                            <button
                              key={concept.id}
                              onClick={() => handleConceptClick(concept.id)}
                              className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-${category.color}-50 border border-gray-200 hover:border-${category.color}-300`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800">{concept.name}</span>
                                <ArrowRight className="text-gray-400" size={16} />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 text-sm">Concepts coming soon...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Project</h3>
            <p className="text-gray-600 text-sm">
              This is a collection of interactive React-based diagrams for software engineering concepts.
              Each category contains visual explanations designed for quick review and learning.
              More concepts and categories will be added over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
