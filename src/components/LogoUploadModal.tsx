import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, RotateCcw, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string;
  defaultLogo: string;
  onLogoChange: (newLogoUrl: string) => void;
  onResetLogo: () => void;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  defaultLogo,
  onLogoChange,
  onResetLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem (PNG, JPG, SVG, WEBP).');
      return;
    }

    try {
      setIsProcessing(true);
      // Downscale logo to max 512x512 with quality 0.85
      const optimizedDataUrl = await optimizeImageFile(file, {
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.85,
      });

      onLogoChange(optimizedDataUrl);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Falha ao processar logotipo:', err);
      alert('Não foi possível otimizar a imagem. Tente outro arquivo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#241710]/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#FAF6F0] rounded-2xl border border-[#DECFC0] shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E8DFD5] bg-[#F5EDE3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#B88114]" />
              <h3 className="font-serif-display text-base font-bold text-[#3B271E]">
                Personalizar Logotipo
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EBE0D3] text-[#7A5442] hover:text-[#3B271E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Current preview */}
            <div className="flex items-center gap-4 p-3 bg-[#F5EDE3]/60 rounded-xl border border-[#EAE0D4]">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#D9C7B8] flex items-center justify-center shrink-0">
                <img
                  src={currentLogo}
                  alt="Logo preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#3B271E]">Logotipo Ativo</p>
                <p className="text-[11px] text-[#7A5442] mt-0.5">
                  Exibido na barra de navegação e em destaque no Hero.
                </p>
              </div>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#DCA028] bg-[#FDF7E7]'
                  : 'border-[#D9C7B8] hover:border-[#DCA028] bg-[#FDF9F3]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-[#F5EDE3] flex items-center justify-center text-[#B88114] mb-2">
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#B88114]" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="text-xs font-bold text-[#3B271E]">
                {isProcessing
                  ? 'Otimizando e aplicando logotipo...'
                  : 'Clique para selecionar ou arraste o arquivo do logo'}
              </p>
              <p className="text-[11px] text-[#7A5442] mt-1">
                Formatos suportados: PNG, SVG, JPG, WEBP
              </p>
            </div>

            {successNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Logotipo atualizado com sucesso!</span>
              </div>
            )}

            {/* Reset option */}
            {currentLogo !== defaultLogo && (
              <button
                onClick={() => {
                  onResetLogo();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-[#8C6249] hover:text-[#593E30] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar logotipo padrão inicial</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
