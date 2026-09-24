import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  FileCheck2, 
  Compass,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PROCEDURAL_RULES } from '../../data/mockData';

export const RulesView: React.FC = () => {
  const diplomaticVocab = [
    { term: 'A Mesa Diretora', meaning: 'Corpo docente e discente responsável por presidir, mediar e organizar os debates da sessão.' },
    { term: 'Pontos e Moções', meaning: 'Instrumentos regimentais que os delegados usam para intervir, questionar regras ou propor dinâmicas de fala.' },
    { term: 'Plenária Geral', meaning: 'Reunião de todas as salas/delegações para a deliberação e votação final dos projetos de resolução.' },
    { term: 'Cláusulas Preambulares', meaning: 'Parágrafos iniciais da resolução iniciados por verbos no gerúndio que justificam a criação do projeto.' },
    { term: 'Cláusulas Operativas', meaning: 'Artigos numerados que determinam ações concretas a serem implementadas na escola ou comunidade.' },
    { term: 'Direito de Resposta', meaning: 'Recurso concedido caso uma delegação sofra menção direta depreciativa ou caluniosa em plenário.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          Guia Regimental & Práticas Diplomáticas
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Regras de conduta parlamentar, intervenções de ordem e estrutura oficial das deliberações da OSU.
        </p>
      </div>

      {/* Regras e Pontos Regimentais */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-400" />
          Pontos e Recursos de Intervenção
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROCEDURAL_RULES.map((rule) => (
            <div 
              key={rule.id}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base text-blue-400">{rule.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                  Prioridade #{rule.priorityOrder}
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-400">Quando usar: {rule.usage}</p>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Como redigir uma Resolução */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-400" />
          Anatomia de um Projeto de Resolução Escolar
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Um Projeto de Resolução é a peça legislativa máxima formulada pelos comitês da OSU. Ele expressa a vontade coletiva das delegações e deve seguir a estrutura padrão:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              1. Cláusulas Preambulares (Considerandos)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explicam os motivos, o histórico e a gravidade do problema tratado. Devem iniciar com verbos em itálico no gerúndio ou particípio:
            </p>
            <div className="text-[11px] text-slate-400 italic space-y-1 pl-2 border-l border-slate-700">
              <p>• Considerando o expressivo acúmulo de embalagens plásticas...</p>
              <p>• Reconhecendo a importância da empatia nas salas de aula...</p>
              <p>• Tendo em vista a necessidade de laboratórios acessíveis...</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              2. Cláusulas Operativas (Ações Concretas)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Estabelecem as medidas que serão executadas ou recomendadas à direção escolar. São numeradas e usam verbos no presente do indicativo:
            </p>
            <div className="text-[11px] text-slate-400 space-y-1 pl-2 border-l border-slate-700">
              <p>• 1. Determina a instalação de três postos de triagem...</p>
              <p>• 2. Recomenda a criação de um comitê permanente de acolhimento...</p>
              <p>• 3. Solicita apoio do grêmio estudantil para o cronograma de oficinas...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulário Diplomático */}
      <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          Vocabulário da Diplomacia Estudantil
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {diplomaticVocab.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-white text-blue-300 block">{item.term}</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
