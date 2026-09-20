import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  MapPin,
  MessageCircle,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Eye,
  X,
  Upload,
  RotateCcw,
} from 'lucide-react';
import { RECANTO_7_DATA } from '../data/cafeteriaData';
import defaultFachadaImage from '../assets/images/fachada_amarela_1789934046294.jpg';
import { getRecantoStatus, BusinessStatus } from '../utils/businessHours';

export const ScheduleSection: React.FC = () => {
  const [fachadaSrc, setFachadaSrc] = useState<string>(() => {
    try {
      return localStorage.getItem('recanto7_custom_facade') || defaultFachadaImage;
    } catch {
      return defaultFachadaImage;
    }
  });
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [businessStatus, setBusinessStatus] = useState<BusinessStatus>(() => getRecantoStatus());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFachadaSrc(result);
        try {
          localStorage.setItem('recanto7_custom_facade', result);
        } catch (err) {
          console.warn('Could not save facade to localStorage', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetFachada = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFachadaSrc(defaultFachadaImage);
    try {
      localStorage.removeItem('recanto7_custom_facade');
    } catch (err) {
      console.warn('Could not reset facade in localStorage', err);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${RECANTO_7_DATA.whatsapp}?text=${encodeURIComponent(
    RECANTO_7_DATA.whatsappMessage
  )}`;

  return (
    <section id="horarios" className="relative py-16 sm:py-24 bg-[#F5EDE3]/60 border-t border-[#EAE1D7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with slide-up */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E3D3C2] text-xs font-semibold text-[#7A5442] mb-3">
            <Clock className="w-3.5 h-3.5 text-[#C68B18]" />
            <span>Planeje Sua Visita</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#3B271E]">
            Horários de Atendimento & Localização
          </h2>

          <p className="text-sm sm:text-base text-[#674433] mt-3 leading-relaxed">
            Estamos de portas abertas para receber você com um café quentinho e atendimento atencioso.
          </p>
        </motion.div>

        {/* 2-Column Card layout with subtle slide-up */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Weekly Schedule Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-[#FAF6F0] border border-[#DECFC0] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8DFD5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EDE3] border border-[#E3D3C2] flex items-center justify-center text-[#B88114]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-xl font-bold text-[#3B271E]">
                      Quadro de Horários
                    </h3>
                    <p className="text-xs text-[#7A5442]">Funcionamento semanal</p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
                    businessStatus.isOpen
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : 'bg-[#FFF8EE] text-[#7A5442] border-[#EAD8C7]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      businessStatus.isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                    }`}
                  />
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#2C1D16]">{businessStatus.statusText}</span>
                    <span className="hidden sm:inline text-[11px] opacity-80">• {businessStatus.detailText}</span>
                  </div>
                </div>
              </div>

              {/* Schedule list */}
              <div className="space-y-2.5">
                {RECANTO_7_DATA.schedule.map((item, index) => {
                  const isClosed = item.hours.includes('Fechado');
                  return (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isClosed
                          ? 'bg-[#F9F5EE] border-[#ECE2D6] text-[#8C6249]'
                          : 'bg-[#FDF9F3] border-[#E8DFD3] hover:border-[#DCA028] text-[#3B271E]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isClosed ? 'bg-[#C8B8A6]' : 'bg-[#E9B949]'}`} />
                        <span className="text-sm font-semibold">{item.day}</span>
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-bold mt-1 sm:mt-0 ${
                          isClosed ? 'text-[#8C6249]' : 'text-[#593E30]'
                        }`}
                      >
                        {item.hours}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note alert */}
            <div className="mt-6 p-4 rounded-xl bg-[#FFF8EC] border border-[#F3DFC1] flex items-start gap-3 text-xs text-[#6F5244]">
              <AlertCircle className="w-4 h-4 text-[#DCA028] shrink-0 mt-0.5" />
              <p>
                <strong>Importante:</strong> Nossos produtos são preparados diariamente de forma artesanal. As opções de quitutes e pães podem variar conforme a produção fresca de cada dia.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Location & Quick WhatsApp Contact */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Location Card ("Onde Encontrar") */}
            <div className="rounded-3xl p-6 sm:p-7 bg-[#FAF6F0] border border-[#DECFC0] shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EDE3] border border-[#E3D3C2] flex items-center justify-center text-[#B88114]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-display text-lg font-bold text-[#3B271E]">
                      Onde Encontrar
                    </h3>
                    <p className="text-xs text-[#7A5442]">Bairro Maiobão • Paço do Lumiar</p>
                  </div>
                </div>

                <p className="text-sm text-[#553C30] leading-relaxed mb-4">
                  Venha nos fazer uma visita no <strong>Maiobão</strong>, em <strong>Paço do Lumiar - MA</strong>. Um refúgio aconchegante para a sua pausa do dia.
                </p>

                {/* Fachada do Estabelecimento com Foto e Legenda */}
                <div className="mb-4 rounded-2xl overflow-hidden border border-[#DECFC0] bg-[#F5EDE3] shadow-xs group">
                  <div
                    onClick={() => setIsPhotoOpen(true)}
                    className="relative cursor-pointer aspect-4/3 w-full overflow-hidden bg-[#EAE0D4]"
                  >
                    <img
                      src={fachadaSrc}
                      alt="Fachada amarela do Recanto 7 Café e Cia no Maiobão"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#241710]/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Top Pill */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF6F0]/90 backdrop-blur-xs text-[11px] font-bold text-[#3B271E] border border-[#DECFC0] shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#E9B949]" />
                      <span>Fachada do Recanto 7</span>
                    </div>

                    {/* Click to expand hint */}
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#FAF6F0]/90 backdrop-blur-xs flex items-center justify-center text-[#3B271E] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Legenda de Rodapé Solicitada: "Procure a fachada amarela" */}
                  <div className="p-3 bg-[#FFF9ED] border-t border-[#F1E0CE] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-[#E9B949] ring-4 ring-[#E9B949]/30 shrink-0" />
                      <p className="text-xs sm:text-sm font-bold text-[#3B271E] tracking-tight">
                        Procure a fachada amarela
                      </p>
                    </div>

                    {/* Quick upload or reset facade if user wants */}
                    <div className="flex items-center gap-1.5">
                      <label
                        title="Substituir foto da fachada se desejar"
                        className="p-1.5 rounded-lg hover:bg-[#F2E4D2] text-[#8C6249] hover:text-[#3B271E] cursor-pointer transition-colors text-[11px] flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span className="hidden sm:inline">Trocar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {fachadaSrc !== defaultFachadaImage && (
                        <button
                          onClick={handleResetFachada}
                          title="Restaurar foto original"
                          className="p-1.5 rounded-lg hover:bg-[#F2E4D2] text-[#8C6249] hover:text-[#3B271E] cursor-pointer transition-colors text-[11px]"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F1E8] border border-[#E8DFD5] text-xs text-[#674433] space-y-1 mb-5">
                  <p className="font-bold text-[#3B271E]">Local de Fácil Acesso</p>
                  <p>Bairro Maiobão • Paço do Lumiar - Maranhão</p>
                  <p className="text-[#8C6249]">Sem delivery • Atendimento acolhedor presencial</p>
                </div>
              </div>

              <a
                href={RECANTO_7_DATA.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[#D9C7B8] bg-[#F7F1E8] hover:bg-[#EFE5D8] text-[#3B271E] font-bold text-sm transition-all shadow-2xs hover:shadow-xs"
              >
                <MapPin className="w-4 h-4 text-[#C68B18]" />
                <span>Abrir rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            {/* WhatsApp Highlight Box */}
            <div className="rounded-3xl p-6 bg-gradient-to-br from-[#F5D88C]/40 via-[#FAF6F0] to-[#E8D4C2]/50 border border-[#E3D3C2] shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8C6249] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C68B18]" />
                <span>Atendimento Direto</span>
              </div>
              <h4 className="font-serif-display text-lg font-bold text-[#3B271E] mb-1">
                Fale conosco no WhatsApp
              </h4>
              <p className="text-xs text-[#674433] mb-4">
                Tire dúvidas sobre os preparos do dia ou confirme os horários.
              </p>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-sm shadow-xs hover:shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-[#241710]" />
                <span>Iniciar conversa no {RECANTO_7_DATA.whatsappFormatted}</span>
              </a>
            </div>

          </motion.div>

        </div>

      </div>

      {/* Lightbox / Enlarged View for Fachada */}
      <AnimatePresence>
        {isPhotoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPhotoOpen(false)}
              className="fixed inset-0 bg-[#1D130E]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#FAF6F0] rounded-2xl sm:rounded-3xl border border-[#DECFC0] shadow-2xl overflow-hidden z-10"
            >
              {/* Top bar */}
              <div className="px-5 py-4 bg-[#F5EDE3] border-b border-[#E8DFD5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E9B949]" />
                  <span className="font-serif-display font-bold text-[#3B271E] text-base">
                    Fachada do Recanto 7
                  </span>
                </div>

                <button
                  onClick={() => setIsPhotoOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#EAE0D4] text-[#553C30] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo */}
              <div className="relative max-h-[65vh] bg-[#241710] flex items-center justify-center overflow-hidden">
                <img
                  src={fachadaSrc}
                  alt="Fachada amarela do Recanto 7 Café e Cia"
                  className="w-full h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Footer caption */}
              <div className="p-5 bg-[#FFF9ED] border-t border-[#F1E0CE] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E9B949] ring-4 ring-[#E9B949]/30 shrink-0" />
                  <div>
                    <p className="font-bold text-sm sm:text-base text-[#3B271E]">
                      Procure a fachada amarela
                    </p>
                    <p className="text-xs text-[#7A5442]">
                      Bairro Maiobão • Paço do Lumiar - Maranhão
                    </p>
                  </div>
                </div>

                <a
                  href={RECANTO_7_DATA.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

