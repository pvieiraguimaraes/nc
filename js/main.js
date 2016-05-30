var Narnia = {};

(function (cartola) {

    var time_api_url = 'https://api.cartolafc.globo.com/time/';
    var times = ['perebas-forever', 'narnia-de-munique', 'sao-bacon-fc', 'goblins-team', 'boletos-fc', 'petrinhus-fc', 'xutebol-club'];

    function get_pontuacao_rodada(nome_time, handleData) {
        $.ajax({
            dataType: "json",
            url: time_api_url + nome_time,
            success: function (data) {
                handleData(data);
            }
        });
    }

    function montaTime(data) {
        var imgEscudo = data.time.url_escudo_png;
        var imgPerfil = data.time.foto_perfil;

        var nome = data.time.nome;
        var nome_cartola = data.time.nome_cartola;
        var pontos = data.pontos;

        $('#narnia-table').append('<tr><td><img src="' + imgEscudo + '" style="width: 150px;"><img src="' + imgPerfil + '" class="img-circle"></td><td><h3>' + nome + '</h3><p>' + nome_cartola + '</p></td><td><h3>Pontos</h3><p class="ponto">' + pontos + '</p></td><td class="coca"></td></tr>');
    }

    function quem_paga(){
        var menorObj = $('.ponto').first();
        var menorValor = parseFloat($('.ponto').first().text());
        $('.ponto').each(function(i, obj) {
            if (parseFloat($(obj).text()) < menorValor){
                menorObj = obj;
                menorValor = parseFloat($(obj).text());
            }
        });

        $(menorObj).parent().parent().append('<img src="img/coca.png" style="height: 100px;">')
    }

    cartola.initialize = function () {
        $(document).ready(function () {
            for (var i = 0; i < times.length; i++) {
                get_pontuacao_rodada(times[i], function (obj) { montaTime(obj); });
            }
        })

        $(document).ajaxStop(function() { quem_paga();});
    }
}(Narnia));

Narnia.initialize();