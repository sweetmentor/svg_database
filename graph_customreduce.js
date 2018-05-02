queue()
    .defer(d3.json, "data/transactions.json")
    .await(makeGraph);
    

function makeGraph(error, transactionsData) {
    let ndx = crossfilter(transactionsData);

            let nameDim = ndx.dimension(dc.pluck('name'));
            let companySpend = nameDim.group().reduce(
                function(p,v) {
                    p.count++;
                    p.companyShare += +v["spend"] * 0.75;
                    return p;
                },
                function(p,v) {
                    p.count--;
                    p.companyShare -= +v["spend"] * 0.75;
                    return p;
                },
                function() {
                    return { count: 0, companyShare: 0 };
                })

            let spendChart = dc.barChart("#spend-chart");
	let barColors = d3.scale.ordinal().range(["red","blue","green","yellow"]);


            spendChart
                .width(300)
                .height(150)
                .dimension(nameDim)
                .group(companySpend)
                .valueAccessor(function(p) {
                    return p.value.companyShare;
                })
		.colorAccessor(function(d) {
			return d.key
		})
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Company's Share")
                .yAxis().ticks(4);
                
            let secondDim = ndx.dimension(dc.pluck("name"));
            let spendByName = secondDim.group().reduceSum(dc.pluck("spend"));
                        
dc.barChart("#spend-chart2")
                .width(300)
                .height(150)
                .dimension(secondDim)
                .group(spendByName)
                .x(d3.scale.ordinal())
                .xUnits(dc.units.ordinal)
                .xAxisLabel("Person")
                .yAxis().ticks(4);
            

            dc.renderAll();

    dc.renderAll();

}
