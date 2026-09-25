import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Por favor, informe o usuário e a senha.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Credenciais inválidas. Verifique os dados informados.');
      }
    } catch {
      setErrorMessage('Erro ao tentar conectar ao servidor.');
    } finally {
      setLoading(false);
    }
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

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>Mesa Diretora & Bancadas Estudantis</span>
          </div>

          <h2 className="text-lg font-black text-slate-800 pt-1">
            Acesso ao Plenário
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
            Informe suas credenciais autorizadas para ingressar na simulação
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
                placeholder="Ex: admin ou usuário da bancada"
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

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-[11px] text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Mesa Diretora:</span>
              <span className="font-mono font-bold text-orange-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">admin / admin123</span>
            </div>
            <div className="text-[10px] text-slate-400 pt-0.5">
              Bancadas utilizam o usuário e senha cadastrados em <strong>Salas & Bancadas</strong>.
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
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Rodapé institucional */}
        <div className="text-center pt-2 text-[10px] text-slate-400 font-medium">
          Simulação Acadêmica • Organização das Salas Unidas
        </div>

      </div>
    </div>
  );
};
