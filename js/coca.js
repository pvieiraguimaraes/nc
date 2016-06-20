var Coca = {};

(function (cartola) {

  var numRodadas = 38;

  //Nome do time com os numeros das rodadas que pagou
  var timesPagantes = {
    perebas_forever: [],
    narnia_de_munique: [],
    sao_bacon_fc: [7, 8],
    goblins_team: [5],
    boletos_fc: [3, 4, 9],
    petrinhus_fc: [6],
    xutebol_club: [1, 2],
    cachaca_s_esporte_clube: []
  };

  function montaMural() {
    var linhaNormal = '<td></td>';
    var linhaCoca = '<td style="text-align: center"><img src="img/coca.png" style="width: 10px;"></td>';

    var pagantes = '';
    for (var k in timesPagantes) {
      pagantes += '<tr><td>' + k + '</td>'
      for (var i = 1; i <= numRodadas; i++) {
        var rodadas = timesPagantes[k];
        var linhapagou = false;
        for (var r = 0; r < rodadas.length; r++) {
          if (rodadas[r] == i) {
            linhapagou = true;
            pagantes += linhaCoca;
          }
        }
        if (!linhapagou) {
          pagantes += linhaNormal;
        }
      }
      pagantes += '</tr>';
    }
    return pagantes;
  }

  function imagensMural() {
    var larguraPagina = $('#mural').width();
    var qtdeImagens = 10;
    var limite = false;
    for (var i = 0; i < qtdeImagens; i++) {
      if (limite) {
        break
      }
      $.get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=shame', function (data) {
        var larguraCorrente = $('#mural-vergonha-zoeira').width();
        if (larguraPagina < larguraCorrente) {
          limite = true
        }
        $('#mural-vergonha-zoeira').append('<img src="' + data.data.image_url + '" style="height: 100px;">');
      });
    }
  }

  cartola.initialize = function () {
    $(document).ready(function () {
      $('#mural-vergonha > tbody').append(montaMural());

      $('#mural-vergonha').show();
      $('#spinner').hide();


      imagensMural();
    });
  }
}(Coca));

Coca.initialize();
