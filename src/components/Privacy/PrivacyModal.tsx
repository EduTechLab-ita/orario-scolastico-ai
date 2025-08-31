import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Shield, X, Lock, Eye, Database, Users, Mail, AlertTriangle } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <CardTitle>Privacy Policy</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Come gestiamo e proteggiamo i tuoi dati personali in OrarioAI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm">
          {/* Introduzione */}
          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Introduzione
            </h3>
            <p className="text-gray-600 leading-relaxed">
              OrarioAI è un'applicazione sviluppata da <strong>EduTech Lab by Fabio Rizzotto</strong> per la gestione 
              automatizzata degli orari scolastici. Questa Privacy Policy descrive come raccogliamo, utilizziamo e 
              proteggiamo le informazioni quando utilizzi la nostra applicazione.
            </p>
          </section>

          {/* Dati che raccogliamo */}
          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Dati che Raccogliamo
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Dati Scolastici
                </h4>
                <ul className="text-gray-600 space-y-1 text-xs ml-6">
                  <li>• Informazioni sui docenti (nome, materie, disponibilità)</li>
                  <li>• Dati delle classi (denominazione, numero studenti)</li>
                  <li>• Informazioni su materie e aule</li>
                  <li>• Orari e vincoli didattici</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Dati di Utilizzo
                </h4>
                <ul className="text-gray-600 space-y-1 text-xs ml-6">
                  <li>• Interazioni con l'applicazione</li>
                  <li>• Preferenze di configurazione</li>
                  <li>• Log di sistema (solo se necessario per debugging)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Come utilizziamo i dati */}
          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              Come Utilizziamo i Tuoi Dati
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                I dati vengono utilizzati esclusivamente per:
              </p>
              <ul className="mt-3 space-y-1 text-gray-600 ml-4">
                <li>• Generare orari scolastici ottimizzati</li>
                <li>• Salvare le tue configurazioni e preferenze</li>
                <li>• Migliorare le funzionalità dell'applicazione</li>
                <li>• Fornire supporto tecnico quando richiesto</li>
              </ul>
            </div>
          </section>

          {/* Archiviazione e sicurezza */}
          <section>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              Archiviazione e Sicurezza
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-green-800">Archiviazione Locale</h4>
                <p className="text-green-700 text-xs">
                  I dati sono memorizzati localmente nel tuo browser utilizzando localStorage. 
                  Nessun dato personale viene trasmesso a server esterni.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-green-800">Sicurezza</h4>
                <p className="text-green-700 text-xs">
                  I dati rimangono sul tuo dispositivo e sono protetti dalle misure di sicurezza 
                  del tuo browser e sistema operativo.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie */}
          <section>
            <h3 className="font-semibold text-lg mb-3">Cookie e Tecnologie Simili</h3>
            <p className="text-gray-600 leading-relaxed mb-3">
              Utilizziamo cookie e tecnologie simili per:
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-1">Cookie Necessari</h4>
                <p className="text-xs text-gray-600">Essenziali per il funzionamento</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-1">Cookie Analytics</h4>
                <p className="text-xs text-gray-600">Per migliorare l'esperienza</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="font-medium text-sm mb-1">Cookie Marketing</h4>
                <p className="text-xs text-gray-600">Contenuti personalizzati</p>
              </div>
            </div>
          </section>

          {/* Diritti dell'utente */}
          <section>
            <h3 className="font-semibold text-lg mb-3">I Tuoi Diritti</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3">In conformità al GDPR, hai diritto di:</p>
              <div className="grid md:grid-cols-2 gap-2 text-xs">
                <div>• Accedere ai tuoi dati</div>
                <div>• Rettificare dati incorretti</div>
                <div>• Cancellare i tuoi dati</div>
                <div>• Portabilità dei dati</div>
                <div>• Limitare il trattamento</div>
                <div>• Opporti al trattamento</div>
              </div>
            </div>
          </section>

          {/* Contatti */}
          <section className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contatti
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                Per questioni relative alla privacy, contatta:
              </p>
              <div className="text-sm">
                <p><strong>EduTech Lab by Fabio Rizzotto</strong></p>
                <p>GitHub: <a href="https://github.com/EduTechLab-ita" className="text-blue-600 hover:underline">@EduTechLab-ita</a></p>
              </div>
            </div>
          </section>

          {/* Avviso */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Importante</h4>
                <p className="text-yellow-700 text-xs">
                  Questa Privacy Policy può essere aggiornata periodicamente. 
                  Ti informeremo di eventuali modifiche significative.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>
              Ho Compreso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}