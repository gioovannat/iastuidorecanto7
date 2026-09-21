import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, MapPin, AlertCircle, ExternalLink, MessageCircle } from 'lucide-react';
import { RECANTO_7_DATA } from '../data/cafeteriaData';
import defaultFachadaImage from '../assets/images/fachada_amarela_1789934046294.jpg';
import { getRecantoStatus } from '../utils/businessHours';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fachadaSrc?: string;
  fachadaCaption?: string;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  fachadaSrc,
  fachadaCaption,
}) => {
  const businessStatus = getRecantoStatus();
  if (!isOpen) return null;

  const currentFachada = fachadaSrc || defaultFachadaImage;
  const currentCaption = fachadaCaption || 'Procure a fachada amarela';

  const whatsappDirectUrl = `https://wa.me/${RECANTO_7_DATA.whatsapp}?text=${encodeURIComponent(
    RECANTO_7_DATA.whatsappMessage
  )}`;

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
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#FAF6F0] rounded-2xl border border-[#DECFC0] shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8DFD5] bg-[#F5EDE3] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#E9B949]/20 text-[#B88114]">
                <Clock className="w-5 h-5 text-[#B88114]" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg font-bold text-[#3B271E]">
                  Horários & Informações
                </h3>
                <p className="text-xs text-[#7A5442]">Recanto 7 • Cafeteria Artesanal</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#EBE0D3] text-[#7A5442] hover:text-[#3B271E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Opening Hours list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C6249] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#DCA028]" />
                  Horários de Funcionamento
                </h4>

                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                    businessStatus.isOpen
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : 'bg-[#FFF8EE] text-[#7A5442] border-[#EAD8C7]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      businessStatus.isOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                    }`}
                  />
                  <span>{businessStatus.statusText}</span>
                  <span className="text-[11px] opacity-80">• {businessStatus.detailText}</span>
                </div>
              </div>
              <div className="space-y-2 bg-[#F5EDE3]/50 rounded-xl p-3 border border-[#EAE0D4]">
                {RECANTO_7_DATA.schedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs sm:text-sm border-b border-[#EFE5D9] last:border-0"
                  >
                    <span className="font-medium text-[#553C30]">{item.day}</span>
                    <span
                      className={`font-semibold ${
                        item.hours.includes('Fechado') ? 'text-[#8C6249]' : 'text-[#3B271E]'
                      }`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Map */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C6249] mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#DCA028]" />
                Localização & Como Encontrar
              </h4>

              {/* Fachada Photo and caption */}
              <div className="rounded-xl overflow-hidden border border-[#DECFC0] bg-[#FAF6F0] mb-3">
                <div className="aspect-square sm:aspect-16/10 max-h-[260px] sm:max-h-[290px] w-full overflow-hidden bg-[#241710] flex items-center justify-center">
                  <img
                    src={currentFachada}
                    alt="Fachada do Recanto 7"
                    className="w-full h-full object-cover object-top sm:object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-2.5 bg-[#FFF9ED] border-t border-[#F1E0CE] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E9B949] ring-2 ring-[#E9B949]/30 shrink-0" />
                  <p className="text-xs font-bold text-[#3B271E]">
                    {currentCaption}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5EDE3]/50 border border-[#EAE0D4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#3B271E]">Bairro Maiobão</p>
                  <p className="text-xs text-[#7A5442]">
                    Paço do Lumiar, Maranhão • Brasil
                  </p>
                </div>
                <a
                  href={RECANTO_7_DATA.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#E9B949] hover:bg-[#DCA028] text-[#2C1D16] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Abrir no Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Important Notices */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#8C6249] mb-3 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#DCA028]" />
                Importante saber
              </h4>
              <ul className="space-y-2 text-xs text-[#553C30] bg-[#FFF8EC] border border-[#F3DFC1] rounded-xl p-3.5">
                {RECANTO_7_DATA.notices.map((notice, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DCA028] mt-1.5 shrink-0" />
                    <span>{notice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#F5EDE3] border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#7A5442]">
              Dúvidas? Entre em contato pelo WhatsApp.
            </span>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#E9B949] hover:bg-[#DCA028] text-[#2C1D16] text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-[#2C1D16]" />
              <span>Chamar {RECANTO_7_DATA.whatsappFormatted}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
