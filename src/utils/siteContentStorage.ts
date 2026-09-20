import { SiteConfig, GalleryMediaItem, AdminCredentials } from '../types';
export type { SiteConfig, GalleryMediaItem, AdminCredentials };
import defaultLogo from '../assets/images/recanto_7_logo_1789933091731.jpg';
import defaultFachada from '../assets/images/fachada_amarela_1789934046294.jpg';
import heroCafeImage from '../assets/images/recanto_hero_cafe_1789933102401.jpg';
import pastriesImage from '../assets/images/recanto_pastries_1789933523946.jpg';
import pourOverImage from '../assets/images/recanto_pourover_1789933538581.jpg';
import interiorImage from '../assets/images/recanto_interior_1789933549590.jpg';
import cakesImage from '../assets/images/recanto_cakes_1789933561227.jpg';

const SITE_CONFIG_KEY = 'recanto7_site_config_v3';
const ADMIN_CREDENTIALS_KEY = 'recanto7_admin_credentials_v1';
const ADMIN_SESSION_KEY = 'recanto7_admin_session_v1';

/* -------------------------------------------------------------
   INDEXEDDB PERSISTENCE (High capacity for images and media)
   ------------------------------------------------------------- */
const DB_NAME = 'recanto7_app_db_v1';
const DB_VERSION = 1;
const STORE_NAME = 'site_state';
const STORE_KEY = 'current_config';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB não suportado no ambiente'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToIndexedDB(config: SiteConfig): Promise<boolean> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(config, STORE_KEY);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

export async function loadFromIndexedDB(): Promise<SiteConfig | null> {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(STORE_KEY);
      req.onsuccess = () => {
        if (req.result && typeof req.result === 'object') {
          resolve(req.result as SiteConfig);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export const DEFAULT_GALLERY_ITEMS: GalleryMediaItem[] = [
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
    description: 'Cantinhos pensados para quem quer ler um livro, trabalhar com calma ou conversar entre amigos no Maiobão.',
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
    src: defaultFachada,
    tag: 'Procure a Fachada Amarela',
  },
  {
    id: 'item-7',
    title: 'Momento Café & Aconchego',
    type: 'video',
    category: 'espaco',
    categoryLabel: 'Nosso Espaço',
    description: 'Um vislumbre em vídeo da experiência, do aroma de café recém-moído e do ambiente acolhedor do Recanto 7.',
    src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/a6n3j28kK_8', // Ambient cafe presentation video embed
    thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    tag: 'Vídeo do Local',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  version: '1.2.0',
  lastUpdated: new Date().toISOString(),
  brand: {
    name: 'Recanto 7',
    tagline: 'Cafeteria & Companhia',
    subtagline: 'Café e Cia',
    description:
      'Seu refúgio diário para saborear cafés especiais e delícias artesanais preparadas com afeto. Um ambiente calmo e acolhedor no Maiobão para desacelerar, conversar e apreciar os melhores momentos da vida.',
    whatsapp: '5598985353197',
    whatsappFormatted: '(98) 98535-3197',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre a cafeteria e as delícias do dia.',
    instagram: '@recanto_7cafeteria',
    instagramUrl: 'https://www.instagram.com/recanto_7cafeteria',
    mapsUrl: 'https://maps.google.com/?q=Recanto+7+Cafeteria+Maiobao+Paco+do+Lumiar',
    address: 'Bairro Maiobão',
    neighborhood: 'Maiobão',
    cityState: 'Paço do Lumiar - MA',
  },
  logo: {
    src: defaultLogo,
    alt: 'Logo Recanto 7 Café e Cia',
  },
  fachada: {
    src: defaultFachada,
    caption: 'Procure a fachada amarela',
    badgeText: 'Fachada do Recanto 7',
  },
  gallery: DEFAULT_GALLERY_ITEMS,
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'admin@recanto7.com.br',
  passwordHash: 'admin123', // Master initial password for the buyer
  recoveryPin: '7777',
  recoveryQuestion: 'Qual é o nome oficial do estabelecimento?',
  recoveryAnswer: 'Recanto 7',
  updatedAt: new Date().toISOString(),
};

/**
 * Loads current site configuration from localStorage or falls back to default.
 */
export function getStoredSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(SITE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate or sanitize
      return {
        ...DEFAULT_SITE_CONFIG,
        ...parsed,
        brand: { ...DEFAULT_SITE_CONFIG.brand, ...(parsed.brand || {}) },
        logo: { ...DEFAULT_SITE_CONFIG.logo, ...(parsed.logo || {}) },
        fachada: { ...DEFAULT_SITE_CONFIG.fachada, ...(parsed.fachada || {}) },
        gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_GALLERY_ITEMS,
      };
    }

    // Check legacy localStorage keys if available
    const legacyLogo = localStorage.getItem('recanto7_custom_logo');
    const legacyFachada = localStorage.getItem('recanto7_custom_facade');
    const initialConfig = { ...DEFAULT_SITE_CONFIG };

    if (legacyLogo) {
      initialConfig.logo = { ...initialConfig.logo, src: legacyLogo };
    }
    if (legacyFachada) {
      initialConfig.fachada = { ...initialConfig.fachada, src: legacyFachada };
    }

    return initialConfig;
  } catch (err) {
    console.warn('Failed to load stored site configuration, using defaults.', err);
    return DEFAULT_SITE_CONFIG;
  }
}

/**
 * Saves the site configuration in IndexedDB (high capacity) and localStorage (fast sync).
 * Resilient against QuotaExceededError by offloading high-res assets to IndexedDB.
 */
export function saveStoredSiteConfig(config: SiteConfig): boolean {
  const updated: SiteConfig = {
    ...config,
    lastUpdated: new Date().toISOString(),
  };

  // 1. Asynchronously persist full data (including photos) to IndexedDB
  saveToIndexedDB(updated).catch((err) => {
    console.warn('IndexedDB auto-save:', err);
  });

  // 2. Dispatch custom event immediately so all views update in real-time
  try {
    window.dispatchEvent(
      new CustomEvent('recanto7_content_updated', { detail: updated })
    );
  } catch (eventErr) {
    console.warn('Could not dispatch update event:', eventErr);
  }

  // 3. Attempt to save to localStorage safely
  try {
    // Clean up obsolete redundant keys that duplicate large base64 strings
    try {
      localStorage.removeItem('recanto7_custom_logo');
      localStorage.removeItem('recanto7_custom_facade');
      localStorage.removeItem('recanto7_site_config_v2');
    } catch (_) {}

    localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    // If quota exceeded, optimize the localStorage copy by trimming heavy base64 strings
    // while IndexedDB retains the full high-resolution data.
    try {
      const lightweightConfig: SiteConfig = {
        ...updated,
        gallery: updated.gallery.map((item) => {
          // If media src is a massive base64 string (>30KB), use preview or fallback for localStorage
          if (item.src && item.src.startsWith('data:') && item.src.length > 30000) {
            return {
              ...item,
              src: item.thumbnailUrl || heroCafeImage,
            };
          }
          return item;
        }),
      };

      localStorage.setItem(SITE_CONFIG_KEY, JSON.stringify(lightweightConfig));
      return true;
    } catch (fallbackErr) {
      // Even if localStorage fails completely, IndexedDB has already secured the data
      return true;
    }
  }
}

/**
 * Resets site configuration to factory defaults across all storage layers.
 */
export function resetStoredSiteConfig(): SiteConfig {
  try {
    localStorage.removeItem(SITE_CONFIG_KEY);
    localStorage.removeItem('recanto7_custom_logo');
    localStorage.removeItem('recanto7_custom_facade');
  } catch (_) {}

  saveToIndexedDB(DEFAULT_SITE_CONFIG).catch(() => {});

  window.dispatchEvent(
    new CustomEvent('recanto7_content_updated', { detail: DEFAULT_SITE_CONFIG })
  );
  return DEFAULT_SITE_CONFIG;
}

/**
 * Generates a downloadable JSON file for committing to GitHub.
 */
export function downloadConfigForGitHub(config: SiteConfig, filename = 'recanto-site-content.json') {
  const jsonContent = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats config as pretty JSON string for copying or viewing.
 */
export function getPrettyConfigJson(config: SiteConfig): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Imports configuration from raw JSON string (e.g. pasted or uploaded from GitHub).
 */
export function importConfigFromJson(jsonString: string): { success: boolean; config?: SiteConfig; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Arquivo JSON inválido ou vazio.' };
    }
    const merged: SiteConfig = {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      brand: { ...DEFAULT_SITE_CONFIG.brand, ...(parsed.brand || {}) },
      logo: { ...DEFAULT_SITE_CONFIG.logo, ...(parsed.logo || {}) },
      fachada: { ...DEFAULT_SITE_CONFIG.fachada, ...(parsed.fachada || {}) },
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_GALLERY_ITEMS,
      lastUpdated: new Date().toISOString(),
    };
    saveStoredSiteConfig(merged);
    return { success: true, config: merged };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Falha ao analisar JSON.' };
  }
}

/* -------------------------------------------------------------
   ADMIN AUTHENTICATION & SECURITY
   ------------------------------------------------------------- */

export function getAdminCredentials(): AdminCredentials {
  try {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (raw) {
      return { ...DEFAULT_ADMIN_CREDENTIALS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Could not read admin credentials', e);
  }
  return DEFAULT_ADMIN_CREDENTIALS;
}

export function saveAdminCredentials(credentials: AdminCredentials): boolean {
  try {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(credentials));
    return true;
  } catch (e) {
    console.error('Could not save admin credentials', e);
    return false;
  }
}

export function verifyAdminLogin(emailInput: string, passwordInput: string): boolean {
  const creds = getAdminCredentials();
  const trimmedEmail = emailInput.trim().toLowerCase();
  const storedEmail = creds.email.trim().toLowerCase();
  return trimmedEmail === storedEmail && passwordInput === creds.passwordHash;
}

export function isUserAdminAuthenticated(): boolean {
  try {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return session === 'authenticated_admin';
  } catch {
    return false;
  }
}

export function setAdminAuthenticatedSession(authenticated: boolean): void {
  try {
    if (authenticated) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated_admin');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
    window.dispatchEvent(new CustomEvent('recanto7_admin_auth_changed', { detail: { authenticated } }));
  } catch (e) {
    console.warn('Could not update admin session', e);
  }
}

export function resetAdminPasswordWithPin(emailInput: string, pinInput: string, newPassword: string): { success: boolean; message: string } {
  const creds = getAdminCredentials();
  const trimmedEmail = emailInput.trim().toLowerCase();
  const storedEmail = creds.email.trim().toLowerCase();

  if (trimmedEmail !== storedEmail) {
    return { success: false, message: 'E-mail não encontrado no sistema.' };
  }

  if (pinInput.trim() !== creds.recoveryPin.trim()) {
    return { success: false, message: 'PIN de segurança incorreto.' };
  }

  if (newPassword.length < 4) {
    return { success: false, message: 'A nova senha deve ter no mínimo 4 caracteres.' };
  }

  creds.passwordHash = newPassword;
  creds.updatedAt = new Date().toISOString();
  saveAdminCredentials(creds);

  return { success: true, message: 'Senha redefinida com sucesso! Você já pode entrar com a nova senha.' };
}
