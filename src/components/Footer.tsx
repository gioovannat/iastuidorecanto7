import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, MapPin, Instagram } from 'lucide-react';
import { RECANTO_7_DATA } from '../data/cafeteriaData';

interface FooterProps {
  onOpenSchedule: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSchedule }) => {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${RECANTO_7_DATA.whatsapp}?text=${encodeURIComponent(
    RECANTO_7_DATA.whatsappMessage
  )}`;

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-[#E8DFD5] bg-[#F5EDE3]/70 pt-10 pb-8 text-[#553C30]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E8DFD5]">
          {/* Brand info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-serif-display text-xl font-bold text-[#3B271E]">
              Recanto 7
            </span>
            <span className="text-xs text-[#7A5442] mt-0.5">
              Cafeteria Artesanal • Maiobão, Paço do Lumiar - MA
            </span>
          </div>

          {/* Quick links & contact */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <a
              href="#galeria"
              className="text-[#674433] hover:text-[#3B271E] underline decoration-[#E9B949] underline-offset-2 transition-colors cursor-pointer"
            >
              Galeria de Fotos
            </a>
            <span className="text-[#D9C7B8]">•</span>
            <button
              onClick={onOpenSchedule}
              className="text-[#674433] hover:text-[#3B271E] underline decoration-[#E9B949] underline-offset-2 transition-colors cursor-pointer"
            >
              Horários de Funcionamento
            </button>
            <span className="text-[#D9C7B8]">•</span>
            <a
              href={RECANTO_7_DATA.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#674433] hover:text-[#3B271E] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C68B18]" />
              <span>Como Chegar</span>
            </a>
            <span className="text-[#D9C7B8]">•</span>
            <a
              href={RECANTO_7_DATA.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#674433] hover:text-[#3B271E] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#C68B18]" />
              <span>Instagram</span>
            </a>
            <span className="text-[#D9C7B8]">•</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#3B271E] font-bold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#C68B18]" />
              <span>{RECANTO_7_DATA.whatsappFormatted}</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C6249] gap-3">
          <p>© {currentYear} Recanto 7 Cafeteria. Todos os direitos reservados.</p>

          <p className="flex items-center gap-1">
            <span>Feito com</span>
            <Heart className="w-3.5 h-3.5 fill-[#DCA028] text-[#DCA028]" />
            <span>para quem aprecia café de verdade.</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};


