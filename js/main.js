var Narnia = {};

(function (cartola) {

    var timesProcessados = 0;
    var processado = false;
    var times = ['perebas-forever', 'narnia-de-munique', 'sao-bacon-fc', 'goblins-team', 'boletos-fc', 'petrinhus-fc', 'xutebol-club', 'cachaca-s-esporte-clube'];
    var atletas_pontuados = [];
    var total_pontos = 0.00;
    var classeOrdenacao = '.pontoparcial';

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
            complete: function (data) {
                if (data && data.responseJSON && data.responseJSON.atletas) {
                  atletas_pontuados = data.responseJSON.atletas;
                } else {
                    $('#info-mercado').html('Tem parcial nao tiozao!');
                    classeOrdenacao = '.ponto';
                }
                for (var i = 0; i < times.length; i++) {
                    timesProcessados++;
                    get_pontuacao_rodada(times[i], function (obj) {
                        montaTime(obj);
                    });
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
        var slug_time = data.time.slug;
        var pontos_ordenacao = total_pontos == 0.00 ? pontos : total_pontos;

        $('#narnia-table').append('<tr class="' + slug_time + '" data-row="' + slug_time + '" data-total="' + pontos_ordenacao + '"><td colspan="1"><div class="col-xs-12"><img src="' + imgEscudo + '" style="width: 50px;"><img style="width: 30px;position: absolute;left: 45px;top: 25px;" src="' + imgPerfil + '" class="img-circle"></div></td><td colspan="3"><h3>' + nome + '</h3><p>' + nome_cartola + '</p></td><td colspan="2"><p class="ponto" style="text-align: center">' + pontos + '</p></td><td colspan="2" style="text-align: center"><p class="pontoparcial">' + parcial_rodada + '</p></td><td colspan="2" style="text-align: center;"><p class="patrimonio">' + patrimonio + '</p></td><td colspan="2" style="text-align: center" class="coca"></td></tr>');
        if (atletas_html != '')
            $('#narnia-table').append('<tr class="' + slug_time + '"	>' + atletas_html + '</tr>');

        total_pontos = 0.00;
    }

    function createAtletasTimeHtml(atletas_time) {
        var atletas = '';
        for (var i = 0; i < atletas_time.length; i++) {
            atletas += getTemplateAtleta(atletas_time[i]);
        }
        return atletas;
    }

    function getTemplateAtleta(data) {
        var atletaPontuado = atletas_pontuados[data.atleta_id];
        var pontuacao = 0.00;

        if (typeof atletaPontuado !== 'undefined') {
            pontuacao = atletaPontuado.pontuacao;
            total_pontos += pontuacao;
        }

        var foto = data.foto;
        if (foto == null) foto = '';

        return '<td><div class="col-xs-12">' +
            '<p style="font-size: small">' + data.apelido + '</p>' +
            '<img style="width: 40px;" src="' + foto.replace("FORMATO", "140x140") + '">' +
            '<p>' + pontuacao + '<p>' +
            '</div></td>';
    }

    function quem_paga() {
        var menorObj = $(classeOrdenacao).first();
        var menorValor = parseFloat($(classeOrdenacao).first().text());
        $(classeOrdenacao).each(function (i, obj) {
            if (parseFloat($(obj).text()) < menorValor) {
                menorObj = obj;
                menorValor = parseFloat($(obj).text());
            }
        });

        var parent = $(menorObj).parent().parent();
        parent.addClass('paga-coca');
        $.get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=coca-cola', function (data) {
            parent.find('.coca').append('<img src="' + data.data.image_url + '" style="height: 100px;">')
        });
    }

    function mito(){
        var theLegend = $('#narnia-table > tbody > tr')[0];
        $(theLegend).addClass('mito');
        $.get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=win', function (data) {
            $(theLegend).find('.coca').append('<img src="' + data.data.image_url + '" style="height: 100px;">')
        });
    }

    function ordena() {
        var rows = $('#narnia-table > tbody > tr');
        var data_row = [], data_total = [], data_row_attr = '', data_total_attr = '';
        for (var i = 0; i < rows.length; i++) {
            data_row_attr = $(rows[i]).data('row');
            data_total_attr = $(rows[i]).data('total');

            if (typeof data_row_attr !== 'undefined') data_row.push(data_row_attr);
            if (typeof data_total_attr !== 'undefined') data_total.push(data_total_attr);
        }
        var arrr = [];
        for (var h = 0; h < data_row.length; h++) {
            arrr[h + '-' + data_total[h]] = data_row[h];
        }

        var ordenado = [];
        data_total = data_total.sort(function (a, b) {
            return b - a;
        });
        for (var t = 0; t < data_total.length; t++) {
            for (var x = 0; x < data_total.length; x++) {
                var arrr2 = arrr[x + '-' + data_total[t]];
                if ((typeof arrr2 !== 'undefined') && (ordenado.indexOf(arrr2) == -1))
                    ordenado.push(arrr2);
            }
        }

        var row_o = '';
        $(ordenado).each(function (i, obj) {
            row_o = $("#narnia-table > tbody > ." + obj);
            $('#narnia-table > tbody').append(row_o);
        });
    }

    cartola.initialize = function () {
        $(document).ready(function () {
            get_pontuacao_atletas();
        }).ajaxStop(function () {
            if (!processado && times.length == timesProcessados) {
                processado = true;
                quem_paga();
                ordena();
                mito();
                $('#narnia-table').show();
                $('#spinner').hide();
            }
        });
    }
}(Narnia));

Narnia.initialize();
