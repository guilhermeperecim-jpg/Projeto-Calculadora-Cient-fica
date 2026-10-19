const caminho = /\/(conversor|plano)\//.test(window.location.pathname) ? "../" : "";
const lightTheme = `${caminho}styles/light.css`;
const darkTheme = `${caminho}styles/dark.css`;
const sunIcon = `${caminho}assets/SunIcon.svg`;
const moonIcon = `${caminho}assets/MoonIcon.svg`;
const githubLight = `${caminho}assets/GitHubLight.svg`;
const githubDark = `${caminho}assets/GitHubDark.svg`;
const planoIconDark = `${caminho}assets/Icon_do_plano_cartesiano_certo.png`;
const planoIconLight = `${caminho}assets/plano_cartesiano_icone.png`;
const calculatorIconDark = `${caminho}assets/calculator.ico.png`;
const calculatorIconLight = `${caminho}assets/calculator.icon.branco.png`;
const themeIcon = document.getElementById("theme-icon");
const githubIcon = document.getElementById("github-icon");
const planoIcon = document.getElementById("plano-icon");
const calculatorIcon = document.getElementById("calculator");
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
    res.value = calculatedValue;
    res.scrollLeft = 0;
    return 0;
  }
}

// Converte graus em radianos. Nenhum código a chama hoje: foi mantida de
// propósito para a decisão pendente do bug 4 (sen/cos/tan em graus).
function grausParaRadiano(graus) {
  return graus * Math.PI / 180;
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

// Alterna entre modo escuro e claro. Usada pelas três telas: os elementos
// que não existem na página (ex.: #plano-icon no plano) são simplesmente ignorados.
// Ao final dispara o evento "themechange" (o plano.js o usa para redesenhar o canvas).
function changeTheme() {
  const theme = document.querySelector(".wrapper");
  const indoParaEscuro = theme.classList.contains("light");

  themeIcon.setAttribute("src", indoParaEscuro ? sunIcon : moonIcon);
  githubIcon.setAttribute("src", indoParaEscuro ? githubLight : githubDark);
  if (calculatorIcon) calculatorIcon.setAttribute("src", indoParaEscuro ? calculatorIconDark : calculatorIconLight);
  if (planoIcon) planoIcon.setAttribute("src", indoParaEscuro ? planoIconDark : planoIconLight);

  theme.classList.toggle("light");
  theme.classList.toggle("dark");

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
  // para corrigir o comportamento padrão do navegador,

  /*
  As teclas Enter e Backspace estavam causando comportamento 
  indesejado quando algum elemento já estava em foco.. 
  */
  //e.preventDefault();
  //pegando a livescreen

  //Para input funcionar também no conversor de bases
  //Se o alvo for input editável (não readonly), o navegador cuida da digitação
  if (e.target.tagName === "INPUT" && !e.target.readOnly) {
    return;
  }

  e.preventDefault();


  // Números
  if (e.key === "0") {
    res.value += "0";
  } else if (e.key === "1") {
    res.value += "1";
  } else if (e.key === "2") {
    res.value += "2";
  } else if (e.key === "3") {
    res.value += "3";
  } else if (e.key === "4") {
    res.value += "4";
  } else if (e.key === "5") {
    res.value += "5";
  } else if (e.key === "6") {
    res.value += "6";
  } else if (e.key === "7") {
    res.value += "7";
  } else if (e.key === "8") {
    res.value += "8";
  } else if (e.key === "9") {
    res.value += "9";
  }

  // Operadores
  if (e.key === "+") {
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

  // Ponto decimal
  if (e.key === ".") {
    res.value += ".";
  }

  if (e.key === "(") {
    res.value += "(";
  }
  else if (e.key === ")") {
    res.value += ")";
  }

  // Enter para calcular o resultado
  if (e.key === "Enter") {
    calculate(result.value);
  }

  // Backspace para apagar o último caractere
  if (e.key === "Backspace") {
    const resultInput = res.value;

    res.value = resultInput.substring(0, res.value.length - 1);
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
        parsedExpr += "Math.sin";
        i += 2;
        break;

      case 'c':
        toks.push({pos: parsedExpr.length, T: "_func_"});
        parsedExpr += "Math.cos";
        i += 2;
        break;

      case 't':
        toks.push({pos: parsedExpr.length, T: "_func_"});
        parsedExpr += "Math.tan";
        i += 2;
        break;

      default: // socorro
        if (isDigit(expr[i])){
          const temp = parsedExpr.length;

          while(isDigit(expr[i]))
            parsedExpr += expr[i++];

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

function mudarModo() {
  calc.classList.toggle('expandida');
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
  const todosCaracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
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
  const baseE = parseInt(baseEntrada, 10);
  const baseS = parseInt(baseSaida, 10);
  let erro = "";
  let result = "";

  if (isNaN(baseE) || isNaN(baseS) || baseE < 2 || baseE > 32 || baseS < 2 || baseS > 32) {
    erro = "Erro: As bases devem estar entre 2 e 32.";
  }

  if (!erro) {
    const todosCaracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
    const caracteresValidos = todosCaracteres.substring(0, baseE);

    for (let i = 0; i < num.length; i++) {
      if (caracteresValidos.indexOf(num[i]) === -1) {
        erro = `Erro: O caractere '${num[i]}' é inválido para a base ${baseE}. Caracteres permitidos: ${caracteresValidos}`;
        break;
      }
    }
  }

  if (!erro) {
    const dec = paraDecimal(num, baseE);
    result = deDecimal(dec, baseS);
  }

  return { erro, result };
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
