const lightTheme = "styles/light.css";
const darkTheme = "styles/dark.css";
const sunIcon = "assets/SunIcon.svg";
const moonIcon = "assets/MoonIcon.svg";
const githubLight = "assets/GitHubLight.svg";
const githubDark = "assets/GitHubDark.svg";
const themeIcon = document.getElementById("theme-icon");
const githubIcon = document.getElementById("github-icon");
const res = document.getElementById("result");
const toast = document.getElementById("toast");

// Avalia uma expressão simples, verifica se resulta em NaN
function calculate(value) {
  const calculatedValue = eval(value || null);
  if (!Number.isFinite(calculatedValue)) {
    res.value = "Não é possível divisão por 0";
    setTimeout(() => {
      res.value = "";
    }, 1300);
    return -1; // error: NaN
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
  const seno = Math.sin(Number(res.value));
  res.value = seno;
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
  e.preventDefault();
  //pegando a livescreen

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
      case '∛':
        parsedExpr += "Math.cbrt";
      case 'l':
        if (expr[i + 1] === 'o')
          parsedExpr += "Math.log10";
        else
          parsedExpr += "Math.log";

        break;
      case 'e':
        if (expr[i + 1] = 'ˣ') {
          parsedExpr += "Math.exp";
          i++;
        }
        else {
          parsedExpr += "Math.E";
        }
        break;
      case 's':
        parsedExpr += "Math.sin";
      default:
        parsedExpr += expr[i];
    }
  }

  return parsedExpr;
}

function mudarModo() {
  calc.classList.toggle('expandida');
}