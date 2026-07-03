// Projetos publicados pelo painel — cards da Central de Aplicativos criados sem
// mexer no código. Sites estáticos (zip/html) ficam em uploads/sites/<slug>/ e
// são servidos publicamente em /sites/<slug>/.
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const dbPool = require('../config/db');

const SITES_DIR = path.join(__dirname, '..', 'uploads', 'sites');

function garantirDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

// Normaliza um texto em slug seguro para URL e nome de pasta.
function gerarSlug(texto) {
    return String(texto || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 70);
}

// Remove recursivamente uma pasta (proteção: só dentro de SITES_DIR).
function apagarPasta(dir) {
    const abs = path.resolve(dir);
    if (!abs.startsWith(path.resolve(SITES_DIR))) return;
    fs.rmSync(abs, { recursive: true, force: true });
}

// Descobre o arquivo de entrada dentro de uma pasta descompactada.
// Se o zip tinha uma única pasta-raiz, "sobe" o conteúdo dela.
function normalizarSitePasta(destino) {
    let itens = fs.readdirSync(destino, { withFileTypes: true }).filter(i => i.name !== '__MACOSX');
    // Caso o zip embrulhe tudo numa única subpasta, promove o conteúdo dela.
    if (itens.length === 1 && itens[0].isDirectory()) {
        const sub = path.join(destino, itens[0].name);
        for (const nome of fs.readdirSync(sub)) {
            fs.renameSync(path.join(sub, nome), path.join(destino, nome));
        }
        fs.rmSync(sub, { recursive: true, force: true });
        itens = fs.readdirSync(destino, { withFileTypes: true }).filter(i => i.name !== '__MACOSX');
    }
    // Procura um index.html (na raiz de preferência).
    if (fs.existsSync(path.join(destino, 'index.html'))) return 'index.html';
    const htmlNaRaiz = itens.find(i => i.isFile() && /\.html?$/i.test(i.name));
    if (htmlNaRaiz) return htmlNaRaiz.name;
    return 'index.html';
}

// Processa o arquivo enviado (zip ou html) para uploads/sites/<slug>/.
// Retorna o nome do arquivo de entrada. Lança erro se inválido.
function processarUpload(file, slug) {
    const destino = path.join(SITES_DIR, slug);
    apagarPasta(destino);
    garantirDir(destino);

    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.zip') {
        const zip = new AdmZip(file.buffer);
        zip.extractAllTo(destino, true);
        return normalizarSitePasta(destino);
    }
    if (ext === '.html' || ext === '.htm') {
        fs.writeFileSync(path.join(destino, 'index.html'), file.buffer);
        return 'index.html';
    }
    throw new Error('Formato inválido. Envie um arquivo .zip ou .html.');
}

const projetoController = {
    SITES_DIR,

    // GET /api/projetos  (público) — cards publicados para a Central de Aplicativos
    listarPublico: async (req, res) => {
        try {
            const [rows] = await dbPool.query(
                `SELECT id, slug, titulo, subtitulo, descricao, cor, cor_secundaria, icone,
                        tipo, url_externa, arquivo_entrada
                 FROM projetos WHERE publicado = 1
                 ORDER BY ordem ASC, criado_em DESC`
            );
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Erro ao listar projetos públicos:', error);
            res.json({ success: true, data: [] }); // não quebra a página pública
        }
    },

    // GET /api/admin/projetos  (admin) — todos, inclusive despublicados
    listar: async (req, res) => {
        try {
            const [rows] = await dbPool.query(
                `SELECT * FROM projetos ORDER BY ordem ASC, criado_em DESC`
            );
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Erro ao listar projetos:', error);
            res.status(500).json({ success: false, error: 'Erro ao buscar projetos.' });
        }
    },

    // POST /api/admin/projetos  (multipart: campos + arquivo opcional)
    criar: async (req, res) => {
        const b = req.body || {};
        if (!b.titulo) return res.status(400).json({ success: false, error: 'Informe o título do projeto.' });

        const tipo = b.tipo === 'link' ? 'link' : 'arquivos';
        let slug = gerarSlug(b.slug || b.titulo);
        if (!slug) return res.status(400).json({ success: false, error: 'Título inválido para gerar o endereço.' });

        try {
            // Garante slug único.
            const [dup] = await dbPool.query('SELECT id FROM projetos WHERE slug = ?', [slug]);
            if (dup.length) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

            let arquivoEntrada = 'index.html';
            if (tipo === 'arquivos') {
                if (!req.file) return res.status(400).json({ success: false, error: 'Envie o arquivo .zip ou .html do site.' });
                arquivoEntrada = processarUpload(req.file, slug);
            } else if (!b.url_externa) {
                return res.status(400).json({ success: false, error: 'Informe a URL externa do link.' });
            }

            const [r] = await dbPool.query(
                `INSERT INTO projetos
                 (slug, titulo, subtitulo, descricao, cor, cor_secundaria, icone, tipo, url_externa, arquivo_entrada, publicado, ordem)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    slug, b.titulo, b.subtitulo || null, b.descricao || null,
                    b.cor || '#4F46E5', b.cor_secundaria || '#7C3AED', b.icone || 'Globe',
                    tipo, tipo === 'link' ? b.url_externa : null, arquivoEntrada,
                    b.publicado === '0' || b.publicado === false ? 0 : 1,
                    Number(b.ordem) || 0,
                ]
            );
            res.status(201).json({ success: true, id: r.insertId, slug, mensagem: 'Projeto criado com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            res.status(500).json({ success: false, error: error.message || 'Erro ao criar o projeto.' });
        }
    },

    // PUT /api/admin/projetos/:id  (multipart: campos + arquivo opcional para re-upload)
    atualizar: async (req, res) => {
        const b = req.body || {};
        try {
            const [linhas] = await dbPool.query('SELECT * FROM projetos WHERE id = ?', [req.params.id]);
            if (!linhas.length) return res.status(404).json({ success: false, error: 'Projeto não encontrado.' });
            const atual = linhas[0];

            const tipo = b.tipo ? (b.tipo === 'link' ? 'link' : 'arquivos') : atual.tipo;
            let arquivoEntrada = atual.arquivo_entrada;

            // Re-upload opcional de arquivos.
            if (tipo === 'arquivos' && req.file) {
                arquivoEntrada = processarUpload(req.file, atual.slug);
            }

            await dbPool.query(
                `UPDATE projetos SET titulo=?, subtitulo=?, descricao=?, cor=?, cor_secundaria=?, icone=?,
                        tipo=?, url_externa=?, arquivo_entrada=?, publicado=?, ordem=? WHERE id=?`,
                [
                    b.titulo ?? atual.titulo,
                    b.subtitulo ?? atual.subtitulo,
                    b.descricao ?? atual.descricao,
                    b.cor ?? atual.cor,
                    b.cor_secundaria ?? atual.cor_secundaria,
                    b.icone ?? atual.icone,
                    tipo,
                    tipo === 'link' ? (b.url_externa ?? atual.url_externa) : null,
                    arquivoEntrada,
                    b.publicado === undefined ? atual.publicado : (b.publicado === '0' || b.publicado === false ? 0 : 1),
                    b.ordem === undefined ? atual.ordem : (Number(b.ordem) || 0),
                    req.params.id,
                ]
            );
            res.json({ success: true, mensagem: 'Projeto atualizado.' });
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            res.status(500).json({ success: false, error: error.message || 'Erro ao atualizar o projeto.' });
        }
    },

    // DELETE /api/admin/projetos/:id
    remover: async (req, res) => {
        try {
            const [linhas] = await dbPool.query('SELECT slug FROM projetos WHERE id = ?', [req.params.id]);
            if (!linhas.length) return res.status(404).json({ success: false, error: 'Projeto não encontrado.' });
            await dbPool.query('DELETE FROM projetos WHERE id = ?', [req.params.id]);
            apagarPasta(path.join(SITES_DIR, linhas[0].slug));
            res.json({ success: true, mensagem: 'Projeto removido.' });
        } catch (error) {
            console.error('Erro ao remover projeto:', error);
            res.status(500).json({ success: false, error: 'Erro ao remover o projeto.' });
        }
    },
};

module.exports = projetoController;
