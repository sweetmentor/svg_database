queue()
    .defer(d3.json, "data/transactions.json")
    .await(makeGraph);
    

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

    let parseDate = d3.time.format("%d/%m/%Y").parse;

    transactionsData.forEach(function(d) {
        d.date = parseDate(d.date);
    })

    let dateDim = ndx.dimension(dc.pluck("date"));

    let minDate = dateDim.bottom(1)[0].date;
    let maxDate = dateDim.top(1)[0].date;

    let tomSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "Tom") {
            return +d.spend;
        }
        else {
            return 0;
        }
    })

    let aliceSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "Alice") {
            return +d.spend;
        }
        else {
            return 0;
        }
    })

    let bobSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "Bob") {
            return +d.spend;
        }
        else {
            return 0;
        }
    })

    let compositeChart = dc.compositeChart("#composite-chart")

    compositeChart
        .width(1000)
        .height(200)
        .dimension(dateDim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Spend")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(compositeChart)
            .colors("green")
            .group(tomSpend, "Tom"),
            dc.lineChart(compositeChart)
            .colors("red")
            .group(bobSpend, "Bob"),
            dc.lineChart(compositeChart)
            .colors("blue")
            .group(aliceSpend, "Alice")

        ])
        .render();
  

    let NYSpend = dateDim.group().reduceSum(function(d) {
        if (d.state === "NY") {
            return +d.spend;
        }
        else {
            return 0;
        }
    })

    let FLSpend = dateDim.group().reduceSum(function(d) {
        if (d.state === "FL") {
            return +d.spend;
        }
        else {
            return 0;
        }
    })

    let CASpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "CA") {
            return +d.spend;
        }
        else {
            return 0;
        }
    })
    let TNSpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "TN") {
            return +d.spend;
        }
        else {
            return 0;
        } 
    })
    let WISpend = dateDim.group().reduceSum(function(d) {
        if (d.name === "WI") {
            return +d.spend;
        }
        else {
            return 0;
        }
        
    })

    let statecompositeChart = dc.compositeChart("#statecomposite-chart")

    statecompositeChart
        .width(1000)
        .height(200)
        .dimension(dateDim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Spend")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(statecompositeChart)
            .colors("green")
            .group(NYSpend, "NY"),
            dc.lineChart(statecompositeChart)
            .colors("red")
            .group(FLSpend, "FL"),
            dc.lineChart(statecompositeChart)
            .colors("blue")
            .group(CASpend, "CA"),
            dc.lineChart(statecompositeChart)
            .colors("yellow")
            .group(TNSpend, "TN"),
            dc.lineChart(statecompositeChart)
            .colors("blue")
            .group(WISpend, "WI")

        ])
        
       
        .render()
        .yAxis().ticks(4);
        
        let storeDim = ndx.dimension(dc.pluck("store"));
        let totalSpendByStore = storeDim.group().reduceSum(dc.pluck("spend"));
        dc.pieChart("#store-chart")
        .height(300)
        .radius(100)
        .dimension(storeDim)
        .group(totalSpendByStore)

    dc.renderAll();

}
