import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  verifyAdminLogin,
  resetAdminPasswordWithPin,
  setAdminAuthenticatedSession,
} from '../../utils/siteContentStorage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeView, setActiveView] = useState<'login' | 'forgot'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot password state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPin, setRecoveryPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !password) {
      setLoginError('Por favor, informe o e-mail e a senha.');
      return;
    }

    const isValid = verifyAdminLogin(email, password);
    if (isValid) {
      setAdminAuthenticatedSession(true);
      onLoginSuccess();
      onClose();
    } else {
      setLoginError('E-mail ou senha incorretos. Verifique suas credenciais.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!recoveryEmail.trim() || !recoveryPin.trim() || !newPassword) {
      setForgotError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('As senhas digitadas não coincidem.');
      return;
    }

    const res = resetAdminPasswordWithPin(recoveryEmail, recoveryPin, newPassword);
    if (res.success) {
      setForgotSuccess(res.message);
      setTimeout(() => {
        setEmail(recoveryEmail);
        setPassword(newPassword);
        setActiveView('login');
        setForgotSuccess('');
      }, 2000);
    } else {
      setForgotError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#1D130E]/80 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-[#FAF6F0] rounded-3xl border border-[#D9C7B8] shadow-2xl overflow-hidden z-10 my-8"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#F5EDE3] border-b border-[#E8DFD5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E9B949]/20 border border-[#E9B949]/40 flex items-center justify-center text-[#8C5D0B]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-[#3B271E] leading-tight">
                {activeView === 'login' ? 'Área do Administrador' : 'Recuperar Senha'}
              </h3>
              <p className="text-xs text-[#7A5442]">Recanto 7 • Gestão da Landing Page</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EAE0D4] text-[#553C30] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeView === 'login' ? (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                <div className="p-3.5 rounded-2xl bg-[#F0E6D8]/60 border border-[#DECFC0] text-xs text-[#674433] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#C68B18] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#3B271E]">Painel Exclusivo do Proprietário</p>
                    <p className="mt-0.5">
                      Gerencie fotos, vídeos da cafeteria, logomarca e exporte suas atualizações diretamente para o GitHub.
                    </p>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email input */}
                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-1.5">
                    E-mail do Administrador
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8C6249] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="admin@recanto7.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D9C7B8] focus:border-[#C68B18] focus:ring-2 focus:ring-[#E9B949]/20 outline-hidden text-sm text-[#3B271E] placeholder:text-[#A89687]"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#4A3326]">
                      Senha de Acesso
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveView('forgot')}
                      className="text-xs text-[#9B6A1A] hover:text-[#3B271E] font-semibold hover:underline cursor-pointer"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#8C6249] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#D9C7B8] focus:border-[#C68B18] focus:ring-2 focus:ring-[#E9B949]/20 outline-hidden text-sm text-[#3B271E]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C6249] hover:text-[#3B271E]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Entrar no Painel</span>
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleForgotSubmit}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="p-1 rounded-lg hover:bg-[#EAE0D4] text-[#674433] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-[#7A5442]">
                    Informe seu e-mail e o PIN de segurança cadastrado para redefinir sua senha.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{forgotSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-1">
                    E-mail do Administrador
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@recanto7.com.br"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#4A3326]">
                      PIN de Recuperação (4 dígitos)
                    </label>
                    <span className="text-[10px] text-[#8C6249]">Padrão: 7777</span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Ex: 7777"
                    value={recoveryPin}
                    onChange={(e) => setRecoveryPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E] font-mono tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 4 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3326] mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D9C7B8] text-sm text-[#3B271E]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="flex-1 py-3 px-4 rounded-xl border border-[#DECFC0] bg-[#F7F1E8] hover:bg-[#EFE5D8] text-[#553C30] font-semibold text-xs transition-colors"
                  >
                    Voltar ao Login
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#E9B949] hover:bg-[#DCA028] text-[#241710] font-bold text-xs transition-all shadow-xs"
                  >
                    Redefinir Senha
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
