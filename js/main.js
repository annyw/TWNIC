/**
 * Part of twnic project.
 *
 * @copyright  Copyright (C) 2017 {ORGANIZATION}. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

var chartHeight = $(window).height() / 6;

var color1 = {
    "from" : '#FE5961',
    "to" : '#A13664'
};

var color2 = {
    "from": '#7DC354',
    "to": '#006A39'
};

var color3 = {
    "from" : '#00ABE8',
    "to" : '#233F8C'
};

var color4 = {
    "from" : '#D1295B',
    "to" : '#3D3674'
};

defaultBar(1, color1);
defaultBar(2, color1);
defaultBar(3, color1);

$('a[href="#domain"]').on('shown.bs.tab', function() {
    defaultBar(1, color1);
    defaultBar(2, color1);
    defaultBar(3, color1);
});

$('a[href="#ip-address"]').on('shown.bs.tab', function() {
    defaultBar(4, color2);
    defaultBar(5, color2);
    defaultBar(6, color2);
});

$('a[href="#www-server"]').on('shown.bs.tab', function() {
    defaultBar(7, color3);
});

$('a[href="#bandwidth"]').on('shown.bs.tab', function() {
    defaultBar(8, color4);
});

function defaultBar(id, color)
{
    var chart = document.getElementById("chart" + id).getContext("2d");

    var gradient = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient.addColorStop(0, color.from);
    gradient.addColorStop(1, color.to);

    var labels = [], values = [];

    $.getJSON('data/chart' + id + '.json', function (json) {
        var jsonData = json.data;

        console.log(jsonData);

        $.each(jsonData, function (i, v)
        {
            labels[i] = v.label;
            values[i] = v.value;
        });

        var data = {
            labels: labels,
            datasets: [
                {
                    fillColor  : gradient, // Put the gradient here as a fill color
                    data: values
                }
            ]
        };

        var barChart = new Chart(chart).Bar(data, {
            responsive: true,
            showTooltips: false,
            scaleLabel: function(label){return  label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");},
            onAnimationComplete: function () {

                if ($(window).width() > 767) {
                    var ctx = this.chart.ctx;
                    ctx.font = this.scale.font;
                    ctx.fillStyle = this.scale.textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    var old_height = 0;

                    this.datasets.forEach(function (dataset) {
                        dataset.bars.forEach(function (bar) {
                            var abs = Math.round(Math.abs(old_height - (bar.y)));

                            if (abs < 10) {
                                height = bar.y - 25;
                            }
                            else {
                                height = bar.y - 5;
                            }

                            ctx.fillText(bar.value.numberFormat(0), bar.x, height);

                            old_height = height;
                        });
                    })
                }
            }
        });

    });
}

Number.prototype.numberFormat = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};