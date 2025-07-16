
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TreePine } from 'lucide-react';
import { NoArvore } from '@/componentes/NoArvore';

const calcularPosicoes = (no, x, y, nivel, espacamento, posicoes = []) => {
  if (!no) return posicoes;
  
  posicoes.push({ no, x, y, nivel });
  const espacamentoFilho = espacamento / 1.8;
  
  if (no.esquerda) calcularPosicoes(no.esquerda, x - espacamentoFilho, y + 80, nivel + 1, espacamentoFilho, posicoes);
  if (no.direita) calcularPosicoes(no.direita, x + espacamentoFilho, y + 80, nivel + 1, espacamentoFilho, posicoes);
  
  return posicoes;
};

const desenharConexoes = (no, x, y, espacamento, conexoes = []) => {
  if (!no) return conexoes;

  const espacamentoFilho = espacamento / 1.8;
  
  if (no.esquerda) {
    const xFilho = x - espacamentoFilho;
    const yFilho = y + 80;
    conexoes.push(
      <motion.line
        key={`${no.id}-esquerda`}
        x1={x} y1={y + 24} x2={xFilho} y2={yFilho - 24}
        className="stroke-slate-600" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
      />
    );
    desenharConexoes(no.esquerda, xFilho, yFilho, espacamentoFilho, conexoes);
  }
  
  if (no.direita) {
    const xFilho = x + espacamentoFilho;
    const yFilho = y + 80;
    conexoes.push(
      <motion.line
        key={`${no.id}-direita`}
        x1={x} y1={y + 24} x2={xFilho} y2={yFilho - 24}
        className="stroke-slate-600" strokeWidth="2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
      />
    );
    desenharConexoes(no.direita, xFilho, yFilho, espacamentoFilho, conexoes);
  }

  return conexoes;
};

export const VisualizacaoArvore = ({ arvore, nosDestacados, caminhoBusca }) => {
  if (!arvore.raiz) {
    return (
      <div className="glass-card flex items-center justify-center h-full min-h-[400px] lg:min-h-full p-6">
        <div className="text-center text-slate-400">
          <TreePine className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Árvore Vazia</p>
          <p className="text-sm">Insira um valor para começar a construir.</p>
        </div>
      </div>
    );
  }

  const posicoes = calcularPosicoes(arvore.raiz, 400, 60, 0, 220);
  const conexoes = desenharConexoes(arvore.raiz, 400, 60, 220);

  return (
    <div className="glass-card w-full h-full overflow-auto p-4">
      <svg width="800" height="500" className="mx-auto">
        <g>{conexoes}</g>
        <g>
          <AnimatePresence>
            {posicoes.map(({ no, x, y, nivel }) => (
              <NoArvore
                key={no.id}
                no={no}
                x={x}
                y={y}
                nosDestacados={nosDestacados}
                caminhoBusca={caminhoBusca}
                nivel={nivel}
              />
            ))}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
};
