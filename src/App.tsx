import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { School, Users, GraduationCap, BookOpen, MapPin, Calendar, BarChart3 } from 'lucide-react';
import { Footer } from './components/Layout/Footer';
import { CookieBanner } from './components/Privacy/CookieBanner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { title: 'Docenti', value: 0, icon: Users, color: 'text-blue-600' },
    { title: 'Classi', value: 0, icon: GraduationCap, color: 'text-green-600' },
    { title: 'Materie', value: 0, icon: BookOpen, color: 'text-purple-600' },
    { title: 'Aule', value: 0, icon: MapPin, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 primary-gradient rounded-xl shadow-lg">
                <School className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  OrarioAI
                </h1>
                <p className="text-sm text-gray-600 font-medium">Gestione Orari Scolastici</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 font-medium px-3 py-2 bg-white/50 rounded-lg border border-gray-200/50">
                {new Date().toLocaleDateString('it-IT', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-white/60 backdrop-blur-sm border-r border-gray-200/50">
          <nav className="p-6">
            <div className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
                { id: 'teachers', label: 'Docenti', icon: Users, color: 'text-green-600' },
                { id: 'classes', label: 'Classi', icon: GraduationCap, color: 'text-purple-600' },
                { id: 'subjects', label: 'Materie', icon: BookOpen, color: 'text-orange-600' },
                { id: 'rooms', label: 'Aule', icon: MapPin, color: 'text-red-600' },
                { id: 'schedule', label: 'Orario', icon: Calendar, color: 'text-indigo-600' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative">
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full justify-start h-12 text-left font-medium sidebar-item relative overflow-hidden
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:from-blue-600 hover:to-indigo-700' 
                          : 'hover:bg-white/80 text-gray-700'
                        }`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : item.color}`} />
                      <span className="relative z-10">{item.label}</span>
                    </Button>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-r-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 fade-in">
                {/* Welcome Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <School className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">
                          Benvenuto in OrarioAI
                        </h2>
                        <p className="text-blue-100 font-medium">
                          Sistema Intelligente per la Scuola Italiana
                        </p>
                      </div>
                    </div>
                    <p className="text-blue-50 text-lg leading-relaxed max-w-3xl">
                      Gestione avanzata degli orari scolastici con algoritmi di intelligenza artificiale. 
                      Ottimizzazione automatica, risoluzione di conflitti e generazione di orari perfetti per la tua scuola.
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                    Panoramica del Sistema
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <Card key={stat.title} className="stat-card hover-lift border-0 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1">
                                  {stat.title}
                                </p>
                                <div className="text-3xl font-bold text-gray-900 mb-2">
                                  {stat.value}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${stat.color.replace('text-', 'bg-')}`}></div>
                                  Attualmente configurati
                                </div>
                              </div>
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color.replace('text-', 'bg-')}/10`}>
                                <Icon className={`w-7 h-7 ${stat.color}`} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <Card className="hover-lift border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                      <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
                      Inizia Subito
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Configura il tuo sistema per generare orari ottimizzati
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div 
                        className="group p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => setActiveTab('teachers')}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Configura Docenti</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Aggiungi docenti e le loro disponibilità
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="group p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => setActiveTab('classes')}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Gestisci Classi</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Imposta classi, materie e aule
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="group p-6 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:border-purple-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        onClick={() => setActiveTab('schedule')}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Genera Orario</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              Crea orari ottimizzati con l'AI
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div className="space-y-8 fade-in">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Gestione Docenti</h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Configura l'anagrafe dei docenti, le loro competenze e disponibilità orarie per ottimizzare la distribuzione delle lezioni
                  </p>
                </div>
                <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
                  <CardContent className="flex flex-col items-center justify-center py-16 px-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Inizia con i Docenti
                    </h3>
                    <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
                      Aggiungi i docenti del tuo istituto, specifica le materie che insegnano e imposta le loro disponibilità orarie
                    </p>
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <Users className="w-5 h-5 mr-2" />
                      Aggiungi Primo Docente
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
      
      {/* Footer */}
      <Footer />
      
      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}

export default App;