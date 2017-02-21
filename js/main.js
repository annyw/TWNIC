/**
 * Part of twnic project.
 *
 * @copyright  Copyright (C) 2017 {ORGANIZATION}. All rights reserved.
 * @license    GNU General Public License version 2 or later.
 */

$(document).ready(function ()
{
    $('#print-btn').on('click', function ()
    {
        window.print();
    });

    $('a[data-toggle="tab"]').on('click', function ()
    {
        $('body').animate({'scrollTop': 0});
    });
});

var chartHeight = $(window).height() / 6;

var color1 = {
    "from": '#FE5961',
    "to": '#A13664'
};

var color2 = {
    "from": '#7DC354',
    "to": '#006A39'
};

var color3 = {
    "from": '#00ABE8',
    "to": '#233F8C'
};

var color4 = {
    "from": '#D1295B',
    "to": '#3D3674'
};

defaultBar(1, color1);
defaultBar(2, color1);
defaultBar(3, color1);

$('a[href="#domain"]').on('shown.bs.tab', function ()
{
    defaultBar(1, color1);
    defaultBar(2, color1);
    defaultBar(3, color1);
});

$('a[href="#ip-address"]').on('shown.bs.tab', function ()
{
    defaultBar(4, color2);
    defaultBar(5, color2);
    defaultBar(6, color2);
});

$('a[href="#www-server"]').on('shown.bs.tab', function ()
{
    defaultBar(7, color3);
});

$('a[href="#bandwidth"]').on('shown.bs.tab', function ()
{
    defaultBar(8, color4);
});

$('a[href="#users"]').on('shown.bs.tab', function ()
{
    threeBar(9);
    twoBar(10);
    twoBar(11);
    twoBar(12);
    twoBar(13);
    fourLine(14);
});

function defaultBar(id, color)
{
    var chart = document.getElementById("chart" + id).getContext("2d");

    var gradient = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient.addColorStop(0, color.from);
    gradient.addColorStop(1, color.to);

    var labels = [], values = [], max = 0;

    $.getJSON('data/chart' + id + '.json', function (json)
    {
        var jsonData = json.data;

        $.each(jsonData, function (i, v)
        {
            labels[i] = v.label;
            values[i] = v.value;

            max = Math.max(v.value, max);
        });

        var data = {
            labels: labels,
            datasets: [
                {
                    fillColor: gradient, // Put the gradient here as a fill color
                    data: values
                }
            ]
        };

        var stepWidth;
        var scaleSteps;

        if ($(window).width() > 767) {
            scaleSteps = 10;
        }
        else {
            scaleSteps = 5;
        }

        stepWidth = Math.ceil(max * 1.1 / scaleSteps);

        unit = stepWidth.toString().length - 2;

        stepWidth = stepWidth / Math.pow(10, unit);

        stepWidth = Math.ceil(stepWidth / 5) * 5 * Math.pow(10, unit);

        var barChart = new Chart(chart).Bar(data, {
            responsive: true,
            showTooltips: false,
            scaleOverride: true,
            scaleSteps: scaleSteps,
            scaleStepWidth: stepWidth,
            scaleLabel: function (label)
            {
                return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            onAnimationComplete: function ()
            {

                if ($(window).width() > 767)
                {
                    var ctx = this.chart.ctx;
                    ctx.font = this.scale.font;
                    ctx.fillStyle = this.scale.textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    this.datasets.forEach(function (dataset)
                    {
                        dataset.bars.forEach(function (bar)
                        {
                            var height = bar.y - 25;

                            ctx.fillText(bar.value.numberFormat(0), bar.x, height);
                        });
                    })
                }
            }
        });

    });
}

function twoBar(id)
{
    var chart = document.getElementById("chart" + id).getContext("2d");

    var gradient1 = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient1.addColorStop(0, color3.to);
    gradient1.addColorStop(1, color3.from);

    var gradient2 = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient2.addColorStop(0, color1.to);
    gradient2.addColorStop(1, color1.from);

    var labels = [], values1 = [], values2 = [], values3 = [], max = 0;

    $.getJSON('data/chart' + id + '.json', function (json)
    {
        var jsonLabel = json.label;
        var jsonData = json.data;

        $.each(jsonData, function (i, v)
        {
            labels[i] = v.label;

            values1[i] = v.value1;
            values2[i] = v.value2;

            max = Math.max(v.value1, v.value2, max);
        });

        var data = {
            labels: labels,
            datasets: [
                {
                    label: jsonLabel.label1,
                    //fillColor: gradient1, // Put the gradient here as a fill color
                    fillColor: color3.from, // Put the gradient here as a fill color
                    data: values1
                },
                {
                    label: jsonLabel.label2,
                    //fillColor: gradient2, // Put the gradient here as a fill color
                    fillColor: color1.from, // Put the gradient here as a fill color
                    data: values2
                }
            ]
        };

        var stepWidth;
        var scaleSteps;

        if ($(window).width() > 767) {
            scaleSteps = 10;
        }
        else {
            scaleSteps = 5;
        }

        stepWidth = Math.ceil(max * 1.1 / scaleSteps);

        unit = stepWidth.toString().length - 2;

        stepWidth = stepWidth / Math.pow(10, unit);

        stepWidth = Math.ceil(stepWidth / 5) * 5 * Math.pow(10, unit);

        var barChart = new Chart(chart).Bar(data, {
            responsive: true,
            showTooltips: false,
            scaleOverride: true,
            scaleSteps: scaleSteps,
            scaleStepWidth: stepWidth,
            scaleLabel: function (label)
            {
                return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            onAnimationComplete: function ()
            {

                if ($(window).width() > 767)
                {
                    var ctx = this.chart.ctx;
                    ctx.font = this.scale.font;
                    ctx.fillStyle = this.scale.textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    this.datasets.forEach(function (dataset, index)
                    {
                        var offset = 5 * index;

                        dataset.bars.forEach(function (bar)
                        {
                            var height = bar.y - 10 - offset;

                            ctx.fillText(bar.value.numberFormat(0), bar.x, height);
                        });
                    })
                }
            }
        });

        $('#chart' + id + '-legend').html(barChart.generateLegend());

    });
}

function threeBar(id)
{
    var chart = document.getElementById("chart" + id).getContext("2d");

    var gradient1 = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient1.addColorStop(0, "#008EBF");
    gradient1.addColorStop(1, "#10A8DB");

    console.log(gradient1);

    var gradient2 = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient2.addColorStop(0, "#CB125A");
    gradient2.addColorStop(1, "#FC1187");

    var gradient3 = chart.createLinearGradient(0, chartHeight, 0, chartHeight * 2);
    gradient3.addColorStop(0, "#04914E");
    gradient3.addColorStop(1, "#7DC354");

    var labels = [], values1 = [], values2 = [], values3 = [], max = 0;

    $.getJSON('data/chart' + id + '.json', function (json)
    {
        var jsonLabel = json.label;
        var jsonData = json.data;

        $.each(jsonData, function (i, v)
        {
            labels[i] = v.label;

            values1[i] = v.value1;
            values2[i] = v.value2;
            values3[i] = v.value3;

            max = Math.max(v.value1, v.value2, v.value3, max);
        });

        var data = {
            labels: labels,
            datasets: [
                {
                    label: jsonLabel.label1,
                    //fillColor: gradient1, // Put the gradient here as a fill color
                    fillColor: color3.from,
                    data: values1
                },
                {
                    label: jsonLabel.label2,
                    //fillColor: gradient2, // Put the gradient here as a fill color
                    fillColor: color1.from,
                    data: values2
                },
                {
                    label: jsonLabel.label3,
                    //fillColor: gradient3, // Put the gradient here as a fill color
                    fillColor: color2.from,
                    data: values3
                }
            ]
        };

        var stepWidth;
        var scaleSteps;

        if ($(window).width() > 767) {
            scaleSteps = 10;
        }
        else {
            scaleSteps = 5;
        }

        stepWidth = Math.ceil(max * 1.1 / scaleSteps);

        unit = stepWidth.toString().length - 2;

        stepWidth = stepWidth / Math.pow(10, unit);

        stepWidth = Math.ceil(stepWidth / 5) * 5 * Math.pow(10, unit);

        var barChart = new Chart(chart).Bar(data, {
            responsive: true,
            showTooltips: false,
            scaleOverride: true,
            scaleSteps: scaleSteps,
            scaleStepWidth: stepWidth,
            barDatasetSpacing : 3,
            scaleLabel: function (label)
            {
                return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            onAnimationComplete: function ()
            {
                if ($(window).width() > 767)
                {
                    var ctx = this.chart.ctx;
                    ctx.font = this.scale.font;
                    ctx.fillStyle = this.scale.textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    this.datasets.forEach(function (dataset, index)
                    {
                        var offset = 5 * index;

                        dataset.bars.forEach(function (bar)
                        {
                            var height = bar.y - 10 - offset;

                            ctx.fillText(bar.value.numberFormat(0), bar.x, height);
                        });
                    })
                }

                $('#chart' + id + '-legend').html(barChart.generateLegend());
            }
        });
    });
}

function fourLine(id)
{
    var chart = document.getElementById("chart" + id).getContext("2d");

    var labels = [], values1 = [], values2 = [], values3 = [], values4 = [], max = 0;

    $.getJSON('data/chart' + id + '.json', function (json)
    {
        var jsonLabel = json.label;
        var jsonData = json.data;

        $.each(jsonData, function (i, v)
        {
            labels[i] = v.label;

            values1[i] = v.value1;
            values2[i] = v.value2;
            values3[i] = v.value3;
            values4[i] = v.value4;

            max = Math.max(v.value1, v.value2, v.value3, v.value4, max);
        });

        var data = {
            labels: labels,
            datasets: [
                {
                    label: jsonLabel.label1,
                    fillColor: "transparent",
                    strokeColor: "#7DC354", // Put the gradient here as a fill color
                    data: values1
                },
                {
                    label: jsonLabel.label2,
                    fillColor: "transparent",
                    strokeColor: "#9A2C89", // Put the gradient here as a fill color
                    data: values2
                },
                {
                    label: jsonLabel.label3,
                    fillColor: "transparent",
                    strokeColor: "#10A8DB", // Put the gradient here as a fill color
                    data: values3
                },
                {
                    label: jsonLabel.label4,
                    fillColor: "transparent",
                    strokeColor: "#FE923A", // Put the gradient here as a fill color
                    data: values4
                }
            ]
        };

        var stepWidth;
        var scaleSteps;

        if ($(window).width() > 767) {
            scaleSteps = 10;
        }
        else {
            scaleSteps = 5;
        }

        stepWidth = Math.ceil(max * 1.1 / scaleSteps);

        unit = stepWidth.toString().length - 2;

        stepWidth = stepWidth / Math.pow(10, unit);

        stepWidth = Math.ceil(stepWidth / 5) * 5 * Math.pow(10, unit);

        var LineChart = new Chart(chart).Line(data, {
            responsive: true,
            showTooltips: false,
            scaleOverride: true,
            scaleSteps: scaleSteps,
            scaleStepWidth: stepWidth,
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
            onAnimationComplete: function ()
            {

                if ($(window).width() > 767)
                {
                    var ctx = this.chart.ctx;
                    ctx.font = this.scale.font;
                    ctx.fillStyle = this.scale.textColor;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "bottom";

                    this.datasets.forEach(function (dataset, index)
                    {
                        dataset.points.forEach(function (point)
                        {
                            var height = point.y - 5;

                            ctx.fillText(point.value, point.x, height);
                        });
                    })
                }
            }
        });

        $('#chart' + id + '-legend').html(LineChart.generateLegend());

    });
}

Number.prototype.numberFormat = function (c, d, t)
{
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};