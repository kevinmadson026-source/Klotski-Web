const fs = require('fs');
const path = require('path');
const Klotski = require('./klotski.js');
const OUTPUT_DIR = path.join(__dirname, 'levels_created');
const TOTAL = 99;
const TOTAL_A_CRIAR = 100; // Quantos novos você quer gerar agora

function criarPastaSeNaoExiste() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
}

// --- NOVA FUNÇÃO PARA DESCOBRIR O ÚLTIMO NÍVEL ---
function obterUltimoNumeroFase() {
  criarPastaSeNaoExiste();
  const arquivos = fs.readdirSync(OUTPUT_DIR);
  
  // Filtra apenas arquivos .json e extrai os números
  const numeros = arquivos
    .map(arq => {
      const match = arq.match(/^(\d+)\.json$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));

  return numeros.length > 0 ? Math.max(...numeros) : 0;
}

function podeColocar(grid, shape, row, col) {
  for (let i = 0; i < shape[0]; i++) {
    for (let j = 0; j < shape[1]; j++) {
      if (grid[row + i][col + j] !== 0) return false;
    }
  }
  return true;
}

function marcaNoGrid(grid, shape, row, col, id) {
  for (let i = 0; i < shape[0]; i++) {
    for (let j = 0; j < shape[1]; j++) {
      grid[row + i][col + j] = id;
    }
  }
}

function gerarBlocos() {
  const largura = 4;
  const altura = 5;
  const grid = Array.from({ length: altura }, () => Array(largura).fill(0));
  const blocks = [];
  
  const qtd_verticais = 4;  // Quantidade de peças verticais
  const qtd_horizontal = 1; // Quantidade de peças horizontais
  const qtd_pequenas = 4;   // Quantidade de peças pequenas

  const tipos = [
    { shape: [2, 2], qtd: 1 }, // Vermelha 1
    { shape: [2, 1], qtd: qtd_verticais }, // Verticais 4
    { shape: [1, 2], qtd: qtd_horizontal }, // Horizontal 1
    { shape: [1, 1], qtd: qtd_pequenas }, // Pequenas 4
  ];

  let id = 1;

  for (const tipo of tipos) {
    let colocados = 0;
    let tentativas = 0;

    while (colocados < tipo.qtd && tentativas < 100) {
      const row = Math.floor(Math.random() * (altura - tipo.shape[0] + 1));
      const col = Math.floor(Math.random() * (largura - tipo.shape[1] + 1));

      if (podeColocar(grid, tipo.shape, row, col)) {
        marcaNoGrid(grid, tipo.shape, row, col, id++);
        blocks.push({ shape: tipo.shape, position: [row, col] });
        colocados++;
      }
      tentativas++;
    }
  }

  return blocks;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function gerarFases() {
  const ultimoNivel = obterUltimoNumeroFase();
  let criadosNestaRodada = 0;
  let tentativas = 0;
  
  console.log(`Existe ${ultimoNivel} fases criadas, iniciando a partir da fase: ${ultimoNivel + 1}`);
  await sleep(3000);
  const klotski = new Klotski();

  while (criadosNestaRodada < TOTAL_A_CRIAR && tentativas < 10000) {
    const blocks = gerarBlocos();
    const options = {
      boardSize: [5, 4],
      escapePoint: [3, 1],
      blocks: blocks,
      useMirror: true
    };

    const resultado = klotski.solve(options);

    if (resultado && resultado.length > 0) {
      // O número da fase atual é o último encontrado + os que já criamos agora + 1
      const numeroAtual = ultimoNivel + criadosNestaRodada + 1;
      
      // Ajustei os parâmetros do exportLevelJSON para usar o numeroAtual
      const json = klotski.exportLevelJSON(options, numeroAtual, 100 + numeroAtual);

      const nomeArquivo = path.join(OUTPUT_DIR, `${String(numeroAtual).padStart(3, '0')}.json`);
      
      // Checagem extra de segurança para não sobrescrever
      if (!fs.existsSync(nomeArquivo)) {
        fs.writeFileSync(nomeArquivo, JSON.stringify(json, null, 2), 'utf8');
        criadosNestaRodada++;
        console.log(`Fase ${numeroAtual} criada com sucesso!`);
      }
    }

    tentativas++;
  }

  console.log(`✅ Processo finalizado. Total de novas fases: ${criadosNestaRodada}`);
  console.log(`Total de fases: ${ultimoNivel + criadosNestaRodada}`);
}

gerarFases();
