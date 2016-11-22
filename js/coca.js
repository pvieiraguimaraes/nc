var Coca = {};

(function (cartola) {

	var totalCaixa = 0;
	var numRodadas = 38;

	//Nome do time com os numeros das rodadas que pagou
	var timesPagantes = {
		perebas_forever: [13, 14, 26, 27, 36],
		narnia_de_munique: [],
		sao_bacon_fc: [7, 8, 16],
		goblins_team: [5, 10, 17, 20, 29],
		boletos_fc: [3, 4, 9],
		petrinhus_fc: [6, 11, 15, 19, 21, 22, 24, 32],
		xutebol_club: [1, 2, 18, 28, 33],
		cachaca_s_esporte_clube: [12, 23, 25, 30, 31, 34, 35]
	};

	function montaMural() {
		var linhaNormal = '<td></td>';
		var linhaCoca = '<td style="text-align: center"><img src="img/coca.png" style="width: 10px;"></td>';
		var linhaCoin = '<td style="text-align: center"><img src="img/coin.png" style="width: 20px;"></td>';

		var pagantes = '';
		for (var k in timesPagantes) {
			var qtdePaga = timesPagantes[k].length
			pagantes += '<tr><td>' + getNameTime(k) + '<span class="pull-right">' + qtdePaga +  '</span>' + '</td>'
			for (var i = 1; i <= numRodadas; i++) {
				var rodadas = timesPagantes[k];
				var linhapagou = false;
				for (var r = 0; r < rodadas.length; r++) {
					if (rodadas[r] == i) {
						linhapagou = true;
						if(i >= 14){
							pagantes += linhaCoin;
							totalCaixa += 6;
						} else {
							pagantes += linhaCoca;
						}
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

	function getNameTime(time) {
		switch (time) {
			case "perebas_forever":
				return decodeURIComponent(escape("Perebas Forever"));
				break;
			case "narnia_de_munique":
				return decodeURIComponent(escape("Narnia de Munique"));
				break;
			case "sao_bacon_fc":
				return decodeURIComponent(escape("Sao Bacon FC"));
				break;
			case "goblins_team":
				return decodeURIComponent(escape("Goblins Team"));
				break;
			case "boletos_fc":
				return decodeURIComponent(escape("Boletos FC"));
				break;
			case "petrinhus_fc":
				return decodeURIComponent(escape("Petrinhus FC"));
				break;
			case "xutebol_club":
				return decodeURIComponent(escape("Xutebol Club"));
				break;
			case "cachaca_s_esporte_clube":
				return decodeURIComponent(escape("Cachacas's Esporte Clube"));
				break;
		}
	}

	cartola.initialize = function () {
		$(document).ready(function () {
			$('#mural-vergonha > tbody').append(montaMural());

			$('#mural-vergonha').show();
			$('#spinner').hide();

			$('#mural-vergonha-zoeira').append('<h1>R$'+totalCaixa+',00 temmers</h1>');
			//imagensMural();
		});
	}
}(Coca));

Coca.initialize();
