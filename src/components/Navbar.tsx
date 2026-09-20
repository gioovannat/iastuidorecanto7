import React from 'react';
import { MessageCircle, MapPin, Clock, Instagram, Lock } from 'lucide-react';
import { RECANTO_7_DATA } from '../data/cafeteriaData';

interface NavbarProps {
  logoSrc: string;
  onOpenSchedule: () => void;
  onLogoUploadClick: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  logoSrc,
  onOpenSchedule,
  onLogoUploadClick,
  onOpenAdmin,
}) => {
  const whatsappUrl = `https://wa.me/${RECANTO_7_DATA.whatsapp}?text=${encodeURIComponent(
    RECANTO_7_DATA.whatsappMessage
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF6F0]/90 border-b border-[#E8DFD5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLogoUploadClick}
            title="Clique para trocar ou ver a logo"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-[#D9C7B8] bg-[#F5EBE1] shadow-xs hover:border-[#DCA028] transition-all cursor-pointer"
          >
            <img
              src={logoSrc}
              alt="Logo Recanto 7"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[#3B271E]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-medium">
              Logo
            </div>
          </button>

          <div className="flex flex-col">
            <span className="font-serif-display text-2xl font-bold tracking-tight text-[#3B271E] leading-none">
              Recanto 7
            </span>
            <span className="text-xs font-medium text-[#7A5442] tracking-wider uppercase mt-1">
              Café e Cia
            </span>
          </div>
        </div>

        {/* Center Pill: Location, Schedule & Gallery */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#F3EBE1] border border-[#E4D6C6] text-xs font-medium text-[#674433]">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C68B18]" />
            Maiobão, Paço do Lumiar
          </span>
          <span className="text-[#C8B8A6]">•</span>
          <a
            href="#galeria"
            className="text-[#674433] hover:text-[#3B271E] font-semibold hover:underline decoration-[#E9B949] underline-offset-2 transition-colors cursor-pointer"
          >
            Galeria
          </a>
          <span className="text-[#C8B8A6]">•</span>
          <button
            onClick={onOpenSchedule}
            className="flex items-center gap-1.5 text-[#674433] hover:text-[#3B271E] font-semibold underline decoration-[#E9B949] underline-offset-2 transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#C68B18]" />
            <span>Horários</span>
          </button>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenAdmin}
            title="Área do Administrador (Gestão de Fotos, Vídeos e Logo)"
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#E2D2C2] text-[#674433] hover:text-[#3B271E] hover:border-[#DCA028] hover:bg-[#FDF9F3] transition-all cursor-pointer"
            aria-label="Painel Administrativo"
          >
            <Lock className="w-4 h-4" />
          </button>

          <a
            href={RECANTO_7_DATA.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Siga no Instagram @recanto_7cafeteria"
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-[#E2D2C2] text-[#674433] hover:text-[#3B271E] hover:border-[#DCA028] hover:bg-[#FDF9F3] transition-all"
            aria-label="Instagram da Cafeteria Recanto 7"
          >
            <Instagram className="w-4 h-4" />
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E9B949] hover:bg-[#DCA028] text-[#2C1D16] font-semibold text-sm shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-[#2C1D16]" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden text-xs">Contato</span>
          </a>
        </div>
      </div>
    </header>
  );
};

