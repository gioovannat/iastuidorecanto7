import React from 'react';
import { motion } from 'motion/react';
import { Coffee, Sparkles, Heart, Clock, Smile } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const cards = [
    {
      icon: Coffee,
      title: 'Cafés Especiais',
      description:
        'Grãos selecionados e métodos de extração pensados para extrair as notas mais puras e marcantes de cada café.',
      tag: 'Grãos selecionados',
      accentColor: 'from-[#F7D070]/20 to-[#E8DFD5]/40',
      badgeColor: 'bg-[#FAF6F0] text-[#8C6249] border-[#E3D3C2]',
    },
    {
      icon: Sparkles,
      title: 'Produção Diária & Artesanal',
      description:
        'Não utilizamos congelados industriais. Cada receita do dia sai do forno com ingredientes frescos e opções que variam com a inspiração da manhã.',
      tag: 'Sem cardápio fixo',
      accentColor: 'from-[#F3D58C]/30 to-[#EAD8C7]/50',
      badgeColor: 'bg-[#FAF6F0] text-[#7A5442] border-[#E3D3C2]',
    },
    {
      icon: Heart,
      title: 'Presencial & Aconchegante',
      description:
        'Não trabalhamos com delivery. Nosso propósito é ser o seu recanto no Maiobão: uma pausa calma para conversar, relaxar e degustar sem pressa.',
      tag: '100% no local',
      accentColor: 'from-[#EFE5D8]/50 to-[#E2D2C2]/40',
      badgeColor: 'bg-[#FAF6F0] text-[#674433] border-[#E3D3C2]',
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-[#FAF6F0] border-t border-[#EAE1D7] overflow-hidden">
      {/* Decorative soft pastel blurred glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-80 rounded-full bg-[#FDF1BE]/30 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with subtle scroll slide-up */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-18"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EBE1] border border-[#E3D3C2] text-xs font-semibold text-[#7A5442] mb-3">
            <Smile className="w-3.5 h-3.5 text-[#C68B18]" />
            <span>A Essência do Recanto 7</span>
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-[#3B271E] leading-tight">
            Cada detalhe pensado para o seu aconchego
          </h2>

          <p className="text-sm sm:text-base text-[#674433] mt-3 leading-relaxed">
            Uma cafeteria no Maiobão criada para desacelerar a rotina. Aqui, o café é companhia para boas conversas e momentos que marcam.
          </p>
        </motion.div>

        {/* Cards Grid with Staggered Slide-up */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative rounded-2xl p-7 bg-gradient-to-b ${card.accentColor} border border-[#E2D2C2] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] border border-[#DECFC0] flex items-center justify-center text-[#B88114] shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${card.badgeColor}`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="font-serif-display text-xl font-bold text-[#3B271E] mb-2.5">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#553C30] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E3D3C2]/70 flex items-center gap-1.5 text-xs font-semibold text-[#8C6249]">
                  <Clock className="w-3.5 h-3.5 text-[#C68B18]" />
                  <span>Feito no seu tempo</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
