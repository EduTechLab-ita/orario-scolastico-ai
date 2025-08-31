import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { School, Users, GraduationCap, BookOpen, MapPin, Calendar, BarChart3 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { title: 'Docenti', value: 12, icon: Users, color: 'text-blue-600' },
    { title: 'Classi', value: 8, icon: GraduationCap, color: 'text-green-600' },
    { title: 'Materie', value: 15, icon: BookOpen, color: 'text-purple-600' },
    { title: 'Aule', value: 20, icon: MapPin, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OrarioAI</h1>
                <p className="text-sm text-gray-500">Gestione Orari Scolastici</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('it-IT')}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'teachers', label: 'Docenti', icon: Users },
                { id: 'classes', label: 'Classi', icon: GraduationCap },
                { id: 'subjects', label: 'Materie', icon: BookOpen },
                { id: 'rooms', label: 'Aule', icon: MapPin },
                { id: 'schedule', label: 'Orario', icon: Calendar }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">
                    Benvenuto nel Sistema OrarioAI
                  </h2>
                  <p className="text-blue-100">
                    Gestione intelligente degli orari scolastici con ottimizzazione automatica tramite algoritmi AI
                  </p>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Panoramica Generale
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <Card key={stat.title} className="hover:shadow-md transition-shadow">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                              {stat.title}
                            </CardTitle>
                            <Icon className={`w-5 h-5 ${stat.color}`} />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                              {stat.value}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Azioni Rapide</CardTitle>
                    <CardDescription>
                      Operazioni frequenti per la gestione dell'orario
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button 
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('teachers')}
                      >
                        <Users className="w-6 h-6" />
                        <span className="text-sm font-medium">Gestisci Docenti</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-center space-y-2" 
                        variant="outline"
                        onClick={() => setActiveTab('classes')}
                      >
                        <GraduationCap className="w-6 h-6" />
                        <span className="text-sm font-medium">Gestisci Classi</span>
                      </Button>
                      <Button 
                        className="h-auto p-4 flex flex-col items-center space-y-2" 
                        variant="outline"
                        onClick={() => setActiveTab('schedule')}
                      >
                        <Calendar className="w-6 h-6" />
                        <span className="text-sm font-medium">Genera Orario</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestione Docenti</h2>
                  <p className="text-gray-600">Configura l'anagrafe dei docenti e le loro disponibilità</p>
                </div>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sezione Docenti
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      Qui potrai gestire l'anagrafe dei docenti
                    </p>
                    <Button>
                      <Users className="w-4 h-4 mr-2" />
                      Aggiungi Docente
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'classes' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestione Classi</h2>
                  <p className="text-gray-600">Configura le classi dell'istituto</p>
                </div>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <GraduationCap className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sezione Classi
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      Qui potrai gestire le classi dell'istituto
                    </p>
                    <Button>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Aggiungi Classe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestione Materie</h2>
                  <p className="text-gray-600">Configura le discipline curricolari</p>
                </div>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sezione Materie
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      Qui potrai gestire le materie curricolari
                    </p>
                    <Button>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Aggiungi Materia
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestione Aule</h2>
                  <p className="text-gray-600">Configura gli spazi didattici</p>
                </div>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sezione Aule
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      Qui potrai gestire le aule e gli spazi didattici
                    </p>
                    <Button>
                      <MapPin className="w-4 h-4 mr-2" />
                      Aggiungi Aula
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Generatore Orario AI</h2>
                  <p className="text-gray-600">Utilizza algoritmi genetici per ottimizzare l'orario</p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Generazione Automatica
                    </CardTitle>
                    <CardDescription>
                      Crea un orario ottimizzato utilizzando l'intelligenza artificiale
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Generatore AI Pronto
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Configura prima docenti, classi, materie e aule per generare l'orario ottimale
                      </p>
                      <Button size="lg" disabled>
                        <Calendar className="w-4 h-4 mr-2" />
                        Genera Orario Ottimale
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">
                        Completa la configurazione per abilitare la generazione
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;