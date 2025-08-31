import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Cookie, X, Settings } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const rejectAll = () => {
    const minimal = { necessary: true, analytics: false, marketing: false };
    setPreferences(minimal);
    localStorage.setItem('cookie-consent', JSON.stringify(minimal));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <CardTitle>Impostazioni Cookie</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>
              Personalizza le tue preferenze sui cookie per migliorare la tua esperienza.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cookie Necessari */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookie Necessari</h4>
                  <p className="text-sm text-gray-600">
                    Essenziali per il funzionamento del sito
                  </p>
                </div>
                <div className="text-sm text-gray-500">Sempre attivi</div>
              </div>
              <p className="text-xs text-gray-500">
                Questi cookie sono necessari per il funzionamento base dell'applicazione e non possono essere disabilitati.
              </p>
            </div>

            {/* Cookie Analytics */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookie Analytics</h4>
                  <p className="text-sm text-gray-600">
                    Ci aiutano a capire come utilizzi il sito
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Raccogliamo informazioni anonime su come gli utenti interagiscono con il sito per migliorarlo.
              </p>
            </div>

            {/* Cookie Marketing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cookie Marketing</h4>
                  <p className="text-sm text-gray-600">
                    Per personalizzare contenuti e pubblicità
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Utilizzati per mostrare contenuti e pubblicità più rilevanti per te.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button onClick={acceptSelected} className="flex-1">
                Salva Preferenze
              </Button>
              <Button onClick={acceptAll} variant="outline" className="flex-1">
                Accetta Tutti
              </Button>
              <Button onClick={rejectAll} variant="outline" className="flex-1">
                Solo Necessari
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex items-start space-x-3 flex-1">
            <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium mb-1">
                Utilizziamo i cookie per migliorare la tua esperienza
              </p>
              <p className="text-gray-600">
                Questo sito utilizza cookie per fornire funzionalità essenziali e analizzare il traffico. 
                Accettando, consenti l'uso di tutti i cookie.{' '}
                <button 
                  onClick={() => setShowSettings(true)}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Personalizza le preferenze
                </button>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
            <Button onClick={rejectAll} variant="outline" size="sm">
              Solo Necessari
            </Button>
            <Button onClick={() => setShowSettings(true)} variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Personalizza
            </Button>
            <Button onClick={acceptAll} size="sm">
              Accetta Tutti
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}