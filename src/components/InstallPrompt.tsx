import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

export function InstallAppButton() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detect OS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);
    setIsAndroid(/android/i.test(navigator.userAgent));

    // Detect if already installed (standalone mode)
    const isReadyStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isReadyStandalone);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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
      }
    } else if (isIOS) {
      alert("Para instalar no iPhone:\n1. Toque no ícone de Compartilhar (quadrado com seta) na barra do navegador.\n2. Role para baixo e selecione 'Adicionar à Tela de Início'.");
    } else if (isAndroid) {
      alert("Para instalar no Android:\n1. Toque nos 3 pontinhos no navegador.\n2. Escolha 'Adicionar à tela inicial' ou 'Instalar aplicativo'.");
    } else {
       alert("Para instalar no Computador:\nClique no ícone de instalação (monitor pequeno com uma seta) na barra de endereços do seu navegador Chrome ou Edge.");
    }
  };

  // Do not suggest installation if it's already running as an app
  if (isStandalone) {
    return null;
  }

  // Determine if it looks like a mobile device to emphasize the button size, optional
  return (
    <div className="mt-4 pt-4 border-t border-teal-100/50">
      <button
        type="button"
        onClick={handleInstallClick}
        className="w-full bg-white hover:bg-teal-50 text-teal-700 font-bold py-3 px-4 rounded-xl shadow-sm border border-teal-200 transition-all flex items-center justify-center gap-2"
      >
        <Smartphone className="w-5 h-5 text-teal-600" />
        Instalar Aplicativo no Celular
      </button>
      <p className="text-center text-[10px] text-teal-600/70 mt-2 font-medium">Acesse o sistema diretamente da tela inicial sem abrir o navegador.</p>
    </div>
  );
}
