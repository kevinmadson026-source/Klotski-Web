const express = require('express');
const path = require('path');
const fs = require('fs'); // Importa o módulo de arquivos

const app = express();
const PORT = 3001;

// Rota para contar os arquivos JSON dinamicamente
app.get('/api/max-levels', (req, res) => {
  // Caminho absoluto para a pasta de levels
  const levelsPath = path.join(__dirname, 'public', 'levels');

  fs.readdir(levelsPath, (err, files) => {
    if (err) {
      console.error("Erro ao ler pasta:", err);
      return res.status(500).json({ error: 'Não foi possível ler a pasta de níveis' });
    }

    // Filtra apenas arquivos que terminam com .json
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
    
    res.json({ total: jsonFiles.length });
  });
});

// Rota para listar fases clássicas no server.js
app.get('/api/fases-classicas', (req, res) => {
  const directoryPath = path.join(__dirname, 'public', 'fases-classicas');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler a pasta' });
    }

    const fases = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        // Formatação do nome: "fase-facil.json" -> "Fase Facil"
        const cleanName = file.replace('.json', '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        return {
          id: file,       // Nome original do arquivo (ex: fase-facil.json)
          nome: cleanName // Nome formatado (ex: Fase Facil)
        };
      });

    res.json(fases);
  });
});

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});