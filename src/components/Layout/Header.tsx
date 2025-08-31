import React from 'react';
import { School, Settings, Download, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

interface HeaderProps {
  onExport: () => void;
  onSettings: () => void;
}

export function Header({ onExport, onSettings }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                OrarioAI
              </h1>
              <p className="text-sm text-gray-500">
                Gestione Orari Scolastici
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="hidden sm:flex"
            >
              <Download className="w-4 h-4 mr-2" />
              Esporta
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSettings}
              className="hidden sm:flex"
            >
              <Settings className="w-4 h-4 mr-2" />
              Impostazioni
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">
                {new Date().toLocaleDateString('it-IT', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}