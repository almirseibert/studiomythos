# Pasta de vídeos locais

Os 4 vídeos de fundo autoplay/loop (o Hero não usa vídeo — veja
`public/hero-frames/README.md`):

- cinematic.mp4
- metrics.mp4
- technology.mp4
- footer.mp4

Pra trocar algum: coloque o arquivo original em `raw/<nome>.mp4` (mesmo
nome do slot) na raiz do projeto e rode `./optimize-videos.sh` — ele
recodifica o que estiver em `raw/` e sobrescreve o arquivo correspondente
aqui.

O Vite copia tudo que está em `public/` para a raiz do `dist/` no build,
então depois de rodar `npm run build` esses arquivos aparecem em
`dist/videos/*.mp4` — prontos para subir no VPS junto com o resto.
