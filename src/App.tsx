import { useState, useEffect } from 'react';
import defaultLogo from './assets/images/recanto_7_logo_1789933091731.jpg';
import heroCafeImage from './assets/images/recanto_hero_cafe_1789933102401.jpg';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExperienceSection } from './components/ExperienceSection';
import { GallerySection } from './components/GallerySection';
import { ScheduleSection } from './components/ScheduleSection';
import { InfoModal } from './components/InfoModal';
import { LogoUploadModal } from './components/LogoUploadModal';
import { Footer } from './components/Footer';
import { AdminBar } from './components/admin/AdminBar';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SiteConfig } from './types';
import {
  getStoredSiteConfig,
  saveStoredSiteConfig,
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
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

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

    // Check if user entered via hash #admin
    if (window.location.hash === '#admin') {
      if (isUserAdminAuthenticated()) {
        setCurrentView('admin');
      } else {
        setIsAdminLoginModalOpen(true);
      }
    }

    return () => {
      window.removeEventListener('recanto7_content_updated', handleContentUpdate);
      window.removeEventListener('recanto7_admin_auth_changed', handleAuthChange);
    };
  }, []);

  const handleAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setCurrentView((prev) => (prev === 'admin' ? 'site' : 'admin'));
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setAdminAuthenticatedSession(false);
    setIsAdminAuthenticated(false);
    setCurrentView('site');
  };

  const handleExportGitHub = () => {
    downloadConfigForGitHub(siteConfig, 'recanto-site-content.json');
  };

  const handleLogoChange = (newLogoUrl: string) => {
    const updated = {
      ...siteConfig,
      logo: { ...siteConfig.logo, src: newLogoUrl },
    };
    setSiteConfig(updated);
    saveStoredSiteConfig(updated);
  };

  const handleResetLogo = () => {
    const updated = {
      ...siteConfig,
      logo: { ...siteConfig.logo, src: defaultLogo },
    };
    setSiteConfig(updated);
    saveStoredSiteConfig(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#3D2C24] font-sans-body selection:bg-[#E9B949]/30 selection:text-[#241710]">
      {/* Top Admin Status Bar for logged-in administrator */}
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

      {/* Main View Router: Site (Visitor) vs Admin Dashboard */}
      {currentView === 'admin' && isAdminAuthenticated ? (
        <AdminDashboard
          config={siteConfig}
          onUpdateConfig={setSiteConfig}
          onCloseToSite={() => setCurrentView('site')}
          onLogout={handleLogout}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            logoSrc={siteConfig.logo.src}
            onOpenSchedule={() => setIsScheduleOpen(true)}
            onLogoUploadClick={() => setIsLogoModalOpen(true)}
            onOpenAdmin={handleAdminTrigger}
          />

          {/* Main Sections */}
          <main className="flex-1">
            <HeroSection
              logoSrc={siteConfig.logo.src}
              heroImageSrc={heroCafeImage}
              onOpenSchedule={() => setIsScheduleOpen(true)}
              onLogoUploadClick={() => setIsLogoModalOpen(true)}
            />

            <ExperienceSection />

            <div id="galeria">
              <GallerySection items={siteConfig.gallery} />
            </div>

            <ScheduleSection />
          </main>

          {/* Bottom Footer */}
          <Footer
            onOpenSchedule={() => setIsScheduleOpen(true)}
            onOpenAdmin={handleAdminTrigger}
          />
        </>
      )}

      {/* Modals */}
      <InfoModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        fachadaSrc={siteConfig.fachada.src}
        fachadaCaption={siteConfig.fachada.caption}
      />

      <LogoUploadModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={siteConfig.logo.src}
        defaultLogo={defaultLogo}
        onLogoChange={handleLogoChange}
        onResetLogo={handleResetLogo}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
