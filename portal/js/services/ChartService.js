(function () {

    angular.module('portal.charts', ['googlechart'])

        .factory('chartService', [function () {
            function buildChart(data, type, options) {
               return {
                    type: type,
                    data: data,
                    options: options
                };
            }

            function drawBarChart(response, name) {
                var data = {
                    cols: [
                        {id: 'd', label: 'Date', type: 'date'},
                        {id: 'n', label: name, type: 'number'}
                    ],
                    rows: []
                }, dateAdded;
                for (var i = 0; i < 7; i++) {
                    var minusOneDay = new Date();
                    minusOneDay.setDate(minusOneDay.getDate() - (i + 1));
                    dateAdded = false;
                    response.forEach(function (row) {
                        var watchedDate = new Date(row.date);
                        if (minusOneDay.toDateString() === watchedDate.toDateString()) {
                            data.rows.push({c: [{v: minusOneDay}, {v: row[name]}]});
                            dateAdded = true;
                        }
                    });
                    if (!dateAdded) {
                        data.rows.push({c: [{v: minusOneDay}, {v: 0}]});
                    }
                }

                var options = {
                    title: 'Views last week',
                    height: 350
                };
                return buildChart(data, 'BarChart', options);
            }

            function drawLocChart(response, type) {
                var chartType;
                if (type == 'country') chartType = 'Geo';
                if (type == 'ref') chartType = 'Pie';

                var geoData = [];
                if (chartType == 'Geo') geoData.push(['Countries', 'Views']);
                if (chartType == 'Pie') geoData.push(['Sites', 'Views']);
                response.forEach(function (row) {
                    geoData.push([row.country || row.ref, row.total])
                });
                var options = {
                    title: geoData[0][0],
                    height: 350
                };
                return buildChart(geoData, chartType + 'Chart', options, type);
            }

            function drawBrowsersCharts(data) {
                var total = 0;
                for (var j = 0; j < data.length; j++) {
                    total += data[j].counts;
                }
                $.each(data, function (i, item) {
                    if (item && item.name) {
                        var percents = (item.counts * 100 / total).toFixed(2) - 0;
                        var pieChart = $('.' + item.name.toLowerCase() + '-chart');
                        pieChart.attr("data-percent", percents);
                        $('.' + item.name.toLowerCase() + '-chart span').text(percents);
                    }
                });
                var colors = ['#F75554', '#F9CB7B', '#8BCFEB', '#95D171'];
                $('.chart').each(function () {
                    var color = colors[Math.floor(Math.random() * colors.length)];
                    colors = $.grep(colors, function (value) {
                        return value != color;
                    });
                    $(this).easyPieChart({
                        trackColor: '#EFEFEF',
                        barColor: color
                    })
                })
            }

            function buildImpressionChart (data) {
                var chartData = {
                    cols: [
                        {id: 'd', label: 'Second', type: 'number'},
                        {id: 'n', label: 'Impressions', type: 'number'}
                    ],
                    rows: []
                };
                var newData = [];
                $.each(data, function (index, item) {
                    var intervals = item.intervals.split(',');
                    intervals.forEach(function (interval) {
                        var seconds = [];
                        if (interval.indexOf('-') > -1) {
                            var splitted = interval.split('-');
                            if (+splitted[1] < +splitted[0]) {
                                return;
                            }
                            for (var i = +splitted[0]; i <= +splitted[1]; i++) {
                                seconds.push(i);
                            }
                        } else {
                            seconds.push(+interval);
                        }
                        data[index].intervals = seconds;
                        var counts = {};
                        seconds.forEach(function (x) {
                            counts[x] = (counts[x] || 0) + 1;
                        });
                        newData.push(counts);
                    });
                });
                var result = {};
                var item = null, keys = null;
                for (var c = 0; c < newData.length; c++) {
                    item = newData[c];
                    keys = Object.keys(item);
                    keys.forEach(function (key) {
                        if (!result[key]) {
                            result[key] = item[key];
                        }
                        else {
                            result[key] += item[key];
                        }
                    })
                }

                for (var key in result) {
                    if (result.hasOwnProperty(key)) {
                        chartData.rows.push({c: [{v: +key}, {v: +result[key]}]});
                    }
                }

                var options = {
                    title: 'Video impressions',
                    height: 350,
                    hAxis: {
                        title: 'Time'
                    },
                    vAxis: {
                        title: 'Views'
                    }
                };

                return buildChart(chartData, 'LineChart', options);
            }

            return {
                drawBarChart: drawBarChart,
                drawLocChart: drawLocChart,
                drawBrowsersCharts: drawBrowsersCharts,
                buildImpressionsChart: buildImpressionChart
            };
        }]);

})();