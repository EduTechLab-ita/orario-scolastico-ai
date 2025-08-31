import React, { useState } from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { PrivacyModal } from '../Privacy/PrivacyModal';

export function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>© 2025 EduTech Lab by</span>
              <a 
                href="https://github.com/EduTechLab-ita" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Fabio Rizzotto
                <ExternalLink className="inline w-3 h-3 ml-1" />
              </a>
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Realizzato con</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>per la scuola italiana</span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6 text-sm">
              <button 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setShowPrivacyModal(true)}
              >
                Privacy Policy
              </button>
              <button 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => {
                  localStorage.removeItem('cookie-consent');
                  window.location.reload();
                }}
              >
                Cookie
              </button>
              <a 
                href="https://github.com/EduTechLab-ita/orario-scolastico-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
              >
                GitHub
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Privacy Modal */}
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </footer>
  );
}