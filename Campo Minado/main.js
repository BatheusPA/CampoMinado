'use strict'

let linhas, colunas, bombas, matriz, tabela
//função para gerar a matriz
function gerarMatriz(l, c) {
  matriz = []
  for (let i = 0; i < l; i++) {
    matriz[i] = new Array(c).fill(0)
  }
  console.log(matriz)
}
//função para gerar o tabuleiro
function gerarTabela(l, c) {
  gerarMatriz(l, c)
  let str = ''
  for (let i = 0; i < l; i++) {
    str += '<tr>'
    for (let j = 0; j < c; j++) {
      str += "<td class='blocked'></td>"
    }
    str += '</tr>'
  }
  tabela.innerHTML = str
}

function mostrarMatriz() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (matriz[i][j] === -1) {
        tabela.rows[i].cells[j].innerHTML = '&#128163;'
      } else {
        tabela.rows[i].cells[j].innerHTML = matriz[i][j]
      }
    }
  }
}

//gera as bombas no tabuleiro
function gerarBombas() {
  for (let i = 0; i < bombas; ) {
    let linha = Math.floor(Math.random() * linhas)
    let coluna = Math.floor(Math.random() * colunas)
    if (matriz[linha][coluna] === 0) {
      matriz[linha][coluna] = -1
      i++
    }
  }
}
//gera as celulas que não contem bomba
function gerarNumero(l, c) {
  let count = 0
  for (let i = l - 1; i <= l + 1; i++) {
    for (let j = c - 1; j <= c + 1; j++) {
      if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
        if (matriz[i][j] === -1) {
          count++
        }
      }
    }
  }
  matriz[l][c] = count
}
function gerarNumeros() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (matriz[i][j] !== -1) {
        gerarNumero(i, j)
      }
    }
  }
}
//função que bloqueia as celular já reveladas
function bandeira(event) {
  let cell = event.target
  let linha = cell.parentNode.rowIndex
  let coluna = cell.cellIndex
  if (cell.className === 'blocked') {
    cell.className = 'flag'
    cell.innerHTML = '&#128681;'
  } else if (cell.className === 'flag') {
    cell.className = 'blocked'
    cell.innerHTML = ''
  }
  return false
}
//Selecionar dificuldade para montar o tabuleiro.
function init() {
  tabela = document.getElementById('tabela')
  tabela.onclick = verificar
  tabela.oncontextmenu = bandeira
  let diff = document.getElementById('dificuldade')
  switch (parseInt(diff.value)) {
    case 0:
      linhas = 0
      colunas = 0
      bombas = 0
      break
    case 1:
      linhas = 8
      colunas = 10
      bombas = 10
      start()
      break
    case 2:
      linhas = 14
      colunas = 18
      bombas = 40
      start()
      break
    default:
      linhas = 20
      colunas = 24
      bombas = 99
      start()
      break
  }
  //gerando o tabuleiro com as informações da dificuldade
  gerarTabela(linhas, colunas)
  gerarBombas()
  gerarNumeros()
}
//função que expande as celulas ao redor que não contem bomba
function limparCelulas(l, c) {
  for (let i = l - 1; i <= l + 1; i++) {
    for (let j = c - 1; j <= c + 1; j++) {
      if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
        let cell = tabela.rows[i].cells[j]
        if (cell.className !== 'blank') {
          switch (matriz[i][j]) {
            case -1:
              break
            case 0:
              cell.innerHTML = ''
              cell.className = 'blank'
              limparCelulas(i, j)
              break
            default:
              cell.innerHTML = matriz[i][j]
              cell.className = 'n' + matriz[i][j]
          }
        }
      }
    }
  }
}
//função para mostrar as bombas no tabuleiro
function mostrarBombas() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      if (matriz[i][j] === -1) {
        let cell = tabela.rows[i].cells[j]
        cell.innerHTML = '&#128163;'
        cell.className = 'blank'
      }
    }
  }
}
//função para verificar se existem bombas na celula|| case -1 : Condição de derrota| case 0: limpar as celulas que não possuem bomba| default: revela a celula clicada normalmente.
function verificar(event) {
  let cell = event.target
  if (cell.className !== 'flag') {
    let linha = cell.parentNode.rowIndex
    let coluna = cell.cellIndex
    switch (matriz[linha][coluna]) {
      case -1:
        mostrarBombas()
        cell.style.backgroundColor = 'red'
        tabela.onclick = undefined
        tabela.oncontextmenu = undefined
        pause()
        alert('Você perdeu!')
        setTimeout(function () {
          location.reload()
        }, 5000)
        break
      case 0:
        limparCelulas(linha, coluna)
        break
      default:
        cell.innerHTML = matriz[linha][coluna]
        cell.className = 'n' + matriz[linha][coluna]
    }
    fimDeJogo()
  }
}
//condição de vitoria
function fimDeJogo() {
  let cells = document.querySelectorAll('.blocked, .flag')
  if (cells.length === bombas) {
    mostrarBombas()
    tabela.onclick = undefined
    tabela.oncontextmenu = undefined
    pause()
    alert('Você venceu!')
    setTimeout(function () {
      location.reload()
    }, 5000)
  }
}
//função das dificuldades
function registerEvents() {
  init()
  let diff = document.getElementById('dificuldade')
  diff.onchange = init
}
onload = registerEvents

//cronometro
let hh = 0
let mm = 0
let ss = 0

//1000 ms = 1min
let tempo = 1000
let cron

//Inicia o cronometro
function start() {
  cron = setInterval(() => {
    timer()
  }, tempo)
}

//Pausa o cronometro
function pause() {
  clearInterval(cron)
}

//função para executar a crnometragem e exibir na formatação correta.
function timer() {
  ss++

  if (ss == 59) {
    ss = 0
    mm++

    if (mm == 59) {
      mm = 0
      hh++
    }
  }

  //Cria uma variavel com o valor tratado HH:MM:SS
  let format =
    (hh < 10 ? '0' + hh : hh) +
    ':' +
    (mm < 10 ? '0' + mm : mm) +
    ':' +
    (ss < 10 ? '0' + ss : ss)

  //Insere o valor tratado no elemento counter
  document.getElementById('counter').innerText = format

  //Retorna o valor tratado
  return format
}
