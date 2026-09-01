# Documentação — Calculadora Científica

Documentação técnica do projeto (fork de `zxcodes/Calculator`), calculadora com modo claro/escuro e funções científicas básicas.

## Estrutura de arquivos

```
├── index.html          # Estrutura da página e botões
├── assets/
│   ├── calculator.ico
│   ├── GitHubLight.svg
│   ├── GitHubDark.svg  # presente no projeto, mas não referenciado no HTML
│   ├── SunIcon.svg
│   └── MoonIcon.svg
├── styles/
│   ├── light.css
│   └── dark.css
└── scripts/
    └── script.js
```

## `index.html`

Estrutura principal:
- `#result`: campo de texto somente leitura que funciona como visor.
- `#clear-button`: limpa `#result` diretamente via `onclick="result.value=''"` (sem passar por função JS).
- `.button-grid`: grid 4 colunas com os botões numéricos, operadores (`+ - * / ^`) e científicos (`√`, `eˣ`, `log`, `ln`).
- `#igual`: botão `=`, chama `calculate(result.value)`.
- `#theme-icon` / `.theme-button`: alterna tema via `changeTheme()`.
- `link#theme`: `<link>` de CSS cujo `href` é trocado entre `styles/light.css` e `styles/dark.css`.

**Observação:** os botões científicos chamam as funções diretamente sobre o valor atual do campo (ex.: `calcularRaiz(result.value)`), e não inserem símbolos (`√`, `∛`) no texto do visor. Por isso `evalParser` nunca é acionado por essa UI.

## `styles/light.css` e `styles/dark.css`

Dois temas com a mesma estrutura de classes, valores de cor diferentes:

| Elemento | Light | Dark |
|---|---|---|
| `.wrapper` (fundo) | azul claro `rgb(125,205,230)` | quase preto `rgb(20,19,19)` |
| `input` (botões) | branco, texto cinza | cinza escuro `rgb(47,51,50)`, texto branco |
| `#clear-button` | azul `rgb(25,105,255)` | vermelho `rgb(255,42,42)` |
| `#igual` | azul-marinho | laranja (`orangered`) |

Ambos usam `.button-grid` (grid 4 colunas) e `.header-container`/`.top-buttons` para o cabeçalho com título, ícone do GitHub e botão de tema.

## `scripts/script.js`

### Estado / referências globais
- `res`: referência ao `#result`.
- `themeIcon`, `toast`: usados por `changeTheme()`.
- `lightTheme`, `darkTheme`, `sunIcon`, `moonIcon`: caminhos usados na troca de tema.

### Funções de cálculo

| Função | O que faz | Tratamento de erro |
|---|---|---|
| `calculate(value)` | Faz `eval(value)` e escreve o resultado em `res.value`. Retorna `0` (sucesso) ou `-1` (erro). | Só trata `!Number.isFinite(...)` (ex.: divisão por zero). **Não trata erro de sintaxe** — expressão inválida lança exceção não capturada. |
| `calcularExponencial(value)` | Calcula `e^value` via `Math.exp`. | Depende de `calculate` ter retornado sucesso antes. |
| `calcularLn(value)` | Log natural. | Trata `<= 0` com mensagem customizada. |
| `calcularLog(value)` | Log base 10. | Trata `<= 0` com mensagem customizada. |
| `calcularRaiz(value)` | Raiz quadrada. | Trata negativo com mensagem customizada. |
| `calcularRaizCubica(value)` | Raiz cúbica (`Math.cbrt`). | **Não é usada por nenhum botão no HTML atual.** |

Todas essas funções seguem o mesmo padrão: chamam `calculate(value)` primeiro para resolver a expressão bruta, e só então aplicam a operação científica sobre o resultado numérico.

### `changeTheme()`
Alterna `href` do `<link id="theme">` entre light/dark, troca o ícone do tema (sol/lua) e atualiza o texto do `<h1 id="toast">` como notificação temporária.

### `liveScreen(enteredValue)`
Concatena o valor digitado ao `res.value`. Usada pelos botões numéricos e de operadores.

### `keyboardInputHandler(e)`
Permite digitar números, operadores (`+ - * / ^`→`**`), ponto decimal e parênteses via teclado; `Enter` chama `calculate`, `Backspace` apaga o último caractere. `e.preventDefault()` é chamado incondicionalmente no topo da função, para toda tecla.

### `evalParser(expr)`
Função utilitária destinada a converter símbolos (`√`, `∛`, `l`→log/ln, `e`→exp) em chamadas `Math.*` dentro de uma string de expressão. **Não é chamada em nenhum outro lugar do código atual** — é código morto na versão presente do projeto.

## Bugs e pontos em aberto (para tratar antes de documentar como comportamento esperado)

1. `evalParser`: `case '∛':` sem `break`, cai no `case 'l':` (fallthrough indevido).
2. `evalParser` e `calcularRaizCubica`: não conectados a nenhum fluxo de UI — decidir se serão usados ou removidos.
3. `calculate()`: sem `try/catch` em torno do `eval` — expressão malformada quebra a execução sem feedback ao usuário.
4. `keyboardInputHandler`: bloco `else if (e.key === "7")` duplicado.
5. Ícone do GitHub fixo em `GitHubLight.svg` independente do tema ativo; `GitHubDark.svg` não é referenciado.
6. `alt="Sun Icon"` fixo na tag do ícone de tema, mesmo quando o ícone exibido é a lua.