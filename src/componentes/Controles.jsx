
import React, { useState } from 'react';
import { Botao } from '@/componentes/ui/botao';
import { Plus, Search, Trash2, RotateCcw } from 'lucide-react';

export const Controles = ({ onAction }) => {
  const [valorInserir, setValorInserir] = useState('');
  const [valorBuscar, setValorBuscar] = useState('');

  const handleKeyPress = (e, action, value) => {
    if (e.key === 'Enter') {
      action(value);
    }
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          Inserir Valor
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={valorInserir}
            onChange={(e) => setValorInserir(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, () => { onAction('inserir', valorInserir); setValorInserir(''); })}
            placeholder="Ex: 42"
            className="input-field"
          />
          <Botao onClick={() => { onAction('inserir', valorInserir); setValorInserir(''); }} className="btn btn-success shrink-0">
            <Plus className="w-4 h-4" />
          </Botao>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          Buscar / Remover
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={valorBuscar}
            onChange={(e) => setValorBuscar(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, () => onAction('buscar', valorBuscar))}
            placeholder="Ex: 15"
            className="input-field"
          />
          <Botao onClick={() => onAction('buscar', valorBuscar)} className="btn btn-primary shrink-0">
            <Search className="w-4 h-4" />
          </Botao>
          <Botao onClick={() => { onAction('remover', valorBuscar); setValorBuscar(''); }} className="btn btn-danger shrink-0">
            <Trash2 className="w-4 h-4" />
          </Botao>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-amber-400" />
          Ações Gerais
        </h3>
        <Botao onClick={() => onAction('limpar')} className="w-full btn btn-warning flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Limpar Árvore
        </Botao>
      </div>
    </div>
  );
};
