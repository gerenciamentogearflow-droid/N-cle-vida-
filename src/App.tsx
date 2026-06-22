import React, { useState, useEffect } from 'react';
import { db } from './lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { Leaf, Sun, Heart, Loader2, ArrowLeft, Users, ShieldCheck, User, Image as ImageIcon, FileText, Download, MessageSquare, Printer, List } from 'lucide-react';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { ContractPDFDocument } from './components/ContractPDFDocument';
import { initialContractData, ContractData } from './types';
import { pdf } from '@react-pdf/renderer';
import { InstallAppButton } from './components/InstallPrompt';

import html2pdf from 'html2pdf.js';

const convertImageToJPEG = async (dataUrl: string): Promise<string> => {
  if (dataUrl.startsWith('data:image/jpeg')) return dataUrl;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dev' | 'user' | 'contratos' | 'preview' | 'listar'>('login');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Contract Data State
  const [contractData, setContractData] = useState<ContractData>(initialContractData);
  const [savedContracts, setSavedContracts] = useState<ContractData[]>([]);

  useEffect(() => {
    if (currentView === 'listar') {
      const fetchSavedContracts = async () => {
        try {
          const contratosRef = collection(db, 'contratos');
          const q = query(contratosRef);
          const snapshot = await getDocs(q);
          const loaded: ContractData[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as ContractData));
          
          loaded.sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          setSavedContracts(loaded);
        } catch (err) {
          console.error("Erro ao carregar contratos:", err);
        }
      };
      fetchSavedContracts();
    }
  }, [currentView]);

  useEffect(() => {
    // Load from localStorage if present
    const saved = localStorage.getItem('contractData');
    if (saved) {
      try {
        setContractData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contractData', JSON.stringify(contractData));
  }, [contractData]);

  const handlePrint = async () => {
    await saveContractToFirebase(contractData);
    window.print();
  };

  const saveContractToFirebase = async (data: ContractData) => {
    try {
      const contratosRef = collection(db, 'contratos');
      if (data.id) {
        // Update
        const docRef = doc(db, 'contratos', data.id);
        const updateData = { ...data };
        delete updateData.id;
        await setDoc(docRef, updateData, { merge: true });
      } else {
        // Create new
        const newData = { ...data, createdAt: new Date().toISOString() };
        delete newData.id;
        const docRef = await addDoc(contratosRef, newData);
        setContractData(prev => ({ ...prev, id: docRef.id, createdAt: newData.createdAt }));
      }
    } catch (err) {
      console.error('Erro ao salvar contrato:', err);
    }
  };

  const handleDownloadPDF = async () => {
    await saveContractToFirebase(contractData);
    try {
      const blob = await pdf(<ContractPDFDocument data={contractData} logoUrl={logoUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Contrato_Nuclevida_${contractData.acolhido?.nome || 'Acolhido'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Houve um erro ao gerar o PDF. Tente novamente.');
    }
  };

  const handleWhatsApp = async () => {
    await saveContractToFirebase(contractData);
    try {
      const pdfBlob = await pdf(<ContractPDFDocument data={contractData} logoUrl={logoUrl} />).toBlob();
      const file = new File([pdfBlob], `Contrato_Nuclevida_${contractData.acolhido?.nome || 'Acolhido'}.pdf`, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Contrato - ${contractData.acolhido?.nome || 'Nuclevida'}`,
          text: `Segue o contrato de ${contractData.acolhido?.nome || 'Nuclevida'}`,
        });
      } else {
        // Fallback to downloading and just opening WhatsApp with text
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const message = `Olá! O sistema Nuclevida acaba de gerar o contrato para ${contractData.acolhido?.nome || 'o acolhido'}. O arquivo PDF foi baixado em meu dispositivo e o anexarei logo em seguida nesta conversa.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
      }
    } catch (e) {
      console.error(e);
      alert('Houve um erro ao gerar o PDF. Tente novamente.');
    }
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().logoUrl) {
          let url = docSnap.data().logoUrl;
          if (!url.startsWith('data:image/jpeg')) {
            url = await convertImageToJPEG(url);
            // Optionally update firebase here so it gets fixed for good
            await setDoc(docRef, { logoUrl: url }, { merge: true });
          }
          setLogoUrl(url);
        }
      } catch (err) {
        console.error('Falha ao carregar a logo', err);
      }
    };
    fetchLogo();
  }, []);

  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  
  // Dev Create User State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [createMsg, setCreateMsg] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Logo Upload State
  const [uploadMsg, setUploadMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Dev Delete Contracts State
  const [deleteMsg, setDeleteMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteAllContracts = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    setDeleteMsg('');
    try {
      const contratosRef = collection(db, 'contratos');
      const q = query(contratosRef);
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'contratos', document.id)));
      await Promise.all(deletePromises);

      setDeleteMsg(`${snapshot.size} contrato(s) excluído(s) com sucesso.`);
      setSavedContracts([]); // Clear local state just in case
    } catch (err) {
      console.error(err);
      setDeleteMsg('Erro ao excluir os contratos.');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadMsg('Erro: Imagem muito grande. Máximo 2MB.');
      return;
    }

    setIsUploading(true);
    setUploadMsg('');

    const imgURL = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 500;
      const MAX_HEIGHT = 500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Export as JPEG so @react-pdf/renderer supports it natively without PNG/interlaced issues
      const base64Str = canvas.toDataURL('image/jpeg', 0.9);

      try {
        const docRef = doc(db, 'settings', 'general');
        await setDoc(docRef, { logoUrl: base64Str }, { merge: true });
        setLogoUrl(base64Str);
        setUploadMsg('Logo atualizada com sucesso!');
      } catch (err) {
        console.error(err);
        setUploadMsg('Erro ao salvar a logo no banco.');
      } finally {
        setIsUploading(false);
        URL.revokeObjectURL(imgURL);
      }
    };

    img.onerror = () => {
      setUploadMsg('Erro ao formatar a imagem. Tente outro formato.');
      setIsUploading(false);
      URL.revokeObjectURL(imgURL);
    };

    img.src = imgURL;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    
    if (!username || !password) {
      setError('Por favor, preencha usuário e senha.');
      return;
    }

    setIsLoading(true);

    try {
      // Check Dev Hardcoded Login
      if (username === 'Mafran' && password === 'Zetech.556') {
        setCurrentView('dev');
        setUsername('');
        setPassword('');
        setIsLoading(false);
        return;
      }

      // Check Firestore normal users
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), where('password', '==', password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setCurrentView('user');
        setUsername('');
        setPassword('');
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o banco de dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg('');
    
    if (!newUsername || !newPassword) {
      setCreateMsg('Preencha os dados do novo usuário.');
      return;
    }

    setIsCreating(true);
    try {
      const usersRef = collection(db, 'users');
      // Check if user exists
      const q = query(usersRef, where('username', '==', newUsername));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setCreateMsg('Erro: Usuário já existe.');
      } else {
        await addDoc(usersRef, {
          username: newUsername,
          password: newPassword,
          createdAt: new Date().toISOString()
        });
        setCreateMsg('Usuário criado com sucesso!');
        setNewUsername('');
        setNewPassword('');
      }
    } catch (err) {
      console.error(err);
      setCreateMsg('Erro ao criar usuário no banco de dados.');
    } finally {
      setIsCreating(false);
    }
  };

  if (currentView === 'dev') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-sky-200 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg relative z-10 flex flex-col h-full">
          <button 
            onClick={() => setCurrentView('login')}
            className="flex items-center text-teal-700 hover:text-teal-900 mb-6 transition-colors font-medium bg-white/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/50 w-max"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sair da Área Dev
          </button>
          
          <div className="flex-1 bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-400 font-mono text-xs uppercase tracking-tighter italic">Terminal v1.0.4 - Mafran Systems</span>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto pr-2">
              <div>
                <h2 className="text-emerald-400 font-mono text-xl mb-4 flex items-center">
                  <span className="mr-2">$</span>Área Dev
                </h2>
                
                <form onSubmit={handleCreateUser} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
                  <p className="text-slate-300 text-xs font-mono italic opacity-80 mb-4 underline">Gerenciar Acessos: Criar Novo Usuário</p>
                  
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-1 font-mono">Novo Usuário</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-emerald-500 opacity-70" />
                      </div>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 bg-slate-900 text-emerald-500 rounded font-mono text-sm border border-emerald-500/30 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600 transition duration-200"
                        placeholder="Nome de usuário"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 uppercase block mb-1 font-mono">Senha de Acesso</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full px-3 py-3 bg-slate-900 text-emerald-500 rounded font-mono text-sm border border-emerald-500/30 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600 transition duration-200"
                      placeholder="Defina uma senha"
                    />
                  </div>

                  {createMsg && (
                    <div className={`text-sm text-center p-3 rounded font-mono mt-4 ${createMsg.includes('Erro') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                      {createMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full mt-6 flex justify-center bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 rounded uppercase text-[10px] tracking-widest transition-colors disabled:opacity-50"
                  >
                    {isCreating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Criar Conta no Banco'}
                  </button>
                </form>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
                <p className="text-slate-300 text-xs font-mono italic opacity-80 mb-4 underline">Gerenciar Mídia: Logo do App</p>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-2 font-mono">Upload de Nova Logo (Max 2MB)</label>
                  <label className="flex items-center justify-center w-full px-4 py-3 bg-slate-900 text-emerald-500 rounded font-mono text-sm border border-emerald-500/30 cursor-pointer hover:bg-slate-800 transition-colors">
                    {isUploading ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <ImageIcon className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {uploadMsg && (
                  <div className={`text-sm text-center p-3 rounded font-mono mt-4 ${uploadMsg.includes('Erro') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {uploadMsg}
                  </div>
                )}
                {logoUrl && (
                  <div className="mt-4 flex justify-center bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <img src={logoUrl} alt="Logo Preview" className="max-h-20 w-auto object-contain" />
                  </div>
                )}
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
                <p className="text-slate-300 text-xs font-mono italic opacity-80 mb-4 underline">Gerenciar Dados: Contratos</p>
                <div>
                  {!confirmDelete ? (
                    <button
                      onClick={handleDeleteAllContracts}
                      disabled={isDeleting}
                      className="w-full flex justify-center items-center bg-red-900/40 hover:bg-red-800 text-red-100 font-bold py-3 rounded uppercase text-[10px] tracking-widest transition-colors disabled:opacity-50 border border-red-500/30"
                    >
                      Apagar Todos os Contratos Emitidos
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAllContracts}
                        disabled={isDeleting}
                        className="flex-1 flex justify-center items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded uppercase text-[10px] tracking-widest transition-colors disabled:opacity-50 border border-red-500"
                      >
                        {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirmar Exclusão'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        disabled={isDeleting}
                        className="flex-1 flex justify-center items-center bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded uppercase text-[10px] tracking-widest transition-colors disabled:opacity-50 border border-slate-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
                {deleteMsg && (
                  <div className={`text-sm text-center p-3 rounded font-mono mt-4 ${deleteMsg.includes('Erro') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'}`}>
                    {deleteMsg}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <div><span className="text-emerald-500 mr-1">●</span>Database Sync: Online</div>
                <div>Zetech Framework v5.2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-sky-200 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center relative z-10">
          <div className="mb-8 flex flex-col items-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Núcle Vida" className="h-20 w-auto mb-4 object-contain mix-blend-multiply" />
            ) : (
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Sun className="w-10 h-10 text-white" />
              </div>
            )}
            <h2 className="text-3xl font-bold text-teal-900 tracking-tight">Bem-vindo(a)</h2>
            <p className="text-teal-700/70 text-sm mt-1 tracking-widest font-medium">Você acessou o sistema Núcle Vida.</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => { setContractData(initialContractData); setCurrentView('contratos'); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Emitir Contratos
            </button>

            <button
              onClick={() => setCurrentView('listar')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
              <List className="w-5 h-5" />
              Ver Contratos Emitidos
            </button>

            <button
              onClick={() => setCurrentView('login')}
              className="w-full bg-white/80 hover:bg-white text-teal-800 font-bold py-4 rounded-xl border border-teal-100 shadow-sm transition-all active:scale-[0.98]"
            >
              Sair do Sistema
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'listar') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-emerald-800 text-white p-6 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl hidden sm:block">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              ) : (
                <Sun className="w-8 h-8 text-emerald-800" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Contratos Emitidos</h1>
              <p className="text-emerald-200 text-xs sm:text-sm">Sistema Nuclevida</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('user')}
            className="flex items-center text-emerald-100 hover:text-white transition-colors text-sm sm:text-base font-medium bg-emerald-900/50 hover:bg-emerald-900 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
        </header>

        <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {savedContracts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Nenhum contrato emitido ainda.</div>
            ) : (
              <div className="flex flex-col">
                {savedContracts.map((contract) => (
                  <div key={contract.id} className="border-b border-gray-50 last:border-0 p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-emerald-900">{contract.acolhido?.nome || 'Acolhido sem nome'}</h3>
                      <p className="text-sm text-gray-500">Contratante: {contract.contratante?.nome || 'Não informado'}</p>
                      <p className="text-xs text-gray-400 mt-1">Data: {contract.createdAt ? new Date(contract.createdAt).toLocaleString('pt-BR') : 'Desconhecida'}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setContractData(contract);
                        setCurrentView('preview');
                      }}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      Ver / Editar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'contratos') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-emerald-800 text-white p-6 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl hidden sm:block">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              ) : (
                <Sun className="w-8 h-8 text-emerald-800" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Emissão de Contratos</h1>
              <p className="text-emerald-200 text-xs sm:text-sm">Sistema Nuclevida</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('user')}
            className="flex items-center text-emerald-100 hover:text-white transition-colors text-sm sm:text-base font-medium bg-emerald-900/50 hover:bg-emerald-900 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
        </header>

        <main className="w-full">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-12">
              <ContractForm data={contractData} onChange={setContractData} onPrint={() => setCurrentView('preview')} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'preview') {
    return (
      <div className="min-h-screen bg-gray-100 print:bg-white text-gray-900">
        <div className="max-w-4xl mx-auto py-6 print:py-0">
          <div className="flex flex-wrap gap-4 justify-center mb-6 bg-white p-4 rounded-lg shadow-md print:hidden sticky top-4 z-10 w-[95%] mx-auto">
            <button onClick={() => setCurrentView('contratos')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <ArrowLeft size={20} /> Voltar
            </button>
            <button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <Download size={20} /> Baixar PDF
            </button>
            <button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <Printer size={20} /> Imprimir / Salvar PDF
            </button>
            <button onClick={handleWhatsApp} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 shadow-sm transition-colors">
              <MessageSquare size={20} /> Enviar WhatsApp
            </button>
          </div>
          
          <div className="bg-white shadow-xl rounded-sm print:shadow-none print:m-0 mx-auto w-full max-w-[210mm] overflow-auto print:overflow-visible">
            <div className="p-8 sm:p-12 print:p-0">
              <ContractPreview data={contractData} logoUrl={logoUrl} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-sky-200 flex items-center justify-center p-8 font-sans overflow-hidden relative">
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center relative z-10">
        <div className="mb-8 flex flex-col items-center">
          {logoUrl ? (
            <img src={logoUrl} alt="Núcle Vida" className="h-24 w-auto mb-4 object-contain mix-blend-multiply" />
          ) : (
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          )}
          <h1 className="text-3xl font-bold text-teal-900 tracking-tight">Núcle Vida</h1>
          <p className="text-teal-700/70 text-sm mt-1 uppercase tracking-widest font-medium italic">Renascendo para a Esperança</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="text-xs font-semibold text-teal-800 ml-1 uppercase tracking-wider mb-1 block">Usuário</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full bg-white/60 border border-teal-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-teal-300 transition-all"
            />
          </div>
          
          <div className="text-left">
            <label className="text-xs font-semibold text-teal-800 ml-1 uppercase tracking-wider mb-1 block">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/60 border border-teal-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-teal-300 transition-all"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-teal-200 text-emerald-500 focus:ring-emerald-500" />
              <span className="text-sm text-teal-700 group-hover:text-teal-900">Lembrar senha</span>
            </label>
          </div>

          {error && (
            <div className="text-sm bg-white/60 text-red-600 p-3 rounded-xl border border-red-200 backdrop-blur-md shadow-sm">
              {error}
            </div>
          )}
          
          {infoMessage && (
            <div className="text-sm bg-white/60 text-emerald-700 p-3 rounded-xl border border-emerald-200 backdrop-blur-md shadow-sm mt-3">
              {infoMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200/50 transition-all active:scale-[0.98] mt-4 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'ENTRAR NO PORTAL'}
          </button>
        </form>

        <InstallAppButton />
      </div>
    </div>
  );
}
