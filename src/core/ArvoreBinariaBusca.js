
class NoArvore {
  constructor(valor) {
    this.valor = valor;
    this.esquerda = null;
    this.direita = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

export class ArvoreBinariaBusca {
  constructor() {
    this.raiz = null;
  }

  inserir(valor) {
    const novoNo = new NoArvore(valor);
    if (!this.raiz) {
      this.raiz = novoNo;
      return true;
    }

    let atual = this.raiz;
    while (true) {
      if (valor === atual.valor) return false;
      
      if (valor < atual.valor) {
        if (!atual.esquerda) {
          atual.esquerda = novoNo;
          return true;
        }
        atual = atual.esquerda;
      } else {
        if (!atual.direita) {
          atual.direita = novoNo;
          return true;
        }
        atual = atual.direita;
      }
    }
  }

  buscar(valor) {
    let atual = this.raiz;
    const caminho = [];
    
    while (atual) {
      caminho.push(atual.valor);
      if (valor === atual.valor) {
        return { encontrado: true, caminho };
      }
      atual = valor < atual.valor ? atual.esquerda : atual.direita;
    }
    
    return { encontrado: false, caminho };
  }

  remover(valor) {
    const noFoiRemovido = this._removerNo(this.raiz, valor) !== null || this.raiz === null;
    return this.buscar(valor).encontrado === false;
  }

  _removerNo(no, valor) {
    if (!no) return null;

    if (valor < no.valor) {
      no.esquerda = this._removerNo(no.esquerda, valor);
    } else if (valor > no.valor) {
      no.direita = this._removerNo(no.direita, valor);
    } else {
      if (!no.esquerda && !no.direita) return null;
      if (!no.esquerda) return no.direita;
      if (!no.direita) return no.esquerda;

      const minDireita = this._encontrarMin(no.direita);
      no.valor = minDireita.valor;
      no.direita = this._removerNo(no.direita, minDireita.valor);
    }
    return no;
  }

  _encontrarMin(no) {
    while (no.esquerda) {
      no = no.esquerda;
    }
    return no;
  }

  limpar() {
    this.raiz = null;
  }

  _preOrdem(no, resultado) {
    if (no) {
      resultado.push(no.valor);
      this._preOrdem(no.esquerda, resultado);
      this._preOrdem(no.direita, resultado);
    }
  }

  _emOrdem(no, resultado) {
    if (no) {
      this._emOrdem(no.esquerda, resultado);
      resultado.push(no.valor);
      this._emOrdem(no.direita, resultado);
    }
  }

  _posOrdem(no, resultado) {
    if (no) {
      this._posOrdem(no.esquerda, resultado);
      this._posOrdem(no.direita, resultado);
      resultado.push(no.valor);
    }
  }

  _largura() {
    if (!this.raiz) return [];
    const resultado = [];
    const fila = [this.raiz];
    while (fila.length > 0) {
      const no = fila.shift();
      resultado.push(no.valor);
      if (no.esquerda) fila.push(no.esquerda);
      if (no.direita) fila.push(no.direita);
    }
    return resultado;
  }

  executarTravessia(tipo) {
    const resultado = [];
    let nome = '';
    switch (tipo) {
      case 'preOrdem':
        this._preOrdem(this.raiz, resultado);
        nome = 'Pré-ordem';
        break;
      case 'emOrdem':
        this._emOrdem(this.raiz, resultado);
        nome = 'Em ordem';
        break;
      case 'posOrdem':
        this._posOrdem(this.raiz, resultado);
        nome = 'Pós-ordem';
        break;
      case 'largura':
        return { resultado: this._largura(), nome: 'Busca em Largura' };
      case 'profundidade':
        this._preOrdem(this.raiz, resultado);
        nome = 'Busca em Profundidade';
        break;
      default:
        return { resultado: [], nome: '' };
    }
    return { resultado, nome };
  }
}
