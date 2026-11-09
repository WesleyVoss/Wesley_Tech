// ========================================
// 1. LISTA DE PRODUTOS DISPONÍVEIS NA LOJA
// ========================================

const produtos = [
  {
    id: 1,
    nome: "Teclado mecânico",
    descricao: "Teclado confortável para trabalho e jogos.",
    preco: 189.90,
    emoji: "⌨️"
  },
  {
    id: 2,
    nome: "Mouse gamer",
    descricao: "Mouse preciso com design ergonômico.",
    preco: 99.90,
    emoji: "🖱️"
  },
  {
    id: 3,
    nome: "Headset",
    descricao: "Áudio para chamadas, estudos e jogos.",
    preco: 159.90,
    emoji: "🎧"
  },
  {
    id: 4,
    nome: "Celular",
    descricao: "Tela de alta resolução, câmera de qualidade e bateria de longa duração.",
    preco: 1590.90,
    emoji: "📱"
  },
  {
    id: 5,
    nome: "Microfone",
    descricao: "Microfone profissional de alta qualidade, para cantores e apresentadore.",
    preco: 130.90,
    emoji: "🎤"
  },
  {
    id: 5,
    nome: "Controle",
    descricao: "Para jogadores que gostam de um controle confortável e com longa duração.",
    preco: 130.90,
    emoji: "🎮"
  }

];

// O carrinho começa vazio.
// Cada item será um objeto com produtoId e quantidade.
let carrinho = [];


// ========================================
// 2. FUNÇÕES AUXILIARES
// ========================================

// Formata um número como moeda brasileira.
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}


// Procura um produto no catálogo pelo ID.
function buscarProduto(id) {
  return produtos.find(produto => produto.id === id);
}


// ========================================
// 3. MOSTRAR OS PRODUTOS NA PÁGINA (DOM)
// ========================================

function exibirProdutos() {
  const listaProdutos = document.querySelector("#lista-produtos");

  listaProdutos.innerHTML = produtos.map(produto => `
    <article class="card-produto">
      <div class="icone-produto">${produto.emoji}</div>
      <h3>${produto.nome}</h3>
      <p class="descricao">${produto.descricao}</p>
      <span class="preco">${formatarMoeda(produto.preco)}</span>
      <button class="botao botao-principal"
              onclick="adicionarProduto(${produto.id})">
        Adicionar ao carrinho
      </button>
    </article>
  `).join("");
}


// ========================================
// 4. ADICIONAR PRODUTO AO CARRINHO
// ========================================

function adicionarProduto(id) {
  const produto = buscarProduto(id);

  // Se o produto não existir no catálogo, interrompe a função.
  if (!produto) {
    alert("Produto não encontrado.");
    return;
  }

  // Verifica se o produto já está no carrinho.
  const itemExistente = carrinho.find(item => item.produtoId === id);

  if (itemExistente) {
    // Se já existe, aumenta a quantidade.
    itemExistente.quantidade++;
  } else {
    // Se ainda não existe, adiciona um novo item.
    carrinho.push({
      produtoId: id,
      quantidade: 1
    });
  }

  atualizarCarrinho();
}


// ========================================
// 5. ALTERAR A QUANTIDADE DE UM PRODUTO
// ========================================

function atualizarQuantidade(id, alteracao) {
  const item = carrinho.find(item => item.produtoId === id);

  if (!item) {
    return;
  }

  item.quantidade += alteracao;

  // Não permite quantidade igual a zero ou negativa.
  if (item.quantidade <= 0) {
    removerProduto(id);
    return;
  }

  atualizarCarrinho();
}


// ========================================
// 6. REMOVER UM PRODUTO DO CARRINHO
// ========================================

function removerProduto(id) {
  // filter cria uma lista sem o produto que queremos remover.
  carrinho = carrinho.filter(item => item.produtoId !== id);

  atualizarCarrinho();
}


// ========================================
// 7. CALCULAR O TOTAL DA COMPRA
// ========================================

function calcularTotal() {
  let total = 0;

  // Percorre todos os itens do carrinho.
  for (const item of carrinho) {
    const produto = buscarProduto(item.produtoId);

    if (produto) {
      const subtotal = produto.preco * item.quantidade;
      total += subtotal;
    }
  }

  return total;
}


// ========================================
// 8. ATUALIZAR A APRESENTAÇÃO DO CARRINHO
// ========================================

function atualizarCarrinho() {
  const areaItens = document.querySelector("#itens-carrinho");
  const contador = document.querySelector("#contador-carrinho");

  // Soma a quantidade de unidades de todos os produtos.
  const quantidadeTotal = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  contador.textContent = quantidadeTotal;

  // Se o carrinho estiver vazio, mostra uma mensagem.
  if (carrinho.length === 0) {
    areaItens.innerHTML = `
      <div class="carrinho-vazio">
        <p>🛒 Seu carrinho está vazio.</p>
        <p>Adicione algum produto para começar!</p>
      </div>
    `;
  } else {
    // Cria o HTML de cada item do carrinho.
    areaItens.innerHTML = carrinho.map(item => {
      const produto = buscarProduto(item.produtoId);
      const subtotal = produto.preco * item.quantidade;

      return `
        <div class="item-carrinho">
          <div class="item-info">
            <strong>${produto.emoji} ${produto.nome}</strong>
            <small>${formatarMoeda(produto.preco)} cada</small>
          </div>

          <div class="controles-quantidade">
            <button onclick="atualizarQuantidade(${produto.id}, -1)"
                    aria-label="Diminuir quantidade">−</button>

            <span>${item.quantidade}</span>

            <button onclick="atualizarQuantidade(${produto.id}, 1)"
                    aria-label="Aumentar quantidade">+</button>
          </div>

          <div class="subtotal-item">
            ${formatarMoeda(subtotal)}
            <button class="remover"
                    onclick="removerProduto(${produto.id})">
              Remover
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Atualiza subtotal e total na página.
  const total = calcularTotal();

  document.querySelector("#subtotal").textContent = formatarMoeda(total);
  document.querySelector("#total").textContent = formatarMoeda(total);
}


// ========================================
// 9. LIMPAR TODO O CARRINHO
// ========================================

function limparCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}


// ========================================
// 10. FINALIZAR COMPRA (SIMULAÇÃO)
// ========================================

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio. Adicione produtos antes de finalizar.");
    return;
  }

  const total = calcularTotal();

  alert(
    "Compra simulada com sucesso!\n\n" +
    "Total: " + formatarMoeda(total) +
    "\n\nEste exemplo não realiza pagamentos reais."
  );

  // Em uma loja real, aqui seria iniciada a etapa de checkout.
}


// ========================================
// 11. EVENTOS DOS BOTÕES
// ========================================

document.querySelector("#limpar-carrinho")
  .addEventListener("click", limparCarrinho);

document.querySelector("#finalizar-compra")
  .addEventListener("click", finalizarCompra);


// ========================================
// 12. INICIALIZAÇÃO DO SISTEMA
// ========================================

// Mostra os produtos e o carrinho vazio ao abrir a página.
exibirProdutos();
atualizarCarrinho();
