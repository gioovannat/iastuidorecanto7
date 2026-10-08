import { supabase } from '../lib/supabase';

export async function signInAdmin(email: string, password: string) {
  if (!supabase) return { error: 'Supabase ainda não foi configurado.' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  if (data.user.app_metadata?.role !== 'admin') { await supabase.auth.signOut(); return { error: 'Esta conta não possui permissão de administrador.' }; }
  return {};
}
export async function getAdminSession() {
  if (!supabase) return false;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.app_metadata?.role === 'admin';
}
export async function signOutAdmin() { await supabase?.auth.signOut(); }
export async function sendPasswordReset(email: string) {
  if (!supabase) return { error: 'Supabase ainda não foi configurado.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/?reset-password#admin` });
  return error ? { error: error.message } : {};
}
export async function updatePassword(password: string) {
  if (!supabase) return { error: 'Supabase ainda não foi configurado.' };
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { error: error.message } : {};
}
