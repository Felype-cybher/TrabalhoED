
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus, 
  Search, 
  Trash2, 
  RotateCcw, 
  Play,
  TreePine,
  ArrowDown,
  ArrowRight,
  ArrowUp
} from 'lucide-react';


class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return true;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return false; 
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return true;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return true;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;
    const path = [];
    
    while (current) {
      path.push(current.value);
      if (value === current.value) {
        return { found: true, path };
      }
      current = value < current.value ? current.left : current.right;
    }
    
    return { found: false, path };
  }

  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
    } else {
      // Nó encontrado
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Nó com dois filhos
      const minRight = this._findMin(node.right);
      node.value = minRight.value;
      node.right = this._removeNode(node.right, minRight.value);
    }
    return node;
  }

  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  
  preOrder() {
    const result = [];
    this._preOrder(this.root, result);
    return result;
  }

  _preOrder(node, result) {
    if (node) {
      result.push(node.value);
      this._preOrder(node.left, result);
      this._preOrder(node.right, result);
    }
  }

  inOrder() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.left, result);
      result.push(node.value);
      this._inOrder(node.right, result);
    }
  }

  postOrder() {
    const result = [];
    this._postOrder(this.root, result);
    return result;
  }

  _postOrder(node, result) {
    if (node) {
      this._postOrder(node.left, result);
      this._postOrder(node.right, result);
      result.push(node.value);
    }
  }

  breadthFirst() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  }

  depthFirst() {
    return this.preOrder(); 
  }
}

// Componente do Nó Visual
const TreeNodeComponent = ({ node, x, y, highlightedNodes, searchPath, level }) => {
  const isHighlighted = highlightedNodes.includes(node.value);
  const isInSearchPath = searchPath.includes(node.value);
  
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, delay: level * 0.1 }}
    >
      <motion.circle
        cx={x}
        cy={y}
        r="25"
        fill={isHighlighted ? "#10b981" : isInSearchPath ? "#f59e0b" : "#6366f1"}
        stroke="#ffffff"
        strokeWidth="2"
        className="drop-shadow-lg"
        animate={{
          scale: isHighlighted ? 1.2 : 1,
          fill: isHighlighted ? "#10b981" : isInSearchPath ? "#f59e0b" : "#6366f1"
        }}
        transition={{ duration: 0.3 }}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
      >
        {node.value}
      </text>
    </motion.g>
  );
};


const TreeVisualization = ({ tree, highlightedNodes, searchPath }) => {
  const calculatePositions = (node, x, y, level, spacing) => {
    if (!node) return [];
    
    const positions = [{ node, x, y, level }];
    const childSpacing = spacing / 2;
    
    if (node.left) {
      positions.push(...calculatePositions(node.left, x - childSpacing, y + 80, level + 1, childSpacing));
    }
    
    if (node.right) {
      positions.push(...calculatePositions(node.right, x + childSpacing, y + 80, level + 1, childSpacing));
    }
    
    return positions;
  };

  const drawConnections = (node, x, y, spacing) => {
    if (!node) return [];
    
    const connections = [];
    const childSpacing = spacing / 2;
    
    if (node.left) {
      const leftX = x - childSpacing;
      const leftY = y + 80;
      connections.push(
        <line
          key={`${node.id}-left`}
          x1={x}
          y1={y + 25}
          x2={leftX}
          y2={leftY - 25}
          stroke="#94a3b8"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
      );
      connections.push(...drawConnections(node.left, leftX, leftY, childSpacing));
    }
    
    if (node.right) {
      const rightX = x + childSpacing;
      const rightY = y + 80;
      connections.push(
        <line
          key={`${node.id}-right`}
          x1={x}
          y1={y + 25}
          x2={rightX}
          y2={rightY - 25}
          stroke="#94a3b8"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
      );
      connections.push(...drawConnections(node.right, rightX, rightY, childSpacing));
    }
    
    return connections;
  };

  if (!tree.root) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <TreePine className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Árvore vazia</p>
          <p className="text-sm">Insira alguns valores para começar</p>
        </div>
      </div>
    );
  }

  const positions = calculatePositions(tree.root, 400, 60, 0, 200);
  const connections = drawConnections(tree.root, 400, 60, 200);

  return (
    <div className="w-full overflow-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
      <svg width="800" height="500" className="mx-auto">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {connections}
        
        <AnimatePresence>
          {positions.map(({ node, x, y, level }) => (
            <TreeNodeComponent
              key={node.id}
              node={node}
              x={x}
              y={y}
              highlightedNodes={highlightedNodes}
              searchPath={searchPath}
              level={level}
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};

function App() {
  const [tree] = useState(() => new BinarySearchTree());
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [searchPath, setSearchPath] = useState([]);
  const [traversalResult, setTraversalResult] = useState('');
  const [traversalType, setTraversalType] = useState('');
  const [treeVersion, setTreeVersion] = useState(0);
  const { toast } = useToast();

  const forceUpdate = () => setTreeVersion(prev => prev + 1);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número válido",
        variant: "destructive"
      });
      return;
    }

    const success = tree.insert(value);
    if (success) {
      toast({
        title: "Sucesso!",
        description: `Valor ${value} inserido na árvore`
      });
      setInputValue('');
      forceUpdate();
    } else {
      toast({
        title: "Aviso",
        description: `Valor ${value} já existe na árvore`,
        variant: "destructive"
      });
    }
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número válido para buscar",
        variant: "destructive"
      });
      return;
    }

    const result = tree.search(value);
    setSearchPath(result.path);
    
    if (result.found) {
      setHighlightedNodes([value]);
      toast({
        title: "Encontrado!",
        description: `Valor ${value} encontrado na árvore`
      });
    } else {
      setHighlightedNodes([]);
      toast({
        title: "Não encontrado",
        description: `Valor ${value} não está na árvore`,
        variant: "destructive"
      });
    }

    setTimeout(() => {
      setSearchPath([]);
      setHighlightedNodes([]);
    }, 3000);
  };

  const handleRemove = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número válido para remover",
        variant: "destructive"
      });
      return;
    }

    const searchResult = tree.search(value);
    if (searchResult.found) {
      tree.remove(value);
      toast({
        title: "Removido!",
        description: `Valor ${value} removido da árvore`
      });
      forceUpdate();
    } else {
      toast({
        title: "Erro",
        description: `Valor ${value} não encontrado na árvore`,
        variant: "destructive"
      });
    }
  };

  const handleTraversal = (type) => {
    let result = [];
    let typeName = '';

    switch (type) {
      case 'preOrder':
        result = tree.preOrder();
        typeName = 'Pré-ordem';
        break;
      case 'inOrder':
        result = tree.inOrder();
        typeName = 'Em ordem';
        break;
      case 'postOrder':
        result = tree.postOrder();
        typeName = 'Pós-ordem';
        break;
      case 'breadthFirst':
        result = tree.breadthFirst();
        typeName = 'Busca em largura';
        break;
      case 'depthFirst':
        result = tree.depthFirst();
        typeName = 'Busca em profundidade';
        break;
    }

    setTraversalResult(result.join(' → '));
    setTraversalType(typeName);
    
    toast({
      title: `${typeName} executada`,
      description: `Resultado: ${result.join(', ')}`
    });
  };

  const handleClear = () => {
    tree.root = null;
    setHighlightedNodes([]);
    setSearchPath([]);
    setTraversalResult('');
    setTraversalType('');
    forceUpdate();
    toast({
      title: "Árvore limpa",
      description: "Todos os nós foram removidos"
    });
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <>
      <Helmet>
        <title>Simulador de Árvore Binária de Busca</title>
        <meta name="description" content="Simulador interativo para aprender e visualizar operações em Árvore Binária de Busca" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <TreePine className="w-10 h-10 text-green-400" />
              Simulador de Árvore Binária de Busca
            </h1>
            <p className="text-gray-300 text-lg">
              Visualize e interaja com operações de ABB em tempo real
            </p>
          </motion.div>

          {/* Controles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Inserção */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-400" />
                  Inserir Valor
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleInsert)}
                    placeholder="Digite um número"
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <Button
                    onClick={handleInsert}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Busca/Remoção */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" />
                  Buscar/Remover
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleSearch)}
                    placeholder="Digite um número"
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleRemove}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Limpar */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-orange-400" />
                  Controles
                </h3>
                <Button
                  onClick={handleClear}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Limpar Árvore
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Visualização da Árvore */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-green-400" />
              Visualização da Árvore
            </h3>
            <TreeVisualization 
              tree={tree} 
              highlightedNodes={highlightedNodes}
              searchPath={searchPath}
              key={treeVersion}
            />
          </motion.div>

          {/* Travessias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-purple-400" />
              Travessias e Buscas
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <Button
                onClick={() => handleTraversal('preOrder')}
                className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                Pré-ordem
              </Button>
              <Button
                onClick={() => handleTraversal('inOrder')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Em ordem
              </Button>
              <Button
                onClick={() => handleTraversal('postOrder')}
                className="bg-pink-500 hover:bg-pink-600 text-white flex items-center gap-2"
              >
                <ArrowUp className="w-4 h-4" />
                Pós-ordem
              </Button>
              <Button
                onClick={() => handleTraversal('breadthFirst')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                Largura
              </Button>
              <Button
                onClick={() => handleTraversal('depthFirst')}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Profundidade
              </Button>
            </div>

            {traversalResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/20 rounded-lg p-4"
              >
                <h4 className="text-white font-semibold mb-2">{traversalType}:</h4>
                <p className="text-gray-200 font-mono text-lg">{traversalResult}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;
