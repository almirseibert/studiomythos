# Referências de Design — Studio Mythos

Biblioteca **portável** de referências visuais e briefs para reaproveitar estilos/animações
em novos sites. Pasta versionada no repositório → transporta de um computador para outro via `git`
(ou copiando a pasta inteira).

## Como usar
1. Cada referência mora em sua própria subpasta: `<slug>/`.
2. Dentro há sempre:
   - `BRIEF.md` — o "script" descritivo/técnico. **Cole ele inteiro para o Claude** quando quiser
     recriar ou adaptar aquele estilo. O brief é auto-suficiente (conceito, timeline, câmera, paleta,
     tipografia, layout e opções de implementação).
   - `frames/` — imagens-chave extraídas da referência (prova visual do que o brief descreve).
   - (opcional) o arquivo original da referência (`.webp`, `.mp4`, print, link).

## Fluxo para adicionar uma nova referência
1. Me mande o link/arquivo da referência.
2. Eu analiso (extraio frames se for animação), e gero `<slug>/BRIEF.md` + `frames/`.
3. Você guarda; depois é só colar o BRIEF para eu construir/adaptar em qualquer projeto.

## Extração de frames (animações WebP/MP4)
Feito com Python + Pillow:
```bash
python -m pip install Pillow
# abre o arquivo, itera com im.seek(i), salva frames distintos (ver BRIEF de cada ref)
```

## Referências catalogadas
| Slug | Estilo | Usado em |
|---|---|---|
| [`hero-reverie`](hero-reverie/BRIEF.md) | Hero cinematográfico scroll-driven: câmera atravessa um portal → mar de nuvens, com scramble-in e cards de vidro | Página modelo **Floricultura** (`/modelos/floricultura`) |
