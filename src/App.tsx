import { useState, useEffect } from 'react';
import heroCafeImage from './assets/images/recanto_hero_cafe_1789933102401.jpg';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExperienceSection } from './components/ExperienceSection';
import { GallerySection } from './components/GallerySection';
import { ScheduleSection } from './components/ScheduleSection';
import { InfoModal } from './components/InfoModal';
import { Footer } from './components/Footer';
import { AdminBar } from './components/admin/AdminBar';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SiteConfig } from './types';
import { Lock, ShieldCheck } from 'lucide-react';
import {
  getStoredSiteConfig,
  isUserAdminAuthenticated,
  setAdminAuthenticatedSession,
  downloadConfigForGitHub,
  loadFromIndexedDB,
} from './utils/siteContentStorage';

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => getStoredSiteConfig());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    isUserAdminAuthenticated()
  );
  const [currentView, setCurrentView] = useState<'site' | 'admin'>('site');
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Sync favicon with the current logo
  useEffect(() => {
    const link: HTMLLinkElement | null =
      document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/jpeg';
    link.rel = 'shortcut icon';
    link.href = siteConfig.logo.src;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [siteConfig.logo.src]);

  // Listen to cross-component content updates
  useEffect(() => {
    const handleContentUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteConfig>;
      if (customEvent.detail) {
        setSiteConfig(customEvent.detail);
      }
    };

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ authenticated: boolean }>;
      setIsAdminAuthenticated(customEvent.detail.authenticated);
    };

    window.addEventListener('recanto7_content_updated', handleContentUpdate);
    window.addEventListener('recanto7_admin_auth_changed', handleAuthChange);

    // Hydrate high-capacity storage from IndexedDB if available
    loadFromIndexedDB()
      .then((idbConfig) => {
        if (idbConfig) {
          setSiteConfig(idbConfig);
        }
      })
      .catch(() => {});

    // Private Admin Router: detects #admin or /admin access
    const checkAdminRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const isAdminRoute =
        hash === '#admin' ||
        hash === '#/admin' ||
        hash.startsWith('#admin') ||
        path === '/admin' ||
        path === '/admin/' ||
        search.includes('admin');

      if (isAdminRoute) {
        if (isUserAdminAuthenticated()) {
          setIsAdminAuthenticated(true);
          setCurrentView('admin');
          setIsAdminLoginModalOpen(false);
        } else {
          setCurrentView('admin');
          setIsAdminLoginModalOpen(true);
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    // Secret shortcut for administrator: Ctrl+Shift+A or Alt+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        window.location.hash = '#admin';
        checkAdminRoute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('recanto7_content_updated', handleContentUpdate);
      window.removeEventListener('recanto7_admin_auth_changed', handleAuthChange);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
    window.location.hash = '#admin';
    setIsAdminLoginModalOpen(false);
  };

  const handleCloseLoginModal = () => {
    setIsAdminLoginModalOpen(false);
    if (!isAdminAuthenticated) {
      setCurrentView('site');
      if (window.location.hash.toLowerCase().includes('admin')) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  };

  const handleLogout = () => {
    setAdminAuthenticatedSession(false);
    setIsAdminAuthenticated(false);
    setCurrentView('site');
    setIsAdminLoginModalOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleReturnToSite = () => {
    setCurrentView('site');
    if (window.location.hash.toLowerCase().includes('admin')) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleExportGitHub = () => {
    downloadConfigForGitHub(siteConfig, 'recanto-site-content.json');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#3D2C24] font-sans-body selection:bg-[#E9B949]/30 selection:text-[#241710]">
      {/* Top Admin Status Bar ONLY visible when administrator is actively logged in */}
      {isAdminAuthenticated && (
        <AdminBar
          currentView={currentView}
          onToggleView={() =>
            setCurrentView((prev) => (prev === 'admin' ? 'site' : 'admin'))
          }
          onExportGitHub={handleExportGitHub}
          onLogout={handleLogout}
        />
      )}

      {/* Main View Router: Visitor Site vs Admin Portal */}
      {currentView === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminDashboard
            config={siteConfig}
            onUpdateConfig={setSiteConfig}
            onCloseToSite={() => setCurrentView('site')}
            onLogout={handleLogout}
          />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#241710] text-[#FAF6F0] p-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF6F0]/10 border border-[#FAF6F0]/20 flex items-center justify-center text-[#E9B949] mb-5 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9B949]/20 border border-[#E9B949]/30 text-[#E9B949] text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acesso Restrito</span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold mb-2 text-white">
              Painel de Administração • Recanto 7
            </h1>
            <p className="text-sm text-[#DECFC0] max-w-md mb-6 leading-relaxed">
              Esta área é de acesso exclusivo do administrador para gerenciamento de fotos, vídeos e identidade da cafeteria.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Acessar com E-mail e Senha
              </button>
              <button
                onClick={handleReturnToSite}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3D281D] hover:bg-[#523728] text-[#DECFC0] hover:text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Voltar para o Site
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          {/* Top Navigation - Completely free of admin links */}
          <Navbar
            logoSrc={siteConfig.logo.src}
            onOpenSchedule={() => setIsScheduleOpen(true)}
          />

          {/* Main Sections for Visitors */}
          <main className="flex-1">
            <HeroSection
              logoSrc={siteConfig.logo.src}
              heroImageSrc={heroCafeImage}
              onOpenSchedule={() => setIsScheduleOpen(true)}
            />

            <ExperienceSection />

            <div id="galeria">
              <GallerySection items={siteConfig.gallery} />
            </div>

            <ScheduleSection
              fachadaSrc={siteConfig.fachada.src}
              fachadaCaption={siteConfig.fachada.caption}
              fachadaBadgeText={siteConfig.fachada.badgeText}
            />
          </main>

          {/* Bottom Footer - Completely free of admin links */}
          <Footer onOpenSchedule={() => setIsScheduleOpen(true)} />
        </>
      )}

      {/* Modals */}
      <InfoModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        fachadaSrc={siteConfig.fachada.src}
        fachadaCaption={siteConfig.fachada.caption}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
