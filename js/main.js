var Narnia = {};

(function (cartola) {

    var times = ['perebas-forever', 'narnia-de-munique', 'sao-bacon-fc', 'goblins-team', 'boletos-fc', 'petrinhus-fc', 'xutebol-club'];
    var atletas_pontuados = [];
    var total_pontos = 0.00;

    function get_pontuacao_rodada(nome_time, handleData) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            cache: false,
            url: "load-api.php",
            data: {
                api: "busca-time",
                team_slug: nome_time
            },
            success: function (data) {
                handleData(data);
            }
        });
    }

    function get_pontuacao_atletas() {
        $.ajax({
            dataType: "json",
            cache: false,
            url: "load-api.php",
            data: {
                api: "parciais-atletas"
            },
            success: function (data) {
                atletas_pontuados = data.atletas;

                for (var i = 0; i < times.length; i++) {
                    get_pontuacao_rodada(times[i], function (obj) { montaTime(obj); });
                }
            }
        });
    }

    function montaTime(data) {
        var imgEscudo = data.time.url_escudo_png;
        var imgPerfil = data.time.foto_perfil;

        var nome = data.time.nome;
        var nome_cartola = data.time.nome_cartola;
        var pontos = data.pontos.toFixed(2);
        var patrimonio = data.patrimonio;
        var atletas_html = createAtletasTimeHtml(data.atletas);
        var parcial_rodada = total_pontos.toFixed(2);

        $('#narnia-table').append('<tr><td colspan="1"><div class="col-xs-12"><img src="' + imgEscudo + '" style="width: 50px;"><img style="width: 30px;position: absolute;left: 45px;top: 25px;" src="' + imgPerfil + '" class="img-circle"></div></td><td colspan="3"><h3>' + nome + '</h3><p>' + nome_cartola + '</p></td><td colspan="2"><p class="ponto" style="text-align: center">' + pontos + '</p></td><td colspan="2" style="text-align: center"><p class="pontoparcial">' + parcial_rodada + '</p></td><td colspan="2" style="text-align: center;"><p class="patrimonio">'+patrimonio+'</p></td><td colspan="2" style="text-align: center" class="coca"></td></tr>');
        $('#narnia-table').append('<tr>' + atletas_html + '</tr>>');

        total_pontos = 0.00;
    }

    function createAtletasTimeHtml(atletas_time){
        var atletas = '';
        for (var i = 0; i < atletas_time.length; i++) {
            atletas += getTemplateAtleta(atletas_time[i]);
        }
        return atletas;
    }

    function getTemplateAtleta(data){
        var atletaPontuado = atletas_pontuados[data.atleta_id];
        var pontuacao = 0.00;

        if(typeof atletaPontuado !== 'undefined'){
            pontuacao = atletaPontuado.pontuacao;
            total_pontos += pontuacao;
        }

        return '<td><div class="col-xs-12">' +
                    '<p style="font-size: small">' + data.apelido + '</p>' +
                    '<img style="width: 40px;" src="' + data.foto.replace("FORMATO", "140x140") + '">' +
                    '<p>' + pontuacao + '<p>' +
            '</div></td>';
    }

    function quem_paga(){
        var menorObj = $('.ponto').first();
        var menorValor = parseFloat($('.ponto').first().text());
        $('.pontoparcial').each(function(i, obj) {
            if (parseFloat($(obj).text()) < menorValor){
                menorObj = obj;
                menorValor = parseFloat($(obj).text());
            }
        });

        var parent = $(menorObj).parent().parent();
        parent.addClass('paga-coca');
        parent.find('.coca').append('<img src="img/coca.png" style="height: 100px;">')
    }

    cartola.initialize = function () {
        $(document).ready(function () {
            get_pontuacao_atletas();
        }).ajaxStop(function() {
            quem_paga();
            $("#narnia-table").tablesorter({
                // sort on the first column and third column, order asc
                sortList: [3,0]
            });
        });
    }
}(Narnia));

Narnia.initialize();