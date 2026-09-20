import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Coffee,
  Heart,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { RECANTO_7_DATA } from '../data/cafeteriaData';
import { getRecantoStatus, BusinessStatus } from '../utils/businessHours';

interface HeroSectionProps {
  logoSrc: string;
  heroImageSrc: string;
  onOpenSchedule: () => void;
  onLogoUploadClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  logoSrc,
  heroImageSrc,
  onOpenSchedule,
  onLogoUploadClick,
}) => {
  const [businessStatus, setBusinessStatus] = useState<BusinessStatus>(() => getRecantoStatus());

  useEffect(() => {
    // Refresh status every 60 seconds to keep open/closed accurate
    const interval = setInterval(() => {
      setBusinessStatus(getRecantoStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const whatsappDirectUrl = `https://wa.me/${RECANTO_7_DATA.whatsapp}?text=${encodeURIComponent(
    RECANTO_7_DATA.whatsappMessage
  )}`;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative Pastel Background Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#F3D58C]/25 blur-3xl" />
        <div className="absolute top-40 right-10 w-[30rem] h-[30rem] rounded-full bg-[#E5D4C0]/40 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#FDF0D5]/50 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand, Narrative & WhatsApp CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Micro-badge / Location */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EBE1] border border-[#E3D3C2] text-xs font-semibold text-[#674433] mb-6 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#E9B949] animate-pulse" />
              <span>Bairro Maiobão • Paço do Lumiar, MA</span>
              <span className="text-[#C8B8A6]">•</span>
              <span className="text-[#8C6249]">Cafeteria Artesanal</span>
            </motion.div>

            {/* Logo Badge & Title Group */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 mb-6"
            >
              {/* Logo Emblem Frame */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-br from-[#F5D88C] via-[#E8D4C2] to-[#B89073] shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#FAF6F0] flex items-center justify-center relative">
                    <img
                      src={logoSrc}
                      alt="Logotipo Oficial Recanto 7"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {/* Subtle hover upload overlay */}
                    <button
                      onClick={onLogoUploadClick}
                      title="Alterar imagem do logotipo"
                      className="absolute inset-0 bg-[#3B271E]/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity text-[11px] font-medium cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#F7D070]" />
                      <span>Trocar Logo</span>
                    </button>
                  </div>
                </div>
                {/* Floating mini bean accent */}
                <div className="absolute -bottom-2 -right-2 bg-[#E9B949] text-[#2C1D16] p-1.5 rounded-full shadow-xs border-2 border-[#FAF6F0]">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Title & Sub-header */}
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#8C6249] mb-1">
                  Bem-vindo ao
                </span>
                <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3B271E] leading-[1.08]">
                  Recanto <span className="text-[#C68B18] italic font-normal font-serif-display">7</span>
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#7A5442] mt-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#DCA028]" />
                  <span>{RECANTO_7_DATA.tagline}</span>
                </p>
              </div>
            </motion.div>

            {/* Welcoming Cozy Description */}
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-[#553C30] leading-relaxed max-w-2xl mb-8"
            >
              {RECANTO_7_DATA.description}
            </motion.p>

            {/* WhatsApp CTA Action Group */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8"
            >
              {/* Primary WhatsApp Action */}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-button"
                className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-[#E9B949] via-[#E2AF3C] to-[#DCA028] hover:from-[#DFAC3A] hover:to-[#CF951E] text-[#241710] font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#241710]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-[#241710] text-[#241710]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                    Fale no WhatsApp
                  </span>
                  <span className="text-base font-extrabold tracking-tight">
                    {RECANTO_7_DATA.whatsappFormatted}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>

              {/* View Schedule Modal Trigger with Live Open/Closed indicator */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenSchedule}
                  className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl border border-[#D9C7B8] bg-[#FAF6F0] hover:bg-[#F3EBE1] text-[#674433] hover:text-[#3B271E] font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
                >
                  <Clock className="w-4 h-4 text-[#C68B18]" />
                  <span>Horários & Local</span>
                </button>

                {/* Live Open / Closed indicator badge */}
                <button
                  type="button"
                  onClick={onOpenSchedule}
                  title="Ver horários completos da semana"
                  className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all text-left shadow-2xs ${
                    businessStatus.isOpen
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-[#FFF8EE] text-[#674433] border-[#EAD8C7] hover:bg-[#F6EDE0]'
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    {businessStatus.isOpen && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        businessStatus.isOpen ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                    />
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 leading-tight">
                    <span className="font-bold text-[#2C1D16]">
                      {businessStatus.statusText}
                    </span>
                    <span className="text-[11px] text-[#7A5442] font-medium">
                      • {businessStatus.detailText}
                    </span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Practical Notes & Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-[#E8DFD5]"
            >
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F5EDE3]/60 border border-[#EBE0D3]">
                <div className="p-1 rounded-md bg-[#FAF6F0] text-[#C68B18] mt-0.5">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3B271E]">Produção do Dia</h4>
                  <p className="text-xs text-[#6F5244] leading-relaxed mt-0.5">
                    Receitas artesanais frescas diárias preparadas com dedicação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F5EDE3]/60 border border-[#EBE0D3]">
                <div className="p-1 rounded-md bg-[#FAF6F0] text-[#C68B18] mt-0.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3B271E]">Experiência Presencial</h4>
                  <p className="text-xs text-[#6F5244] leading-relaxed mt-0.5">
                    Atendimento acolhedor sem delivery: venha viver esse momento.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase & Atmosphere Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Main Aesthetic Photo Frame */}
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#F9F4EC] to-[#EFE6DC] border border-[#DECFC0] shadow-xl">
              
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-4/3 lg:aspect-5/4 shadow-inner bg-[#4B3327]">
                <img
                  src={heroImageSrc}
                  alt="Ambiente aconchegante da Cafeteria Recanto 7 com café artesanal"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                {/* Soft gradient wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2F1D15]/80 via-transparent to-black/10" />

                {/* Floating Badge Bottom Left: Address */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 p-3 rounded-xl backdrop-blur-md bg-[#FAF6F0]/92 border border-white/40 shadow-lg text-[#3B271E]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#F5EBE1] flex items-center justify-center text-[#B88114]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#8C6249] uppercase tracking-wider">
                        Onde nos encontrar
                      </p>
                      <p className="text-xs font-bold text-[#3B271E]">
                        Maiobão • Paço do Lumiar
                      </p>
                    </div>
                  </div>

                  <a
                    href={RECANTO_7_DATA.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E9B949] hover:bg-[#DCA028] text-[#2C1D16] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Ver no Mapa</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Floating Accent Tag: Fresh Daily Badge */}
              <div className="absolute -top-3 -right-2 sm:-right-4 px-3.5 py-2 rounded-xl bg-[#FAF6F0] border border-[#E3D3C2] shadow-md flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#E9B949]" />
                <span className="text-xs font-bold text-[#3B271E]">
                  Café Especial & Afeto
                </span>
              </div>

              {/* Floating Accent Tag: Handcrafted Detail */}
              <div className="hidden sm:flex absolute -bottom-3 -left-3 px-3.5 py-1.5 rounded-full bg-[#3B271E] text-[#FDF0D5] text-xs font-medium items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#E9B949]" />
                <span>Pausas que aquecem a alma</span>
              </div>
            </div>

            {/* Quick Instagram callout underneath */}
            <div className="mt-4 flex items-center justify-center lg:justify-end gap-2 text-xs font-medium text-[#7A5442]">
              <span>Acompanhe o dia a dia no Instagram:</span>
              <a
                href={RECANTO_7_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#3B271E] hover:text-[#C68B18] underline decoration-[#E9B949] underline-offset-2 flex items-center gap-1"
              >
                @recanto_7cafeteria
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
