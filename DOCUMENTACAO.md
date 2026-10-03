# Documentação — Calculadora Científica

Documentação técnica do projeto (fork de `zxcodes/Calculator`). O projeto reúne três ferramentas em páginas separadas, todas com modo claro/escuro:

- **Calculadora científica** (`index.html`): operações básicas, funções científicas e entrada via teclado.
- **Conversor de bases** (`conversor/tela_bases.html`): conversão entre bases de 2 a 32.
- **Plano cartesiano** (`plano/tela_plano.html`): gráfico de funções quadráticas (`ax² + bx + c`) com delta, raízes e vértice.

> Última atualização: 03/10/2026.
> Tags usadas na seção de bugs: **[Resolvido]**, **[Em aberto]**, **[Regressão]** (algo que estava resolvido e deixou de valer na UI atual).

## Sumário

1. [Visão geral dos módulos](#visão-geral-dos-módulos)
2. [Estrutura de arquivos](#estrutura-de-arquivos)
3. [Como executar](#como-executar)
4. [Navegação entre telas](#navegação-entre-telas) e [Assets](#assets)
5. [Páginas HTML](#páginas-html)
6. [Estilos](#estilos)
7. [`scripts/script.js`](#scriptsscriptjs)
8. [`plano/plano.js`](#planoplanojs)
9. [Sistema de temas](#sistema-de-temas)
10. [Bugs e pontos em aberto](#bugs-e-pontos-em-aberto)

---

## Visão geral dos módulos

| Módulo | Página | Estilos | Scripts carregados | Função de tema |
|---|---|---|---|---|
| Calculadora | `index.html` | `styles/style.css` | `scripts/script.js` | `changeTheme()` |
| Conversor de bases | `conversor/tela_bases.html` | `styles/style.css` | `scripts/script.js` | `changeThemeConversor()` |
| Plano cartesiano | `plano/tela_plano.html` | `plano/plano.css` | `scripts/script.js` + `plano/plano.js` | `changeThemePlano()` (em `plano.js`) |

Observações importantes:

- Calculadora e conversor **compartilham** `style.css` e `script.js`. O plano tem folha de estilos e script próprios.
- `tela_plano.html` também carrega `scripts/script.js`, mas **nenhuma função dele é usada nessa página** — e o `keydown` global registrado por ele causa efeitos colaterais (ver bug 11).

## Estrutura de arquivos

```
├── index.html                  # Calculadora (página principal)
├── DOCUMENTACAO.md             # Este arquivo
├── README.md
├── assets/                     # detalhes na seção "Assets"
│   ├── calculator.ico                      # favicon
│   ├── calculator.ico.png                  # ícone da calculadora, 36×36 (tema escuro)
│   ├── calculator.icon.branco.png          # mesma arte em 2048×2048 com fundo branco (tema claro)
│   ├── GitHubLight.svg / GitHubDark.svg    # ícone do GitHub (branco / cinza-escuro)
│   ├── SunIcon.svg / MoonIcon.svg          # ícone do botão de tema
│   ├── iconeConversorBases.png             # link para o conversor (1254×1254)
│   ├── Icon_do_plano_cartesiano_certo.png  # link para o plano, eixos claros (tema escuro)
│   ├── plano_cartesiano_icone.png          # link para o plano, eixos escuros (tema claro)
│   ├── preview_dark.jpg                    # captura usada no README (896×1200)
│   └── preview_light.jpg
├── styles/
│   └── style.css               # tema claro + escuro (calculadora e conversor)
├── scripts/
│   └── script.js               # lógica da calculadora, do conversor e dos temas das duas telas
├── conversor/
│   └── tela_bases.html         # Conversor de bases
└── plano/
    ├── tela_plano.html         # Plano cartesiano
    ├── plano.css               # estilos do plano (tema próprio)
    └── plano.js                # desenho do gráfico, cálculos e tema do plano
```

> `styles/light.css` e `styles/dark.css` **não existem mais**: os dois temas ficam em `style.css`, alternados por classe (ver [Sistema de temas](#sistema-de-temas)).

## Assets

| Arquivo | Dimensões / peso | Onde é usado | Troca por tema |
|---|---|---|---|
| `calculator.ico` | não verificado | favicon das três páginas | não |
| `calculator.ico.png` | 36×36 / ~2 KB | ícone "calculadora" nas telas do conversor e do plano | tema escuro |
| `calculator.icon.branco.png` | 2048×2048 / ~842 KB (RGB, sem transparência) | mesmo ícone, nas telas do conversor e do plano | tema claro |
| `GitHubLight.svg` | SVG, preenchimento `#fff` | link do GitHub | tema escuro |
| `GitHubDark.svg` | SVG, preenchimento `#383838` | link do GitHub | tema claro |
| `SunIcon.svg` / `MoonIcon.svg` | SVG | botão de tema (mostra o sol no escuro e a lua no claro) | sim |
| `iconeConversorBases.png` | 1254×1254 / ~1,3 MB | link para o conversor (calculadora e plano) | não (mesma imagem nos dois temas) |
| `Icon_do_plano_cartesiano_certo.png` | 1254×1254 / ~616 KB, com transparência, eixos claros | link para o plano | tema escuro |
| `plano_cartesiano_icone.png` | 1254×1254 / ~200 KB, com transparência, eixos escuros | link para o plano | tema claro |
| `preview_dark.jpg` / `preview_light.jpg` | 896×1200 / ~330 e ~400 KB | `README.md` | — |

Observações:

- O ícone da calculadora é a mesma arte (azulejo branco com símbolos pretos e o "=" vermelho) em dois arquivos de resolução muito diferente. Como ambos têm base clara, não há problema de contraste em nenhum dos temas (ver bug 30).
- Os ícones de GitHub, plano e calculadora seguem a lógica "ícone claro em fundo escuro e vice-versa".
- Os arquivos PNG são exibidos entre 25 e 35 px, mas têm até 1254–2048 px de lado (ver bug 31).

## Como executar

1. Clone o repositório: `git clone https://github.com/guilhermeperecim-jpg/Projeto-Calculadora-Cient-fica.git`
2. Abra `index.html` no navegador. Não há build nem dependências.
3. As fontes (Inter e Orbitron) vêm do Google Fonts; sem internet, o navegador usa as fontes de fallback.

## Navegação entre telas

Cada página tem um conjunto de ícones no topo (`.top-buttons`) que leva às outras duas:

| Página atual | Ícones (da esquerda para a direita) |
|---|---|
| Calculadora | GitHub, tema, conversor de bases (`#calc-bases`), plano cartesiano (`#plano-icon`) |
| Conversor | GitHub, tema, calculadora (`#calculator`), plano cartesiano (`#plano-icon`) |
| Plano | GitHub (abre em nova aba), tema, calculadora (`#calculator`), conversor de bases (`#calc-bases`) |

---

## Páginas HTML

### `index.html` (Calculadora)

- `#toast` (`<h1>`): título que também serve de notificação temporária na troca de tema.
- `#result`: campo de texto **somente leitura** que funciona como visor.
- `#clear-button`: `<button>` que limpa o visor via `onclick="result.value=''"` (sem passar por função JS).
- `.toggle` (`onclick="mudarModo()"`): mostra/esconde o painel científico.
- `.botoes-cientificos`: painel com os botões abaixo. **Todos inserem texto no visor via `liveScreen(...)`**; nenhum calcula diretamente.

| Botão | Texto inserido no visor |
|---|---|
| `sen` | `sen(` |
| `cos` | `cos(` |
| `tg` | `tan(` |
| `√` | `√(` |
| `^` | `**(` |
| `eˣ` | `e^(` |
| `log` | `log(` |
| `ln` | `ln(` |
| `(` / `)` | `(` / `)` |

- `.botoes-basicos`: dígitos `0–9`, `.`, operadores `+ - * /` e `=` (`.igual`, `onclick="calculate(result.value)"`).
- `#theme-icon` / `.theme-button`: alterna o tema via `changeTheme()`.
- `#github-icon` e `#plano-icon`: trocam de imagem junto com o tema.
- Fontes: Inter (300/400) e Orbitron (400/700).

### `conversor/tela_bases.html` (Conversor de bases)

- Três campos de texto: `#base-entrada`, `#base-saida` e `#num-convert`.
- `#result-bases`: `<textarea readonly>` com o resultado ou a mensagem de erro.
- `.btn-converter` (`onclick="calculateBase()"`): dispara a conversão.
- Botão de tema chama `changeThemeConversor()`.
- Usa `../styles/style.css` e `../scripts/script.js`.

### `plano/tela_plano.html` (Plano cartesiano)

- `#wrapper` (`.wrapper.dark` inicialmente): raiz do tema (o `plano.js` busca por esse id).
- `#grafico`: `<canvas>` 500×500 (o tamanho real é recalculado em JS).
- `.canvas-controls`: botões `#btn-zoom-in` (+), `#btn-zoom-out` (−) e `#btn-reset` (⟲).
- Inputs numéricos `#coef-a`, `#coef-b`, `#coef-c` (`step="0.1"`, valores iniciais `1`, `0`, `0`).
- Painel de resultados: `#res-funcao`, `#res-delta`, `#res-raiz1`, `#res-raiz2`, `#res-vertice`.
- `#btn-atualizar`: existe no HTML, mas está dentro de um `<div hidden>` e sem texto/ícone. Hoje o gráfico atualiza ao digitar (evento `input`), então o botão é efetivamente código morto (ver bug 25).
- Fontes: Inter (300–600) e Orbitron (400/700).
- Usa `plano.css`, `../scripts/script.js` e `plano.js`, nessa ordem.

---

## Estilos

### `styles/style.css` (calculadora e conversor)

O controle de tema é feito por **classes** `.light` / `.dark` no elemento `.wrapper`, que definem variáveis CSS (`--bg`, `--button-bg` etc.).

| Elemento | Claro | Escuro |
|---|---|---|
| `.wrapper` (fundo) | verde-água claro `rgb(200,235,220)` | quase preto `rgb(20,19,19)` |
| botões | claro, texto escuro | `rgb(47,51,50)`, texto branco |
| `#clear-button` | vermelho `rgb(220,70,60)` | vermelho `rgb(255,42,42)` |
| `.igual` | verde `rgb(16,135,90)` | laranja (`orangered`) |
| `.toggle` | verde `rgb(16,135,90)` | vermelho escuro `rgb(82,4,4)` |
| `.btn-converter` | verde `rgb(12,130,80)` | vermelho `#ff3b30` |
| `#result-bases` | fundo branco, texto preto | fundo `rgb(47,51,50)`, texto `#c9c1c1` |

Layout e comportamento:

- `.wrapper`: `height: 100vh`, flex em coluna centralizado; transição de 0.8s ao trocar de tema.
- `.header-container`: largura fixa `calc(280px + 1.6em)`, igual à do teclado básico.
- `.botoes-cientificos`: grid de 2 colunas, escondido por padrão (`max-width: 0; opacity: 0`). A classe `.expandida` (adicionada ao `#calc` por `mudarModo()`) libera `max-width: 160px` e `opacity: 1`, e alarga o `.toggle` para `calc(420px + 2.4em)`.
- `.botoes-basicos`: grid de 4 colunas.
- `button` (regra global): `width: 70px`, `padding: 25px`, `border-radius: 100px`, efeito `:active` com `scale(0.93)`.
- `.btn-converter`: 85×70 px com `border-radius: 50%` (resulta em formato oval).
- `#result-bases`: `min-width: 350px`, `max-width: 90vw`, sem redimensionamento manual (`resize: none`); largura/altura são ajustadas por `autoResizeInput()`.
- `.theme-button`: `all: unset`, para remover o estilo global de `button`.
- Título (`h1`) usa `Orbitron`.

### `plano/plano.css` (plano cartesiano)

Tem **sistema de tema próprio**, independente do `style.css`: as variáveis são definidas em `.wrapper.dark` e `.wrapper.light`.

| Variável (principais) | Escuro | Claro |
|---|---|---|
| `--bg` | `rgb(14,14,16)` | `rgb(245,248,246)` |
| `--accent` | `#ff5733` | `rgb(16,135,90)` |
| `--canvas-bg` | `rgb(18,18,22)` | `rgb(252,254,253)` |
| `--curve-color` | `#ff5733` | `rgb(16,135,90)` |

Blocos principais:

- **Layout**: `.plano-content` é um flex com o canvas (`.canvas-wrapper`, 500 px, `min-width: 300px`) à esquerda e o `.controls-panel` à direita.
- **Canvas**: `.canvas-wrapper` com `overflow: hidden`, borda arredondada e brilho no hover; `.canvas-controls` posiciona os botões de zoom no canto inferior direito.
- **Painéis**: `.panel-section` (efeito vidro com `backdrop-filter`), `.section-header`, `.formula`, `.inputs-grid` (3 colunas), `.results-grid` / `.result-item` (a linha `.highlight` destaca o vértice).
- **Animações**: `fadeInUp` nos painéis, canvas e botão; `toastPulse` (classe `.toast-active`) no título durante a troca de tema.
- **Responsivo**: `@media (max-width: 960px)` empilha canvas e painel (máx. 500 px); `@media (max-width: 520px)` reduz paddings, coloca os inputs em 1 coluna e empilha o cabeçalho.

---

## `scripts/script.js`

### Estado / referências globais

- Caminhos: `caminho` (`"../"` quando a URL contém `/conversor/`, senão `""`), `sunIcon`, `moonIcon`, `githubLight`, `githubDark`, `planoIconDark`, `planoIconLight`.
- Elementos: `themeIcon`, `githubIcon`, `planoIcon`, `res` (`#result`) e `toast`.
- `lightTheme` e `darkTheme` apontam para `styles/light.css` e `styles/dark.css`, **arquivos que não existem mais e variáveis que nenhum código usa** (resquício da troca de `<link>`; ver bug 19).

### Fluxo de avaliação de uma expressão (calculadora)

```
botão/tecla → liveScreen(texto) → visor (#result)
"=" ou Enter → calculate(visor) → evalParser(texto) → eval(código JS) → validação → visor
```

Exemplo: digitar `sen(30)` gera no visor o texto `sen(30)`; ao confirmar, `evalParser` produz `Math.sin(30)`, que é avaliado por `eval`.

### `calculate(value)`

Converte o texto com `evalParser`, avalia com `eval` dentro de `try/catch` e escreve o resultado em `res.value`. Retorna `0` (sucesso) ou `-1` (erro).

| Situação | Comportamento |
|---|---|
| Expressão mal formada (erro de sintaxe) | `try/catch` captura; visor mostra `Erro` por 1,3 s e depois é limpo. |
| Resultado não finito (`NaN`, `Infinity`) | Visor mostra `Resultado inválido` por 1,3 s e depois é limpo. |
| Visor vazio | `evalParser("") \|\| null` vira `eval(null)` → `null` → também cai em `Resultado inválido`. |

A mensagem `Resultado inválido` é intencionalmente genérica: cobre divisão por zero e overflow sem distinguir os dois (decisão do item 5 da seção de bugs). Agora ela também cobre domínio inválido de funções (`ln(0)`, `ln(-1)`, `√(-1)`), já que as mensagens específicas das funções `calcular*` não são mais acionadas pela UI (ver bug 6).

### `evalParser(expr)`

**Em uso**: é chamada por `calculate()`. Percorre a string caractere a caractere e troca símbolos por chamadas JavaScript:

| No visor | Vira em JavaScript | Observação |
|---|---|---|
| `√` | `Math.sqrt` | Os parênteses vêm do próprio texto (`√(`). |
| `ln` | `Math.log` | `l` seguido de algo diferente de `o`; pula 1 caractere. |
| `log` | `Math.log10` | `l` seguido de `o`; pula 2 caracteres. |
| `e^` | `Math.exp` | Pula o `^`. |
| `e` (isolado) | `Math.E` | Origem do bug da notação científica (bug 9). |
| `π` | `Math.PI` | Não há botão nem tecla para `π`. |
| `sen` | `Math.sin` | Pula 2 caracteres. **Usa radianos** (ver bug 4). |
| `cos` | `Math.cos` | Pula 2 caracteres. **Usa radianos**. |
| `tan` | `Math.tan` | Pula 2 caracteres. **Usa radianos**. |

O parser é por caractere: qualquer `l`, `e`, `s`, `c` ou `t` é transformado. Isso só funciona porque o visor é somente leitura e recebe texto apenas dos botões e do teclado filtrado.

### `liveScreen(enteredValue)`

Concatena o valor ao `res.value`. Usada por todos os botões numéricos, operadores e científicos.

### `keyboardInputHandler(e)`

Registrada com `document.addEventListener("keydown", ...)` em **todas** as páginas que carregam `script.js`.

- Se o alvo é um `<input>` editável (não `readOnly`), retorna e deixa o navegador digitar (necessário no conversor e no plano).
- Caso contrário, chama `e.preventDefault()` e trata: dígitos `0–9`, operadores `+ - * /`, `^` (insere `**`, sem parêntese), `.`, `(`, `)`, `Enter` (`calculate(result.value)`) e `Backspace` (apaga o último caractere).
- Não digita funções (`sen`, `log` etc.) nem `e`/`π`: elas só entram pelos botões.

### Funções de cálculo específicas (hoje sem uso na UI)

Quando os botões científicos chamavam essas funções diretamente, elas aplicavam a operação sobre o valor do visor. Hoje os botões apenas inserem texto e o cálculo passa por `evalParser`, então **nenhuma delas é chamada** (ver bug 6):

| Função | O que faz |
|---|---|
| `calcularExponencial(value)` | `Math.exp`; mostra `Infinito` em caso de overflow. |
| `calcularLn(value)` / `calcularLog(value)` | Log natural / base 10; mensagem própria para valor `<= 0`. |
| `calcularRaiz(value)` | Raiz quadrada; mensagem própria para valor negativo. |
| `calcularRaizCubica(value)` | `Math.cbrt` (nunca teve botão). |
| `calcularsen(value)` / `calcularcos(value)` / `calculartg(value)` | Convertem **graus → radianos** com `grausParaRadiano` antes de aplicar a função. |
| `grausParaRadiano(graus)` | `graus * Math.PI / 180`. Só é chamada pelas três funções acima. |
| `euler()` | Concatena `'e'` no visor (nunca teve botão). |

### `mudarModo()`

Alterna a classe `expandida` no elemento `#calc`, mostrando ou escondendo o painel científico via CSS. Referencia `calc` pelo id (variável global implícita).

### Temas: `changeTheme()` e `changeThemeConversor()`

Ver [Sistema de temas](#sistema-de-temas).

### Funções do conversor de bases

| Função | O que faz | Tratamento de erro |
|---|---|---|
| `paraDecimal(num, baseE)` | Converte a string `num` da base de entrada (2–32) para decimal usando `BigInt`. Aceita `-` no início. | Nenhum (assume dados validados). |
| `deDecimal(dec, baseS)` | Converte um decimal (`BigInt`) para string na base de saída (2–32). | Retorna `"0"` se a entrada for 0. |
| `converterBase(numero, baseEntrada, baseSaida)` | Normaliza (`trim` + maiúsculas), valida bases (2–32) e caracteres do número, e aciona `paraDecimal` → `deDecimal`. Retorna `{ erro, result }`. | Mensagens de erro para base fora do intervalo e para caractere inválido (informa o caractere e os permitidos). |
| `calculateBase()` | Lê os inputs, chama `converterBase()` e escreve resultado/erro em `#result-bases`. | `"Preencha todos os campos"` se faltar algum. |
| `autoResizeInput(input)` | Mede o texto com um `<span>` invisível para ajustar `width` (mín. 250 px, máx. 60% da janela) e usa `scrollHeight` para ajustar `height` (mín. 60 px). Usada no `<textarea>` de resultado. | — |

Caracteres usados: `0123456789ABCDEFGHIJKLMNOPQRSTUV` (32 símbolos). Como `BigInt` é usado, não há limite prático de tamanho do número.

---

## `plano/plano.js`

### Constantes e estado

- Elementos: `canvas`, `ctx`, `coefA`, `coefB`, `coefC`, `btnAtualizar`, `btnZoomIn`, `btnZoomOut`, `btnReset` e os campos de resultado (`resFuncao`, `resDelta`, `resRaiz1`, `resRaiz2`, `resVertice`).
- `scale`: pixels por unidade (inicia em 40). Limites `MIN_SCALE = 10`, `MAX_SCALE = 120`, passo `SCALE_STEP = 10`.

### Sistema de coordenadas

A origem fica no centro do canvas (`cx = w/2`, `cy = h/2`):

- `px = cx + x * scale`
- `py = cy - y * scale` (o eixo y do canvas cresce para baixo, por isso o sinal negativo)

### Funções

| Função | O que faz |
|---|---|
| `setupCanvas()` | Suporte a telas de alta densidade: usa `devicePixelRatio` para dimensionar o buffer do canvas e aplica `ctx.scale(dpr, dpr)`. Chamada a cada redesenho. |
| `isDarkTheme()` | Retorna se `#wrapper` tem a classe `dark`. |
| `getThemeColors()` | Devolve as cores usadas no canvas (fundo, grade, eixos, textos, curva, brilho, vértice, raízes) conforme o tema. |
| `drawGrid()` | Desenha fundo, grade, eixos, números dos eixos, origem e as letras `x` e `y`. |
| `drawCurve(a, b, c)` | Amostra a função a cada 0,5 px de largura e traça a curva duas vezes: uma passada larga e translúcida (brilho) e outra fina (linha principal). Interrompe o traço quando `py` sai de `[-100, h + 100]`. |
| `drawPoint(x, y, color, label)` | Desenha um ponto (com halo) em coordenadas do plano, com rótulo opcional. Ignora pontos fora da área visível. O halo usa `color + '33'`, então espera cores em hexadecimal. |
| `formatNumber(n)` | Arredonda para 4 casas, remove zeros à direita; devolve `—` para `NaN`/infinito. |
| `buildFunctionString(a, b, c)` | Monta o texto `f(x) = ...` omitindo termos nulos e coeficientes `1`. |
| `calcularEAtualizar()` | Função central: lê os coeficientes, calcula, atualiza o painel e redesenha. |
| `changeThemePlano()` | Alterna `light`/`dark` em `#wrapper`, troca ícones, mostra o aviso no título e redesenha o canvas com as novas cores. |

### O que `calcularEAtualizar()` calcula

Coeficientes são lidos com `parseFloat(...) || 0` (campo vazio ou inválido vira `0`).

- Delta: `Δ = b² − 4ac`
- Vértice (apenas se `a ≠ 0`): `xv = −b / 2a`, `yv = −Δ / 4a`

| Caso | Delta | Raiz 1 / Raiz 2 | Vértice | Desenho |
|---|---|---|---|---|
| `a ≠ 0`, `Δ ≥ 0` | valor | duas raízes reais (iguais se `Δ = 0`; o segundo ponto não é desenhado se repetir o primeiro) | calculado | curva, vértice e raízes |
| `a ≠ 0`, `Δ < 0` | valor | raízes complexas em texto (`re + imi`, `re - imi`) | calculado | curva e vértice |
| `a = 0`, `b ≠ 0` (reta) | `—` | `−c/b` / `—` | `—` | curva e raiz |
| `a = 0`, `b = 0` | `—` | `—` / `—` | `—` | **nada além da grade** (ver bug 12) |

### Interações

- Zoom `+` / `−`: soma/subtrai `SCALE_STEP` dentro dos limites; `⟲` volta para 40.
- `input` nos três campos: atualização ao vivo. `Enter` nos campos também recalcula (redundante com o `input`).
- `resize` da janela: recalcula e redesenha.
- Clique em `#btn-atualizar`: recalcula (botão oculto, ver bug 25).
- Render inicial ao carregar o script.

---

## Sistema de temas

Existem **três** funções de tema, uma por tela. Todas alternam `light`/`dark` no wrapper, trocam ícones e mostram o nome do tema no título (`#toast`) por 1,5 s.

| Função | Arquivo | Wrapper | O que troca além da classe |
|---|---|---|---|
| `changeTheme()` | `script.js` | `.wrapper` | ícone de tema, GitHub e plano (`#plano-icon`) |
| `changeThemeConversor()` | `script.js` | `.wrapper` | ícone de tema, GitHub, calculadora (`#calculator`) e plano |
| `changeThemePlano()` | `plano.js` | `#wrapper` | ícone de tema, GitHub e calculadora; depois redesenha o canvas |

Pontos de atenção:

- Toda página **abre em escuro** (`class="wrapper dark"` fixo no HTML). A escolha **não é salva**: ao navegar entre telas, o tema volta ao escuro.
- `changeThemeConversor()` usa `calculator` como variável global implícita (elemento com `id="calculator"`) e um caminho fixo `../assets/...`.
- `changeThemePlano()` declara um `const caminho = '../'` local; o `caminho` global do `script.js` vale `""` na página do plano e só não causa problema porque o plano não usa as funções de tema do `script.js`.

---

## Bugs e pontos em aberto

### Itens históricos (numeração original)

1. **[Resolvido]** `evalParser`, `case '∛'`: sem `break`, caía no `case 'l'`. O caso foi removido.
2. **[Resolvido]** `evalParser`, `case 'e'`: usava atribuição (`=`) em vez de comparação e comparava com `'x'`. Corrigido no commit `5b02eed` ("Adição Plano Cartesiano"): agora `if (expr[i + 1] === '^')`, alinhado ao botão `eˣ`, que insere `e^(`.
3. **[Resolvido]** `evalParser`, `case 's'`: faltavam `i += 2` e `break`. Corrigido no mesmo commit `5b02eed`.
4. **[Regressão]** Seno, cosseno e tangente em **graus**. A conversão (`grausParaRadiano`) existe apenas em `calcularsen`, `calcularcos` e `calculartg`, que a UI não chama mais. Pelo fluxo atual (`botão → visor → calculate → evalParser`), `sen(90)` vira `Math.sin(90)`, ou seja, **radianos** (resultado ≈ 0.894, não 1). Decisão pendente: assumir radianos e documentar na interface, ou fazer o parser converter graus (por exemplo, mapeando `sen` para uma função própria que aplique `grausParaRadiano`).
5. **[Resolvido]** A mensagem de erro de `calculate()` foi generalizada para "Resultado inválido" (não distingue divisão por zero de overflow).
6. **[Em aberto]** Código sem uso na UI atual: `calcularExponencial`, `calcularLn`, `calcularLog`, `calcularRaiz`, `calcularRaizCubica`, `calcularsen`, `calcularcos`, `calculartg`, `grausParaRadiano` e `euler()`. Decidir entre remover ou reaproveitar (por exemplo, usar as validações de domínio e as mensagens específicas dentro do fluxo do `evalParser`). Nota: `evalParser` **deixou de ser código morto**; é chamada por `calculate()`.
7. **[Resolvido]** `keyboardInputHandler`: bloco `else if (e.key === "7")` duplicado, removido.
8. **[Resolvido]** `calculate()` usa `try/catch` para expressões mal formadas, exibindo `Erro`.
9. **[Em aberto]** **Notação científica.** Quando um resultado é muito grande ou pequeno, o JavaScript o exibe em notação científica (ex.: `1e+21`). Ao continuar a conta, o `evalParser` troca o `e` por `Math.E` (`1Math.E+21`), gerando erro de sintaxe.

   Passo a passo:
   1. Digite uma operação que gere um número enorme (ex.: `99999999999 * 99999999999`).
   2. Aperte `=` ou Enter. O visor mostrará algo como `9.9999999998e+21`.
   3. Tente somar `+1`.
   4. `calculate()` exibe `Erro`.

10. **[Em aberto]** **Código duplicado nos temas.** `changeTheme()` e `changeThemeConversor()` são quase idênticas e `changeThemePlano()` repete a ideia em outro arquivo. Unificar em uma função parametrizada.

### Calculadora

11. **[Em aberto]** **`keyboardInputHandler` global.** O `e.preventDefault()` roda para toda tecla que não esteja em um `<input>` editável. Consequências: bloqueia `Tab` (navegação por teclado) e pode bloquear atalhos do navegador (como `F5`/`Ctrl+R`); e, nas páginas do conversor e do plano, se o foco não estiver em um campo editável, as teclas tratadas acessam `res` (que é `null` nessas páginas) e geram `TypeError`/`ReferenceError` no console. Sugestões: chamar `preventDefault()` só nas teclas efetivamente tratadas; sair cedo se `res` não existir; remover `script.js` de `tela_plano.html`.
12. **[Em aberto]** **Zeros à esquerda viram octal.** Em modo não estrito, `eval` interpreta `010` como octal (valor 8). Digitar `0` e depois `1`, `0` pode produzir resultado inesperado. Tratar na entrada (`liveScreen`) ou no parser.
13. **[Em aberto]** **Limitações da sintaxe `eval`.** `-2**2` é erro de sintaxe em JavaScript (operador unário antes de `**`); multiplicação implícita (`2sen(30)`) não é suportada; `Backspace` apaga um caractere por vez, então apagar só o `(` de `sen(` deixa um token incompleto.
14. **[Em aberto]** **Precisão de ponto flutuante** exibida diretamente (ex.: `0.1 + 0.2` → `0.30000000000000004`). Considerar arredondar na exibição.
15. **[Em aberto]** **Uso de `eval`.** Hoje o risco é baixo porque o visor é somente leitura e a entrada é filtrada, mas `eval` continua sendo ponto sensível. Se o visor virar editável, será preciso substituir por um avaliador de expressões.
16. **[Em aberto]** **Constantes `e` e `π` inacessíveis.** O parser suporta, e o `README.md` cita "constantes e e π", mas não há botão nem tecla que os insira (`e` só aparece dentro de `e^(`). Adicionar botões ou ajustar o `README.md`.

### Conversor de bases

17. **[Em aberto]** **Números negativos inalcançáveis.** `paraDecimal` e `deDecimal` tratam o sinal `-`, mas `converterBase` rejeita `-` na validação de caracteres. Também não há suporte a números fracionários (`.`). Decidir: permitir o `-` na validação (apenas no início) ou remover o tratamento de sinal.
18. **[Em aberto]** **Validação das bases é permissiva.** `parseInt` aceita valores como `"16abc"` (vira 16) e `"2.5"` (vira 2). Além disso, o `minWidth` de 250 px em `autoResizeInput` é sobreposto pelo `min-width: 350px` do CSS.

### Plano cartesiano

19. **[Em aberto]** **Resquícios no projeto**: `index.html` mantém `id="theme"` no `<link>` do CSS; `lightTheme`/`darkTheme` em `script.js` apontam para arquivos inexistentes; `#calc-plano` em `style.css` não corresponde a nenhum elemento (o ícone do plano usa `#plano-icon`).
20. **[Em aberto]** **`index.html` sem `<body>` de abertura** (há `</body>` no final). O navegador corrige sozinho, mas o HTML é inválido.
21. **[Em aberto]** **Função constante não é desenhada.** Com `a = 0` e `b = 0`, a condição `if (a !== 0 || b !== 0)` impede o desenho de `f(x) = c`, mesmo com `c ≠ 0`.
22. **[Em aberto]** **Sinal incorreto em raízes complexas com `a < 0`.** `imagPart` herda o sinal de `2a`, gerando textos como `2 + -1i` e `2 - -1i`. Usar `Math.abs` na parte imaginária.
23. **[Em aberto]** **Formatação inconsistente em `buildFunctionString`.** Coeficientes negativos saem sem espaço (`x² -2x`, `x² -3`), enquanto `b = -1` sai como `- x`. Padronizar o formato (`x² - 2x - 3`).
24. **[Em aberto]** **Canvas pode não acompanhar o layout responsivo.** `setupCanvas()` grava `width`/`height` em pixels no `style` inline, o que tem prioridade sobre as regras de `plano.css` (`width: 100%`, `max-width: 500px`). Após o primeiro desenho, o canvas tende a manter o tamanho fixo ao redimensionar a janela (verificar rotacionando o celular ou reduzindo a janela).
25. **[Em aberto]** **UI sem uso**: `#btn-atualizar` (oculto e sem rótulo) e os estilos `.btn-atualizar`; classes `.caixa` e `.caixa-final` no HTML do conversor e `.cientifica` na calculadora não têm regras próprias no CSS.
26. **[Em aberto]** **Rótulos dos eixos sobrepostos** com zoom mínimo (10 px por unidade), pois um número é desenhado por unidade independentemente do espaçamento. Sugestão: pular rótulos conforme o zoom.
27. **[Em aberto]** **Comparações exatas com ponto flutuante.** `Δ >= 0` e `r2 !== r1` usam comparação exata; coeficientes decimais (passo 0.1) podem gerar `Δ` levemente negativo no lugar de `0`. Considerar uma tolerância (epsilon).

### Geral

28. **[Em aberto]** **Tema não persiste** entre páginas (todas abrem em escuro). Sugestão: salvar a escolha em `localStorage` e aplicá-la ao carregar.
29. **[Em aberto]** **Variáveis globais implícitas por `id`** (`result`, `calculator`, `calc`) funcionam por comportamento do navegador, mas são frágeis. Preferir `document.getElementById`.
30. **[Em aberto — verificado]** **Dois arquivos para o mesmo ícone da calculadora.** A suspeita de contraste não se confirmou: `calculator.ico.png` (36×36) e `calculator.icon.branco.png` (2048×2048) têm a mesma arte de base clara e ficam legíveis nos dois temas. O problema real é de organização: o nome `branco` sugere um ícone branco, mas é só a versão grande com fundo branco; a troca por tema não muda nada visualmente além da resolução; e os nomes misturam `ico` e `icon`. Sugestão: usar um único arquivo (ex.: 128×128 com transparência) e remover a troca em `changeThemeConversor()` e `changeThemePlano()`.
31. **[Em aberto]** **Ícones muito pesados para o tamanho de exibição.** `iconeConversorBases.png` (~1,3 MB), `Icon_do_plano_cartesiano_certo.png` (~616 KB) e `calculator.icon.branco.png` (~842 KB) aparecem em 25–35 px. Só a página inicial carrega ~1,9 MB de ícones logo na abertura. Redimensionar para 64–128 px (ou converter para SVG/WebP) reduz isso a poucos KB.
32. **[Em aberto]** **Previews do README desatualizados.** `preview_dark.jpg` e `preview_light.jpg` mostram o cabeçalho apenas com GitHub e botão de tema; a interface atual também tem os ícones do conversor e do plano cartesiano. Gerar novas capturas.
33. **[Em aberto]** **Favicon não verificado.** `assets/calculator.ico` é referenciado em todas as páginas, mas o arquivo não estava entre os assets enviados para conferência.
