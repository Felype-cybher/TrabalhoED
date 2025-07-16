
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from '@/componentes/ui/notificador';
import { useToast } from '@/componentes/hooks/useNotificacao';
import { ArvoreBinariaBusca } from '@/core/ArvoreBinariaBusca';
import { VisualizacaoArvore } from '@/componentes/VisualizacaoArvore';
import { Controles } from '@/componentes/Controles';
import { PainelTravessias } from '@/componentes/PainelTravessias';
import { TreePine } from 'lucide-react';

function Aplicativo() {
  const [arvore] = useState(() => new ArvoreBinariaBusca());
  const [versaoArvore, setVersaoArvore] = useState(0);
  const [nosDestacados, setNosDestacados] = useState([]);
  const [caminhoBusca, setCaminhoBusca] = useState([]);
  const [resultadoTravessia, setResultadoTravessia] = useState('');
  const [tipoTravessia, setTipoTravessia] = useState('');
  const { toast } = useToast();

  const forcarAtualizacao = () => setVersaoArvore(prev => prev + 1);

  const tratarAcao = (acao, valorStr, tipo) => {
    const valor = parseInt(valorStr);
    if (valorStr && isNaN(valor)) {
      toast({ title: "Entrada inválida", description: "Por favor, insira um número.", variant: "destructive" });
      return;
    }

    let sucesso = false;
    let mensagem = "";
    let titulo = "";

    switch (acao) {
      case 'inserir':
        sucesso = arvore.inserir(valor);
        titulo = sucesso ? "Sucesso!" : "Aviso";
        mensagem = sucesso ? `Valor ${valor} inserido.` : `O valor ${valor} já existe.`;
        if (sucesso) forcarAtualizacao();
        break;
      case 'buscar':
        const resultado = arvore.buscar(valor);
        sucesso = resultado.encontrado;
        titulo = sucesso ? "Encontrado!" : "Não encontrado";
        mensagem = `Valor ${valor} ${sucesso ? 'encontrado na árvore.' : 'não está na árvore.'}`;
        setCaminhoBusca(resultado.caminho);
        if (sucesso) setNosDestacados([valor]);
        setTimeout(() => { setCaminhoBusca([]); setNosDestacados([]); }, 3000);
        break;
      case 'remover':
        sucesso = arvore.remover(valor);
        titulo = sucesso ? "Removido!" : "Erro";
        mensagem = sucesso ? `Valor ${valor} removido.` : `Valor ${valor} não encontrado.`;
        if (sucesso) forcarAtualizacao();
        break;
      case 'limpar':
        arvore.limpar();
        titulo = "Árvore Limpa";
        mensagem = "Todos os nós foram removidos.";
        setNosDestacados([]);
        setCaminhoBusca([]);
        setResultadoTravessia('');
        setTipoTravessia('');
        forcarAtualizacao();
        break;
      case 'travessia':
        const { resultado: res, nome } = arvore.executarTravessia(tipo);
        setResultadoTravessia(res.join(' → '));
        setTipoTravessia(nome);
        titulo = `${nome} executada`;
        mensagem = `Resultado: ${res.join(', ')}`;
        break;
      default:
        return;
    }

    toast({
      title: titulo,
      description: mensagem,
      variant: sucesso || acao === 'limpar' || acao === 'travessia' ? "default" : "destructive",
    });
  };

  return (
    <>
      <Helmet>
        <title>Simulador de Árvore Binária de Busca</title>
        <meta name="description" content="Simulador interativo para aprender e visualizar operações em Árvore Binária de Busca com uma interface moderna e profissional." />
      </Helmet>
      
      <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid gap-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 flex items-center justify-center gap-3">
              <TreePine className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              Simulador de Árvore Binária
            </h1>
            <p className="text-slate-400 text-base sm:text-lg">
              Uma ferramenta visual para entender estruturas de dados.
            </p>
          </motion.header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-8"
            >
              <Controles onAction={tratarAcao} />
              <PainelTravessias
                onTraversal={tratarAcao}
                resultado={resultadoTravessia}
                tipo={tipoTravessia}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <VisualizacaoArvore
                arvore={arvore}
                nosDestacados={nosDestacados}
                caminhoBusca={caminhoBusca}
                key={versaoArvore}
              />
            </motion.div>
          </main>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default Aplicativo;
