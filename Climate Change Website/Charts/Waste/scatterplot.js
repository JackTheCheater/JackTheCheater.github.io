// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 30, bottom: 70, left: 300},
    width2 = 1200
    height2 = 600 

// append the svg object to the body of the page
var svg2 = d3.select("#scatterplot")
	.append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
	.append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// Parse the Data
d3.csv("Data/Waste/Data2.csv", function(data) {

	function update(year) {
        dataFiltered = data.filter(function(d) {
        return d.year == year
			})

	// Add X axis
	var x = d3.scaleLinear()
		.domain([0, 12000])
		.range([ 0, width2-200]);
		
	svg2.append("g")
		.attr("transform", "translate(0," + height2 + ")")
		.call(d3.axisBottom(x)
				.tickFormat(function(d){ return d.toString()
				.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "mln" + " " + "\u20AC";}));

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, 65000000])
		.range([ height2, 0]);
	
	svg2.append("g")
		.call(d3.axisLeft(y)
				.tickFormat(function(d){ return d.toString()
					.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " " + "t";}));

	var countries = d3.map(dataFiltered, function(d){return(d.country)}).keys()

	// Color scale: give me a specie name, I return a color
	var color = d3.scaleOrdinal()
		.domain(countries)
		.range(["thistle", "brown", "blueviolet", "deepskyblue", "darkorange", "grey"
				, "royalblue", "goldenrod", "deeppink", "chocolate", "gold"])

	// Add dots
	svg2.append('g')
		.selectAll("dot")
		.data(dataFiltered)
		.enter()
		.append("circle")
		.attr("cx", function (d) { return x(d.loss); } )
		.attr("cy", function (d) { return y(d.total_disposal); } )
		.attr("r", 5)
		.style("fill", function (d) { return color(d.country) } )
		.style("stroke", "black" )
		.append("title")
		.text(function(d) {
			let str = d.loss.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
			let str1 = d.total_disposal.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
			return "Country: " + d.country + "\n" + "Million loss: " + str
					+ "\n" + "Tons of disposed wastes: " + str1;});
	
	// Add one dot in the legend for each name.
	svg2.selectAll("mydots")
		.data(countries)
		.enter()
		.append("circle")
		.attr("cx", 1080)
		.attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
		.attr("r", 7)
		.style("fill", function(d){ return color(d)})
		.style("stroke", "black" )

	svg2.selectAll("mylabels")
		.data(countries)
		.enter()
		.append("text")
		.attr("x", 1100)
		.attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
		.style("fill", "black")
		.text(function(d){ return d})
		.attr("text-anchor", "left")
		.style("alignment-baseline", "middle")

	}
	update(2018);
	
	// When the button's content is changed, run the updateChart function
    d3.select("#selectButton2").on("change", function(d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        svg2.selectAll("circle").remove();
        update(selectedYear);
    })
})