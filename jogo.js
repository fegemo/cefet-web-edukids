/*
 * Você vai precisar alterar este arquivo APENAS para trocar o caminho da
 * imagem dos animais para a imagem com sprites (Exercício 2)
 */
var animaisTodos = [
  'peixe',
  'leao',
  'gato',
  'cachorro',
  'girafa',
  'rato',
  'hipopotamo',
  'coelho',
  'urso'
];

var temporizador,
  pontuacao = {
    pontos: 0
  };
var TEMPO_PARA_DAR_COMIDA = 4000;
var animais = [];

function sorteiaAnimais(quantos) {
  var animaisTodosCopia = animaisTodos.slice(0),
    indiceSorteado,
    animalSorteado,
    sorteio = [];

  for (var i = 0; i < quantos; i++) {
    indiceSorteado = Math.floor(Math.random() * animaisTodosCopia.length);
    animalSorteado = animaisTodosCopia.splice(indiceSorteado, 1);
    sorteio.push(animalSorteado[0]);
  }

  return sorteio;
}

function preencheAnimaisNaTela() {
  var tela = document.getElementById('conteudo'),
    markupAnimais = '',
    i;

  for (i = 0; i < animais.length; i++) {
    markupAnimais += '<figure class="animal" id="' + animais[i] + '">' +
                     '  <img src="imgs/' + animais[i] + '.jpg">' +
                     '</figure>';
  }

  tela.innerHTML = markupAnimais;
  var elementoAnimais = document.getElementsByClassName('animal');
  for (i = 0; i < elementoAnimais.length; i++) {
    elementoAnimais[i].addEventListener('click', cliqueAnimal);
  }
}

function escolheAnimal() {
  var indiceSorteado = Math.floor(Math.random() * animais.length),
    animalSorteado = animais[indiceSorteado],
    elementoSorteado = document.getElementById(animalSorteado),
    elementoComando = document.getElementById('comando');

  for (var i = 0; i < animais.length; i++) {
    var elementoAnimal = document.getElementById(animais[i]);
    if (elementoAnimal.classList.contains('agitado')) {
      elementoAnimal.classList.remove('agitado');
      elementoAnimal.classList.add('instinto-selvagem');
      atualizaPontuacao(pontuacao.pontos - 2);
      window.setTimeout(function(el) {
        return function() {
          el.classList.remove('instinto-selvagem');
        };
      }(elementoAnimal), 1000);
    }
  }

  elementoComando.innerHTML = animalSorteado;
  elementoComando.classList.add('visivel');

  elementoSorteado.classList.add('agitado');
  window.setTimeout(function() {
    elementoComando.classList.remove('visivel');
  }, TEMPO_PARA_DAR_COMIDA);

  // registra a chamada para o próximo animal
  temporizador = window.setTimeout(escolheAnimal,
    TEMPO_PARA_DAR_COMIDA + Math.random() * TEMPO_PARA_DAR_COMIDA/2);
}

function cliqueAnimal(e) {
  var elementoAnimal = e.currentTarget,
      elementoComando = document.getElementById('comando');
  if (elementoAnimal.classList.contains('agitado')) {
    // animal com fome foi clicado - ganha 1 ponto
    atualizaPontuacao(pontuacao.pontos + 1);
    elementoAnimal.classList.remove('agitado');
    elementoAnimal.classList.add('alimentado');
    elementoComando.classList.remove('visivel');
    window.setTimeout(function() {
      elementoAnimal.classList.remove('alimentado');
    }, 1000);
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(escolheAnimal,
      TEMPO_PARA_DAR_COMIDA/2 + Math.random() * TEMPO_PARA_DAR_COMIDA/4);
  } else if (!elementoAnimal.classList.contains('alimentado')) {
    // animal quieto foi clicado - perde 1 ponto
    elementoAnimal.classList.add('perturbado');
    atualizaPontuacao(pontuacao.pontos - 1);
    window.setTimeout(function() {
      elementoAnimal.classList.remove('perturbado');
    }, 1000);
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(escolheAnimal,
      TEMPO_PARA_DAR_COMIDA + Math.random() * TEMPO_PARA_DAR_COMIDA/2);
  }
}

function iniciaJogo() {
  escolheAnimal(animais);
}

function comecar() {
  atualizaPontuacao(0);
  animais = sorteiaAnimais(5);
  preencheAnimaisNaTela();
  iniciaJogo();
}

function parar() {
  window.clearTimeout(temporizador);
  var elementoAnimais = document.getElementsByClassName('animal'),
      elementoComando = document.getElementById('comando');

  for (var i = 0; i < elementoAnimais.length; i++) {
    elementoAnimais[i].classList.remove(
      'agitado',
      'alimentado',
      'perturbado',
      'instinto-selvagem');
    elementoAnimais[i].removeEventListener('click', cliqueAnimal);
  }

  elementoComando.classList.remove('visivel');
}

function atualizaPontuacao(nova) {
  var elementoPontuacao = document.getElementById('pontuacao');

  pontuacao.pontos = nova;
  elementoPontuacao.innerHTML = pontuacao.pontos;
  elementoPontuacao.classList.remove('positiva');
  elementoPontuacao.classList.remove('negativa');
  if (pontuacao.pontos > 0) {
    elementoPontuacao.classList.add('positiva');
  } else if (pontuacao.pontos < 0) {
    elementoPontuacao.classList.add('negativa');
  }
}

window.onload = function() {
  var botaoComecar = document.getElementById('comecar'),
      botaoParar = document.getElementById('parar');

  botaoComecar.addEventListener('click', comecar);
  botaoParar.addEventListener('click', parar);
};
