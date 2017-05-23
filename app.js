Number.prototype.fixed = function (d, u) {
    var e = Math.pow(10, d),
        n = this.valueOf() * e;
    return (+!u ? Math.round(n) : u > 0 ? Math.ceil(n) : Math.floor(n)) / e;
}


function mktPrice(n) {
    return MROUND(n, tickSize(n));
}

function MROUND(n, m) {
    return jsAcc(m * Math.round(n / m));
}

function jsAcc(n) {
    return +(parseFloat(n).toPrecision(12));
}

function tickSize(p) {
    if (p < 2) return 0.01;
    if (p < 5) return 0.02;
    if (p < 10) return 0.05;
    if (p < 25) return 0.1;
    if (p < 100) return 0.25;
    if (p < 200) return 0.5;
    if (p < 400) return 1;
    return 2;
}


$(function () {
    var opt_line = null,
        opt_ohlc = null,
        opt_columnrange = null;

    function initChart(d) {
        var _data = d.data,
            line = [],
            ohlc = [],
            colrange = [],
            volume = [],
            dataLength = _data.length,
            // set the allowed units for data grouping
            groupingUnits = [[
            'week', // unit name
            [1] // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]];

        for (var i = 0; i < dataLength; i += 1) {
            var _d0 = _data[i][0],
                _d1 = mktPrice(+_data[i][1]),
                _d2 = mktPrice(+_data[i][2]),
                _d3 = mktPrice(+_data[i][3]),
                _d4 = mktPrice(+_data[i][4]),
                _d5 = _data[i][5];

            // LINE
            line.push([
                _d0, // date
                _d4 // close
            ])
            // OHLC
            ohlc.push([
                _d0, // date
                _d1, // open
                _d2, // high
                _d3, // low
                _d4 // close
            ]);
            // COLUMNRANGE
            colrange.push([
                _d0, // date
                Math.min(_d1, _d2, _d3, _d4),
                Math.max(_d1, _d2, _d3, _d4)
            ]);

            // -- VOLUMN -- //
            volume.push([
                _d0, // date
                _d5 // volume
            ]);
        }


        // CONFIG //
        var option = {
            rangeSelector: {
                selected: 2
            },
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Market Price'
                },
                height: '80%',
                lineWidth: 2
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '80%',
                height: '20%',
                offset: 0,
                lineWidth: 2
            }],
            tooltip: {
                split: true
            },
            navigator: {
                enabled: true
            },
            series: [{
                type: 'line',
                name: 'ADVANC',
                data: line,
                dataGrouping: {
                    units: groupingUnits
                }
            }, {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            }]
        }
        // LINE //

        opt_line = {
            type: {
                type: 'line'
            },
            data: line,
        };
        //_.extend(opt_line, config);

        // OHLC //
        opt_ohlc = {
            type: {
                type: 'candlestick'
            },
            data: ohlc
        };
        //_.extend(opt_ohlc, config);

        // COLUMN RANGE //
        opt_columnrange = {
            type: {
                type: 'columnrange'
            },
            data: colrange
        };
        //_.extend(opt_columnrange, config);

        // initial Chart
        chart = new Highcharts.stockChart('stockPrice', option);
    }

    // HIGH STOCK //
    //    var chart = null;
    $.getJSON('stockprice-ohlcv.json', function (resp) {
        initChart(resp);
    });

    // ==========:: API ::========== //
    function redrawChartType(s) {
        var _obj = eval('opt_' + s);
        chart.series[0].update(_obj.type);
        chart.series[0].setData(_obj.data);
    }
    // Select Time Frame
    $(".fx-input-timeframe").find('.btn').click(function () {
        chart.rangeSelector.clickButton(+this.value, {}, true)
    })

    // Select Type
    $(".fx-input-type").change(function () {
        redrawChartType(this.value)
    })

})
var chart = null;
