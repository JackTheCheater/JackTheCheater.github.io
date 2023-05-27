// set the dimensions and margins of the graph
var margin = {top: 50, right: 30, bottom: 70, left: 250},
	width = 1200 
    height = 650 

// append the svg object to the body of the page
var svg = d3.select("#lineChart")
	.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Data/RenewableEnergies/Data.csv", function(data) {
  	
	// Add X axis --> it is a date format
	var x = d3.scaleLinear()
		.domain([2004, 2021])
		.range([ 0, width ]);

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 100])
		.range([ height, 0 ]);

	var tickLabels = ['2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012' 
					,'2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];

	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)
			.ticks(18)
			.tickFormat(function(d,i){ return tickLabels[i];}));
		
	svg.append("g")
		.call(d3.axisLeft(y).tickFormat(function(d){ return String(d)+ " " + "%";}));
	
	// Add the line
    svg.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 4.0)
		.attr("d", d3.line()
			.x(function(d) { return x(d.year) })
			.y(function(d) { return y(d.value) })
        )
	// Add dots
	svg.append('g')
		.selectAll("dot")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return x(d.year); } )
		.attr("cy", function (d) { return y(d.value); } )
		.attr("r", 5)
		.style("fill", "violet")
		.attr("stroke", "black")
		.append("title")
        .text(function(d) {
			return "Share of renewable energies: " + d.value + "%";});	
})

