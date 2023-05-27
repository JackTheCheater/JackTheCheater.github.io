// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 30, bottom: 70, left: 250},
	width2 = 1200 
    height2 = 650 

// append the svg object to the body of the page
var svg2 = d3.select("#lineChart2")
	.append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

//Read the data
d3.csv("Data/RenewableEnergies/Data2.csv", function(data) {
  	
	// Add X axis --> it is a date format
	var x = d3.scaleLinear()
		.domain([2014, 2021])
		.range([ 0, width ]);

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 800000000])
		.range([ height, 0 ]);

	var tickLabels = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];

	svg2.append("g")
		.attr("transform", "translate(0," + height2 + ")")
		.call(d3.axisBottom(x)
			.ticks(8)
			.tickFormat(function(d,i){ return tickLabels[i];}));
		
	svg2.append("g")
		.call(d3.axisLeft(y)
					.tickFormat(function(d){ return d.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "\u20AC";}));
	
	// Add the line
    svg2.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "steelblue")
		.attr("stroke-width", 4.0)
		.attr("d", d3.line()
			.x(function(d) { return x(d.year) })
			.y(function(d) { return y(d.value) })
        )
	// Add dots
	svg2.append('g')
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
			let str = d.value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			str=str.slice(0, -2)
			return "Euros invested: " + str +"\u20AC"});	
})

