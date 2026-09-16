const caminho = window.location.pathname.includes("/conversor/") ? "../" : "";
const lightTheme = `${caminho}styles/light.css`;
const darkTheme = `${caminho}styles/dark.css`;
const sunIcon = `${caminho}assets/SunIcon.svg`;
const moonIcon = `${caminho}assets/MoonIcon.svg`;
const githubLight = `${caminho}assets/GitHubLight.svg`;
const githubDark = `${caminho}assets/GitHubDark.svg`;
const themeIcon = document.getElementById("theme-icon");
const githubIcon = document.getElementById("github-icon");
const res = document.getElementById("result");
const toast = document.getElementById("toast");

// Avalia uma expressão simples, verifica se resulta em NaN
function calculate(value) {
  let calculatedValue;
  try {
    calculatedValue = eval(value || null);
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
    return -1; // error: resultado não numérico ou infinito
  } else {
    res.value = calculatedValue;
    return 0; // sucess
  }
}

// Calcula a potência x da base natural
function calcularExponencial(value) {

  if (calculate(value) === -1) {
    return;
  }

  const exponencial = Math.exp(res.value);
  if (!isFinite(exponencial)) {
    res.value = "Infinito";
  }
  else {
    res.value = exponencial;
  }
}

// Calcula Log com base natural (e)
function calcularLn(value) {

  if (calculate(value) === -1) {
    return;
  }

  if (Number(res.value) <= 0) {
    res.value = "Não existe ln de número menor ou igual a zero";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  }
  else {
    const ln = Math.log(res.value);
    res.value = ln;
  }
}

// Calcula Log com base 10
function calcularLog(value) {

  if (calculate(value) === -1) {
    return;
  }

  if (Number(res.value) <= 0) {
    res.value = "Não existe log de número menor ou igual a zero";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  }
  else {
    const log = Math.log10(res.value);
    res.value = log;
  }

}

function calcularRaizCubica(value) {
  if (calculate(value) === -1) {
    return;
  }

  const cbrt = Math.cbrt(res.value);
  res.value = cbrt;
}

// Função para calcular a raiz quadrada de uma expressão fornecida.
function calcularRaiz(value) {

  if (calculate(value) === -1) {
    return;
  }


  if (Number(res.value) < 0) {
    res.value = "Não existe raiz real de número negativo";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  }
  else {
    const raiz = Math.sqrt(res.value);
    res.value = raiz;
  }

}

function calcularsen(value) {
  if (calculate(value) === -1) {
    return;
  }

  const radiano = grausParaRadiano(res.value);
  const seno = Math.sin(radiano);
  res.value = seno;

  return res.value;
}

function calcularcos(value) {
  if (calculate(value) === -1) {
    return;
  }
  const radiano = grausParaRadiano(res.value);
  const coseno = Math.cos(radiano);
  res.value = coseno;

  return res.value;
}

function calculartg(value) {

  if (calculate(value) === -1) {
    return;
  }

  const radiano = grausParaRadiano(res.value);
  const tangente = Math.tan(radiano);
  res.value = tangente;

  return res.value;
}

function grausParaRadiano(graus) {

  const radianos = graus * Math.PI / 180;

  return radianos;
}

function euler() {
  res.value += 'e';
}


// Ativa o modo escuro ou claro dependendo do tema atual.
function changeTheme() {
  const theme = document.getElementById("theme");
  setTimeout(() => {
    toast.innerHTML = "Calculadora";
  }, 1500);
  if (theme.getAttribute("href") === lightTheme) {
    theme.setAttribute("href", darkTheme);
    themeIcon.setAttribute("src", sunIcon);
    githubIcon.setAttribute("src", githubLight);
    toast.innerHTML = "Modo Escuro 🌙";
  } else {
    theme.setAttribute("href", lightTheme);
    themeIcon.setAttribute("src", moonIcon);
    githubIcon.setAttribute("src", githubDark);
    toast.innerHTML = "Modo Claro ☀️";
  }
}
function changeThemeConversor() {
  const theme = document.getElementById("theme");
  setTimeout(() => {
    toast.innerHTML = "Conversor de Bases";
  }, 1500);
  if (theme.getAttribute("href") === lightTheme) {
    theme.setAttribute("href", darkTheme);
    themeIcon.setAttribute("src", sunIcon);
    githubIcon.setAttribute("src", githubLight);
    calculator.setAttribute("src", "../assets/calculator.ico.png");
    toast.innerHTML = "Modo Escuro 🌙";
  } else {
    theme.setAttribute("href", lightTheme);
    themeIcon.setAttribute("src", moonIcon);
    githubIcon.setAttribute("src", githubDark);
    calculator.setAttribute("src", "../assets/calculator.icon.branco.png");
    toast.innerHTML = "Modo Claro ☀️";
  }
}

// Função para atualizar a tela de resultados com o valor digitado.
function liveScreen(enteredValue) {
  const inputEmpty = !res.value;
  if (inputEmpty) {
    res.value = "";
  }
  res.value += enteredValue;
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
    // Remove o último caractere do valor atual do resultado
    res.value = resultInput.substring(0, res.value.length - 1);
  }
}


/* 
substitui sinais e certos padrões na
expressão de entrada, por exemplo: 
log( -> Math.log10(
*/
function evalParser(expr) {
  let parsedExpr = "";

  for (let i = 0; i < expr.length; i++) {
    switch (expr[i]) {

      case '√':
        parsedExpr += "Math.sqrt";
        break;

      case 'l':
        if (expr[i + 1] === 'o') {
          parsedExpr += "Math.log10";
          i += 2;
        }
        else {
          parsedExpr += "Math.log";
          i++;
        }

        break;

      case 'e':
        if (expr[i + 1] === '^') {
          parsedExpr += "Math.exp";
          i++;
        }
        else {
          parsedExpr += "Math.E";
        }
        break;
      
      case 'π':
        parsedExpr += "Math.PI";
        break;

      case 's':
        parsedExpr += "Math.sin";
        i += 2;
        break;
      
      case 'c':
        parsedExpr += "Math.cos";
        i += 2;
        break;
      
      case 't':
        parsedExpr += "Math.tan";
        i += 2;
      default:
        parsedExpr += expr[i];
    }
    console.log(parsedExpr); // debug
  }

  console.log(parsedExpr); // debug
  return parsedExpr;
}


function mudarModo() {
  calc.classList.toggle('expandida');
}

function paraDecimal(num, baseE) {
  let dec = 0;
  let pot = 0;
  num = num.split("").reverse().join("");
  for (let i = 0; i < num.length; i++) {
    const caracter = num[i];
    let valor;
    if (!isNaN(caracter) && caracter.trim() !== "") {
      valor = parseInt(caracter, 10);
    } else {
      valor = caracter.toUpperCase().charCodeAt(0) - 55;
    }
    dec = dec + valor * Math.pow(baseE, pot);
    pot++;
  }
  return dec;
}

function deDecimal(dec, baseS) {
  if (dec === 0) return "0";
  const todosCaracteres = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
  let result = "";
  while (dec > 0) {
    const resto = dec % baseS;
    result = todosCaracteres[resto] + result;
    dec = Math.floor(dec / baseS);
  }
  return result;
}

function converterBase(numero, baseEntrada, baseSaida) {
  const num = numero.toUpperCase();
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