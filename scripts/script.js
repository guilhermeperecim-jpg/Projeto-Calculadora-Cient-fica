const caminho = /\/(conversor|plano)\//.test(window.location.pathname) ? "../" : "";
const lightTheme = `${caminho}styles/light.css`;
const darkTheme = `${caminho}styles/dark.css`;
const sunIcon = `${caminho}assets/SunIcon.svg`;
const moonIcon = `${caminho}assets/MoonIcon.svg`;
const githubLight = `${caminho}assets/GitHubLight.svg`;
const githubDark = `${caminho}assets/GitHubDark.svg`;
const planoIconDark = `${caminho}assets/Icon_do_plano_cartesiano_certo.png`;
const planoIconLight = `${caminho}assets/plano_cartesiano_icone.png`;
const themeIcon = document.getElementById("theme-icon");
const githubIcon = document.getElementById("github-icon");
const planoIcon = document.getElementById("plano-icon");
const res = document.getElementById("result");
const toast = document.getElementById("toast");
// Título original da página: volta para ele depois do aviso de troca de tema
const tituloOriginal = toast ? toast.textContent.trim() : "";
let toastTimer = null;

// Avalia uma expressão simples, verifica se resulta em NaN
function calculate(value) {
  let calculatedValue;
  try {
    calculatedValue = eval(evalParser(value) || null);
  } catch {
    res.value = "Erro";
    setTimeout(() => {
      res.value = "";
    }, 1300);
    return -1;
  }

  if (!Number.isFinite(calculatedValue)) {
    res.value = "Resultado inválido";
    setTimeout(() => {
      res.value = "";
    }, 1300);
    return -1;
  } else {
    res.value = calculatedValue.toFixed(2);
    res.scrollLeft = 0;
    return 0;
  }
}

// Converte graus em radianos.
// Funções que recebem ângulo em graus e retornam seno, cosseno e tangente.
function grausParaRadiano(graus) {
  return graus * Math.PI / 180;
}

function sinDeg(x) {
  return Math.sin(grausParaRadiano(x));
}

function cosDeg(x) {
  return Math.cos(grausParaRadiano(x));
}

function tanDeg(x) {
  return Math.tan(grausParaRadiano(x));
}

// Calcula o fatorial de um inteiro >= 0
function fatorial(n) {
  if (!Number.isInteger(n) || n < 0) return NaN;

  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

// Aplica o tema claro ou escuro e guarda a escolha para as outras telas.
// Os elementos que não existem na página (ex.: #plano-icon no plano) são ignorados.
function aplicarTema(claro) {
  const theme = document.querySelector(".wrapper");
  theme.classList.toggle("light", claro);
  theme.classList.toggle("dark", !claro);
  themeIcon.setAttribute("src", claro ? moonIcon : sunIcon);
  githubIcon.setAttribute("src", claro ? githubDark : githubLight);
  if (planoIcon) planoIcon.setAttribute("src", claro ? planoIconLight : planoIconDark);
  try { localStorage.setItem("tema", claro ? "light" : "dark"); } catch {} // localStorage pode estar bloqueado
}

// Abre a página no último tema escolhido (todas as telas começam em escuro no HTML),
// com as transições desligadas para a tela não animar de escuro para claro ao abrir.
let temaSalvo = null;
try { temaSalvo = localStorage.getItem("tema"); } catch {}
if (temaSalvo === "light") {
  const semTransicao = document.head.appendChild(document.createElement("style"));
  semTransicao.textContent = "* { transition: none !important; }";
  aplicarTema(true);
  document.body.offsetHeight; // força o navegador a aplicar o tema antes de religar as transições
  semTransicao.remove();
}

// Alterna entre modo escuro e claro. Usada pelas três telas.
// Ao final dispara o evento "themechange" (o plano.js o usa para redesenhar o canvas).
function changeTheme() {
  const indoParaEscuro = document.querySelector(".wrapper").classList.contains("light");
  aplicarTema(!indoParaEscuro);

  toast.innerHTML = indoParaEscuro ? "Modo Escuro 🌙" : "Modo Claro ☀️";
  toast.classList.add("toast-active");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.innerHTML = tituloOriginal;
    toast.classList.remove("toast-active");
  }, 1500);

  document.dispatchEvent(new CustomEvent("themechange"));
}

// Função para atualizar a tela de resultados com o valor digitado.
function liveScreen(enteredValue) {
  const inputEmpty = !res.value;

  if (inputEmpty) {
    res.value = "";
  }

  res.value += enteredValue;

  // Faz o visor acompanhar o último caractere digitado
  res.scrollLeft = res.scrollWidth;
}

// Adiciona um ouvinte de evento para capturar as entradas do teclado.
document.addEventListener("keydown", keyboardInputHandler);

// Função para lidar com as entradas do teclado.
function keyboardInputHandler(e) {
  // Bug 11 — sai imediatamente se a página não tem o visor da calculadora
  // (conversor e plano não têm #result, então res é null nessas páginas).
  if (!res) return;

  // Se o alvo for input editável (não readonly), o navegador cuida da digitação
  // (necessário para os campos do conversor e do plano).
  if (e.target.tagName === "INPUT" && !e.target.readOnly) {
    return;
  }

  // Bug 11 — as teclas tratadas explicitamente são listadas aqui.
  // Só chamamos preventDefault() para elas, preservando Tab, F5, Ctrl+R etc.
  const teclasHandled = new Set([
    "0","1","2","3","4","5","6","7","8","9",
    "+","-","*","/","^","!",".","(",")",
    "Enter","Backspace"
  ]);

  if (!teclasHandled.has(e.key)) return;

  // Atalhos com Ctrl/Alt/Cmd (ex.: Ctrl+- e Ctrl+0 do zoom) ficam com o navegador.
  // AltGr conta como Ctrl+Alt no Windows, mas digita caracteres (ex.: AltGr+Q = "/" no ABNT2).
  if ((e.ctrlKey || e.metaKey || e.altKey) && !e.getModifierState("AltGraph")) return;

  e.preventDefault();

  // Números
  if (e.key >= "0" && e.key <= "9") {
    res.value += e.key;
  }

  // Operadores
  else if (e.key === "+") {
    res.value += "+";
  } else if (e.key === "-") {
    res.value += "-";
  } else if (e.key === "*") {
    res.value += "*";
  } else if (e.key === "/") {
    res.value += "/";
  } else if (e.key === "^") {
    res.value += "**";
  } else if (e.key === "!") {
    res.value += "!";
  }

  // Ponto decimal e parênteses
  else if (e.key === ".") {
    res.value += ".";
  } else if (e.key === "(") {
    res.value += "(";
  } else if (e.key === ")") {
    res.value += ")";
  }

  // Enter para calcular o resultado
  else if (e.key === "Enter") {
    calculate(res.value);
  }

  // Backspace para apagar o último caractere
  else if (e.key === "Backspace") {
    res.value = res.value.substring(0, res.value.length - 1);
  }

  // Mantém o visor mostrando o final da expressão
  res.scrollLeft = res.scrollWidth;
}



/* 
substitui sinais e certos padrões na
expressão de entrada, por exemplo: 
log( -> Math.log10(
*/
function evalParser(expr) {
  let parsedExpr = "";
  let toks = [];
  toks.push({pos: null, T: ""});

  for (let i = 0; i < expr.length; i++){

    switch (expr[i]) {

      case '√':
        toks.push({pos: parsedExpr.length, T: "_func_"});
        parsedExpr += "Math.sqrt";
        break;

      case 'l':
        if (expr[i + 1] === 'o') {
          toks.push({pos: parsedExpr.length, T: "_func_"});
          parsedExpr += "Math.log10";
          i += 2;
        }
        else {
          toks.push({pos: parsedExpr.length, T: "_func_"});
          parsedExpr += "Math.log";
          i++;
        }

        break;

      case 'e':
        if (expr[i + 1] === '^') {
          toks.push({pos: parsedExpr.length, T: "_func_"});
          parsedExpr += "Math.exp";
          i++;
        }
        else if (isExponenteCientifico(expr, i)) {
          parsedExpr += "e"; // notação científica (ex.: 1e+21): mantém como está
        }
        else {
          parsedExpr += "Math.E"; // <-- não tem botão
        }
        break;

      case 'π':
        parsedExpr += "Math.PI";
        break;

      case 's':
        toks.push({pos: parsedExpr.length, T: "_func_"});
        parsedExpr += "sinDeg";
        i += 2;
        break;

      case 'c':
        toks.push({pos: parsedExpr.length, T: "_func_"});
        parsedExpr += "cosDeg";
        i += 2;
        break;

      case 't':
        toks.push({pos: parsedExpr.length, T: "_func_"});
        parsedExpr += "tanDeg";
        i += 2;
        break;

      default: // socorro
        if (isDigit(expr[i]) || expr[i] === "."){
          const temp = parsedExpr.length;
          // Bug 12 — lê o número inteiro (dígitos e ponto) numa variável auxiliar
          // e remove zeros à esquerda da parte inteira antes de concatenar na
          // expressão JS, evitando que "010" seja interpretado como octal pelo eval.
          // O ponto entra junto para "0.05" não virar "0.5" e "3.5!" virar fatorial(3.5).
          let numero = "";
          while(isDigit(expr[i]) || expr[i] === ".")
            numero += expr[i++];
          parsedExpr += stripLeadingZeros(numero);

          if (expr[i] === "!"){
            parsedExpr += ")";
            parsedExpr = insertFactorial(parsedExpr, temp);
          }
          else i--;
        }

        else if (expr[i] === "("){
          const tok = toks[toks.length - 1];

          if (tok.T === "_func_"){
            toks.push({pos: null, T: "_f_start_"});
          }
          else{
            toks.push({pos: parsedExpr.length, T: "_parenthesis_"});
          }

          parsedExpr += expr[i];
        }

        else if(expr[i] === ")"){
          if (toks[toks.length - 1].T === "_f_start_")
            toks.pop();

          if (expr[i + 1] === "!"){
            parsedExpr += expr[i] + ")";
            const temp = toks.pop()
            parsedExpr = insertFactorial(parsedExpr, temp.pos);
            i++;
          }
          else{
            toks.pop();
            parsedExpr += expr[i];
          }
        }

        else
          parsedExpr += expr[i]; // se der merda apaga tudo e
                                 // deixa só isso aqui no default
    }
  }

  // Converte "5!" em "fatorial(5)". Fica depois do loop porque o 't' de "fatorial" seria interpretado como tangente. 
  //return parsedExpr.replace(/(\d+(?:\.\d+)?)!/g, "fatorial($1)");
  // se der merda descomenta o código acima
  return parsedExpr;
}

function insertFactorial(expr, offset) {
  expr = expr.slice(0, offset) + "fatorial(" + expr.slice(offset, expr.length);

  return expr;
}

// Diz se o "e" na posição i faz parte de um número em notação científica
// (ex.: 1e+21, 2.5e-7): vem logo depois de um dígito ou ponto e é seguido
// de um dígito, ou de um sinal e um dígito.
function isExponenteCientifico(expr, i) {
  const anterior = expr[i - 1];
  const proximo = expr[i + 1];

  if (!(isDigit(anterior) || anterior === ".")) return false;

  return isDigit(proximo) ||
    ((proximo === "+" || proximo === "-") && isDigit(expr[i + 2]));
}

function isDigit(caracter){
  if (caracter >= "0" && caracter <= "9")
    return true;
  else
    return false;
}

// Bug 12 — remove os zeros à esquerda da parte inteira para que o eval não
// interprete o literal como octal ("010" → "10", "0" → "0", "0.05" → "0.05").
function stripLeadingZeros(numero) {
  return numero.replace(/^0+(?=\d)/, "");
}

function mudarModo() {
  document.getElementById("calc").classList.toggle('expandida');
}

function paraDecimal(num, baseE) {
  let dec = 0n;
  const base = BigInt(baseE);
  let str = String(num).trim();
  let isNegative = false;
  if (str.startsWith("-")) {
    isNegative = true;
    str = str.slice(1);
  }
  for (let i = 0; i < str.length; i++) {
    const caracter = str[i];
    let valor;
    if (isDigit(caracter)) {
      valor = BigInt(caracter);
    } else {
      valor = BigInt(caracter.toUpperCase().charCodeAt(0) - 55);
    }
    dec = dec * base + valor;
  }
  return isNegative ? -dec : dec;
}

function deDecimal(dec, baseS) {
  let d = BigInt(dec);
  if (d === 0n) return "0";
  const todosCaracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const base = BigInt(baseS);
  let result = "";
  const isNegative = d < 0n;
  if (isNegative) d = -d;

  while (d > 0n) {
    const resto = d % base;
    result = todosCaracteres[Number(resto)] + result;
    d = d / base;
  }
  return isNegative ? "-" + result : result;
}

function converterBase(numero, baseEntrada, baseSaida) {
  const num = String(numero).trim().toUpperCase();
  const baseEStr = String(baseEntrada).trim();
  const baseSStr = String(baseSaida).trim();
  let erro = "";
  let result = "";

  const apenasInteiros = /^\d+$/;

  if (!apenasInteiros.test(baseEStr) || !apenasInteiros.test(baseSStr)) {
    erro = "Erro: As bases devem ser números inteiros.";
  }

  const baseE = parseInt(baseEStr, 10);
  const baseS = parseInt(baseSStr, 10);

  if (!erro && (baseE < 2 || baseE > 36 || baseS < 2 || baseS > 36)) {
    erro = "Erro: As bases devem estar entre 2 e 36.";
  }

  if (!erro) {
    const todosCaracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const caracteresValidos = todosCaracteres.substring(0, baseE);

    const negativo = num.startsWith("-");
    const numSemSinal = negativo ? num.slice(1) : num;

    if (numSemSinal.length === 0) {
      erro = "Erro: Informe um número.";
    } else if (numSemSinal.includes(".") || numSemSinal.includes(",")) {
      erro = "Erro: Números fracionários não são suportados. Informe apenas números inteiros.";
    }

    if (!erro) {
      for (let i = 0; i < numSemSinal.length; i++) {
        if (caracteresValidos.indexOf(numSemSinal[i]) === -1) {
          erro = `Erro: O caractere '${numSemSinal[i]}' é inválido para a base ${baseE}. Caracteres permitidos: ${caracteresValidos}`;
          break;
        }
      }
    }
  }

  if (!erro) {
    const dec = paraDecimal(num, baseE);
    result = deDecimal(dec, baseS);
  }

  return {erro, result};
}

function calculateBase() {
  const numeroInput = document.getElementById("num-convert");
  const baseEntradaInput = document.getElementById("base-entrada");
  const baseSaidaInput = document.getElementById("base-saida");
  const resultInput = document.getElementById("result-bases");

  const numero = numeroInput.value;
  const baseEntrada = baseEntradaInput.value;
  const baseSaida = baseSaidaInput.value;

  if (!numero || !baseEntrada || !baseSaida) {
    resultInput.value = "Preencha todos os campos";
    autoResizeInput(resultInput);
    return;
  }

  const { erro, result } = converterBase(numero, baseEntrada, baseSaida);

  if (erro) {
    resultInput.value = erro;
  } else {
    resultInput.value = result;
  }
  autoResizeInput(resultInput);
}

// Redimensiona o textarea de resultado com base no tamanho do texto
function autoResizeInput(input) {
  // --- Largura ---
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.whiteSpace = "nowrap";

  const style = window.getComputedStyle(input);
  span.style.font = style.font;
  span.style.fontSize = style.fontSize;
  span.style.fontFamily = style.fontFamily;
  span.style.letterSpacing = style.letterSpacing;
  span.style.padding = style.padding;

  span.textContent = input.value || input.placeholder;
  document.body.appendChild(span);

  const minWidth = 250;
  const maxWidth = window.innerWidth * 0.6;
  const newWidth = Math.min(Math.max(span.offsetWidth + 10, minWidth), maxWidth);
  input.style.width = newWidth + "px";
  document.body.removeChild(span);

  // --- Altura (auto-grow com scrollHeight) ---
  input.style.height = "auto";
  const minHeight = 60;
  const newHeight = Math.max(input.scrollHeight, minHeight);
  input.style.height = newHeight + "px";
}
