const lightTheme = "styles/light.css";
const darkTheme = "styles/dark.css";
const sunIcon = "assets/SunIcon.svg";
const moonIcon = "assets/MoonIcon.svg";
const themeIcon = document.getElementById("theme-icon");
const res = document.getElementById("result");
const toast = document.getElementById("toast");

function calculate(value) {
  const calculatedValue = eval(value || null);
  if (isNaN(calculatedValue)) {
    res.value = "Não é possível divisão por 0";
    setTimeout(() => {
      res.value = "";
    }, 1300);
  } else {
    res.value = calculatedValue;
  }
}

//Função para calcular a raiz quadrada de um número.
function calcularRaiz(value) {
  let numero = Number(res.value);

  if (isNaN(numero)) {
    res.value = "Digite um número válido";
    return;
  }

  if (numero < 0) {
    res.value = "Não existe raiz real de número negativo";
    return;
  }

  let raiz = Math.sqrt(numero);
  res.value = raiz;
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
    toast.innerHTML = "Modo Escuro 🌙";
  } else {
    theme.setAttribute("href", lightTheme);
    themeIcon.setAttribute("src", moonIcon);
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
  // As teclas Enter e Backspace estavam causando comportamento indesejado quando algum elemento já estava em foco..
  e.preventDefault();
  //pegando a livescreen

  // Números
  if (e.key === "0") {
    res.value += "0";
  } else if (e.key === "00") {
    res.value += "00";
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
  } else if (e.key === "\|") {
    res.value += "math.sqrt(x)";
  }

  // Ponto decimal
  if (e.key === ".") {
    res.value += ".";
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
