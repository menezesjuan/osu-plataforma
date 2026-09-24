import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from 'lucide-react';
import { useOsu } from '../../context/OsuContext';

export const LoginView: React.FC = () => {
  const { login } = useOsu();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Por favor, informe o usuário e a senha.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Credenciais inválidas. Verifique os dados informados.');
      }
      setLoading(false);
    }, 250);
  };

  const handleQuickLogin = (quickUser: string, quickPass: string) => {
    setUsername(quickUser);
    setPassword(quickPass);
    setErrorMessage(null);
    setLoading(true);
    setTimeout(() => {
      login(quickUser, quickPass);
      setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-orange-50/20 to-slate-100 p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Barra superior decorativa */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600" />

        {/* Marca & Identidade Visual */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1 w-5 h-5 items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-600 scale-125"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              </div>
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-800 font-sans">
              osu<span className="text-orange-500 text-4xl leading-none">.</span>
            </span>
          </div>

          <h2 className="text-lg font-black text-slate-800">
            Acesso à Plenária Escolar
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Organização das Salas Unidas • Credenciamento de Bancadas e Mesa Diretora
          </p>
        </div>

        {/* Mensagem de Erro */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Usuário ou Identificador da Bancada
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Ex: admin ou brasil"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition text-xs font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Entrar na Sessão</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Atalhos Rápidos para Demonstração */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              Acesso Rápido para Testes:
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">1 clique</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200/80 hover:border-orange-300 text-left transition group"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-700 group-hover:text-orange-600">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">Mesa Diretora</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">admin / admin123</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('brasil', '123456')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200/80 hover:border-orange-300 text-left transition group"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-700 group-hover:text-orange-600">
                <span className="text-xs">🇧🇷</span>
                <span className="truncate">Bancada Brasil</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">brasil / 123456</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('canada', '123456')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200/80 hover:border-orange-300 text-left transition group"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-700 group-hover:text-orange-600">
                <span className="text-xs">🇨🇦</span>
                <span className="truncate">Bancada Canadá</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">canada / 123456</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('japao', '123456')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/80 border border-slate-200/80 hover:border-orange-300 text-left transition group"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-700 group-hover:text-orange-600">
                <span className="text-xs">🇯🇵</span>
                <span className="truncate">Bancada Japão</span>
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">japao / 123456</span>
            </button>
          </div>
        </div>

        {/* Rodapé institucional */}
        <div className="text-center pt-2 text-[10px] text-slate-400 font-medium">
          Simulação Acadêmica • Organização das Salas Unidas
        </div>

      </div>
    </div>
  );
};
