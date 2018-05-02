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
        let barColors = d3.scale.ordinal().range(["red","blue","green","yellow"]);
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
        .colorAccessor(function(d) {
			return d.key;
        })
		.colors(barColors)
        .yAxis().ticks(4)
        
        

    

    let sexDim = ndx.dimension(dc.pluck("sex"));
    let totalPeople = sexDim.group();
    let sexChart = dc.pieChart("#sex-chart");

    sexChart
        .height(300)
        .radius(100)
        .dimension(sexDim)
        .group(totalPeople);

    let yrsServiceDim = ndx.dimension(function(d){
        return +d["yrs.service"];
    });
    let totalSalary = yrsServiceDim.group().reduce(
                function(p, v) {
                    ++p.count;
                    p.total += +v["salary"];
                    p.average = p.total / p.count;
                    return p;
                },
                function(p, v) {
                    --p.count;
                    if (p.count == 0) {
                        p.total = 0;
                        p.average = 0;
                    }
                    else {
                        p.total -= v["salary"];
                        p.average = p.total / p.count;
                    }
                    return p;
                },
                function() {
                    return { count: 0, total: 0, average: 0 };
                }
            );
    
    let salaryChart = dc.barChart("#service-salary-chart");
    
    salaryChart
        .width(1000)
        .height(450)
        .dimension(yrsServiceDim)
        .group(totalSalary)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Store")
        .valueAccessor(function(p) {
                    return p.value.average;
                })
        .colorAccessor(function(d) {
			return d.key;
        })
		.colors(barColors)
        .yAxis().ticks(4);


    dc.renderAll()
    

}