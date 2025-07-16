
import React from 'react';
import { motion } from 'framer-motion';
import { Botao } from '@/componentes/ui/botao';
import { GitCommit, GitBranch, GitMerge, ArrowDown, ArrowUp, ArrowRight, Search } from 'lucide-react';

const botoesTravessia = [
  { tipo: 'preOrdem', nome: 'Pré-ordem', icone: ArrowDown, classe: 'btn-secondary' },
  { tipo: 'emOrdem', nome: 'Em ordem', icone: ArrowRight, classe: 'btn-secondary' },
  { tipo: 'posOrdem', nome: 'Pós-ordem', icone: ArrowUp, classe: 'btn-secondary' },
  { tipo: 'largura', nome: 'Largura', icone: GitBranch, classe: 'btn-secondary' },
  { tipo: 'profundidade', nome: 'Profundidade', icone: GitMerge, classe: 'btn-secondary' },
];

export const PainelTravessias = ({ onTraversal, resultado, tipo }) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <GitCommit className="w-5 h-5 text-purple-400" />
        Travessias e Buscas
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-4">
        {botoesTravessia.map(({ tipo, nome, icone: Icone, classe }) => (
          <Botao
            key={tipo}
            onClick={() => onTraversal('travessia', null, tipo)}
            className={`w-full btn ${classe} flex items-center justify-center gap-2 text-xs sm:text-sm`}
          >
            <Icone className="w-4 h-4 hidden sm:block" />
            {nome}
          </Botao>
        ))}
      </div>

      {resultado && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-slate-300 mb-1">{tipo}:</h4>
          <p className="text-slate-100 font-mono text-base break-words">{resultado}</p>
        </motion.div>
      )}
    </div>
  );
};
