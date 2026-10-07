import React from 'react';
import { ShieldCheck, LayoutDashboard, Eye, LogOut } from 'lucide-react';

interface AdminBarProps {
  currentView: 'site' | 'admin';
  onToggleView: () => void;
  onLogout: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  currentView,
  onToggleView,
  onLogout,
}) => {
  return (
    <aside
      aria-label="Barra de Administração"
      className="bg-[#241710] text-[#F3EBE1] border-b border-[#3E291C] px-4 py-2 sticky top-0 z-50 shadow-md text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-tight text-[#E9B949] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Modo Administrador</span>
          </span>
          <span className="text-[#8C6249] hidden sm:inline">|</span>
          <span className="text-[#D0C0B0] hidden sm:inline">
            Total gestão de fotos, vídeos e logomarca
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D281D] hover:bg-[#523728] text-white font-semibold transition-colors cursor-pointer"
          >
            {currentView === 'site' ? (
              <>
                <LayoutDashboard className="w-3.5 h-3.5 text-[#E9B949]" />
                <span>Abrir Painel Admin</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#E9B949]" />
                <span>Ver Site (Visitante)</span>
              </>
            )}
          </button>

          <button
            onClick={onLogout}
            title="Encerrar sessão de administrador"
            className="p-1.5 rounded-lg hover:bg-[#3D281D] text-[#DECFC0] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
