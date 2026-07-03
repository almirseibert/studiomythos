# Brief reutilizável — Hero cinematográfico "Portal / Reverie"

> Cole este documento inteiro para mim quando quiser recriar (ou adaptar) este estilo de hero animado.
> Ele descreve a **referência** (o `.webp` analisado) e as **especificações** para reconstruir em código.

---

## 1. Conceito em uma frase
Um hero de tela cheia **cinematográfico e onírico**, onde a câmera **atravessa um portal** (uma
caverna/gruta de cristais que se abre para um céu lilás) e **emerge num mar de nuvens** com um templo
grego flutuante — enquanto textos e cards de vidro **surgem com efeito "scramble/fade"**. Tudo em loop
contínuo e automático, sem interação obrigatória. Estética "luxo editorial + fantasia AI".

## 2. Referência analisada
- Arquivo: WebP animado, 640×468, **73 frames a ~66 ms** = **loop de ~4,8 s** (~15 fps), em loop infinito.
- Marca fictícia da referência: navbar com `WORLDS · ATELIER · IMMERSIONS` (esq.) — `★` (centro) —
  `CRAFT · CODEX · CONNECT` (dir.). Títulos: "FALL INTO REVERIE" e "FORGE BEYOND THE REAL".

## 3. Timeline do loop (o que acontece, em ordem)
| Tempo aprox. | Cena | Acontece |
|---|---|---|
| 0,0–0,9 s | **A — Portal (abertura)** | Começa fechado num "buraco de fechadura" de cristais; a câmera recua e o portal cresce até um grande oval. Céu lilás com nuvens visível através dele. Cristais e folhagem brilhando ao redor (parallax). |
| 0,9–1,7 s | **A — Painel 1 entra** | Sobre a cena, o conteúdo surge: título grande **"FALL *INTO* REVERIE"** ("INTO" em itálico serifado), subtítulo curto, e **3 cards de vidro fosco** à direita (`▶ View Reel`, `32 World Patrons`, `▶ View Reel`). Indicador **"DESCEND ⌄"** embaixo. |
| 1,7–2,2 s | **Transição** | O texto **se desintegra (scramble/fade)** e a câmera **avança atravessando o portal**; a moldura da caverna sai de cena. |
| 2,2–3,1 s | **B — Nuvens (chegada)** | Emerge num céu aberto de nuvens lavanda; um **templo/pódio grego branco** sobre uma ilha flutuante reflexiva, montanhas ao fundo. Câmera com leve "crane/drift". |
| 3,1–4,8 s | **B — Painel 2 entra** | Título centralizado **"FORGE BEYOND THE REAL"**, subtítulo centralizado, e uma **fileira de cards pastel** flutuando entre as nuvens (ex.: *Silent Havens, Bespoke Quests, Vivid Drifts / Mystic Crests, Deep Currents, Gilded Dusk*), cada um com um ícone/nº no canto. Loop reinicia para a cena A. |

**Constante em todo o loop:** navbar fixa e transparente (dividida esq./centro/dir.), sempre por cima.

## 4. Movimento de câmera / motion design
- **Câmera única e contínua**: dolly-out → push-forward atravessando o portal → drift sobre as nuvens.
  A sensação é de "um plano-sequência" que costura as duas telas, não um corte seco.
- **Parallax por camadas**: primeiro plano (cristais/folhagem) move mais que o fundo (céu).
- **Texto**: entra com **scramble-in** (letras embaralhando até assentar) + fade/slide-up sutil; sai com o
  mesmo scramble ao contrário. Serifa fina para títulos, com uma palavra em **itálico** de destaque.
- **Cards**: **glassmorphism** (fundo translúcido, blur, borda clara 1px, cantos ~16–20px), entram com
  fade + leve escala/rotação, flutuam com micro-movimento (float/parallax).
- **Ritmo**: lento, elegante, easing suave (ease-out cubic). Nada "saltitante".

## 5. Paleta (amostrada da referência)
- Cena portal (escura/quente): `#100C09` (quase preto), `#2C1D1A`, `#4A322A` (marrom-cristal), acento `#AF95C1` (lilás).
- Cena nuvens (clara/fria): `#51426B` (roxo profundo), `#7B6499`, `#9A81B8`, `#C2A3D1`, `#DBBADF`, brancos `#D6D1D6`.
- Direção geral: **lavanda/violeta** como cor-tema, contraste entre um ato escuro e um ato claro.
- Texto sempre **branco / branco-70%**, uppercase para navbar e labels.

## 6. Tipografia
- **Títulos**: serifada display, peso leve, `letter-spacing` levemente negativo; 1 palavra em itálico.
  (equivalentes livres: *Cormorant Garamond*, *Playfair Display*.)
- **Navbar / labels / subtítulos**: sans-serif uppercase, peso leve, `letter-spacing` largo (~0.15em),
  tamanho pequeno. (equivalentes: *Inter*, *Space Grotesk*.)

## 7. Layout
- Hero `100dvh`, fundo sangrando até as bordas (`object-fit: cover`).
- Navbar em 3 colunas: menu esquerdo · logo central · menu direito. Fixa, transparente, sem borda.
- Painel 1: texto à esquerda, cards à direita. Painel 2: título+subtítulo centralizados, cards em fileira.
- Vinheta/gradiente sutil nas bordas para legibilidade do texto.

## 8. Como eu (Claude) implementaria — opções
- **Fiel à referência (autoplay):** o fundo é uma animação renderizada (provavelmente 3D/AI). Reproduzir com
  **`<video>` em loop** (ou sequência de frames em `<canvas>`, como já fiz no hero da demo Mythos Veículos)
  + camadas de texto/cards animadas por cima com **Framer Motion / GSAP** sincronizadas ao tempo do loop.
- **Versão interativa (scroll-driven):** transformar o loop num **scrollytelling** — a posição de scroll
  controla o "atravessar o portal" (scrub de vídeo/frames) e revela os painéis 1 e 2 em sequência.
  Melhor para um site real do que o autoplay.
- **Sem o vídeo original:** recrio o clima com CSS (gradientes lilás, blur, partículas) + um asset de
  nuvens/portal (seu, placeholder, ou equivalente livre). O **layout, tipografia, scramble e os cards**
  eu reproduzo 100% em código.

## 9. O que preciso de você para executar
1. **Onde** vai (componente novo, nova página de demonstração, ou página existente).
2. **Autoplay** (fiel ao loop) **ou scroll-driven** (recomendado para site real).
3. **Assets do fundo**: você fornece o vídeo/imagem, ou uso placeholder/equivalente livre?
4. **Marca/textos**: manter os rótulos da referência ou trocar pelos da Studio Mythos.
5. Fontes: pode ser Google Fonts equivalente? (as originais podem ser pagas).

---
*Gerado a partir da extração de 73 frames do WebP de referência (loop ~4,8 s).*
