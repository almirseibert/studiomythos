# Frames do Hero (scrub por mouse)

63 imagens JPEG (`frame_001.jpg` … `frame_063.jpg`), extraídas do vídeo
original a 1920px de largura, 6 frames por segundo, ~10.4s de duração.

## Por que frames em vez de vídeo aqui

O Hero é a única seção "scrubável" pelo mouse — as outras 4 seções só
dão autoplay/loop e continuam sendo `<video>` normal em `public/videos/`.

Testamos vídeo com seek via `currentTime` (inclusive já otimizado com
GOP curto). O travamento continuava mesmo com o arquivo local, porque a
causa não era rede — era o custo de decodificar o vídeo toda vez que o
mouse pedia um frame novo, dezenas de vezes por segundo. Com uma
sequência de imagens já decodificadas, desenhar no `<canvas>` via
`drawImage()` é uma operação praticamente instantânea, então não sobra
nada pra travar.

## Trocar o vídeo do Hero

```bash
./generate-hero-frames.sh caminho/para/novo-video.mp4
```

Isso regenera os frames aqui. Se a contagem final não for 63 (varia
com a duração do vídeo de origem), o script avisa — só ajustar a
constante `FRAME_COUNT` em `src/components/Hero.tsx` pro novo valor.
