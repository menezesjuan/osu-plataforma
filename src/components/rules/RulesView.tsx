import React from 'react';
import { 
  MessageSquare, 
  FileCheck2, 
  Compass
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
    <div className="p-8 space-y-6 bg-white min-h-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          Guia Regimental & Práticas Diplomáticas
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Regras de conduta parlamentar, intervenções de ordem e estrutura oficial das deliberações da OSU.
        </p>
      </div>

      {/* Regras e Pontos Regimentais */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Compass className="w-5 h-5 text-orange-500" />
          Pontos e Recursos de Intervenção
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROCEDURAL_RULES.map((rule) => (
            <div 
              key={rule.id}
              className="p-5 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-800 text-sm text-orange-600">{rule.title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  Prioridade #{rule.priorityOrder}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700">Quando usar: {rule.usage}</p>
              <p className="text-xs text-slate-500 leading-relaxed pt-1">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Como redigir uma Resolução */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-500" />
          Anatomia de um Projeto de Resolução Escolar
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          O Projeto de Resolução é a peça legislativa máxima dos comitês da OSU. Ele expressa a vontade coletiva das bancadas e segue a estrutura padrão:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider block">
              1. Cláusulas Preambulares (Considerandos)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explicam os motivos e o histórico do problema tratado. Devem iniciar com verbos no gerúndio ou particípio:
            </p>
            <div className="text-[11px] text-slate-500 italic space-y-1 pl-2 border-l-2 border-orange-300">
              <p>• Considerando a importância da preservação ambiental...</p>
              <p>• Reconhecendo a urgência do acolhimento escolar...</p>
              <p>• Tendo em vista a necessidade de espaços acessíveis...</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block">
              2. Cláusulas Operativas (Ações Concretas)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Estabelecem as medidas que serão executadas ou recomendadas. São numeradas e usam verbos no presente do indicativo:
            </p>
            <div className="text-[11px] text-slate-500 space-y-1 pl-2 border-l-2 border-emerald-300">
              <p>• 1. Determina a criação de postos de triagem...</p>
              <p>• 2. Recomenda a realização de oficinas mensais...</p>
              <p>• 3. Solicita apoio da coordenação para os eventos...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vocabulário Diplomático */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          Vocabulário da Diplomacia Estudantil
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {diplomaticVocab.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="font-extrabold text-slate-800 text-orange-600 block">{item.term}</span>
              <p className="text-slate-500 leading-relaxed text-[11px] font-medium">{item.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
