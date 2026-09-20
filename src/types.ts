export interface CafeteriaInfo {
  name: string;
  tagline: string;
  description: string;
  whatsapp: string;
  whatsappFormatted: string;
  whatsappMessage: string;
  neighborhood: string;
  city: string;
  state: string;
  mapsUrl: string;
  instagramUrl: string;
  schedule: {
    day: string;
    hours: string;
    isOpenToday: boolean;
  }[];
  notices: string[];
}

export type MediaCategory = 'cafes' | 'receitas' | 'espaco' | 'todos';

export interface GalleryMediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  category: 'cafes' | 'receitas' | 'espaco';
  categoryLabel: string;
  description: string;
  src: string; // image url / base64 or video url / embed url
  videoUrl?: string; // YouTube or direct video url if type is video
  thumbnailUrl?: string; // optional preview poster for video
  tag: string;
  featured?: boolean;
}

export interface SiteConfig {
  version: string;
  lastUpdated: string;
  brand: {
    name: string;
    tagline: string;
    subtagline: string;
    description: string;
    whatsapp: string;
    whatsappFormatted: string;
    whatsappMessage: string;
    instagram: string;
    instagramUrl: string;
    mapsUrl: string;
    address: string;
    neighborhood: string;
    cityState: string;
  };
  logo: {
    src: string;
    alt: string;
  };
  fachada: {
    src: string;
    caption: string;
    badgeText: string;
  };
  gallery: GalleryMediaItem[];
}

export interface AdminCredentials {
  email: string;
  passwordHash: string; // stored salted/hash or plaintext for local demo
  recoveryPin: string;
  recoveryQuestion: string;
  recoveryAnswer: string;
  updatedAt: string;
}
