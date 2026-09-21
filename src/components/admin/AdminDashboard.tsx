import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Play,
  Trash2,
  Edit2,
  Plus,
  Save,
  Download,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  MessageCircle,
  Instagram,
  ShieldCheck,
  KeyRound,
  FileCode,
  Github,
  HelpCircle,
  Eye,
  X,
  ExternalLink,
  Copy,
  Link2,
} from 'lucide-react';
import {
  SiteConfig,
  GalleryMediaItem,
  MediaCategory,
  AdminCredentials,
} from '../../types';
import {
  saveStoredSiteConfig,
  downloadConfigForGitHub,
  getPrettyConfigJson,
  importConfigFromJson,
  resetStoredSiteConfig,
  getAdminCredentials,
  saveAdminCredentials,
} from '../../utils/siteContentStorage';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import defaultLogoImage from '../../assets/images/recanto_logo_custom.jpg';
import defaultFachadaImage from '../../assets/images/recanto_fachada_custom.png';
import defaultMediaFallback from '../../assets/images/recanto_gallery_item-1.jpg';

interface AdminDashboardProps {
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
  onCloseToSite: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  onUpdateConfig,
  onCloseToSite,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'midia' | 'info' | 'github' | 'seguranca'>('midia');
  const [siteState, setSiteState] = useState<SiteConfig>(config);
  const [saveToast, setSaveToast] = useState(false);

  // Mantém os cards alinhados com a configuração persistida carregada pelo App.
  useEffect(() => {
    setSiteState(config);
  }, [config]);
  const [copiedJson, setCopiedJson] = useState(false);

  // Gallery item edit/create modal state
  const [editingItem, setEditingItem] = useState<GalleryMediaItem | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFormError, setMediaFormError] = useState<string>('');

  // Delete card modal state
  const [itemToDelete, setItemToDelete] = useState<GalleryMediaItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  // Credentials state
  const [creds, setCreds] = useState<AdminCredentials>(getAdminCredentials());
  const [credMessage, setCredMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Import JSON state
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  const triggerSaveNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2800);
  };

  const handleSaveAll = () => {
    const success = saveStoredSiteConfig(siteState);
    if (success) {
      onUpdateConfig(siteState);
      triggerSaveNotification();
    }
  };

  /* -------------------------------------------------------------
     LOGOMARCA & FACHADA HANDLERS
     ------------------------------------------------------------- */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file, {
          maxWidth: 512,
          maxHeight: 512,
          quality: 0.85,
        });
        const updated = {
          ...siteState,
          logo: { ...siteState.logo, src: optimized },
        };
        setSiteState(updated);
        saveStoredSiteConfig(updated);
        onUpdateConfig(updated);
        triggerSaveNotification();
      } catch (err) {
        console.error('Falha ao processar logo:', err);
      }
    }
  };

  const handleFachadaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await optimizeImageFile(file, {
          maxWidth: 1280,
          maxHeight: 1280,
          quality: 0.82,
        });
        const updated = {
          ...siteState,
          fachada: { ...siteState.fachada, src: optimized },
        };
        setSiteState(updated);
        saveStoredSiteConfig(updated);
        onUpdateConfig(updated);
        triggerSaveNotification();
      } catch (err) {
        console.error('Falha ao processar foto da fachada:', err);
      }
    }
  };

  /* -------------------------------------------------------------
     GALLERY / MEDIA HANDLERS
     ------------------------------------------------------------- */
  const handleOpenAddMedia = () => {
    setEditingItem({
      id: `item-${Date.now()}`,
      title: '',
      type: 'image',
      category: 'espaco',
      categoryLabel: 'Nosso Espaço',
      description: '',
      src: '',
      videoUrl: '',
      thumbnailUrl: '',
      tag: 'Novidade',
    });
    setIsMediaModalOpen(true);
  };

  const handleEditMedia = (item: GalleryMediaItem) => {
    setEditingItem({ ...item });
    setIsMediaModalOpen(true);
  };

  const handleDeleteMedia = (id: string) => {
    const item = siteState.gallery.find((i) => i.id === id);
    if (item) {
      setItemToDelete(item);
    }
  };

  const confirmDeleteMedia = (id: string) => {
    const updatedGallery = siteState.gallery.filter((i) => i.id !== id);
    const updated = { ...siteState, gallery: updatedGallery };
    setSiteState(updated);
    saveStoredSiteConfig(updated);
    onUpdateConfig(updated);
    setItemToDelete(null);
    triggerSaveNotification();
  };

  const handleSaveMediaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setMediaFormError('');

    if (!editingItem.title.trim()) {
      setMediaFormError('Por favor, informe o título da foto ou vídeo.');
      return;
    }

    if (editingItem.type === 'image' && !editingItem.src) {
      setMediaFormError('Por favor, adicione uma foto ou link de imagem.');
      return;
    }

    if (editingItem.type === 'video' && !editingItem.videoUrl && !editingItem.src) {
      setMediaFormError('Por favor, adicione o link do vídeo (YouTube ou MP4).');
      return;
    }

    // Format YouTube embed if standard watch link
    let finalVideoUrl = editingItem.videoUrl;
    if (finalVideoUrl && finalVideoUrl.includes('youtube.com/watch?v=')) {
      const videoId = finalVideoUrl.split('watch?v=')[1]?.split('&')[0];
      if (videoId) {
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (finalVideoUrl && finalVideoUrl.includes('youtu.be/')) {
      const videoId = finalVideoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        finalVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Update category label automatically
    let categoryLabel = 'Nosso Espaço';
    if (editingItem.category === 'cafes') categoryLabel = 'Cafés Especiais';
    if (editingItem.category === 'receitas') categoryLabel = 'Receitas Frescas';

    const itemToSave: GalleryMediaItem = {
      ...editingItem,
      videoUrl: finalVideoUrl,
      categoryLabel,
      src: editingItem.src || editingItem.thumbnailUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    };

    const exists = siteState.gallery.some((i) => i.id === itemToSave.id);
    let updatedGallery: GalleryMediaItem[];

    if (exists) {
      updatedGallery = siteState.gallery.map((i) => (i.id === itemToSave.id ? itemToSave : i));
    } else {
      updatedGallery = [itemToSave, ...siteState.gallery];
    }

    const updated = { ...siteState, gallery: updatedGallery };
    setSiteState(updated);
    saveStoredSiteConfig(updated);
    onUpdateConfig(updated);
    setIsMediaModalOpen(false);
    setEditingItem(null);
    setMediaFormError('');
    triggerSaveNotification();
  };

  /* -------------------------------------------------------------
     GITHUB FILE EXPORT / IMPORT
     ------------------------------------------------------------- */
  const handleExportGitHub = () => {
    downloadConfigForGitHub(siteState, 'recanto-site-content.json');
  };

  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const adminSecretUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#admin`
      : '/#admin';

  const handleCopyAdminLink = async () => {
    try {
      await navigator.clipboard.writeText(adminSecretUrl);
      setCopiedAdminLink(true);
      setTimeout(() => setCopiedAdminLink(false), 2500);
    } catch {
      setCopiedAdminLink(true);
      setTimeout(() => setCopiedAdminLink(false), 2500);
    }
  };

  const handleCopyJson = () => {
    const jsonStr = getPrettyConfigJson(siteState);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleImportJson = () => {
    setImportError('');
    setImportSuccessMsg('');
    if (!importJsonText.trim()) {
      setImportError('Cole o código JSON do seu arquivo.');
      return;
    }
    const res = importConfigFromJson(importJsonText);
    if (res.success && res.config) {
      setSiteState(res.config);
      onUpdateConfig(res.config);
      triggerSaveNotification();
      setImportJsonText('');
      setImportSuccessMsg('Configuração importada e salva com sucesso do arquivo!');
      setTimeout(() => setImportSuccessMsg(''), 4000);
    } else {
      setImportError(res.error || 'Erro ao importar arquivo JSON.');
    }
  };

  const handleResetFactory = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmResetFactory = () => {
    const reset = resetStoredSiteConfig();
    setSiteState(reset);
    onUpdateConfig(reset);
    triggerSaveNotification();
    setIsResetConfirmOpen(false);
  };

  /* -------------------------------------------------------------
     SECURITY & CREDENTIALS
     ------------------------------------------------------------- */
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredMessage(null);

    const updatedCreds: AdminCredentials = {
      ...creds,
      updatedAt: new Date().toISOString(),
    };

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setCredMessage({ type: 'error', text: 'As novas senhas não coincidem.' });
        return;
      }
      if (newPassword.length < 4) {
        setCredMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 4 caracteres.' });
        return;
      }
      updatedCreds.passwordHash = newPassword;
    }

    saveAdminCredentials(updatedCreds);
    setCreds(updatedCreds);
    setNewPassword('');
    setConfirmPassword('');
    setCredMessage({ type: 'success', text: 'Credenciais de administrador atualizadas com sucesso!' });
  };

  return (
    <div className="min-h-screen bg-[#F5EDE3] text-[#3B271E] font-sans-body pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-700 text-white text-xs font-bold shadow-xl"
          >
            <Check className="w-4 h-4" />
            <span>Alterações salvas com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header of Admin Panel */}
      <header className="bg-[#FAF6F0] border-b border-[#DECFC0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[#DECFC0] bg-white shadow-2xs flex items-center justify-center p-1 shrink-0">
              <img
                src={siteState.logo.src}
                alt="Logo da Cafeteria"
                className="max-w-full max-h-full w-auto h-auto object-contain select-none"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-display text-lg sm:text-xl font-bold text-[#3B271E] leading-tight">
                  Painel de Administração
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#E9B949]/20 border border-[#E9B949]/40 text-[#8C5D0B] text-[10px] font-bold">
                  Recanto 7
                </span>
              </div>
              <p className="text-xs text-[#7A5442]">Total controle de fotos, vídeos e identidade</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleExportGitHub}
              title="Baixar arquivo JSON com as alterações para adicionar ao GitHub"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241710] hover:bg-[#3D281D] text-[#E9B949] font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>Exportar p/ GitHub</span>
            </button>

            <button
              onClick={onCloseToSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Site</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl border border-[#DECFC0] hover:bg-[#EFE4D5] text-[#7A5442] hover:text-[#3B271E] transition-colors cursor-pointer"
              title="Sair do Administrador"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-[#E8DFD5] py-2">
          <button
            onClick={() => setActiveTab('midia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'midia'
                ? 'bg-[#3B271E] text-white shadow-xs'
                : 'text-[#674433] hover:bg-[#EFE4D5]'
            }`}
          >
            <Video className="w-4 h-4 text-[#E9B949]" />
            <span>Fotos & Vídeos do Espaço</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
              {siteState.gallery.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-[#3B271E] text-white shadow-xs'
                : 'text-[#674433] hover:bg-[#EFE4D5]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#E9B949]" />
            <span>Logomarca & Fachada</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#3B271E] text-white shadow-xs'
                : 'text-[#674433] hover:bg-[#EFE4D5]'
            }`}
          >
            <Clock className="w-4 h-4 text-[#E9B949]" />
            <span>Textos & Contatos</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'github'
                ? 'bg-[#3B271E] text-white shadow-xs'
                : 'text-[#674433] hover:bg-[#EFE4D5]'
            }`}
          >
            <Github className="w-4 h-4 text-[#E9B949]" />
            <span>Salvar no GitHub (.json)</span>
          </button>

          <button
            onClick={() => setActiveTab('seguranca')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'seguranca'
                ? 'bg-[#3B271E] text-white shadow-xs'
                : 'text-[#674433] hover:bg-[#EFE4D5]'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#E9B949]" />
            <span>Segurança & Senha</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Banner: Link de Acesso Exclusivo para o Administrador */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-[#241710] border border-[#3E291C] text-[#FAF6F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E9B949]/20 border border-[#E9B949]/30 flex items-center justify-center text-[#E9B949] shrink-0">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[#FAF6F0]">Link de Acesso Privado ao Painel</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Oculto dos Visitantes
                </span>
              </div>
              <p className="text-xs text-[#DECFC0] mt-1">
                A landing page pública não exibe nenhum botão ou link para o painel. Salve este link nos favoritos para acessar:
                <code className="block sm:inline-block sm:ml-2 mt-1 sm:mt-0 px-2 py-0.5 rounded-md bg-black/40 text-[#E9B949] font-mono text-[11px] select-all">
                  {adminSecretUrl}
                </code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleCopyAdminLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              {copiedAdminLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-900" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Link de Acesso</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            TAB 1: FOTOS & VÍDEOS DO ESPAÇO
            ========================================================= */}
        {activeTab === 'midia' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF6F0] p-6 rounded-3xl border border-[#DECFC0] shadow-xs">
              <div>
                <h2 className="font-serif-display text-xl font-bold text-[#3B271E]">
                  Galeria do Local: Fotos & Vídeos
                </h2>
                <p className="text-xs sm:text-sm text-[#7A5442] mt-0.5">
                  Adicione, edite ou remova fotos de cafés, receitas e vídeos do ambiente para os visitantes.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleOpenAddMedia}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Foto ou Vídeo</span>
                </button>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteState.gallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FAF6F0] rounded-3xl border border-[#DECFC0] overflow-hidden shadow-xs flex flex-col group hover:border-[#C68B18] transition-all"
                >
                  {/* Media Preview Box */}
                  <div className="relative aspect-[16/10] bg-[#241710] overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = defaultMediaFallback;
                      }}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#241710]/80 backdrop-blur-xs text-white text-[11px] font-bold border border-white/20">
                      {item.type === 'video' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-[#E9B949]" />
                          <span>Vídeo</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5 text-[#E9B949]" />
                          <span>Foto</span>
                        </>
                      )}
                    </div>

                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#E9B949]/90 text-[#241710] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Category Pill */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-[#FAF6F0]/90 text-[#3B271E] text-[10px] font-bold">
                      {item.categoryLabel}
                    </div>
                  </div>

                  {/* Info & Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-serif-display font-bold text-base text-[#3B271E] leading-snug line-clamp-1">
                          {item.title}
                        </h3>
                        {item.tag && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#E9B949]/20 text-[#8C5D0B] text-[10px] font-bold">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7A5442] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {item.type === 'video' && item.videoUrl && (
                        <p className="text-[11px] text-[#C68B18] font-mono truncate mt-2">
                          Link: {item.videoUrl}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-4 mt-4 border-t border-[#E8DFD5] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleEditMedia(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DECFC0] hover:bg-[#EFE4D5] text-[#553C30] font-bold text-xs transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#C68B18]" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-700 hover:bg-red-50 hover:border-red-200 border border-transparent font-bold text-xs transition-colors cursor-pointer"
                        title="Excluir este card da galeria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: LOGOMARCA & FACHADA
            ========================================================= */}
        {activeTab === 'visual' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Logomarca */}
            <div className="bg-[#FAF6F0] p-6 sm:p-7 rounded-3xl border border-[#DECFC0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#E9B949]/20 border border-[#E9B949]/40 flex items-center justify-center text-[#8C5D0B]">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[#3B271E]">
                      Logomarca Oficial
                    </h3>
                    <p className="text-xs text-[#7A5442]">
                      Exibida no topo, rodapé e aba do navegador (favicon).
                    </p>
                  </div>
                </div>

                {/* Logo Preview */}
                <div className="p-6 rounded-2xl bg-[#EFE5D8] border border-[#DECFC0] flex flex-col items-center justify-center text-center mb-5">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#D9C7B8] shadow-md bg-white mb-3 flex items-center justify-center p-2">
                    <img
                      src={siteState.logo.src}
                      alt="Logo da Cafeteria"
                      onError={(e) => {
                        e.currentTarget.src = defaultLogoImage;
                      }}
                      className="max-w-full max-h-full w-auto h-auto object-contain select-none"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#3B271E]">Logo Atual</span>
                  <span className="text-[11px] text-[#7A5442]">Formatos recomendados: JPG, PNG, SVG ou WebP</span>
                </div>

                {/* Upload Control */}
                <div className="space-y-3">
                  <label className="block w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-[#C68B18] bg-[#FFF8EE] hover:bg-[#FDF3E3] text-[#3B271E] font-bold text-xs sm:text-sm text-center cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 inline-block mr-2 text-[#C68B18]" />
                    <span>Selecionar Nova Imagem para a Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <label className="block text-xs font-bold text-[#553C30] mb-1">
                      Ou insira o Link / URL da Logo:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://exemplo.com/minha-logo.png"
                        value={siteState.logo.src.startsWith('data:') ? '' : siteState.logo.src}
                        onChange={(e) => {
                          const updated = {
                            ...siteState,
                            logo: { ...siteState.logo, src: e.target.value },
                          };
                          setSiteState(updated);
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                      />
                      <button
                        onClick={handleSaveAll}
                        className="px-4 py-2.5 rounded-xl bg-[#3B271E] hover:bg-[#523728] text-white font-bold text-xs"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#E8DFD5] flex items-center justify-between text-xs text-[#7A5442]">
                <span>Sincronização imediata na página</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ativo
                </span>
              </div>
            </div>

            {/* Card 2: Fachada da Cafeteria */}
            <div className="bg-[#FAF6F0] p-6 sm:p-7 rounded-3xl border border-[#DECFC0] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#E9B949]/20 border border-[#E9B949]/40 flex items-center justify-center text-[#8C5D0B]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[#3B271E]">
                      Foto da Fachada & Localização
                    </h3>
                    <p className="text-xs text-[#7A5442]">
                      Ajuda os clientes a encontrarem o estabelecimento na rua.
                    </p>
                  </div>
                </div>

                {/* Fachada Preview */}
                <div className="rounded-2xl overflow-hidden border border-[#DECFC0] bg-[#241710] aspect-square sm:aspect-[16/10] max-h-[280px] mb-4 relative flex items-center justify-center">
                  <img
                    src={siteState.fachada.src}
                    alt="Foto da fachada"
                    onError={(e) => {
                      e.currentTarget.src = defaultFachadaImage;
                    }}
                    className="w-full h-full object-cover object-top sm:object-center"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF6F0]/90 text-[11px] font-bold text-[#3B271E]">
                    {siteState.fachada.badgeText}
                  </div>
                </div>

                {/* Caption editing */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-[#553C30] mb-1">
                      Legenda em Destaque da Fachada:
                    </label>
                    <input
                      type="text"
                      value={siteState.fachada.caption}
                      onChange={(e) => {
                        const updated = {
                          ...siteState,
                          fachada: { ...siteState.fachada, caption: e.target.value },
                        };
                        setSiteState(updated);
                      }}
                      placeholder="Ex: Procure a fachada amarela"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs font-bold text-[#3B271E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#553C30] mb-1">
                      Etiqueta do Cabeçalho:
                    </label>
                    <input
                      type="text"
                      value={siteState.fachada.badgeText}
                      onChange={(e) => {
                        const updated = {
                          ...siteState,
                          fachada: { ...siteState.fachada, badgeText: e.target.value },
                        };
                        setSiteState(updated);
                      }}
                      placeholder="Ex: Fachada do Recanto 7"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                    />
                  </div>
                </div>

                {/* Upload Control */}
                <label className="block w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-[#C68B18] bg-[#FFF8EE] hover:bg-[#FDF3E3] text-[#3B271E] font-bold text-xs sm:text-sm text-center cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 inline-block mr-2 text-[#C68B18]" />
                  <span>Selecionar Nova Foto da Fachada</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFachadaUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="pt-4 mt-5 border-t border-[#E8DFD5] flex justify-end">
                <button
                  onClick={handleSaveAll}
                  className="px-5 py-2.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs"
                >
                  Salvar Alterações da Fachada
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: TEXTOS & CONTATOS
            ========================================================= */}
        {activeTab === 'info' && (
          <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#DECFC0] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8DFD5]">
              <div>
                <h2 className="font-serif-display text-xl font-bold text-[#3B271E]">
                  Informações Institucionais & Contatos
                </h2>
                <p className="text-xs text-[#7A5442]">
                  Atualize nomes, mensagens de WhatsApp, links e endereços exibidos em toda a página.
                </p>
              </div>

              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Textos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  Nome do Estabelecimento
                </label>
                <input
                  type="text"
                  value={siteState.brand.name}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, name: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  Slogan Principal
                </label>
                <input
                  type="text"
                  value={siteState.brand.tagline}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  Subtítulo / Assinatura (ex: Café e Cia)
                </label>
                <input
                  type="text"
                  value={siteState.brand.subtagline}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, subtagline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  WhatsApp (Exibição Formatada)
                </label>
                <input
                  type="text"
                  value={siteState.brand.whatsappFormatted}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, whatsappFormatted: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  WhatsApp Número para Link (com DDI e DDD, ex: 5598985353197)
                </label>
                <input
                  type="text"
                  value={siteState.brand.whatsapp}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, whatsapp: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  Instagram (@usuario)
                </label>
                <input
                  type="text"
                  value={siteState.brand.instagram}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  Mensagem Automática do WhatsApp
                </label>
                <input
                  type="text"
                  value={siteState.brand.whatsappMessage}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, whatsappMessage: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  Descrição / História Institucional
                </label>
                <textarea
                  rows={3}
                  value={siteState.brand.description}
                  onChange={(e) =>
                    setSiteState({
                      ...siteState,
                      brand: { ...siteState.brand, description: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-sm shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Todas as Alterações</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: GITHUB FILE EXPORT & SYNC
            ========================================================= */}
        {activeTab === 'github' && (
          <div className="space-y-8">
            <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#DECFC0] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#241710] text-[#E9B949] flex items-center justify-center shadow-xs">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif-display text-xl font-bold text-[#3B271E]">
                    Armazenamento em Arquivo para o GitHub
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A5442]">
                    Total facilidade para manter a landing page versionada e atualizada no GitHub.
                  </p>
                </div>
              </div>

              {/* Step by step guide */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 rounded-2xl bg-[#F5EDE3] border border-[#E4D6C6]">
                  <span className="w-6 h-6 rounded-full bg-[#E9B949] text-[#241710] font-bold text-xs flex items-center justify-center mb-2">
                    1
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#3B271E] mb-1">
                    Baixe o Arquivo
                  </h3>
                  <p className="text-xs text-[#674433] leading-relaxed">
                    Clique no botão abaixo para baixar o arquivo <code>recanto-site-content.json</code> com todas as suas fotos, vídeos e edições.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EDE3] border border-[#E4D6C6]">
                  <span className="w-6 h-6 rounded-full bg-[#E9B949] text-[#241710] font-bold text-xs flex items-center justify-center mb-2">
                    2
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#3B271E] mb-1">
                    Envie para o GitHub
                  </h3>
                  <p className="text-xs text-[#674433] leading-relaxed">
                    No seu repositório no GitHub, faça o upload ou commit do arquivo JSON. Ele preserva todo o histórico de alterações.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5EDE3] border border-[#E4D6C6]">
                  <span className="w-6 h-6 rounded-full bg-[#E9B949] text-[#241710] font-bold text-xs flex items-center justify-center mb-2">
                    3
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#3B271E] mb-1">
                    Publicação Automática
                  </h3>
                  <p className="text-xs text-[#674433] leading-relaxed">
                    A página hospedada no Vercel, Netlify ou GitHub Pages carrega as novidades imediatamente, sem depender de banco de dados externo.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E8DFD5]">
                <button
                  onClick={handleExportGitHub}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#241710] hover:bg-[#3D281D] text-[#E9B949] font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar recanto-site-content.json</span>
                </button>

                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-[#D9C7B8] bg-[#F7F1E8] hover:bg-[#EFE5D8] text-[#3B271E] font-bold text-xs transition-colors cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span className="text-emerald-800">Copiado com sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#8C6249]" />
                      <span>Copiar Código JSON</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleResetFactory}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-red-700 hover:bg-red-50 text-xs font-bold transition-colors ml-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrões de Fábrica</span>
                </button>
              </div>
            </div>

            {/* Import JSON Section */}
            <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#DECFC0] shadow-xs">
              <h3 className="font-serif-display text-lg font-bold text-[#3B271E] mb-2">
                Importar Arquivo JSON do GitHub
              </h3>
              <p className="text-xs text-[#7A5442] mb-4">
                Se você baixou um arquivo JSON do repositório ou quer carregar em outro computador, cole o conteúdo abaixo:
              </p>

              {importSuccessMsg && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{importSuccessMsg}</span>
                </div>
              )}

              {importError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Cole o conteúdo do arquivo recanto-site-content.json aqui...'
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs font-mono text-[#3B271E] mb-3"
              />

              <button
                onClick={handleImportJson}
                className="px-5 py-2.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs"
              >
                Carregar Configurações do JSON
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: SEGURANÇA & SENHA
            ========================================================= */}
        {activeTab === 'seguranca' && (
          <div className="bg-[#FAF6F0] p-6 sm:p-8 rounded-3xl border border-[#DECFC0] shadow-xs max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8DFD5]">
              <div className="w-10 h-10 rounded-xl bg-[#E9B949]/20 border border-[#E9B949]/40 flex items-center justify-center text-[#8C5D0B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif-display text-lg font-bold text-[#3B271E]">
                  Segurança & Credenciais do Dono
                </h2>
                <p className="text-xs text-[#7A5442]">
                  Altere o e-mail de acesso, senha e PIN de recuperação da landing page.
                </p>
              </div>
            </div>

            {credMessage && (
              <div
                className={`p-3.5 rounded-xl mb-5 text-xs flex items-center gap-2 ${
                  credMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {credMessage.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{credMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  E-mail de Login do Administrador
                </label>
                <input
                  type="email"
                  required
                  value={creds.email}
                  onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                  PIN de Segurança para Recuperação (4 dígitos)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={creds.recoveryPin}
                  onChange={(e) => setCreds({ ...creds, recoveryPin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm font-mono tracking-widest text-[#3B271E]"
                />
              </div>

              <div className="pt-2 border-t border-[#E8DFD5]">
                <h4 className="text-xs font-bold text-[#3B271E] mb-3">
                  Alterar Senha (opcional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#553C30] mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Deixe em branco p/ manter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#553C30] mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      placeholder="Repita a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs cursor-pointer"
                >
                  Salvar Novas Credenciais
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* =========================================================
          MODAL: ADICIONAR / EDITAR MÍDIA (FOTO OU VÍDEO)
          ========================================================= */}
      <AnimatePresence>
        {isMediaModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMediaModalOpen(false)}
              className="fixed inset-0 bg-[#1D130E]/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#FAF6F0] rounded-3xl border border-[#D9C7B8] shadow-2xl overflow-hidden z-10 my-8"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-[#F5EDE3] border-b border-[#E8DFD5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E9B949]/20 text-[#8C5D0B] flex items-center justify-center">
                    {editingItem.type === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  </div>
                  <h3 className="font-serif-display font-bold text-lg text-[#3B271E]">
                    {editingItem.id.startsWith('item-') && siteState.gallery.some((i) => i.id === editingItem.id)
                      ? 'Editar Mídia'
                      : 'Adicionar Nova Foto ou Vídeo'}
                  </h3>
                </div>

                <button
                  onClick={() => setIsMediaModalOpen(false)}
                  className="p-1 rounded-full hover:bg-[#EAE0D4] text-[#553C30]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveMediaItem} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
                {mediaFormError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{mediaFormError}</span>
                  </div>
                )}
                {/* Type selector: Foto vs Video */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-2">
                    Tipo de Mídia
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, type: 'image' })}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        editingItem.type === 'image'
                          ? 'bg-[#3B271E] text-white border-[#3B271E] shadow-2xs'
                          : 'bg-white text-[#674433] border-[#DECFC0] hover:bg-[#F3EBE1]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Fotografia</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, type: 'video' })}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        editingItem.type === 'video'
                          ? 'bg-[#3B271E] text-white border-[#3B271E] shadow-2xs'
                          : 'bg-white text-[#674433] border-[#DECFC0] hover:bg-[#F3EBE1]'
                      }`}
                    >
                      <Video className="w-4 h-4 text-[#E9B949]" />
                      <span>Vídeo do Local</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-1">
                    Título da Mídia *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Barista preparando café filtrado"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                  />
                </div>

                {/* Category & Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3326] mb-1">
                      Categoria
                    </label>
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value as 'cafes' | 'receitas' | 'espaco',
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                    >
                      <option value="espaco">Nosso Espaço</option>
                      <option value="cafes">Cafés Especiais</option>
                      <option value="receitas">Receitas Frescas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3326] mb-1">
                      Etiqueta / Destaque
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Vídeo do Local, Moído na Hora"
                      value={editingItem.tag}
                      onChange={(e) => setEditingItem({ ...editingItem, tag: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Conte sobre este momento, receita ou espaço..."
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                  />
                </div>

                {/* Image Upload or URL */}
                {editingItem.type === 'image' && (
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-bold text-[#4A3326]">
                      Foto (Arquivo ou Link) *
                    </label>

                    <label className="block w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#C68B18] bg-[#FFF8EE] hover:bg-[#FDF3E3] text-[#3B271E] font-bold text-xs text-center cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 inline-block mr-1 text-[#C68B18]" />
                      <span>Fazer upload de foto do computador/celular</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const optimized = await optimizeImageFile(file, {
                                maxWidth: 1280,
                                maxHeight: 1280,
                                quality: 0.82,
                              });
                              setEditingItem({ ...editingItem, src: optimized });
                            } catch (err) {
                              console.error('Falha ao processar foto:', err);
                            }
                          }
                        }}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <span className="text-[11px] text-[#7A5442] block mb-1">Ou cole a URL da imagem:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={editingItem.src.startsWith('data:') ? '' : editingItem.src}
                        onChange={(e) => setEditingItem({ ...editingItem, src: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                      />
                    </div>

                    {editingItem.src && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-[#DECFC0] bg-[#241710]">
                        <img
                          src={editingItem.src}
                          alt="Prévia"
                          onError={(e) => {
                            e.currentTarget.src = defaultMediaFallback;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Video URL & Thumbnail */}
                {editingItem.type === 'video' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-[#4A3326] mb-1">
                        Link do Vídeo (YouTube, Vimeo ou MP4 direto) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={editingItem.videoUrl || ''}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, videoUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-xs font-mono text-[#3B271E]"
                      />
                      <span className="text-[10px] text-[#8C6249] block mt-1">
                        Dica: Pode ser link normal do YouTube (ex: <code>youtube.com/watch?v=...</code> ou <code>youtu.be/...</code>)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4A3326] mb-1">
                        Imagem de Capa / Poster do Vídeo
                      </label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/poster-video.jpg"
                        value={editingItem.thumbnailUrl || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            thumbnailUrl: e.target.value,
                            src: e.target.value || editingItem.src,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#D9C7B8] text-xs text-[#3B271E]"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between gap-2 border-t border-[#E8DFD5]">
                  {siteState.gallery.some((i) => i.id === editingItem.id) ? (
                    <button
                      type="button"
                      onClick={() => {
                        const target = editingItem;
                        setIsMediaModalOpen(false);
                        setItemToDelete(target);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-red-700 hover:bg-red-50 border border-red-200 font-bold text-xs transition-colors cursor-pointer"
                      title="Excluir este card da galeria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Card</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-[#DECFC0] text-xs font-bold text-[#553C30] hover:bg-[#EFE4D5] cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs cursor-pointer"
                    >
                      Salvar na Galeria
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* =========================================================
            MODAL DE CONFIRMAÇÃO: EXCLUIR CARD DA GALERIA
            ========================================================= */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
              className="fixed inset-0 bg-[#1D130E]/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#FAF6F0] rounded-3xl border border-[#D9C7B8] shadow-2xl p-6 z-10 text-[#3B271E]"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#3B271E]">
                    Excluir card da galeria?
                  </h3>
                  <p className="text-xs text-[#7A5442] mt-0.5 leading-relaxed">
                    Tem certeza de que deseja remover este item? O card deixará de ser exibido para os visitantes na página inicial.
                  </p>
                </div>
              </div>

              {/* Item Preview */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD5] flex items-center gap-3.5 mb-5 shadow-2xs">
                {itemToDelete.src ? (
                  <img
                    src={itemToDelete.src}
                    alt={itemToDelete.title}
                    onError={(e) => {
                      e.currentTarget.src = defaultMediaFallback;
                    }}
                    className="w-14 h-14 rounded-xl object-cover border border-[#DECFC0] bg-[#241710] shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#241710] flex items-center justify-center text-white shrink-0">
                    <ImageIcon className="w-6 h-6 text-[#E9B949]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#3B271E] truncate">
                    {itemToDelete.title || 'Item sem título'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#F5EDE3] text-[10px] font-bold text-[#8C5D0B]">
                      {itemToDelete.categoryLabel || 'Galeria'}
                    </span>
                    {itemToDelete.type === 'video' ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#7A5442] font-semibold">
                        <Video className="w-3 h-3 text-[#C68B18]" />
                        <span>Vídeo</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-[#7A5442] font-semibold">
                        <ImageIcon className="w-3 h-3 text-[#C68B18]" />
                        <span>Foto</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#DECFC0] text-xs font-bold text-[#553C30] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => confirmDeleteMedia(itemToDelete.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Sim, Excluir Card</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* =========================================================
            MODAL DE CONFIRMAÇÃO: RESTAURAR PADRÕES DE FÁBRICA
            ========================================================= */}
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetConfirmOpen(false)}
              className="fixed inset-0 bg-[#1D130E]/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#FAF6F0] rounded-3xl border border-[#D9C7B8] shadow-2xl p-6 z-10 text-[#3B271E]"
            >
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-[#3B271E]">
                    Restaurar Padrões de Fábrica?
                  </h3>
                  <p className="text-xs text-[#7A5442] mt-0.5 leading-relaxed">
                    Todas as fotos, itens da galeria e textos customizados voltarão à configuração inicial de fábrica da cafeteria.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DECFC0] text-xs font-bold text-[#553C30] hover:bg-[#EFE4D5] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={confirmResetFactory}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restaurar Agora</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
