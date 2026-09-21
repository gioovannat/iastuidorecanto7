import { CafeteriaInfo } from '../types';

export const RECANTO_7_DATA: CafeteriaInfo = {
  name: 'Recanto 7',
  tagline: 'Cafeteria & Companhia',
  description:
    'Seu refúgio diário para saborear cafés especiais e delícias artesanais preparadas com afeto. Um ambiente calmo e acolhedor no Maiobão para desacelerar, conversar e apreciar os melhores momentos da vida.',
  whatsapp: '5598985353197',
  whatsappFormatted: '(98) 98535-3197',
  whatsappMessage: 'Olá! Gostaria de saber mais sobre a cafeteria e as delícias do dia.',
  neighborhood: 'Maiobão',
  city: 'Paço do Lumiar',
  state: 'MA',
  mapsUrl: 'https://maps.google.com/?q=Recanto+7+Cafeteria+Maiobao+Paco+do+Lumiar',
  instagramUrl: 'https://www.instagram.com/recanto_7cafeteria',
  schedule: [
    { day: 'Segunda-feira', hours: 'Fechado para descanso', isOpenToday: false },
    { day: 'Terça-feira', hours: '07:30 às 11:00', isOpenToday: false },
    { day: 'Quarta a Sábado', hours: '07:30 às 11:00 • 16:00 às 20:00', isOpenToday: false },
    { day: 'Domingo', hours: '07:30 às 11:00', isOpenToday: false },
  ],
  notices: [
    'Não trabalhamos com delivery — a experiência é 100% presencial.',
    'Não possuímos cardápio digital fixo: nossos produtos são preparados diariamente com ingredientes frescos e variam a cada fornada.',
    'Cafés especiais moídos na hora e receitas artesanais feitas com afeto.',
  ],
};
