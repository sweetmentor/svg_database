queue()
    .defer(d3.csv, "data/Salaries.csv")
    .await(makeGraph);

function makeGraph(error, SalariesData) {
    let ndx = crossfilter(SalariesData);
    let genderDim = ndx.dimension(dc.pluck("sex"));
        let totalcountGender = genderDim.group();
        
        dc.pieChart("#male-female-Piechart")
        .height(300)
        .radius(100)
        .dimension(genderDim)
        .group(totalcountGender);
        
        
        
        
        let rankDim = ndx.dimension(dc.pluck("rank"));
        
        let totalCountByRank = rankDim.group();
        console.log(totalCountByRank.all())
        let rankChart = dc.barChart("#rankChart");
        
        rankChart
        .width(300)
        .height(150)
        .dimension(rankDim)
        .group(totalCountByRank)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("rank")
        .yAxis().ticks(4);
        

    
    
    
    
    
    dc.renderAll();

}