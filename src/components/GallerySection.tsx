import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Coffee,
  Sparkles,
  MessageCircle,
  Video,
  Play,
} from 'lucide-react';
import heroCafeImage from '../assets/images/recanto_hero_cafe_1789933102401.jpg';
import latteArtImage from '../assets/images/recanto_gallery_item-1.jpg';
import pastriesImage from '../assets/images/recanto_pastries_1789933523946.jpg';
import pourOverImage from '../assets/images/recanto_pourover_1789933538581.jpg';
import interiorImage from '../assets/images/recanto_interior_1789933549590.jpg';
import cakesImage from '../assets/images/recanto_cakes_1789933561227.jpg';
import fachadaImage from '../assets/images/fachada_amarela_1789934046294.jpg';
import { RECANTO_7_DATA } from '../data/cafeteriaData';
import { GalleryMediaItem } from '../types';

/**
 * Robust YouTube Embed URL builder that supports standard, short, mobile and embed links.
 */
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.includes('/embed/')) {
    return trimmed.includes('?') ? trimmed : `${trimmed}?autoplay=1`;
  }
  // Matches youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return null;
}

interface GallerySectionProps {
  items?: GalleryMediaItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'cafes' | 'receitas' | 'espaco'>('todos');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const defaultGalleryItems: GalleryMediaItem[] = [
    {
      id: 'item-1',
      title: 'Cappuccino & Latte Art Afetivo',
      type: 'image',
      category: 'cafes',
      categoryLabel: 'Cafés Especiais',
      description: 'Extração cremosa com leite vaporizado na temperatura perfeita e grãos de torra equilibrada.',
      src: heroCafeImage,
      tag: 'Mais Pedido',
    },
    {
      id: 'item-2',
      title: 'Fornadas Artesanais do Dia',
      type: 'image',
      category: 'receitas',
      categoryLabel: 'Receitas Frescas',
      description: 'Croissants folhados crocantes e quitutes dourados preparados frescos diariamente pela manhã.',
      src: pastriesImage,
      tag: 'Produção Diária',
    },
    {
      id: 'item-3',
      title: 'Métodos Especiais & Filtrados',
      type: 'image',
      category: 'cafes',
      categoryLabel: 'Cafés Especiais',
      description: 'Cafés filtrados em métodos artesanais para realçar notas aromáticas florais, frutadas e achocolatadas.',
      src: pourOverImage,
      tag: 'Moído na Hora',
    },
    {
      id: 'item-4',
      title: 'Espaço Convidativo & Acolhedor',
      type: 'image',
      category: 'espaco',
      categoryLabel: 'Nosso Espaço',
      description: 'Cantinhos pensados para quem quer ler um livro, trabalhar com calma ou conversar entre amigos.',
      src: interiorImage,
      tag: 'Ambiente Climatizado',
    },
    {
      id: 'item-5',
      title: 'Bolos & Tortas da Estação',
      type: 'image',
      category: 'receitas',
      categoryLabel: 'Receitas Frescas',
      description: 'Fatias generosas de bolos caseiros, variando a cada dia conforme a produção afetiva.',
      src: cakesImage,
      tag: 'Receita Afetiva',
    },
    {
      id: 'item-6',
      title: 'Fachada Amarela do Recanto',
      type: 'image',
      category: 'espaco',
      categoryLabel: 'Nosso Espaço',
      description: 'Procure a fachada amarela no Maiobão! Nosso refúgio aconchegante com toldo listrado e ambiente acolhedor.',
      src: fachadaImage,
      tag: 'Procure a Fachada Amarela',
    },
  ];

  const galleryItems = items && items.length > 0 ? items : defaultGalleryItems;

  const filteredItems =
    activeCategory === 'todos'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const showNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => ((prev! + 1) % filteredItems.length));
  }, [selectedImageIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  }, [selectedImageIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, showNext, showPrev]);

  const whatsappDirectUrl = `https://wa.me/${RECANTO_7_DATA.whatsapp}?text=${encodeURIComponent(
    'Olá! Vi as fotos da galeria do Recanto 7 e gostaria de saber as opções disponíveis hoje.'
  )}`;

  return (
    <section id="galeria" className="relative py-16 sm:py-24 bg-[#FAF6F0] border-t border-[#EAE1D7] overflow-hidden">
      {/* Soft Pastel Background Accent */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-[#F3D58C]/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-80 rounded-full bg-[#EAD8C7]/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EBE1] border border-[#E3D3C2] text-xs font-semibold text-[#7A5442] mb-3 shadow-2xs">
            <Camera className="w-3.5 h-3.5 text-[#C68B18]" />
            <span>Nossa Atmosfera em Imagens</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#3B271E]">
            Galeria do Recanto
          </h2>

          <p className="text-sm sm:text-base text-[#674433] mt-3 leading-relaxed">
            Conheça o nosso ambiente, as xícaras de café extraídas na hora e as receitas fresquinhas que saem do nosso forno diariamente.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
        >
          {[
            { id: 'todos', label: 'Ver Tudo', icon: Sparkles },
            { id: 'cafes', label: 'Cafés Especiais', icon: Coffee },
            { id: 'receitas', label: 'Fornada do Dia', icon: Sparkles },
            { id: 'espaco', label: 'Nosso Espaço', icon: Camera },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E9B949] text-[#241710] shadow-sm'
                    : 'bg-[#F5EDE3] hover:bg-[#EFE4D7] text-[#674433] border border-[#E3D3C2]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Responsive Photo Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E3D3C2] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col"
              >
                {/* Image / Video Container */}
                <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full overflow-hidden bg-[#241710] flex items-center justify-center">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = latteArtImage;
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C1D16]/80 via-transparent to-black/10 opacity-70 group-hover:opacity-90 transition-opacity" />

                  {/* Top Tag & Type */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FAF6F0]/90 backdrop-blur-xs text-[#553C30] border border-[#E2D2C2] shadow-2xs">
                      {item.tag}
                    </span>
                    {item.type === 'video' && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#241710]/90 text-[#E9B949] border border-[#E9B949]/30 shadow-2xs flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>Vídeo</span>
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay if Video */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-[#E9B949]/90 text-[#241710] flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Hover Magnifier Icon */}
                  <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-[#FAF6F0]/90 backdrop-blur-xs flex items-center justify-center text-[#3B271E] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Title & Category on Image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDF0D5]">
                      {item.categoryLabel}
                    </span>
                    <h3 className="font-serif-display text-lg font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Card Description */}
                <div className="p-4 bg-[#FAF6F0] flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-[#674433] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#EAE0D4] flex items-center justify-between text-[11px] font-semibold text-[#8C6249]">
                    <span>{item.type === 'video' ? 'Assistir ao vídeo' : 'Clique para ampliar'}</span>
                    <span className="text-[#C68B18] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {item.type === 'video' ? (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Assistir →</span>
                        </>
                      ) : (
                        <span>Ver foto →</span>
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Gallery Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-[#7A5442]">
            Gostou do que viu? Nossos preparos são artesanais e variam a cada dia.{' '}
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#3B271E] hover:text-[#C68B18] underline decoration-[#E9B949] underline-offset-2 inline-flex items-center gap-1"
            >
              Consulte no WhatsApp as fornadas de hoje
              <MessageCircle className="w-3 h-3" />
            </a>
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 bg-[#1D130E]/85 backdrop-blur-md transition-opacity"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF6F0] rounded-2xl sm:rounded-3xl border border-[#DECFC0] shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              {/* Lightbox Top Bar */}
              <div className="px-5 py-4 bg-[#F5EDE3] border-b border-[#E8DFD5] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E3D3C2] text-[#8C6249]">
                    {filteredItems[selectedImageIndex].categoryLabel}
                  </span>
                  <span className="text-xs text-[#7A5442]">
                    {filteredItems[selectedImageIndex].type === 'video' ? 'Vídeo' : 'Foto'}{' '}
                    {selectedImageIndex + 1} de {filteredItems.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={closeLightbox}
                    className="p-2 rounded-full hover:bg-[#EBE0D3] text-[#553C30] hover:text-[#2C1D16] transition-colors cursor-pointer"
                    aria-label="Fechar visualização"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lightbox Main Image or Video Display */}
              <div className="relative flex-1 min-h-[260px] sm:min-h-[400px] max-h-[60vh] sm:max-h-[68vh] bg-[#140D09] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                {filteredItems[selectedImageIndex].type === 'video' && filteredItems[selectedImageIndex].videoUrl ? (
                  getYouTubeEmbedUrl(filteredItems[selectedImageIndex].videoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(filteredItems[selectedImageIndex].videoUrl)!}
                      title={filteredItems[selectedImageIndex].title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full max-w-3xl aspect-video border-0 rounded-lg shadow-xl"
                    />
                  ) : (
                    <video
                      src={filteredItems[selectedImageIndex].videoUrl}
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="max-w-full max-h-[56vh] sm:max-h-[64vh] w-auto h-auto object-contain rounded-lg shadow-xl"
                    />
                  )
                ) : (
                  <img
                    src={filteredItems[selectedImageIndex].src}
                    alt={filteredItems[selectedImageIndex].title}
                    onError={(e) => {
                      e.currentTarget.src = latteArtImage;
                    }}
                    className="max-w-full max-h-[56vh] sm:max-h-[64vh] w-auto h-auto object-contain select-none mx-auto rounded-lg shadow-md"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Nav Prev Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#3B271E] flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Item anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Nav Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#3B271E] flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Próximo item"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Caption & Details Bar */}
              <div className="p-5 sm:p-6 bg-[#FAF6F0] border-t border-[#E8DFD5] shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-[#3B271E]">
                    {filteredItems[selectedImageIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#674433] mt-1 max-w-xl leading-relaxed">
                    {filteredItems[selectedImageIndex].description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#2C1D16] font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-[#2C1D16]" />
                    <span>Perguntar no WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
