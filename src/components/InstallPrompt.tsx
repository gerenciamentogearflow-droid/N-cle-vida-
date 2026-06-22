import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Detect if already installed (standalone mode)
    const isReadyStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isReadyStandalone);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isReadyStandalone) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If it's iOS and not standalone, we can choose to prompt them manually after a delay
    if (isIosDevice && !isReadyStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } else if (isIOS) {
      alert("Para instalar no iPhone: Toque no ícone de Compartilhar no navegador e selecione 'Adicionar à Tela de Início'.");
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white shadow-2xl rounded-2xl p-4 border border-teal-100 flex items-center justify-between transform transition-transform duration-300 translate-y-0">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100 p-2 rounded-xl">
          <Download className="text-emerald-600 w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-teal-900">Instalar Aplicativo</h4>
          <p className="text-xs text-teal-700">Acesse mais rápido da sua tela inicial</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Instalar
        </button>
        <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
