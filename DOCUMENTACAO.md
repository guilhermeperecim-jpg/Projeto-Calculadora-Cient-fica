# Documentação — Calculadora Científica

Documentação técnica do projeto (fork de `zxcodes/Calculator`), calculadora com modo claro/escuro, painel de funções científicas expansível e suporte a entrada via teclado.

## Estrutura de arquivos

```
├── index.html          # Estrutura da página e botões
├── DOCUMENTACAO.md      # Este arquivo
├── README.md
├── assets/
│   ├── calculator.ico
│   ├── GitHubLight.svg
│   ├── GitHubDark.svg  # agora referenciado (troca por tema, ver changeTheme())
│   ├── SunIcon.svg
│   ├── MoonIcon.svg
│   ├── preview_dark.jpg
│   └── preview_light.jpg
├── styles/
│   ├── light.css
│   └── dark.css
└── scripts/
    └── script.js
```

## `index.html`

Estrutura principal:
- `#result`: campo de texto somente leitura que funciona como visor.
- `#clear-button`: agora é um `<button>` (antes era `<input type="button">`), limpa `#result` diretamente via `onclick="result.value=''"` (sem passar por função JS).
- `.toggle` (`onclick="mudarModo()"`): mostra/esconde o painel de funções científicas.
- `.botoes-cientificos`: painel com `sen`, `cos`, `tg`, `√`, `^`, `eˣ`, `log`, `ln`, `(`, `)`.
- `.botoes-basicos`: dígitos, operadores (`+ - * /`) e `=`.
- `.igual` (`onclick="calculate(result.value)"`).
- `#theme-icon` / `.theme-button`: alterna tema via `changeTheme()`.
- `#github-icon`: agora troca de imagem junto com o tema (ver `changeTheme()`), não fica mais fixo em `GitHubLight.svg`.
- `link#theme`: `<link>` de CSS cujo `href` é trocado entre `styles/light.css` e `styles/dark.css`.

**Observação:** os botões científicos chamam as funções diretamente sobre o valor atual do campo (ex.: `calcularsen(result.value)`), e não inserem símbolos (`√`, `∛`, `s`) no texto do visor. Por isso `evalParser` continua sem ser acionado por essa UI.

## `styles/light.css` e `styles/dark.css`

Reestruturado para o layout com painel expansível:
- `.calculadora` / `.botoes-container`: organizam o painel científico ao lado do teclado básico.
- `.botoes-cientificos`: escondido por padrão (`max-width: 0; opacity: 0`), expande via classe `.expandida` (adicionada/removida por `mudarModo()`), com transição animada.
- `.toggle`: botão que abre/fecha o painel (vermelho escuro no dark, verde no light).
- Fonte de título mudou para `Orbitron` (import adicionado no `<head>` do `index.html`).

| Elemento | Light | Dark |
|---|---|---|
| `.wrapper` (fundo) | verde-água claro `rgb(200,235,220)` | quase preto `rgb(20,19,19)` |
| botões | claro, texto escuro | escuro `rgb(47,51,50)`, texto branco |
| `#clear-button` | vermelho `rgb(220,70,60)` | vermelho `rgb(255,42,42)` |
| `.igual` | verde `rgb(16,135,90)` | laranja (`orangered`) |
| `.toggle` | verde `rgb(16,135,90)` | vermelho escuro `rgb(82,4,4)` |

## `scripts/script.js`

### Estado / referências globais
- `res`: referência ao `#result`.
- `themeIcon`, `toast`: usados por `changeTheme()`.
- `githubIcon`: **novo** — referência ao ícone do GitHub, trocado por tema.
- `lightTheme`, `darkTheme`, `sunIcon`, `moonIcon`, `githubLight`, `githubDark`: caminhos usados na troca de tema.

### Funções de cálculo

| Função | O que faz | Tratamento de erro |
|---|---|---|
| `calculate(value)` | Faz `eval(value)` e escreve o resultado em `res.value`. Retorna `0` (sucesso) ou `-1` (erro). | Trata `!Number.isFinite(...)` mostrando "Resultado inválido". Essa mensagem é intencionalmente genérica: cobre tanto divisão por zero quanto overflow numérico sem distinguir os dois casos — ver decisão registrada no item 5 da seção de bugs. Não trata erro de sintaxe (expressão inválida lança exceção não capturada). |
| `calcularExponencial(value)` | Calcula `eˣ` via `Math.exp`. | Trata `Infinity` mostrando "Infinito" como resultado válido — diferente de `calculate()`, que trataria o mesmo `Infinity` como "Resultado inválido" se aparecesse ali. |
| `calcularLn(value)` | Log natural. | Trata `<= 0` com mensagem customizada. |
| `calcularLog(value)` | Log base 10. | Trata `<= 0` com mensagem customizada. |
| `calcularRaiz(value)` | Raiz quadrada. | Trata negativo com mensagem customizada. |
| `calcularRaizCubica(value)` | Raiz cúbica (`Math.cbrt`). | Não é usada por nenhum botão no HTML atual. Código órfão. |
| `calcularsen(value)` | Seno. Recebe o valor em **graus**, converte para radianos via `grausParaRadiano` antes de aplicar `Math.sin`. | Nenhum. |
| `calcularcos(value)` | Cosseno. Recebe o valor em **graus**, converte para radianos via `grausParaRadiano` antes de aplicar `Math.cos`. | Nenhum. |
| `calculartg(value)` | Tangente. Recebe o valor em **graus**, converte para radianos via `grausParaRadiano` antes de aplicar `Math.tan`. | Nenhum. |
| `grausParaRadiano(graus)` | Recebe um ângulo em graus e devolve o valor equivalente em radianos (`graus * Math.PI / 180`). Usada por `calcularsen`, `calcularcos` e `calculartg`. | — |
| `euler()` | Concatena o caractere `'e'` no visor. | Não é usada por nenhum botão no HTML atual. Código órfão. |

Todas as funções de cálculo científico seguem o mesmo padrão: chamam `calculate(value)` primeiro para resolver a expressão bruta, e só então aplicam a operação científica sobre o resultado numérico.

### `changeTheme()`
Alterna `href` do `<link id="theme">` entre light/dark, troca o ícone do tema (sol/lua), **agora também troca o ícone do GitHub** (`githubLight`/`githubDark`), e atualiza o texto do `<h1 id="toast">` como notificação temporária.

### `mudarModo()` *(novo)*
Alterna a classe `expandida` no elemento `#calc`, mostrando ou escondendo o painel de funções científicas via CSS.

### `liveScreen(enteredValue)`
Concatena o valor digitado ao `res.value`. Usada pelos botões numéricos e de operadores.

### `keyboardInputHandler(e)`
Permite digitar números, operadores (`+ - * / ^`→`**`), ponto decimal e parênteses via teclado; `Enter` chama `calculate`, `Backspace` apaga o último caractere. `e.preventDefault()` é chamado incondicionalmente no topo da função, para toda tecla.

### `evalParser(expr)`
Função utilitária destinada a converter símbolos (`√`, `∛`, `l`→log/ln, `e`/`eˣ`→exp/Euler, `s`→sen) em chamadas `Math.*` dentro de uma string de expressão. **Ainda não é chamada em nenhum outro lugar do código atual** — continua código morto.

## Bugs e pontos em aberto (para tratar antes de documentar como comportamento esperado)

1. `evalParser`, `case '∛'`: sem `break`, cai no `case 'l'` (fallthrough indevido) — bug antigo, ainda presente.
2. `evalParser`, `case 'e'`: `if (expr[i + 1] = 'ˣ')` usa atribuição (`=`) em vez de comparação — condição sempre verdadeira.
3. `evalParser`, `case 's'`: sem `break`, cai no `default` e duplica conteúdo.
4. **[Resolvido]** As funções `calcularsen`, `calcularcos` e `calculartg` agora convertem graus → radianos usando a função auxiliar `grausParaRadiano(graus)`, criada para trocar a unidade de medida uma única vez e facilitar manutenção, refatoração e legibilidade do código. Optamos por trabalhar em graus porque é como a maioria dos usuários lida com ângulos, mas convertemos para radianos internamente porque é isso que `Math.sin`/`Math.cos`/`Math.tan` exigem nativamente.
5. **[Resolvido]** A mensagem de erro em `calculate()` foi generalizada para "Resultado inválido", pois dessa forma não é necessário distinguir divisão por zero de overflow numérico.
6. `evalParser`, `calcularRaizCubica` e `euler()`: não conectados a nenhum fluxo de UI — decidir se serão usados ou removidos.
7. `keyboardInputHandler`: bloco `else if (e.key === "7")` duplicado.
8. `calculate()`: sem `try/catch` em torno do `eval` — expressão malformada quebra a execução sem feedback ao usuário.
